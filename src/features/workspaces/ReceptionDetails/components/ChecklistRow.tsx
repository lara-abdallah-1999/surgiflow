import { type ChecklistItem } from "../types";
import { Check } from "lucide-react";




export function ChecklistRow({
  item,
  checked,
  onChange,
  disabled = false,
  highlighted = false,
}: {
  item: ChecklistItem;
  disabled?: boolean;
  checked: boolean;
  onChange: () => void;
  highlighted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`group relative flex h-[44px] min-h-0 w-full items-center gap-2 overflow-hidden rounded-lg border px-2.5 py-0.5 text-left transition-all duration-300 disabled:cursor-default ${
        highlighted
          ? "animate-pulse border-amber-300 bg-amber-50/55 shadow-[0_0_0_3px_rgba(251,191,36,0.10),0_0_16px_rgba(251,191,36,0.16)]"
          : checked
            ? "border-amber-200 bg-amber-50/70"
            : "border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/30"
      }`}
    >
      {/* Left orange accent like the reference */}
      <span
        className={`absolute bottom-0 left-0 top-0 w-[3px] ${
          checked ? "bg-amber-500" : "bg-amber-300"
        }`}
      />

      {/* Main square check */}
      <span
        className={`ml-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
          checked
            ? "border-amber-500 bg-amber-500 text-white shadow-sm"
            : "border-amber-200 bg-white text-transparent group-hover:border-amber-300"
        }`}
      >
        <Check size={12} strokeWidth={2.7} />
      </span>

      {/* Title + description */}
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate !text-[9px] font-bold leading-3.5 ${
            checked ? "text-slate-800" : "text-slate-700"
          }`}
          title={item.label}
        >
          {item.label}
        </span>

        {item.description && (
          <span className="mt-[1px] block truncate !text-[7px] font-medium leading-3 text-slate-400">
            {item.description}
          </span>
        )}
      </span>

      {/* Small confirmation circle on the right */}
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${
          checked
            ? "border-amber-500 bg-white text-amber-500"
            : "border-slate-300 bg-white text-transparent"
        }`}
      >
        <Check size={8} strokeWidth={2.8} />
      </span>
    </button>
  );
}
