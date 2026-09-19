import { type Patient } from "../types";
import { getProcedurePricingRows } from "../utils";
import { CheckCircle2, Clock3, ShieldCheck, FileCheck2, Receipt, ArrowRight } from "lucide-react";



export function ReceptionCompletedPanel({
  patient,
  surgery,
  completedCount,
  totalChecks,
  completedForms,
  totalForms,
  onSend,
}: {
  patient: Patient;
  surgery?: any;
  completedCount: number;
  totalChecks: number;
  completedForms: number;
  totalForms: number;
  onSend: () => void;
}) {
  const { rows: procedureRows, totalAmount } =
    getProcedurePricingRows(patient, surgery);

  const paidAmount = Number(
    surgery?.paidAmount ?? 0,
  );

  const balance = Math.max(
    totalAmount - paidAmount,
    0,
  );

  return (
    <div data-responsive-grid="2" className="grid h-full min-h-0 grid-cols-[0.78fr_1.22fr] gap-3">
      {/* COMPLETION SUMMARY */}
      <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex items-center gap-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/85 to-white px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
            <CheckCircle2 size={15} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[11px] font-bold text-emerald-800">
              Reception Completed
            </h3>
            <p className="mt-0.5 text-[7.5px] text-emerald-600">
              Patient is ready for the financial handoff.
            </p>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 content-center gap-2 p-3">
          {[
            {
              label: "Arrival",
              value: patient.arrivalTime || "Confirmed",
              icon: <Clock3 size={11} />,
              tone: "amber",
            },
            {
              label: "Eligibility",
              value: `${completedCount}/${totalChecks} completed`,
              icon: <ShieldCheck size={11} />,
              tone: "emerald",
            },
            {
              label: "Patient Forms",
              value: `${completedForms}/${totalForms} completed`,
              icon: <FileCheck2 size={11} />,
              tone: "blue",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/55 px-2.5 py-2"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                  item.tone === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : item.tone === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-amber-50 text-amber-600"
                }`}
              >
                {item.icon}
              </span>

              <div className="min-w-0">
                <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                  {item.label}
                </p>
                <p className="mt-0.5 truncate text-[8.5px] font-semibold text-slate-700">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CASHIER HANDOFF / PROCEDURE PRICING */}
      <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-amber-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-amber-100 bg-amber-50/45 px-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Receipt size={13} />
            </span>
            <div>
              <p className="text-[10px] font-bold text-slate-700">
                Cashier Handoff
              </p>
              <p className="mt-0.5 text-[7px] text-slate-400">
                Procedure charges passed to Cashier for financial clearance.
              </p>
            </div>
          </div>

          <span className="rounded-full border border-amber-200 bg-white px-2 py-1 text-[7.5px] font-bold text-amber-700">
            {procedureRows.length} procedure{procedureRows.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="min-h-0 flex-1 p-2.5">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div data-responsive-grid="3" className="grid h-7 grid-cols-[34px_minmax(0,1fr)_110px] items-center bg-slate-50 px-2 text-[7px] font-bold uppercase tracking-wide text-slate-400">
              <span>#</span>
              <span>Procedure</span>
              <span className="text-right">Cost</span>
            </div>

            <div className="divide-y divide-slate-100 bg-white">
              {procedureRows.map((item, index) => (
                <div data-responsive-grid="3"
                  key={`${item.name}-${index}`}
                  className="grid min-h-[34px] grid-cols-[34px_minmax(0,1fr)_110px] items-center px-2"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-50 text-[7.5px] font-bold text-amber-700">
                    {index + 1}
                  </span>

                  <div className="min-w-0 pr-2">
                    <p className="truncate text-[8.5px] font-semibold text-slate-700">
                      {item.name}
                    </p>
                    {item.site && (
                      <p className="mt-0.5 truncate text-[6.5px] text-slate-400">
                        {item.site}
                      </p>
                    )}
                  </div>

                  <p className={`text-right text-[8.5px] font-bold ${item.cost !== null ? "text-slate-700" : "text-slate-400"}`}>
                    {item.cost !== null
                      ? `$${item.cost.toLocaleString()}`
                      : "Cashier to price"}
                  </p>
                </div>
              ))}

              <div data-responsive-grid="2" className="grid h-9 grid-cols-[1fr_110px] items-center bg-amber-50/45 px-2.5">
                <span className="text-[8px] font-bold uppercase tracking-wide text-amber-800">
                  Total Payment
                </span>
                <span className="text-right text-[11px] font-extrabold text-amber-800">
                  {totalAmount > 0
                    ? `$${totalAmount.toLocaleString()}`
                    : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div data-responsive-grid="2" className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-slate-200 bg-slate-50/50 px-2 py-1.5">
              <p className="text-[6.5px] font-bold uppercase text-slate-400">Already paid</p>
              <p className="mt-0.5 text-[8px] font-semibold text-slate-700">
                ${paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border border-amber-100 bg-amber-50/40 px-2 py-1.5">
              <p className="text-[6.5px] font-bold uppercase text-amber-600">Balance</p>
              <p className="mt-0.5 text-[8px] font-bold text-amber-800">
                ${balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-amber-100 bg-amber-50/20 p-2.5">
          <button
            type="button"
            onClick={onSend}
            className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 text-[9px] font-bold text-white transition hover:bg-amber-600"
          >
            Send to Cashier
            <ArrowRight size={12} />
          </button>
        </div>
      </section>
    </div>
  );
}
