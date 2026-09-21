import { type ReactNode } from "react";



export function WorkspaceCard({
  title,
  subtitle,
  icon,
  tone,
  action,
  count,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  tone:
    | "cyan"
    | "amber"
    | "emerald"
    | "violet";
  action: ReactNode;
  count?: number;
  children: ReactNode;
}) {
  const tones = {
    cyan: {
      header:
        "border-cyan-100 bg-cyan-50/35",
      icon:
        "bg-cyan-100 text-cyan-600",
    },
    amber: {
      header:
        "border-amber-100 bg-amber-50/35",
      icon:
        "bg-amber-100 text-amber-600",
    },
    emerald: {
      header:
        "border-emerald-100 bg-emerald-50/35",
      icon:
        "bg-emerald-100 text-emerald-600",
    },
    violet: {
      header:
        "border-violet-100 bg-violet-50/35",
      icon:
        "bg-violet-100 text-violet-600",
    },
  };

  const style =
    tones[tone];

  return (
    <div className="flex min-h-0 min-w-0 flex-col overflow-visible rounded-xl border border-slate-200 bg-white">
      <div
        className={`flex min-h-11 shrink-0 flex-wrap items-center justify-between gap-1 py-1 border-b px-3 ${style.header}`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] font-bold text-slate-800">
                {title}
              </p>

              {typeof count === "number" && (
                <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[8px] font-bold text-slate-500 ring-1 ring-slate-100">
                  {count}
                </span>
              )}
            </div>

            <p className="truncate text-[9px] text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        {action}
      </div>

      <div className="postop-card-body min-h-0 flex-1 p-2">
        {children}
      </div>
    </div>
  );
}
