import { type PreOpMeta, type ProcedureItem, type Period, type PreOpWorkflowStatus } from "./types";
import { preOpDemographics } from "./config";


export function getMeta(
  surgery: unknown,
): PreOpMeta {
  return surgery as PreOpMeta;
}


export function toStringArray(
  value: unknown,
): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (
          typeof item === "object" &&
          item !== null
        ) {
          const object =
            item as Record<
              string,
              unknown
            >;

          const name =
            object.name ??
            object.label ??
            object.value ??
            object.allergy;

          if (typeof name === "string") {
            return name;
          }
        }

        return "";
      })
      .filter(Boolean);
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}


export function getPatientName(
  surgery: unknown,
) {
  const meta = getMeta(surgery);

  const value =
    meta.patientName ??
    meta.patient ??
    meta.name ??
    "Unnamed Patient";

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "name" in value
  ) {
    const name = (
      value as {
        name?: unknown;
      }
    ).name;

    if (typeof name === "string") {
      return name;
    }
  }

  return "Unnamed Patient";
}


export function getPatientCode(
  surgery: unknown,
) {
  const meta = getMeta(surgery);

  const value =
    meta.patientCode ??
    meta.mrn ??
    meta.patientId ??
    meta.code ??
    meta.id ??
    "—";

  return String(value);
}


export function getProcedure(
  surgery: unknown,
) {
  const meta = getMeta(surgery);

  return String(
    meta.procedure ??
      meta.surgeryType ??
      meta.operation ??
      meta.type ??
      "Procedure",
  );
}


export function getProcedures(
  surgery: unknown,
): ProcedureItem[] {
  const meta = getMeta(surgery);

  const raw =
    meta.procedures ??
    meta.operations ??
    meta.procedureList;

  if (Array.isArray(raw)) {
    const result = raw
      .map((item) => {
        if (typeof item === "string") {
          return {
            name: item,
          };
        }

        if (
          typeof item === "object" &&
          item !== null
        ) {
          const object =
            item as Record<
              string,
              unknown
            >;

          const name =
            object.name ??
            object.procedure ??
            object.label ??
            object.operation ??
            object.type;

          const site =
            object.site ??
            object.side ??
            object.location ??
            object.bodySite;

          if (typeof name === "string") {
            return {
              name,
              site:
                typeof site === "string"
                  ? site
                  : undefined,
            };
          }
        }

        return null;
      })
      .filter(
        (
          item,
        ): item is ProcedureItem =>
          item !== null,
      );

    if (result.length > 0) {
      return result;
    }
  }

  const procedure =
    getProcedure(surgery);

  const sites = toStringArray(
    meta.procedureSites ??
      meta.sites ??
      meta.procedureSide,
  );

  if (sites.length > 0) {
    return [
      {
        name: procedure,
        site: sites[0],
      },
    ];
  }

  return [
    {
      name: procedure,
    },
  ];
}


export function getAllergies(
  surgery: unknown,
): string[] {
  const meta = getMeta(surgery);

  return toStringArray(
    meta.allergies ??
      meta.allergy ??
      meta.patientAllergies,
  );
}


export function getDoctor(
  surgery: unknown,
) {
  const meta = getMeta(surgery);

  const value =
    meta.doctorName ??
    meta.doctor ??
    meta.surgeon ??
    "Doctor not assigned";

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "name" in value
  ) {
    const name = (
      value as {
        name?: unknown;
      }
    ).name;

    if (typeof name === "string") {
      return name;
    }
  }

  return "Doctor not assigned";
}


export function getSurgeryDate(
  surgery: any,
) {
  const value =
    surgery.surgeryDate ??
    surgery.scheduledDate ??
    surgery.date ??
    surgery.scheduledAt ??
    surgery.startDate;

  if (!value) return "Date not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}


export function getDateValue(
  surgery: unknown,
) {
  const meta = getMeta(surgery);

  const value =
    meta.surgeryDate ??
    meta.scheduledDate ??
    meta.scheduledAt ??
    meta.date;

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return value;
  }

  return undefined;
}


export function formatTime(
  value: unknown,
) {
  if (!value) return "Time not set";

  const date = new Date(
    String(value),
  );

  if (Number.isNaN(date.getTime())) {
    return "Time not set";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}


export function getInitials(
  name: string,
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}


export function getPatientAge(
  surgery: unknown,
) {
  const meta = getMeta(surgery);

  const direct =
    meta.age ??
    meta.patientAge;

  if (
    typeof direct === "number" &&
    Number.isFinite(direct) &&
    direct > 0
  ) {
    return direct;
  }

  const id = String(
    meta.id ?? "",
  );

  return (
    preOpDemographics[id]?.age ??
    "—"
  );
}


export function getPatientGender(
  surgery: unknown,
) {
  const meta = getMeta(surgery);

  const direct =
    meta.gender ??
    meta.patientGender ??
    meta.sex;

  if (
    direct === "Male" ||
    direct === "Female"
  ) {
    return direct;
  }

  const id = String(
    meta.id ?? "",
  );

  return (
    preOpDemographics[id]?.gender ??
    "Not specified"
  );
}


export function getSurgeryClock(
  surgery: any,
) {
  const time =
    surgery.time ??
    surgery.surgeryTime ??
    surgery.scheduledTime;

  if (
    typeof time === "string" &&
    time.trim()
  ) {
    return time;
  }

  const value =
    surgery.scheduledAt ??
    surgery.startDate;

  if (!value) return "—";

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  );
}


export function getDateSortValue(
  surgery: any,
) {
  const value =
    surgery.surgeryDate ??
    surgery.scheduledDate ??
    surgery.date ??
    surgery.scheduledAt ??
    surgery.startDate;

  return value
    ? String(value)
    : "";
}


export function isDateInPeriod(
  surgery: any,
  selectedDate: string,
  period: Period,
) {
  const raw =
    getDateSortValue(surgery);

  if (!raw || !selectedDate) {
    return true;
  }

  const surgeryDate = new Date(
    raw.length === 10
      ? `${raw}T00:00:00`
      : raw,
  );

  const selected = new Date(
    `${selectedDate}T00:00:00`,
  );

  if (
    Number.isNaN(
      surgeryDate.getTime(),
    ) ||
    Number.isNaN(
      selected.getTime(),
    )
  ) {
    return true;
  }

  if (period === "Day") {
    return (
      surgeryDate.getFullYear() ===
        selected.getFullYear() &&
      surgeryDate.getMonth() ===
        selected.getMonth() &&
      surgeryDate.getDate() ===
        selected.getDate()
    );
  }

  if (period === "Week") {
    const day = selected.getDay();
    const diff =
      day === 0 ? -6 : 1 - day;

    const start = new Date(selected);
    start.setDate(
      selected.getDate() + diff,
    );
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(
      start.getDate() + 6,
    );
    end.setHours(
      23,
      59,
      59,
      999,
    );

    return (
      surgeryDate >= start &&
      surgeryDate <= end
    );
  }

  return (
    surgeryDate.getFullYear() ===
      selected.getFullYear() &&
    surgeryDate.getMonth() ===
      selected.getMonth()
  );
}


export function getPreOpWorkflowStatus(
  surgery: any,
): PreOpWorkflowStatus {
  if (
    surgery.status === "Financially Cleared"
  ) {
    return "Awaiting Admit";
  }

  if (surgery.status === "Admitted") {
    return "Admitted";
  }

  /*
   * A patient is complete only after the shared surgery flow
   * has been moved to Ready by Confirm Pre-Op Ready.
   */
  if (
    surgery.status === "Ready" ||
    surgery.status === "In Progress" ||
    surgery.status === "Completed" ||
    surgery.status === "Recovery" ||
    surgery.status === "Discharged" ||
    surgery.preOpStatus === "Ready" ||
    surgery.preOpCompleted === true
  ) {
    return "Complete";
  }

  const id = String(
    surgery.id ?? "",
  );

  if (!id) {
    return "Not Started";
  }

  try {
    const progressRaw =
      localStorage.getItem(
        `pre-op-progress-${id}`,
      );

    const safetyRaw =
      localStorage.getItem(
        `pre-op-safety-${id}`,
      );

    const suppliesRaw =
      localStorage.getItem(
        `pre-op-supplies-${id}`,
      );

    let hasProgress = false;

    if (progressRaw) {
      const progress =
        JSON.parse(progressRaw);

      hasProgress =
        (Array.isArray(
          progress.completedTests,
        ) &&
          progress.completedTests
            .length > 0) ||
        (Array.isArray(
          progress.completedAssessment,
        ) &&
          progress.completedAssessment
            .length > 0) ||
        Boolean(
          progress.anesthesia,
        );
    }

    if (
      !hasProgress &&
      safetyRaw
    ) {
      const safety =
        JSON.parse(safetyRaw);

      hasProgress =
        safety.acknowledged === true ||
        (Array.isArray(
          safety.exceptions,
        ) &&
          safety.exceptions
            .length > 0);
    }

    if (
      !hasProgress &&
      suppliesRaw
    ) {
      const supplies =
        JSON.parse(suppliesRaw);

      hasProgress = [
        ...(Array.isArray(
          supplies.required,
        )
          ? supplies.required
          : []),
        ...(Array.isArray(
          supplies.additional,
        )
          ? supplies.additional
          : []),
      ].some(
        (item: any) =>
          item?.checked === true,
      );
    }

    return hasProgress
      ? "In Progress"
      : "Not Started";
  } catch {
    return "Not Started";
  }
}
