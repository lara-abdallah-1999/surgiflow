import { getProcedureNames } from "../utils";



export function ProcedureNames({
  surgery,
}: {
  surgery: any;
}) {
  const procedures =
    getProcedureNames(surgery);

  return (
    <div className="flex min-w-0 items-center overflow-hidden pr-3">
      {procedures.map(
        (
          procedure,
          index,
        ) => (
          <div
            key={`${procedure}-${index}`}
            className="flex min-w-0 items-center"
          >
            {index > 0 && (
              <span className="mx-2 shrink-0 text-[10px] text-slate-300">
                •
              </span>
            )}

            <span className="truncate text-[10px] font-medium text-slate-600">
              {procedure}
            </span>
          </div>
        ),
      )}
    </div>
  );
}
