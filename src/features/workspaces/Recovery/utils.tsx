import { demoPatientAge, demoPatientGender } from "./config";
import { type Period, type RecoveryStatus } from "./types";


export function getPatientAge(
  surgery: unknown,
): number | string {
  const record = surgery as {
    id?: string;
    age?: unknown;
    patientAge?: unknown;
  };

  const value =
    record.age ??
    record.patientAge;

  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  ) {
    return value;
  }

  return record.id
    ? demoPatientAge[record.id] ?? "—"
    : "—";
}


export function getPatientGender(
  surgery: unknown,
): string {
  const record = surgery as {
    id?: string;
    gender?: unknown;
    patientGender?: unknown;
    sex?: unknown;
  };

  const value =
    record.gender ??
    record.patientGender ??
    record.sex;

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value;
  }

  return record.id
    ? demoPatientGender[record.id] ?? "Not specified"
    : "Not specified";
}


export function getSurgeryProcedures(
  surgery: unknown,
): Array<{
  name: string;
  site?: string;
}> {
  const record = surgery as {
    procedure?: unknown;
    procedures?: unknown;
  };

  if (Array.isArray(record.procedures)) {
    const result = record.procedures
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
          const value = item as {
            name?: unknown;
            procedure?: unknown;
            label?: unknown;
            site?: unknown;
            location?: unknown;
          };

          const name =
            value.name ??
            value.procedure ??
            value.label;

          const site =
            value.site ??
            value.location;

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
        ): item is {
          name: string;
          site?: string;
        } => item !== null,
      );

    if (result.length > 0) {
      return result;
    }
  }

  return [
    {
      name:
        typeof record.procedure === "string"
          ? record.procedure
          : "Procedure",
    },
  ];
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


export function hasRichTextContent(
  value: string,
) {
  const plainText = value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();

  return plainText.length > 0;
}


export function getRecoveryDateSortValue(
  surgery: any,
) {
  const value =
    surgery.surgeryDate ??
    surgery.scheduledDate ??
    surgery.date ??
    surgery.scheduledAt ??
    surgery.startDate ??
    surgery.surgeryStartedAt;

  return value
    ? String(value)
    : "";
}


export function formatRecoverySurgeryDate(
  surgery: any,
) {
  const raw =
    getRecoveryDateSortValue(
      surgery,
    );

  if (!raw) return "—";

  const date = new Date(
    raw.length === 10
      ? `${raw}T00:00:00`
      : raw,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return raw;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}


export function isRecoveryDateInPeriod(
  surgery: any,
  selectedDate: string,
  period: Period,
) {
  const raw =
    getRecoveryDateSortValue(
      surgery,
    );

  if (
    !raw ||
    !selectedDate
  ) {
    return true;
  }

  const surgeryDate =
    new Date(
      raw.length === 10
        ? `${raw}T00:00:00`
        : raw,
    );

  const selected =
    new Date(
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
    const day =
      selected.getDay();

    const diff =
      day === 0
        ? -6
        : 1 - day;

    const start =
      new Date(selected);

    start.setDate(
      selected.getDate() +
        diff,
    );

    start.setHours(
      0,
      0,
      0,
      0,
    );

    const end =
      new Date(start);

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


export function getSurgeryDurationSeconds(
  surgery: any,
) {
  const numeric =
    surgery.durationSeconds ??
    surgery.surgeryDurationSeconds;

  if (
    typeof numeric === "number" &&
    Number.isFinite(numeric)
  ) {
    return Math.max(
      0,
      numeric,
    );
  }

  const duration =
    surgery.duration ??
    surgery.surgeryDuration ??
    surgery.actualDuration;

  if (
    typeof duration === "number" &&
    Number.isFinite(duration)
  ) {
    /*
     * Existing stores often keep duration in seconds.
     * If the value looks like milliseconds, normalize it.
     */
    return duration > 86400
      ? Math.floor(
          duration / 1000,
        )
      : Math.floor(duration);
  }

  const startedAt =
    surgery.surgeryStartedAt ??
    surgery.startedAt ??
    surgery.actualStartAt;

  const completedAt =
    surgery.surgeryCompletedAt ??
    surgery.completedAt ??
    surgery.actualEndAt;

  if (
    startedAt &&
    completedAt
  ) {
    const start =
      new Date(startedAt)
        .getTime();

    const end =
      new Date(completedAt)
        .getTime();

    if (
      Number.isFinite(start) &&
      Number.isFinite(end) &&
      end >= start
    ) {
      return Math.floor(
        (end - start) /
          1000,
      );
    }
  }

  return 0;
}


export function formatSurgeryDuration(
  surgery: any,
) {
  const total =
    getSurgeryDurationSeconds(
      surgery,
    );

  if (!total) {
    return "—";
  }

  const hours =
    Math.floor(
      total / 3600,
    );

  const minutes =
    Math.floor(
      (total % 3600) /
        60,
    );

  const seconds =
    total % 60;

  return [
    hours > 0
      ? `${hours}h`
      : "",
    minutes > 0 ||
    hours > 0
      ? `${minutes}m`
      : "",
    `${seconds}s`,
  ]
    .filter(Boolean)
    .join(" ");
}


export function formatClock(
  value?: string,
) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Not recorded";
  }

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  );
}


export function isRecoveryStatus(
  value: unknown,
): value is RecoveryStatus {
  return [
    "Not Started",
    "Monitoring",
    "Progressing",
    "Ready for Transfer",
  ].includes(String(value));
}
