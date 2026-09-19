



export function ProgressBadge({
  completed,
  total,
  color = "blue",
}: {
  completed: number;
  total: number;
  color?:
    | "blue"
    | "orange"
    | "purple"
    | "violet"
    | "green"
    | "teal";
}) {
  const styles = {
    blue:
      "bg-blue-50 text-blue-600 ring-blue-100",
    orange:
      "bg-orange-50 text-orange-600 ring-orange-100",
    purple:
      "bg-purple-50 text-purple-600 ring-purple-100",
    violet:
      "bg-violet-50 text-violet-600 ring-violet-100",
    green:
      "bg-emerald-50 text-emerald-600 ring-emerald-100",
    teal:
      "bg-teal-50 text-teal-600 ring-teal-100",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ring-1 ring-inset ${styles[color]}`}
    >
      {completed}/{total}
    </span>
  );
}
