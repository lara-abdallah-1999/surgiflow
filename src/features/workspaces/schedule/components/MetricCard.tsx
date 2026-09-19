import { type ReactNode } from "react";
import { type Tone } from "../types";



export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  icon: ReactNode;
  tone: Tone;
}) {
  const tones: Record<
    Tone,
    {
      icon: string;
      value: string;
      accent: string;
    }
  > = {
    blue: {
      icon:
        "bg-blue-50 text-blue-600",
      value:
        "text-blue-700",
      accent:
        "bg-blue-500",
    },
    violet: {
      icon:
        "bg-violet-50 text-violet-600",
      value:
        "text-violet-700",
      accent:
        "bg-violet-500",
    },
    amber: {
      icon:
        "bg-amber-50 text-amber-600",
      value:
        "text-amber-700",
      accent:
        "bg-amber-500",
    },
    emerald: {
      icon:
        "bg-emerald-50 text-emerald-600",
      value:
        "text-emerald-700",
      accent:
        "bg-emerald-500",
    },
    teal: {
      icon:
        "bg-teal-50 text-teal-600",
      value:
        "text-teal-700",
      accent:
        "bg-teal-500",
    },
    slate: {
      icon:
        "bg-slate-100 text-slate-600",
      value:
        "text-slate-700",
      accent:
        "bg-slate-400",
    },
    red: {
      icon:
        "bg-red-50 text-red-600",
      value:
        "text-red-700",
      accent:
        "bg-red-500",
    },
  };

  const style =
    tones[tone];

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <span
        className={`absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full ${style.accent}`}
      />

      <div className="flex items-center justify-between gap-3 pl-1">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <div className="mt-0.5 flex items-end gap-2">
            <p
              className={`text-[20px] font-bold leading-none ${style.value}`}
            >
              {value}
            </p>

            <span className="truncate pb-0.5 text-[8px] text-slate-400">
              {hint}
            </span>
          </div>
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
