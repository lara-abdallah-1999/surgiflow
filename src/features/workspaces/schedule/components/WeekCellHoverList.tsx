import { type ResourceMode, type CalendarSurgery } from "../types";
import { STATUS_STYLES } from "../config";
import { formatTime, surgeryCaseNumber } from "../utils";
import { AlertTriangle } from "lucide-react";




export function WeekCellHoverList({
  date,
  resource,
  resourceMode,
  surgeries,
}: {
  date: Date;
  resource: string;
  resourceMode: ResourceMode;
  surgeries: CalendarSurgery[];
}) {
  if (surgeries.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none invisible absolute left-2 top-[calc(100%-4px)] z-[120] w-[310px] translate-y-1 rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_14px_34px_rgba(15,23,42,0.18)] transition-all duration-150 group-hover/weekcell:visible group-hover/weekcell:translate-y-0 group-hover/weekcell:opacity-100">
      <div className="mb-2 flex items-start justify-between gap-3 border-b border-slate-100 pb-2">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold text-slate-700">
            Booked Surgeries
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
            {" · "}
            {resourceMode === "doctor"
              ? resource
              : `Room ${resource}`}
          </p>
        </div>

        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 px-1.5 text-[8px] font-bold text-blue-700 ring-1 ring-inset ring-blue-100">
          {surgeries.length}
        </span>
      </div>

      <div className="max-h-[260px] space-y-1.5 overflow-hidden">
        {surgeries.map((surgery) => {
          const style = STATUS_STYLES[surgery.bucket];

          return (
            <div
              key={surgery.id}
              className="relative overflow-hidden rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-2"
            >
              <span
                className={`absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full ${style.dot}`}
              />

              <div className="flex items-start justify-between gap-2 pl-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
                    />

                    <p className="truncate text-[9px] font-bold text-slate-700">
                      {surgery.patientName}
                    </p>
                  </div>

                  <p className="mt-0.5 truncate pl-3 text-[8px] text-slate-400">
                    {surgery.displayProcedure}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[7px] font-bold ${style.bg} ${style.border} ${style.text}`}
                >
                  {style.label}
                </span>
              </div>

              <div data-responsive-grid="3" className="mt-1.5 grid grid-cols-3 gap-2 pl-1">
                <div className="min-w-0">
                  <p className="text-[6.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Time
                  </p>
                  <p className="mt-0.5 truncate text-[8px] font-semibold text-slate-600">
                    {formatTime(surgery.start)}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[6.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Room
                  </p>
                  <p className="mt-0.5 truncate text-[8px] font-semibold text-slate-600">
                    {surgery.displayRoom}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[6.5px] font-semibold uppercase tracking-wide text-slate-400">
                    Case
                  </p>
                  <p className="mt-0.5 truncate text-[8px] font-semibold text-slate-600">
                    {surgeryCaseNumber(surgery)}
                  </p>
                </div>
              </div>

              {surgery.conflict && (
                <div className="mt-1.5 flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-[7px] font-semibold text-red-600">
                  <AlertTriangle size={8} />
                  Scheduling conflict
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
