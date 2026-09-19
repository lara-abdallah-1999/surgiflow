import { type ReactNode } from "react";



export function SummaryItem({
  icon,
  label,
  value,
  last = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2.5 px-3 ${
        last
          ? ""
          : "border-r border-slate-100"
      }`}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-teal-500 shadow-sm ring-1 ring-slate-100">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}
