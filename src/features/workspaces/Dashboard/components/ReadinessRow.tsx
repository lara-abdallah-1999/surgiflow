import { type ReactNode } from "react";
import { type Tone } from "../types";
import { toneValueClass, toneAccentClass } from "../utils";



export function ReadinessRow({
  label,
  value,
  icon,
  tone,
  onClick,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone: Tone;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full rounded-lg px-1 py-0.5 text-left transition hover:bg-slate-50"
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={toneValueClass(
              tone,
            )}
          >
            {icon}
          </span>

          <span className="truncate text-[8px] font-semibold text-slate-600">
            {label}
          </span>
        </div>

        <span
          className={`text-[8.5px] font-bold ${toneValueClass(
            tone,
          )}`}
        >
          {value}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${toneAccentClass(
            tone,
          )}`}
          style={{
            width: `${Math.max(
              0,
              Math.min(
                100,
                value,
              ),
            )}%`,
          }}
        />
      </div>
    </button>
  );
}
