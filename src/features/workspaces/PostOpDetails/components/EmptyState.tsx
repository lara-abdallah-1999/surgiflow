import { type ReactNode } from "react";



export function EmptyState({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="row-span-3 flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/30">
      <div className="text-center text-slate-400">
        <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-slate-100">
          {icon}
        </div>

        <p className="mt-2 text-[10px] font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}
