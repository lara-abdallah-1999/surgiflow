import { type ReactNode } from "react";




export function QuickFact({
  label,
  value,
  icon,
  tone = "cyan",
  onClick,
  actionLabel,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone?:
    | "cyan"
    | "teal"
    | "emerald";
  onClick?: () => void;
  actionLabel?: string;
}) {
  const styles = {
    cyan: {
      icon:
        "bg-white text-cyan-600 ring-slate-100",
      action:
        "text-cyan-600",
    },
    teal: {
      icon:
        "bg-white text-cyan-600 ring-slate-100",
      action:
        "text-teal-600",
    },
    emerald: {
      icon:
        "bg-white text-cyan-600 ring-slate-100",
      action:
        "text-emerald-600",
    },
  };

  const style =
    styles[tone];

  const content = (
    <>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-sm ring-1 ${style.icon}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          {actionLabel && (
            <span className="rounded-md bg-cyan-50 px-1.5 py-0.5 text-[8px] font-bold text-cyan-700">
              {actionLabel}
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 items-center gap-2.5 px-3 text-left transition hover:bg-white/80"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2.5 px-3">
      {content}
    </div>
  );
}
