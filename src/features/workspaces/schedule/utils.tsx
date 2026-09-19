import { type Surgery } from "../../../types/surgery";
import { type StatusBucket, type CalendarSurgery, type SurgeryTimeGroup } from "./types";


/* ==========================================================================
   DATA HELPERS
   ========================================================================== */

export function surgeryDate(
  surgery: Surgery,
) {
  const source =
    surgery as any;

  return String(
    source.date ??
      source.surgeryDate ??
      source.scheduledDate ??
      "",
  );
}


export function surgeryTime(
  surgery: Surgery,
) {
  const source =
    surgery as any;

  return String(
    source.time ??
      source.surgeryTime ??
      source.scheduledTime ??
      "",
  );
}


export function surgeryRoom(
  surgery: Surgery,
) {
  const source =
    surgery as any;

  return String(
    source.room ??
      source.opRoom ??
      source.operatingRoom ??
      "Unassigned",
  );
}


export function surgeryProcedure(
  surgery: Surgery,
) {
  const source =
    surgery as any;

  if (
    Array.isArray(
      source.procedures,
    )
  ) {
    return source.procedures
      .map(
        (item: any) =>
          typeof item ===
          "string"
            ? item
            : item?.name ??
              item?.procedure ??
              "",
      )
      .filter(Boolean)
      .join(" • ");
  }

  return String(
    source.procedure ??
      "Procedure not specified",
  );
}


export function surgeryCaseNumber(
  surgery: Surgery,
) {
  const source =
    surgery as any;

  return String(
    source.caseNumber ??
      source.caseNo ??
      source.id ??
      "",
  );
}


export function surgeryGender(
  surgery: Surgery,
) {
  const source =
    surgery as any;

  return String(
    source.gender ??
      source.patientGender ??
      "",
  );
}


export function combineDateTime(
  dateStr: string,
  timeStr?: string,
) {
  const [
    year,
    month,
    day,
  ] = dateStr
    .split("-")
    .map(Number);

  let hours = 0;
  let minutes = 0;

  if (timeStr) {
    const parts =
      timeStr
        .split(":")
        .map(Number);

    hours =
      parts[0] ?? 0;

    minutes =
      parts[1] ?? 0;
  }

  return new Date(
    year,
    (month ?? 1) - 1,
    day ?? 1,
    hours,
    minutes,
  );
}


export function addMinutes(
  date: Date,
  minutes: number,
) {
  return new Date(
    date.getTime() +
      minutes * 60000,
  );
}


export function addDays(
  date: Date,
  amount: number,
) {
  const next =
    new Date(date);

  next.setDate(
    next.getDate() +
      amount,
  );

  return next;
}


export function addMonths(
  date: Date,
  amount: number,
) {
  const next =
    new Date(date);

  next.setMonth(
    next.getMonth() +
      amount,
  );

  return next;
}


export function isSameDay(
  a: Date,
  b: Date,
) {
  return (
    a.getFullYear() ===
      b.getFullYear() &&
    a.getMonth() ===
      b.getMonth() &&
    a.getDate() ===
      b.getDate()
  );
}


export function isToday(
  date: Date,
) {
  return isSameDay(
    date,
    new Date(),
  );
}


export function dateKey(
  date: Date,
) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}


export function getWeekStart(
  date: Date,
) {
  const start =
    new Date(date);

  const day =
    start.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  start.setDate(
    start.getDate() +
      diff,
  );

  start.setHours(
    0,
    0,
    0,
    0,
  );

  return start;
}


export function getWeekDays(
  date: Date,
) {
  const start =
    getWeekStart(date);

  return Array.from(
    {
      length: 7,
    },
    (
      _,
      index,
    ) =>
      addDays(
        start,
        index,
      ),
  );
}


export function getMonthGrid(
  anchor: Date,
) {
  const year =
    anchor.getFullYear();

  const month =
    anchor.getMonth();

  const first =
    new Date(
      year,
      month,
      1,
    );

  const firstDay =
    first.getDay();

  const mondayOffset =
    firstDay === 0
      ? -6
      : 1 - firstDay;

  const gridStart =
    new Date(
      year,
      month,
      1 +
        mondayOffset,
    );

  return Array.from(
    {
      length: 42,
    },
    (
      _,
      index,
    ) =>
      addDays(
        gridStart,
        index,
      ),
  );
}


export function getDurationMinutes(
  surgery: Surgery,
) {
  const source =
    surgery as any;

  if (
    typeof source.durationSeconds ===
      "number" &&
    source.durationSeconds >
      0
  ) {
    return Math.max(
      30,
      Math.round(
        source.durationSeconds /
          60,
      ),
    );
  }

  if (
    typeof source.durationMinutes ===
      "number" &&
    source.durationMinutes >
      0
  ) {
    return Math.max(
      30,
      Math.round(
        source.durationMinutes,
      ),
    );
  }

  return 90;
}


export function getStatusBucket(
  status: unknown,
): StatusBucket {
  const value =
    String(status ?? "")
      .trim()
      .toLowerCase();

  if (
    value ===
      "in progress" ||
    value ===
      "in-progress"
  ) {
    return "in-progress";
  }

  if (
    value ===
      "completed" ||
    value ===
      "complete"
  ) {
    return "completed";
  }

  if (
    value ===
    "recovery"
  ) {
    return "recovery";
  }

  if (
    value ===
    "discharged"
  ) {
    return "discharged";
  }

  if (
    value ===
      "ready" ||
    value.includes(
      "ready",
    )
  ) {
    return "ready";
  }

  return "scheduled";
}


export function formatHourLabel(
  hour: number,
) {
  const date =
    new Date();

  date.setHours(
    hour,
    0,
    0,
    0,
  );

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
    },
  );
}


export function formatTime(
  date: Date,
) {
  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  );
}


export function formatCompactDate(
  date: Date,
) {
  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );
}


export function getInitials(
  name: string,
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0],
    )
    .join("")
    .toUpperCase();
}


export function overlaps(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
) {
  return (
    aStart < bEnd &&
    bStart < aEnd
  );
}


export function applyConflictData(
  surgeries: Omit<
    CalendarSurgery,
    | "conflict"
    | "doctorConflict"
    | "roomConflict"
  >[],
): CalendarSurgery[] {
  return surgeries.map(
    (
      surgery,
      index,
    ) => {
      let doctorConflict =
        false;

      let roomConflict =
        false;

      surgeries.forEach(
        (
          other,
          otherIndex,
        ) => {
          if (
            index ===
            otherIndex
          ) {
            return;
          }

          if (
            !overlaps(
              surgery.start,
              surgery.end,
              other.start,
              other.end,
            )
          ) {
            return;
          }

          if (
            surgery.doctor ===
            other.doctor
          ) {
            doctorConflict =
              true;
          }

          if (
            surgery.displayRoom !==
              "Unassigned" &&
            surgery.displayRoom ===
              other.displayRoom
          ) {
            roomConflict =
              true;
          }
        },
      );

      return {
        ...surgery,
        doctorConflict,
        roomConflict,
        conflict:
          doctorConflict ||
          roomConflict,
      };
    },
  );
}


export function getDayHourRange(
  surgeries: CalendarSurgery[],
) {
  let startHour = 7;
  let endHour = 19;

  surgeries.forEach(
    (surgery) => {
      const start =
        surgery.start.getHours();

      const end =
        surgery.end.getHours() +
        (surgery.end.getMinutes() >
        0
          ? 1
          : 0);

      startHour =
        Math.min(
          startHour,
          start,
        );

      endHour =
        Math.max(
          endHour,
          end,
        );
    },
  );

  return {
    startHour,
    endHour,
  };
}


export function groupSurgeriesByStartTime(
  surgeries: CalendarSurgery[],
): SurgeryTimeGroup[] {
  const groups =
    new Map<
      string,
      CalendarSurgery[]
    >();

  surgeries.forEach(
    (surgery) => {
      const key =
        `${String(
          surgery.start.getHours(),
        ).padStart(2, "0")}:${String(
          surgery.start.getMinutes(),
        ).padStart(2, "0")}`;

      if (!groups.has(key)) {
        groups.set(
          key,
          [],
        );
      }

      groups
        .get(key)!
        .push(surgery);
    },
  );

  return Array.from(
    groups.entries(),
  ).map(
    ([key, items]) => ({
      key,
      time:
        formatTime(
          items[0].start,
        ),
      items,
    }),
  );
}


export function layoutDaySurgeries(
  surgeries: CalendarSurgery[],
) {
  const sorted =
    [...surgeries].sort(
      (a, b) =>
        a.start.getTime() -
        b.start.getTime(),
    );

  const result: {
    surgery: CalendarSurgery;
    laneIndex: number;
    laneCount: number;
  }[] = [];

  let index = 0;

  while (
    index < sorted.length
  ) {
    const cluster: CalendarSurgery[] =
      [sorted[index]];

    let clusterEnd =
      sorted[index].end;

    let cursor =
      index + 1;

    while (
      cursor <
        sorted.length &&
      sorted[cursor].start <
        clusterEnd
    ) {
      cluster.push(
        sorted[cursor],
      );

      if (
        sorted[cursor].end >
        clusterEnd
      ) {
        clusterEnd =
          sorted[cursor].end;
      }

      cursor++;
    }

    cluster.forEach(
      (surgery, laneIndex) =>
        result.push({
          surgery,
          laneIndex,
          laneCount:
            cluster.length,
        }),
    );

    index = cursor;
  }

  return result;
}
