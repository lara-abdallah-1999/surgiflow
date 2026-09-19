import { type ViewMode } from "../types";
import { VIEW_OPTIONS } from "../config";



export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (
    value: ViewMode,
  ) => void;
}) {
  return (
    <div className="flex h-7 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
      {VIEW_OPTIONS.map(
        (option) => (
          <button
            key={
              option.key
            }
            type="button"
            onClick={() =>
              onChange(
                option.key,
              )
            }
            className={`h-5 rounded-md px-2 !text-[11px] font-semibold transition ${
              value ===
              option.key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {option.label}
          </button>
        ),
      )}
    </div>
  );
}
