import { type SurgeryProcedure } from "./types";




/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */





export function getSurgeryProcedures(
  surgery: any,
): SurgeryProcedure[] {
  if (Array.isArray(surgery.procedures)) {
    const procedures = surgery.procedures
      .map((item: any) => {
        if (typeof item === "string") {
          return {
            name: item,
            site: undefined,
          };
        }

        const name =
          item?.name ??
          item?.procedure ??
          item?.label ??
          "";

        const site =
          item?.site ??
          item?.side ??
          item?.location ??
          item?.bodySite;

        if (!name) return null;

        return {
          name: String(name),
          site:
            typeof site === "string" &&
            site.trim()
              ? site.trim()
              : undefined,
        };
      })
      .filter(
        (
          item: SurgeryProcedure | null,
        ): item is SurgeryProcedure =>
          item !== null,
      );

    if (procedures.length > 0) {
      return procedures;
    }
  }

  const fallbackName =
    surgery.procedure ??
    "Procedure not specified";

  const fallbackSite =
    surgery.procedureSite ??
    surgery.site ??
    surgery.side ??
    surgery.bodySite;

  return [
    {
      name: String(fallbackName),
      site:
        typeof fallbackSite === "string" &&
        fallbackSite.trim()
          ? fallbackSite.trim()
          : undefined,
    },
  ];
}




export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}


export function getSurgeryTimestamp(
  surgery: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const value = surgery[key];

    if (value) {
      const date = new Date(String(value));

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
}


export function formatClinicalTime(value: Date | string | null) {
  if (!value) return "Not recorded";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}




export function formatCompletedDuration(surgery: {
  surgeryStartedAt?: string | null;
  surgeryCompletedAt?: string | null;
  durationMinutes?: number | null;
}) {
  if (surgery.surgeryStartedAt && surgery.surgeryCompletedAt) {
    const start = new Date(surgery.surgeryStartedAt).getTime();
    const end = new Date(surgery.surgeryCompletedAt).getTime();

    if (!Number.isNaN(start) && !Number.isNaN(end) && end >= start) {
      const seconds = Math.max(0, Math.floor((end - start) / 1000));
      return formatCompactDuration(seconds);
    }
  }

  if (
    typeof surgery.durationMinutes === "number" &&
    surgery.durationMinutes >= 0
  ) {
    return formatCompactDuration(Math.round(surgery.durationMinutes * 60));
  }

  return "Not available";
}


export function formatCompactDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }

  parts.push(`${seconds}s`);

  return parts.join("");
}


export function getCurrentPhase(status: string) {
  switch (status) {
    case "Pre-Op":
      return "Pre-Operative";
    case "Ready":
      return "Ready for Surgery";
    case "In Progress":
      return "Surgery in Progress";
    case "Completed":
      return "Surgery Completed";
    case "Recovery":
      return "Recovery";
    case "Discharged":
      return "Discharged";
    default:
      return status;
  }
}
