import { type ReactNode } from "react";



export function FilterSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-slate-100 py-2.5 first:border-t-0 first:pt-0">
      <p className="mb-2 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      {children}
    </div>
  );
}
