



export function ProcedureCell({
  surgery,
}: {
  surgery: any;
}) {
  const procedures =
    Array.isArray(surgery.procedures) &&
    surgery.procedures.length > 0
      ? surgery.procedures.map(
          (item: any) =>
            typeof item === "string"
              ? item
              : item?.name ?? "",
        )
      : [surgery.procedure];

  const first =
    procedures[0] || "—";

  const more =
    Math.max(
      0,
      procedures.length - 1,
    );

  return (
    <div data-cell-label="Procedure" className="group/procedure relative min-w-0">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-[10.5px] font-medium text-slate-600">
          {first}
        </span>

        {more > 0 && (
          <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[7px] font-bold text-slate-500">
            +{more}
          </span>
        )}
      </div>

      {procedures.length > 1 && (
        <div className="pointer-events-none invisible absolute left-0 top-[calc(100%+5px)] z-50 w-[235px] rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition group-hover/procedure:visible group-hover/procedure:opacity-100">
          <p className="mb-1.5 text-[7.5px] font-semibold uppercase tracking-wide text-slate-400">
            Procedures
          </p>

          <div className="space-y-1">
            {procedures.map(
              (
                procedure: string,
                index: number,
              ) => (
                <div
                  key={`${procedure}-${index}`}
                  className="flex items-start gap-1.5 text-[10px] font-medium text-slate-600"
                >
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  <span>{procedure}</span>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
