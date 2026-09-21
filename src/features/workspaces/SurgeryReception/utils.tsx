import { type ReceptionToastType, type Period, type PatientStatus, type Patient } from "./types";
import { showNotification } from "../../../components/notifications/showNotification";
import { admissionFormItems, RECEPTION_STATUS_STORAGE_KEY } from "./config";


export function showReceptionToast(type: ReceptionToastType, title: string, message: string) {
  showNotification({ type, title, message }, { duration: 3800 });
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


export function createAdmissionFormsState(complete = false) {
  return Object.fromEntries(
    admissionFormItems.map((item) => [item.id, complete]),
  ) as Record<string, boolean>;
}


export function loadReceptionStatuses(): Record<string, PatientStatus> {
  try {
    const raw = localStorage.getItem(RECEPTION_STATUS_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, PatientStatus>)
      : {};
  } catch {
    return {};
  }
}


export function persistReceptionStatuses(
  value: Record<string, PatientStatus>,
) {
  try {
    localStorage.setItem(
      RECEPTION_STATUS_STORAGE_KEY,
      JSON.stringify(value),
    );
  } catch {
    // Reception can still work for the current session if storage is unavailable.
  }
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


export function getProcedurePricingRows(patient: Patient, surgery?: any) {
  const totalAmount = Number(
    surgery?.cost ??
      surgery?.totalAmount ??
      surgery?.amount ??
      0,
  );

  const rawProcedures = Array.isArray(surgery?.procedures)
    ? surgery.procedures
    : [];

  const procedureCostMap =
    surgery?.procedureCosts && typeof surgery.procedureCosts === "object"
      ? surgery.procedureCosts
      : {};

  const costBreakdown = Array.isArray(surgery?.costBreakdown)
    ? surgery.costBreakdown
    : [];

  const rows = patient.procedures.map((procedure, index) => {
    const raw = rawProcedures[index];
    const breakdown = costBreakdown[index];

    const mappedCost =
      procedureCostMap?.[procedure.name] ??
      procedureCostMap?.[index];

    const rawCost =
      raw && typeof raw === "object"
        ? raw.cost ?? raw.price ?? raw.amount ?? raw.fee
        : undefined;

    const breakdownCost =
      breakdown && typeof breakdown === "object"
        ? breakdown.cost ?? breakdown.price ?? breakdown.amount ?? breakdown.fee
        : undefined;

    const numeric = Number(
      rawCost ?? mappedCost ?? breakdownCost ?? Number.NaN,
    );

    const cost = Number.isFinite(numeric)
      ? numeric
      : patient.procedures.length === 1 && totalAmount > 0
        ? totalAmount
        : null;

    return {
      name: procedure.name,
      site: procedure.site,
      cost,
    };
  });

  const knownTotal = rows.reduce(
    (sum, item) => sum + (item.cost ?? 0),
    0,
  );

  return {
    rows,
    totalAmount: totalAmount > 0 ? totalAmount : knownTotal,
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
