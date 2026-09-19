import { type Period, type Tone } from "./types";


export function isDateInPeriod(
  surgeryDateValue: string,
  selectedDate: string,
  period: Period,
) {
  const surgeryDate = new Date(
    `${surgeryDateValue}T00:00:00`,
  );
  const selected = new Date(
    `${selectedDate}T00:00:00`,
  );

  if (
    Number.isNaN(surgeryDate.getTime()) ||
    Number.isNaN(selected.getTime())
  ) {
    return false;
  }

  if (period === "Day") {
    return (
      surgeryDate.toDateString() ===
      selected.toDateString()
    );
  }

  if (period === "Week") {
    const day = selected.getDay();
    const start = new Date(selected);

    start.setDate(
      selected.getDate() -
        (day === 0 ? 6 : day - 1),
    );
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

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


/* ==========================================================================
   STYLE HELPERS
   ========================================================================== */

export function toneAccentClass(
  tone: Tone,
) {
  const map: Record<Tone, string> = {
    amber: "bg-amber-500",
    indigo: "bg-indigo-500",
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    teal: "bg-teal-500",
    cyan: "bg-cyan-500",
    slate: "bg-slate-400",
    red: "bg-red-500",
  };

  return map[tone];
}


export function toneIconClass(
  tone: Tone,
) {
  const map: Record<Tone, string> = {
    amber:
      "bg-amber-50 text-amber-600",
    indigo:
      "bg-indigo-50 text-indigo-600",
    blue:
      "bg-blue-50 text-blue-600",
    violet:
      "bg-violet-50 text-violet-600",
    teal:
      "bg-teal-50 text-teal-600",
    cyan:
      "bg-cyan-50 text-cyan-600",
    slate:
      "bg-slate-100 text-slate-600",
    red:
      "bg-red-50 text-red-600",
  };

  return map[tone];
}


export function toneValueClass(
  tone: Tone,
) {
  const map: Record<Tone, string> = {
    amber: "text-amber-700",
    indigo: "text-indigo-700",
    blue: "text-blue-700",
    violet: "text-violet-700",
    teal: "text-teal-700",
    cyan: "text-cyan-700",
    slate: "text-slate-700",
    red: "text-red-700",
  };

  return map[tone];
}



/* ==========================================================================
   HELPERS
   ========================================================================== */

export function getInitials(
  name: string,
) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) => part[0],
    )
    .join("")
    .toUpperCase();
}


export function formatMoney(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    },
  ).format(value);
}
