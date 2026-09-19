import { Users } from "lucide-react";



export function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  tone: "orange" | "blue" | "green" | "red";
}) {
  const styles = {
    orange: {
      icon: "bg-amber-50 text-amber-700",
      value: "text-amber-700",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
      value: "text-blue-700",
    },
    green: {
      icon: "bg-emerald-50 text-emerald-600",
      value: "text-emerald-700",
    },
    red: {
      icon: "bg-red-50 text-red-600",
      value: "text-red-700",
    },
  };

  const style = styles[tone];

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-amber-500" />

      <div className="flex items-center justify-between gap-3 pl-1">
        <div className="min-w-0">
          <p className="truncate text-[8.5px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className={`mt-1 text-[20px] font-bold leading-none ${style.value}`}>
            {value}
          </p>
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
        >
          <Icon size={14} />
        </div>
      </div>
    </div>
  );
}
