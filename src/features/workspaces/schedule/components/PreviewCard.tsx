import { type ReactNode } from "react";



export function PreviewCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}

        <span className="text-[8px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-[9px] font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}
