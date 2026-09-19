import { type LifestyleHabit } from "../types";
import { LifestyleTypeIcon } from "./LifestyleTypeIcon";
import { Trash2 } from "lucide-react";



export function LifestyleHabitRow({
  habit,
  onChange,
  onRemove,
}: {
  habit: LifestyleHabit;
  onChange: (value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="group flex min-h-0 min-w-0 items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/25 px-2">
      <LifestyleTypeIcon
        type={habit.type}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="truncate !text-[9px] font-bold uppercase tracking-wide text-emerald-700">
            {habit.type}
          </span>
        </div>

        <input
          value={habit.instruction}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="mt-0.5 h-[18px] w-full min-w-0 bg-transparent p-0 !text-[12px] font-medium text-slate-700 outline-none"
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${habit.type}`}
        title="Remove"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
      >
        <Trash2 size={9} />
      </button>
    </div>
  );
}
