import { type ReactNode } from "react";



export function FilterSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-1.5 !text-[12px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      {children}
    </div>
  );
}
