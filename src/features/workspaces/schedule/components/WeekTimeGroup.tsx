import { type SurgeryTimeGroup } from "../types";
import { STATUS_STYLES } from "../config";



export function WeekTimeGroup({
  group,
  onSelectSurgery,
}: {
  group: SurgeryTimeGroup;
  onSelectSurgery: (
    id: string,
  ) => void;
}) {
  const visible =
    group.items.slice(0, 4);

  const overflow =
    group.items.length -
    visible.length;

  return (
    <div data-responsive-grid="2" className="grid grid-cols-[42px_1fr]">
      <div className="border-r border-slate-100 px-1 py-1.5">
        <p className="text-[8px] font-bold text-slate-500">
          {group.time}
        </p>

        {group.items.length >
          1 && (
          <span className="mt-1 inline-flex items-center bg-amber-50 px-1 py-0.5 text-[7px] font-bold text-amber-700">
            ×
            {
              group.items.length
            }
          </span>
        )}
      </div>

      <div className="min-w-0 py-0.5">
        {visible.map(
          (surgery) => {
            const style =
              STATUS_STYLES[
                surgery.bucket
              ];

            return (
              <button
                key={
                  surgery.id
                }
                type="button"
                onClick={() =>
                  onSelectSurgery(
                    surgery.id,
                  )
                }
                className={`flex w-full min-w-0 items-center gap-1 border-l-2 border-y-0 border-r-0 px-1.5 py-[3px] text-left transition hover:bg-white/70 ${style.bg} ${style.border}`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
                />

                <span
                  className={`min-w-0 flex-1 truncate text-[8px] font-semibold ${style.text}`}
                >
                  {
                    surgery.patientName
                  }
                </span>

                <span className="shrink-0 text-[7px] text-slate-400">
                  {
                    surgery.displayRoom
                  }
                </span>
              </button>
            );
          },
        )}

        {overflow >
          0 && (
          <div className="border-l-2 border-slate-200 bg-slate-50 px-1.5 py-[3px] text-[8px] font-semibold text-slate-500">
            +
            {
              overflow
            }{" "}
            more at{" "}
            {
              group.time
            }
          </div>
        )}
      </div>
    </div>
  );
}
