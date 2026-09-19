import { type SurgeryProcedureItem, type SortKey, type Period } from "./types";



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
  surgery: any,
) {
  const direct =
    surgery.age ??
    surgery.patientAge;

  if (
    typeof direct === "number" &&
    Number.isFinite(direct) &&
    direct > 0
  ) {
    return direct;
  }

  const demoAge: Record<
    string,
    number
  > = {
    "SRG-2048": 42,
    "SRG-2051": 56,
    "SRG-2044": 35,
    "SRG-2057": 61,
    "SRG-2031": 48,
  };

  return (
    demoAge[surgery.id] ??
    "—"
  );
}


export function getPatientGender(
  surgery: any,
) {
  const direct =
    surgery.gender ??
    surgery.patientGender ??
    surgery.sex;

  if (
    direct === "Male" ||
    direct === "Female"
  ) {
    return direct;
  }

  const demoGender: Record<
    string,
    "Male" | "Female"
  > = {
    "SRG-2048": "Female",
    "SRG-2051": "Female",
    "SRG-2044": "Male",
    "SRG-2057": "Female",
    "SRG-2031": "Female",
  };

  return (
    demoGender[surgery.id] ??
    "Not specified"
  );
}


export function getProcedureItems(
  surgery: any,
): SurgeryProcedureItem[] {
  if (
    Array.isArray(
      surgery.procedures,
    )
  ) {
    const items =
      surgery.procedures
        .map((item: any) => {
          if (
            typeof item ===
            "string"
          ) {
            return {
              name: item,
            };
          }

          if (
            item &&
            typeof item ===
              "object"
          ) {
            const name =
              item.name ??
              item.procedure ??
              item.label ??
              item.operation;

            const site =
              item.site ??
              item.side ??
              item.location ??
              item.bodySite;

            if (
              typeof name ===
              "string"
            ) {
              return {
                name,
                site:
                  typeof site ===
                  "string"
                    ? site
                    : undefined,
              };
            }
          }

          return null;
        })
        .filter(
          (
            item: SurgeryProcedureItem | null,
          ): item is SurgeryProcedureItem =>
            item !== null,
        );

    if (items.length > 0) {
      return items;
    }
  }

  const fallbackSitesRaw =
    surgery.procedureSites ??
    surgery.sites ??
    surgery.procedureSide;

  const fallbackSites =
    Array.isArray(
      fallbackSitesRaw,
    )
      ? fallbackSitesRaw
          .map(
            (value: unknown) =>
              typeof value ===
              "string"
                ? value
                : "",
          )
          .filter(Boolean)
      : typeof fallbackSitesRaw ===
          "string"
        ? fallbackSitesRaw
            .split(",")
            .map(
              (value: string) =>
                value.trim(),
            )
            .filter(Boolean)
        : [];

  return [
    {
      name:
        surgery.procedure ||
        "Procedure",
      site:
        fallbackSites[0],
    },
  ];
}


export function getProcedureNames(
  surgery: any,
) {
  return getProcedureItems(
    surgery,
  ).map((item) => item.name);
}


export function getSurgerySortValue(
  surgery: any,
  key: SortKey,
) {
  switch (key) {
    case "patient":
      return surgery.patientName;

    case "procedures":
      return getProcedureNames(
        surgery,
      ).join(" ");

    case "doctor":
      return surgery.doctor;

    case "room":
      return surgery.room ?? "";

    case "caseNumber":
      return getCaseNumber(
        surgery,
      );

    case "note":
      return getSurgeryNote(
        surgery,
      );

    case "status":
      return surgery.status;

    default:
      return "";
  }
}


export function getCaseNumber(
  surgery: any,
) {
  const value =
    surgery.caseNumber ??
    surgery.caseNo ??
    surgery.caseId ??
    surgery.case_number;

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  return surgery.id
    ? `CASE-${String(surgery.id).replace(
        /^SRG-/,
        "",
      )}`
    : "—";
}


export function getSurgeryNote(
  surgery: any,
) {
  const value =
    surgery.note ??
    surgery.notes ??
    surgery.surgeryNote ??
    surgery.surgeonNotes ??
    surgery.preOpNote;

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return "—";
}


export function formatTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}


export function formatDuration(startedAt?: string, completedAt?: string) {
  if (!startedAt || !completedAt) return "—";

  const start = new Date(startedAt).getTime();
  const end = new Date(completedAt).getTime();

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    end <= start
  ) {
    return "—";
  }

  const totalSeconds = Math.floor(
    (end - start) / 1000,
  );

  const hours = Math.floor(
    totalSeconds / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds =
    totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) =>
      String(value).padStart(2, "0"),
    )
    .join(":");
}


export function formatRunningDuration(
  startedAt?: string,
) {
  if (!startedAt) return "00:00:00";

  const start =
    new Date(startedAt).getTime();

  if (Number.isNaN(start)) {
    return "00:00:00";
  }

  const totalSeconds = Math.max(
    0,
    Math.floor(
      (Date.now() - start) / 1000,
    ),
  );

  const hours = Math.floor(
    totalSeconds / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds =
    totalSeconds % 60;

  return [
    hours,
    minutes,
    seconds,
  ]
    .map((value) =>
      String(value).padStart(2, "0"),
    )
    .join(":");
}


export function isDateInPeriod(
  surgeryDateValue: string | undefined,
  selectedDate: string,
  period: Period,
) {
  if (!surgeryDateValue) return false;
  const surgeryDate = new Date(`${surgeryDateValue}T00:00:00`);
  const selected = new Date(`${selectedDate}T00:00:00`);
  if (Number.isNaN(surgeryDate.getTime()) || Number.isNaN(selected.getTime())) {
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
