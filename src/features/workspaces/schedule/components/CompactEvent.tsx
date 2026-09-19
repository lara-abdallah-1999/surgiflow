import { type CalendarSurgery } from "../types";
import { STATUS_STYLES } from "../config";
import { AlertTriangle } from "lucide-react";
import { MiniDetail } from "./MiniDetail";
import { formatTime } from "../utils";



/* ==========================================================================
   EVENT UI
   ========================================================================== */

export function CompactEvent({
  surgery,
  onClick,
}: {
  surgery: CalendarSurgery;
  onClick: () => void;
}) {
  const style =
    STATUS_STYLES[
      surgery.bucket
    ];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full min-w-0 items-center gap-1.5 overflow-visible border-l-2 border-y-0 border-r-0 px-1.5 py-[3px] text-left transition hover:bg-white/70 ${style.bg} ${style.border}`}
    >
      {surgery.conflict && (
        <span className="absolute bottom-0 left-0 top-0 w-[2px] bg-red-500" />
      )}

      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
      />

      <span
        className={`truncate text-[9px] font-semibold ${style.text}`}
      >
        {
          surgery.displayTime
        }{" "}
        {surgery.patientName}
      </span>

      {surgery.conflict && (
        <AlertTriangle
          size={9}
          className="ml-auto shrink-0 text-red-500"
        />
      )}

      <div className="pointer-events-none invisible absolute left-0 top-[calc(100%+5px)] z-[90] w-[270px] translate-y-1 rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-[10px] font-bold text-slate-700">
          {
            surgery.patientName
          }
        </p>

        <p className="mt-0.5 text-[8px] text-slate-400">
          {
            surgery.displayProcedure
          }
        </p>

        <div data-responsive-grid="2" className="mt-2 grid grid-cols-2 gap-2">
          <MiniDetail
            label="Time"
            value={`${formatTime(
              surgery.start,
            )} – ${formatTime(
              surgery.end,
            )}`}
          />

          <MiniDetail
            label="Room"
            value={
              surgery.displayRoom
            }
          />

          <MiniDetail
            label="Surgeon"
            value={
              surgery.doctor
            }
          />

          <MiniDetail
            label="Status"
            value={
              style.label
            }
          />
        </div>

        {surgery.conflict && (
          <div className="mt-2 rounded-lg border border-red-100 bg-red-50 px-2 py-1.5">
            <p className="text-[8px] font-semibold text-red-700">
              Scheduling conflict detected
            </p>
          </div>
        )}
      </div>
    </button>
  );
}
