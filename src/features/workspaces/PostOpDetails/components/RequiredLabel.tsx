import { type ReactNode } from "react";




export function RequiredLabel({
  children,
  optional = false,
}: {
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="mb-1 flex items-center gap-1 text-[9px] font-semibold text-slate-600">
      {children}

      {!optional && (
        <span className="text-red-500">
          *
        </span>
      )}

      {optional && (
        <span className="text-[8px] font-medium text-slate-400">
          optional
        </span>
      )}
    </label>
  );
}
