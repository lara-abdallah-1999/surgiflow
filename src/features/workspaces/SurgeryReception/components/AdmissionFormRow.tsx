import { type AdmissionFormItem } from "../types";
import { Check, PenLine } from "lucide-react";




export function AdmissionFormRow({
  item,
  completed,
  onToggle,
}: {
  item: AdmissionFormItem;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group flex h-[38px] min-w-0 items-center gap-2 rounded-lg border px-2.5 text-left transition ${
        completed
          ? "border-blue-200 bg-blue-50/55"
          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/20"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
          completed
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-slate-300 bg-white text-transparent group-hover:border-blue-300"
        }`}
      >
        <Check size={9} strokeWidth={3} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[8px] font-semibold text-slate-700" title={item.label}>
          {item.shortLabel}
        </span>
        <span className="mt-0.5 block truncate text-[6.8px] text-slate-400" title={item.label}>
          {item.label}
        </span>
      </span>

      <PenLine
        size={10}
        className={completed ? "text-blue-500" : "text-slate-300"}
      />
    </button>
  );
}
