


export const localToday = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
};


export const toDateLabel = (value: string) => {
  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


export const changeDay = (
  value: string,
  amount: number,
) => {
  const parsed = new Date(`${value}T00:00:00`);
  parsed.setDate(parsed.getDate() + amount);

  return `${parsed.getFullYear()}-${String(
    parsed.getMonth() + 1,
  ).padStart(2, "0")}-${String(
    parsed.getDate(),
  ).padStart(2, "0")}`;
};


export const field =
  "h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-[9.5px] font-medium text-slate-700 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50 disabled:text-slate-400";
