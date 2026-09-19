import { type ReceptionToastType, type Period, type PatientStatus, type AdmissionFormItem, type ConsentFormDetails, type ConsentAnswer, type ReceptionConsentApproval, type Patient, type CashierChargeRow } from "./types";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, HeartPulse, X } from "lucide-react";
import { admissionFormItems } from "./config";


export function showReceptionToast(
  type: ReceptionToastType,
  title: string,
  message: string,
) {
  const isSuccess = type === "success";
  const isWarning = type === "warning";

  const borderClass = isSuccess
    ? "border-emerald-200"
    : isWarning
      ? "border-amber-200"
      : "border-red-200";

  const accentClass = isSuccess
    ? "bg-emerald-500"
    : isWarning
      ? "bg-amber-500"
      : "bg-red-500";

  const iconClass = isSuccess
    ? "bg-emerald-50 text-emerald-600"
    : isWarning
      ? "bg-amber-50 text-amber-600"
      : "bg-red-50 text-red-600";

  const titleClass = isSuccess
    ? "text-emerald-700"
    : isWarning
      ? "text-amber-700"
      : "text-red-700";

  toast.custom(
    (toastId) => (
      <div className="w-[410px] max-w-[calc(100vw-40px)]">
        <div
          className={`relative overflow-hidden rounded-xl border bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] ${borderClass}`}
        >
          <span
            className={`absolute bottom-0 left-0 top-0 w-1 ${accentClass}`}
          />

          <div className="flex items-start gap-3 py-3.5 pl-4 pr-3.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
            >
              {isSuccess ? (
                <CheckCircle2 size={17} />
              ) : isWarning ? (
                <AlertTriangle size={17} />
              ) : (
                <HeartPulse size={17} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`text-[12px] font-bold ${titleClass}`}>
                {title}
              </p>

              <p className="mt-0.5 whitespace-pre-line text-[9px] leading-4 text-slate-500">
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toast.dismiss(toastId)}
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-50 hover:text-slate-500"
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: "bottom-right",
    },
  );
}


export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}


export function isDateInPeriod(
  surgeryDateValue: string,
  selectedDate: string,
  period: Period,
) {
  const surgeryDate = new Date(`${surgeryDateValue}T00:00:00`);
  const selected = new Date(`${selectedDate}T00:00:00`);

  if (
    Number.isNaN(surgeryDate.getTime()) ||
    Number.isNaN(selected.getTime())
  ) {
    return false;
  }

  if (period === "Day") {
    return surgeryDate.toDateString() === selected.toDateString();
  }

  if (period === "Week") {
    const day = selected.getDay();
    const start = new Date(selected);
    start.setDate(selected.getDate() - (day === 0 ? 6 : day - 1));
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return surgeryDate >= start && surgeryDate <= end;
  }

  return (
    surgeryDate.getFullYear() === selected.getFullYear() &&
    surgeryDate.getMonth() === selected.getMonth()
  );
}


export function formatSurgeryDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}



export function getSharedReceptionStatus(
  surgery: {
    status?: string;
    arrivedAt?: string;
    receptionCompletedAt?: string;
  },
): PatientStatus | null {
  /*
   * Only completed cross-page handoffs should override Reception's
   * local intermediate workflow state.
   *
   * IMPORTANT:
   * `arrivedAt` must NOT force "Reception In Progress" here because that
   * would overwrite local states such as "Ready for Admission".
   */
  if (
    surgery.receptionCompletedAt ||
    surgery.status === "Payment Pending" ||
    surgery.status === "Pre-Op" ||
    surgery.status === "Ready" ||
    surgery.status === "In Progress" ||
    surgery.status === "Completed" ||
    surgery.status === "Recovery" ||
    surgery.status === "Discharged"
  ) {
    return "Sent to Cashier";
  }

  return null;
}

export function createAdmissionFormsState(complete = false) {
  return Object.fromEntries(
    admissionFormItems.map((item) => [item.id, complete]),
  ) as Record<string, boolean>;
}


export function createConsentFormDetails(
  item: AdmissionFormItem,
): ConsentFormDetails {
  return {
    values: Object.fromEntries(
      item.fields.map((field) => [
        field.id,
        "",
      ]),
    ) as Record<string, string>,
    answers: Object.fromEntries(
      item.questions.map((question) => [
        question.id,
        "",
      ]),
    ) as Record<string, ConsentAnswer>,
  };
}


export function createConsentApproval(): ReceptionConsentApproval {
  return {
    signerName: "",
    signerRole: "Patient",
    identificationNumber: "",
    approvalMethod: "",
  };
}


export function isConsentFormComplete(
  item: AdmissionFormItem,
  details: ConsentFormDetails,
) {
  return item.fields
    .filter((field) => field.required)
    .every((field) =>
      Boolean(
        details.values[field.id]?.trim(),
      ),
    );
}


export function firstMoneyValue(...values: unknown[]) {
  for (const value of values) {
    const numeric = Number(value);

    if (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(numeric)
    ) {
      return numeric;
    }
  }

  return null;
}


export function getCashierChargeSummary(
  patient: Patient,
  surgery?: any,
) {
  const configuredLineItems: CashierChargeRow[] =
    Array.isArray(
      surgery?.cashierEstimate?.lineItems,
    )
      ? surgery.cashierEstimate.lineItems.map(
          (item: any, index: number) => {
            const label = String(
              item?.label ??
                "Hospital charge",
            );

            const matchingProcedure =
              patient.procedures.find(
                (procedure) =>
                  procedure.name === label,
              );

            return {
              id:
                String(
                  item?.id ??
                    `charge-${index}`,
                ),
              category: String(
                item?.category ??
                  "Hospital",
              ),
              label,
              site:
                typeof item?.site ===
                "string"
                  ? item.site
                  : matchingProcedure?.site,
              detail:
                typeof item?.detail ===
                "string"
                  ? item.detail
                  : undefined,
              amount: firstMoneyValue(
                item?.amount,
              ),
            };
          },
        )
      : [];

  const recordedTotal =
    firstMoneyValue(
      surgery?.cost,
      surgery?.totalAmount,
      surgery?.amount,
    ) ?? 0;

  let rows = configuredLineItems;

  // Backward-compatible fallback for records that do not yet have a
  // configured cashier estimate.
  if (rows.length === 0) {
    const procedureCosts =
      surgery?.procedureCosts &&
      typeof surgery.procedureCosts ===
        "object"
        ? surgery.procedureCosts
        : {};

    rows = patient.procedures.map(
      (procedure, index) => ({
        id: `procedure-${index}`,
        category: "Procedure",
        label: procedure.name,
        site: procedure.site,
        amount: firstMoneyValue(
          procedureCosts?.[
            procedure.name
          ],
          procedureCosts?.[index],
        ),
      }),
    );

    const known = rows.reduce(
      (sum, item) =>
        sum + (item.amount ?? 0),
      0,
    );

    if (
      recordedTotal > 0 &&
      recordedTotal > known
    ) {
      rows.push({
        id: "package-balance",
        category: "Package",
        label: "Remaining surgery package",
        detail:
          known > 0
            ? "Unallocated hospital estimate"
            : "Detailed pricing to be confirmed by Cashier",
        amount:
          recordedTotal - known,
      });
    }
  }

  const lineItemsTotal =
    rows.reduce(
      (sum, item) =>
        sum + (item.amount ?? 0),
      0,
    );

  const totalAmount =
    recordedTotal > 0
      ? recordedTotal
      : lineItemsTotal;

  const paidAmount =
    firstMoneyValue(
      surgery?.paidAmount,
    ) ?? 0;

  const insuranceCoverage =
    firstMoneyValue(
      surgery?.cashierEstimate
        ?.insuranceCoverage,
      surgery?.insuranceCoverage,
      surgery?.coverageAmount,
    );

  const discountAmount =
    firstMoneyValue(
      surgery?.cashierEstimate
        ?.discountAmount,
      surgery?.discountAmount,
    ) ?? 0;

  const patientResponsibility =
    Math.max(
      totalAmount -
        (insuranceCoverage ?? 0) -
        discountAmount,
      0,
    );

  const balance = Math.max(
    patientResponsibility -
      paidAmount,
    0,
  );

  return {
    rows,
    totalAmount,
    paidAmount,
    insuranceCoverage,
    discountAmount,
    patientResponsibility,
    balance,
  };
}


export function filteredIndexForPatient(
  patients: Patient[],
  id: string,
) {
  return Math.max(
    0,
    patients.findIndex(
      (patient) => patient.id === id,
    ),
  );
}
