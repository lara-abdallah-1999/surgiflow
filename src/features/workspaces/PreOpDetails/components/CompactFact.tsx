




export function CompactFact({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "indigo" | "green" | "orange";
}) {
  const dot = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    green: "bg-emerald-500",
    orange: "bg-orange-500",
  }[tone];

  return (
    <div className="min-w-0 self-center">
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>
      <p className="mt-1 truncate pl-3 text-[11px] font-semibold text-slate-700" title={value}>
        {value}
      </p>
    </div>
  );
}
