import { type Patient } from "../types";
import { getCashierChargeSummary } from "../utils";
import { CheckCircle2, Receipt, ArrowRight } from "lucide-react";



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
  const {
    rows,
    totalAmount,
    paidAmount,
    insuranceCoverage,
    discountAmount,
    patientResponsibility,
    balance,
  } = getCashierChargeSummary(
    patient,
    surgery,
  );

  const money = (amount: number) =>
    `$${amount.toLocaleString()}`;

  const MAX_VISIBLE_CHARGES = 8;

  const visibleRows =
    rows.length <= MAX_VISIBLE_CHARGES
      ? rows
      : [
          ...rows.slice(
            0,
            MAX_VISIBLE_CHARGES - 1,
          ),
          {
            id: "additional-charges-summary",
            category: "Other",
            label: `${rows.length - (MAX_VISIBLE_CHARGES - 1)} additional charges`,
            site: undefined,
            detail:
              "Combined to keep the Reception handoff visible without scrolling",
            amount: rows
              .slice(
                MAX_VISIBLE_CHARGES - 1,
              )
              .every(
                (row) =>
                  row.amount !== null,
              )
              ? rows
                  .slice(
                    MAX_VISIBLE_CHARGES - 1,
                  )
                  .reduce(
                    (sum, row) =>
                      sum +
                      (row.amount ?? 0),
                    0,
                  )
              : null,
          },
        ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      {/* RECEPTION COMPLETED — directly under the patient header */}
      <section data-responsive-grid="2" className="grid h-[62px] shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex min-w-0 items-center gap-3 px-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
            <CheckCircle2
              size={16}
            />
          </span>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate !text-[12px] font-bold text-emerald-800">
                Reception Completed
              </h3>

              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 !text-[7px] font-bold text-emerald-700">
                Ready for Cashier
              </span>
            </div>

            <p className="mt-0.5 truncate !text-[9px] text-slate-400">
              Reception requirements are complete. Financial values below are read-only estimates for cashier verification.
            </p>
          </div>
        </div>

        <div className="flex h-full items-center divide-x divide-slate-100 border-l border-slate-100">
          {[
            {
              label: "Arrival",
              value:
                patient.arrivalTime ||
                "Confirmed",
            },
            {
              label: "Eligibility",
              value: `${completedCount}/${totalChecks}`,
            },
            {
              label: "Consents",
              value: `${completedForms}/${totalForms}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="min-w-[104px] px-3"
            >
              <p className="!text-[8px] font-bold uppercase tracking-wide text-slate-400">
                {item.label}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="truncate !text-[9.5px] font-bold text-slate-700">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CASHIER HANDOFF — full width under Reception Completed */}
      <section className="shrink-0 overflow-hidden rounded-xl border border-amber-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex h-10 items-center justify-between border-b border-amber-100 bg-amber-50/45 px-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Receipt size={13} />
            </span>

            <div className="min-w-0">
              <p className="!text-[11px] font-bold text-slate-800">
                Cashier Handoff
              </p>

              <p className="mt-0.5 truncate !text-[9px] text-slate-400">
                Estimated surgery charges for Cashier review. Final pricing, coverage and discounts are confirmed by Cashier.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className="rounded-full border border-amber-200 bg-white px-2 py-1 !text-[8px] font-bold text-amber-700">
              {rows.length} charge{rows.length === 1 ? "" : "s"}
            </span>

            <span className="rounded-full bg-amber-500 px-2 py-1 !text-[8px] font-bold text-white">
              Estimate
            </span>
          </div>
        </div>

        <div data-responsive-grid="2" className="grid grid-cols-[minmax(0,1fr)_274px] gap-1.5 p-1.5">
          {/* DETAILED CASH TABLE */}
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div data-responsive-grid="4" className="grid h-7 grid-cols-[82px_minmax(0,1fr)_130px_92px] items-center bg-slate-50 px-2.5">
              <span className="!text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Category
              </span>

              <span className="!text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Charge
              </span>

              <span className="!text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Site
              </span>

              <span className="text-right !text-[9px] font-bold uppercase tracking-wide text-slate-400">
                Amount
              </span>
            </div>

            <div className="divide-y divide-slate-100 bg-white">
              {visibleRows.map((row) => (
                <div data-responsive-grid="4"
                  key={row.id}
                  className="grid min-h-[29px] grid-cols-[82px_minmax(0,1fr)_130px_92px] items-center px-2.5"
                >
                  <span className="truncate !text-[9px] font-bold text-amber-700">
                    {row.category}
                  </span>

                  <div className="min-w-0 pr-2">
                    <p className="truncate !text-[9px] font-semibold text-slate-700">
                      {row.label}
                    </p>
                  </div>

                  <span
                    className={`truncate !text-[9px] font-semibold ${
                      row.site
                        ? "text-slate-700"
                        : "text-slate-300"
                    }`}
                    title={row.site ?? ""}
                  >
                    {row.site ?? "—"}
                  </span>

                  <span
                    className={`text-right !text-[10px] font-bold ${
                      row.amount !== null
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {row.amount !== null
                      ? money(row.amount)
                      : "To verify"}
                  </span>
                </div>
              ))}

              <div data-responsive-grid="2" className="grid h-9 grid-cols-[1fr_92px] items-center border-t border-amber-100 bg-amber-50/45 px-2.5">
                <span className="!text-[9px] font-extrabold uppercase tracking-wide text-amber-800">
                  Estimated Total
                </span>

                <span className="text-right !text-[12px] font-extrabold text-amber-800">
                  {totalAmount > 0
                    ? money(totalAmount)
                    : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* PAYMENT SUMMARY */}
          <aside className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/30">
            <div className="border-b border-slate-100 bg-white px-2.5 py-1.5">
              <p className="!text-[10px] font-bold text-slate-800">
                Payment Summary
              </p>

              <p className="mt-0.5 !text-[8px] text-slate-400">
                What Cashier needs to verify before financial clearance.
              </p>
            </div>

            <div className="px-2.5 py-1">
              {[
                {
                  label: "Estimated charges",
                  value:
                    totalAmount > 0
                      ? money(totalAmount)
                      : "Pending",
                },
                {
                  label: "Insurance / coverage",
                  value:
                    insuranceCoverage !== null
                      ? `- ${money(insuranceCoverage)}`
                      : "To verify",
                },
                {
                  label: "Discounts",
                  value:
                    discountAmount > 0
                      ? `- ${money(discountAmount)}`
                      : "—",
                },
                {
                  label: "Patient responsibility",
                  value:
                    totalAmount > 0
                      ? money(patientResponsibility)
                      : "Pending",
                },
                {
                  label: "Already paid",
                  value: money(paidAmount),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex h-[29px] items-center justify-between gap-2 border-b border-slate-100 last:border-b-0"
                >
                  <span className="truncate !text-[8.5px] font-semibold text-slate-500">
                    {item.label}
                  </span>

                  <span className="shrink-0 !text-[9px] font-bold text-slate-700">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-2 mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/55 px-2.5 py-1.5">
              <div>
                <p className="!text-[8px] font-bold uppercase tracking-wide text-amber-700">
                  Balance to clear
                </p>

                <p className="mt-0.5 !text-[7px] text-amber-600">
                  Subject to Cashier verification
                </p>
              </div>

              <span className="!text-[14px] font-extrabold text-amber-800">
                {totalAmount > 0
                  ? money(balance)
                  : "Pending"}
              </span>
            </div>

            <div className="mx-2 mb-2">
              <button
                type="button"
                onClick={onSend}
                className="flex h-7 w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-4 !text-[11px] font-bold text-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition hover:bg-amber-600"
              >
                Send to Cashier
                <ArrowRight size={12} />
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
