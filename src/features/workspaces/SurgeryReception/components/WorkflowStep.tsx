import { Check } from "lucide-react";



export function WorkflowStep({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${
          completed
            ? "bg-amber-500 text-white"
            : active
              ? "bg-amber-500 text-white"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {completed ? <Check size={12} /> : number}
      </div>

      <span
        className={`whitespace-nowrap text-[9px] font-semibold ${
          active || completed ? "text-slate-700" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
