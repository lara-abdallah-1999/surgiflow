import { getProcedureNames } from "../utils";



export function ProcedureNames({
  surgery,
}: {
  surgery: any;
}) {
  const procedures =
    getProcedureNames(surgery);

  return (
    <div className="group/procedures relative min-w-0 pr-2">
      {/* TABLE CELL — always stays on one line */}
      <div className="flex min-w-0 items-center overflow-hidden">
        <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-600">
          {procedures.join(" • ")}
        </span>

        {procedures.length > 1 && (
          <span className="ml-1.5 shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[7px] font-bold text-slate-500">
            {procedures.length}
          </span>
        )}
      </div>

      {/* HOVER PANEL */}
      <div className="pointer-events-none invisible absolute left-0 top-[calc(100%+7px)] z-50 w-[280px] translate-y-1 rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_32px_rgba(15,23,42,0.16)] transition-all duration-150 group-hover/procedures:visible group-hover/procedures:translate-y-0 group-hover/procedures:opacity-100">
        <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <p className="text-[9px] font-bold text-slate-700">
              Procedures
            </p>

            <p className="mt-0.5 text-[7px] text-slate-400">
              Scheduled for this surgical case
            </p>
          </div>

          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[8px] font-bold text-violet-600">
            {procedures.length}
          </span>
        </div>

        <div className="space-y-1">
          {procedures.map(
            (
              procedure,
              index,
            ) => (
              <div
                key={`${procedure}-${index}`}
                className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-2.5 py-2"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-100 text-[7px] font-bold text-violet-700">
                  {index + 1}
                </span>

                <span className="min-w-0 flex-1 text-[9px] font-semibold text-slate-700">
                  {procedure}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
