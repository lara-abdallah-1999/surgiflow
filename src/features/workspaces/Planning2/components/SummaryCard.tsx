



export function SummaryCard({
  label,
  value,
  helper,
  tone,
  icon,
}: {
  label: string;
  value: number;
  helper: string;
  tone:
    | "blue"
    | "violet"
    | "amber"
    | "red";
  icon: React.ReactNode;
}) {
  const styles = {
    blue: {
      line: "bg-blue-500",
      icon:
        "bg-blue-50 text-blue-600",
      value:
        "text-blue-700",
    },
    violet: {
      line: "bg-violet-500",
      icon:
        "bg-violet-50 text-violet-600",
      value:
        "text-violet-700",
    },
    amber: {
      line: "bg-amber-500",
      icon:
        "bg-amber-50 text-amber-600",
      value:
        "text-amber-700",
    },
    red: {
      line: "bg-red-500",
      icon:
        "bg-red-50 text-red-600",
      value:
        "text-red-700",
    },
  }[tone];

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <span
        className={`absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full ${styles.line}`}
      />

      <div className="flex items-center justify-between gap-3 pl-1">
        <div className="min-w-0">
          <p className="text-[7.5px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <div className="mt-1 flex items-end gap-2">
            <span
              className={`text-[20px] font-bold leading-none ${styles.value}`}
            >
              {value}
            </span>

            <span className="pb-0.5 text-[7px] text-slate-400">
              {helper}
            </span>
          </div>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
