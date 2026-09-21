import { type ReceptionToastType, type Period, type PatientStatus, type AdmissionFormItem, type ConsentFormDetails, type ConsentAnswer, type ReceptionConsentApproval, type Patient, type CashierChargeRow } from "./types";
import { showNotification } from "../../../components/notifications/showNotification";
import { admissionFormItems } from "./config";


export function showReceptionToast(type: ReceptionToastType, title: string, message: string) {
  showNotification({ type, title, message }, { duration: 5000 });
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
