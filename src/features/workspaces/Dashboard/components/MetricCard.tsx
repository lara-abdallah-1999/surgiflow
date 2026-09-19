import { type ReactNode } from "react";
import { type Tone } from "../types";
import { toneAccentClass, toneValueClass, toneIconClass } from "../utils";



/* ==========================================================================
   COMPONENTS
   ========================================================================== */

export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone,
  onClick,
}: {
  label: string;
  value: number;
  hint: string;
  icon: ReactNode;
  tone: Tone;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:-translate-y-px hover:border-slate-300 hover:shadow-[0_5px_16px_rgba(15,23,42,0.06)]"
    >
      <span
        className={`absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full ${toneAccentClass(
          tone,
        )}`}
      />

      <div className="flex items-center justify-between gap-3 pl-1">
        <div className="min-w-0">
          <p className="text-[8.5px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <div className="mt-1 flex items-end gap-2">
            <p
              className={`text-[20px] font-bold leading-none ${toneValueClass(
                tone,
              )}`}
            >
              {value}
            </p>

            <span className="truncate pb-0.5 text-[9px] text-slate-400">
              {hint}
            </span>
          </div>
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneIconClass(
            tone,
          )}`}
        >
          {icon}
        </div>
      </div>
    </button>
  );
}
