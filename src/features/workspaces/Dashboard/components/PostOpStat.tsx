import { type ReactNode } from "react";
import { type Tone } from "../types";
import { toneIconClass, toneValueClass } from "../utils";
import { ChevronRight } from "lucide-react";



export function PostOpStat({
  label,
  value,
  hint,
  icon,
  tone,
  onClick,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  tone: Tone;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-w-0 px-2.5 py-2.5 text-left transition hover:bg-slate-50"
    >
      <div className="flex items-center justify-between gap-1.5">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${toneIconClass(
            tone,
          )}`}
        >
          {icon}
        </div>

        <ChevronRight
          size={8}
          className="text-slate-200 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
        />
      </div>

      <p
        className={`mt-2 text-[14px] font-bold leading-none ${toneValueClass(
          tone,
        )}`}
      >
        {value}
      </p>

      <p className="mt-1 truncate text-[8.5px] font-semibold text-slate-600">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[7.5px] text-slate-400">
        {hint}
      </p>
    </button>
  );
}
