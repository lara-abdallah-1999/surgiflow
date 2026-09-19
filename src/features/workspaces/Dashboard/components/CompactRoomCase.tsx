import { type Surgery } from "../../../../types/surgery";
import { ChevronRight } from "lucide-react";
import { CompactDetail } from "./CompactDetail";




export function CompactRoomCase({
  surgery,
  title,
  tone,
  onOpen,
}: {
  surgery: Surgery;
  title: string;
  tone: "violet" | "blue";
  onOpen: (id: string) => void;
}) {
  const procedures =
    surgery.procedures?.length
      ? surgery.procedures
      : [
          {
            name: surgery.procedure,
            site: undefined,
          },
        ];

  const firstProcedure = procedures[0];
  const extraProcedures =
    Math.max(procedures.length - 1, 0);

  const accent =
    tone === "violet"
      ? {
          dot: "bg-violet-500",
          text: "text-violet-700",
          soft: "bg-violet-50",
          border: "border-violet-100",
        }
      : {
          dot: "bg-blue-500",
          text: "text-blue-700",
          soft: "bg-blue-50",
          border: "border-blue-100",
        };

  return (
    <button
      type="button"
      onClick={() => onOpen(surgery.id)}
      className={`group/case block w-full rounded-lg border ${accent.border} bg-white p-2.5 text-left transition hover:bg-slate-50/70`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${accent.dot}`}
          />
          <p
            className={`text-[8px] font-bold uppercase tracking-wide ${accent.text}`}
          >
            {title}
          </p>
        </div>

        <ChevronRight
          size={9}
          className="text-slate-300 transition group-hover/case:translate-x-0.5"
        />
      </div>

      <div className="mt-1.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11.5px] font-bold text-slate-800">
            {surgery.patientName}
          </p>

          <p className="mt-0.5 truncate text-[9px] font-medium text-slate-500">
            MRN: {surgery.mrn || "Not recorded"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-md ${accent.soft} px-2 py-1 text-[10px] font-bold tabular-nums ${accent.text}`}
        >
          {surgery.time}
        </span>
      </div>

      <div data-responsive-grid="2" className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-slate-100 pt-2">
        <CompactDetail
          label="Procedure"
          value={
            firstProcedure?.name ||
            surgery.procedure ||
            "Not recorded"
          }
          secondary={
            firstProcedure?.site ||
            (extraProcedures > 0
              ? `+${extraProcedures} more`
              : undefined)
          }
        />

        <CompactDetail
          label="Surgeon"
          value={surgery.doctor || "Not recorded"}
        />

        <CompactDetail
          label="Anesthesia"
          value={surgery.anesthesiaType || "Not recorded"}
        />

        <CompactDetail
          label="Allergies"
          value={
            surgery.allergies?.length
              ? surgery.allergies.join(", ")
              : "None recorded"
          }
          alert={Boolean(surgery.allergies?.length)}
        />
      </div>
    </button>
  );
}
