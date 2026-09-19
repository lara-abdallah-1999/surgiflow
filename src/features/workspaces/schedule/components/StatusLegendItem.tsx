import { type StatusBucket } from "../types";
import { STATUS_STYLES } from "../config";



/* ==========================================================================
   SHARED UI
   ========================================================================== */

export function StatusLegendItem({
  bucket,
}: {
  bucket: StatusBucket;
}) {
  const style =
    STATUS_STYLES[bucket];

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`h-2 w-2 rounded-full ${style.dot}`}
      />

      <span className="text-[9px] font-semibold text-slate-500">
        {style.label}
      </span>
    </div>
  );
}
