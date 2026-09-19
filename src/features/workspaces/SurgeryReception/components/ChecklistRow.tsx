import { type ChecklistItem } from "../types";
import { Check } from "lucide-react";



export function ChecklistRow({
  item,
  checked,
  onChange,
  disabled = false,
}: {
  item: ChecklistItem;
  disabled?: boolean;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`group flex min-h-[36px] w-full items-center gap-2 rounded-lg border px-2.5 py-1 text-left transition disabled:cursor-default ${
        checked
          ? "border-amber-200 bg-amber-50/65"
          : "border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/20"
      }`}
    >
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition ${
          checked
            ? "border-amber-500 bg-amber-500 text-white"
            : "border-slate-300 bg-white text-transparent group-hover:border-amber-300"
        }`}
      >
        <Check size={10} strokeWidth={2.8} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[9px] font-semibold ${
            checked ? "text-amber-800" : "text-slate-700"
          }`}
          title={item.label}
        >
          {item.label}
        </span>

        {item.description && (
          <span
            className="mt-0.5 block truncate text-[7px] leading-3 text-slate-400"
            title={item.description}
          >
            {item.description}
          </span>
        )}
      </span>
    </button>
  );
}
