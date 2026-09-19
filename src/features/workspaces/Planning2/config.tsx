import { type StatusKey, type Tone } from "./types";


export const STATUS_COLUMNS: Array<{
  key: StatusKey;
  label: string;
  tone: Tone;
}> = [
  {
    key: "Pre-Op",
    label: "Pre-Op",
    tone: "amber",
  },
  {
    key: "Ready",
    label: "Ready",
    tone: "emerald",
  },
  {
    key: "In Progress",
    label: "In Progress",
    tone: "violet",
  },
  {
    key: "Completed",
    label: "Completed",
    tone: "blue",
  },
];


export const localToday = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
};


export const changeDay = (
  value: string,
  amount: number,
) => {
  const parsed = new Date(
    `${value}T00:00:00`,
  );

  parsed.setDate(
    parsed.getDate() + amount,
  );

  return `${parsed.getFullYear()}-${String(
    parsed.getMonth() + 1,
  ).padStart(2, "0")}-${String(
    parsed.getDate(),
  ).padStart(2, "0")}`;
};



export const toDateLabel = (value: string) => {
  const parsed = new Date(
    `${value}T00:00:00`,
  );

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return value;
  }

  return parsed.toLocaleDateString(
    undefined,
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
};



export const field =
  "h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-[9px] font-medium text-slate-700 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50 disabled:text-slate-400";


export const formatDateValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;


export const monthTitle = (date: Date) =>
  date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });


export const calendarDays = (month: Date) => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  const mondayOffset = (first.getDay() + 6) % 7;
  start.setDate(first.getDate() - mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const value = new Date(start);
    value.setDate(start.getDate() + index);
    return value;
  });
};
