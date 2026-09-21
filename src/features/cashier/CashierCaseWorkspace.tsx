// import { Printer, ArrowLeft, Receipt, CreditCard } from "lucide-react";
// import { useState } from "react";
// import { renderToStaticMarkup } from "react-dom/server";
// import type { Surgery } from "../../types/surgery";

// type Charge = { id: string; label: string; detail?: string; amount: number };
// type BillingCase = Surgery & { cashierEstimate?: { lineItems?: Charge[]; discountAmount?: number; insuranceCoverage?: number }; receiptNumber?: string };
// const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

// export function CaseCharges({ surgery }: { surgery: Surgery }) {
//   const estimate = (surgery as BillingCase).cashierEstimate;
//   const lines = estimate?.lineItems?.filter((line) => Number.isFinite(line.amount)) ?? [];
//   const itemized = lines.reduce((sum, line) => sum + line.amount, 0);
//   const adjustment = surgery.cost - itemized + (estimate?.discountAmount ?? 0) + (estimate?.insuranceCoverage ?? 0);
//   return <section className="rounded-xl border border-indigo-100 bg-white p-4">
//     <h2 className="text-sm font-bold text-slate-800">Surgery charges</h2>

//     <dl className="mt-4 space-y-3 text-xs">
//       {lines.map((line) => <div key={line.id} className="flex justify-between gap-3 border-b border-slate-100 pb-2"><dt className="min-w-0 break-words font-semibold text-slate-700">{line.label}{line.detail && <span className="mt-1 block font-normal text-slate-400">{line.detail}</span>}</dt><dd className="shrink-0 font-semibold">{money(line.amount)}</dd></div>)}
//       {!lines.length && <div className="flex justify-between gap-3"><dt>Total recorded charges <span className="block text-slate-400">Individual charges are not itemized in this record.</span></dt><dd>{money(surgery.cost)}</dd></div>}
//       {!!lines.length && Math.abs(adjustment) > 0.005 && <div className="flex justify-between gap-3"><dt>Difference from recorded total <span className="block text-slate-400">Review the itemization; the recorded case total is used.</span></dt><dd>{money(adjustment)}</dd></div>}
//       {!!estimate?.discountAmount && <div className="flex justify-between"><dt>Discount</dt><dd>−{money(estimate.discountAmount)}</dd></div>}
//       {!!estimate?.insuranceCoverage && <div className="flex justify-between"><dt>Insurance coverage</dt><dd>−{money(estimate.insuranceCoverage)}</dd></div>}
//       <div className="flex justify-between border-t border-slate-200 pt-3 font-bold"><dt>Total due</dt><dd>{money(surgery.cost)}</dd></div>
//       <div className="flex justify-between text-emerald-700"><dt>Paid</dt><dd>{money(surgery.paidAmount)}</dd></div>
//       <div className="flex justify-between font-bold text-indigo-700"><dt>Balance</dt><dd>{money(Math.max(0, surgery.cost - surgery.paidAmount))}</dd></div>
//     </dl>
//   </section>;
// }

// function PaymentReceipt({ surgery }: { surgery: Surgery }) {
//   return <article><h1>Payment receipt</h1><p>{surgery.patientName} · {surgery.patientId} · {surgery.id}</p><p>Doctor: {surgery.doctor}</p><p>Payment recorded: {surgery.paymentCompletedAt ? new Date(surgery.paymentCompletedAt).toLocaleString() : "Timestamp not recorded"}</p><CaseCharges surgery={surgery} /><p>Status: {surgery.paymentStatus}</p></article>;
// }

// export function CashierCaseWorkspace({ surgery, amount, setAmount, onPay, onBack }: { surgery: Surgery; amount: string; setAmount: (value: string) => void; onPay: () => void; onBack: () => void }) {
//   const [printError, setPrintError] = useState("");
//   const paid = surgery.paymentStatus === "Paid";
//   const balance = Math.max(0, surgery.cost - surgery.paidAmount);
//   function printReceipt() {
//     const popup = window.open("", "_blank", "width=800,height=850");
//     if (!popup) { setPrintError("Allow popups to print this receipt."); return; }
//     popup.document.write('<!doctype html><html><head><title>Payment receipt</title><style>body{font:14px Arial;padding:30px;color:#202938}dl>div{display:flex;justify-content:space-between;gap:24px;margin:12px 0}dd{white-space:nowrap}dt span{display:block;font-size:12px;color:#64748b}h1{font-size:22px}section{border-top:1px solid #ddd;margin-top:20px} @media print{body{padding:0}}</style></head><body>' + renderToStaticMarkup(<PaymentReceipt surgery={surgery} />) + '</body></html>');
//     popup.document.close();
//     popup.focus();
//     popup.print();
//   }
//   return <div className="flex h-full min-h-0 flex-col gap-3 bg-slate-50 p-3">
//     <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto lg:grid-cols-[1.2fr_1fr]">
//       <CaseCharges surgery={surgery} />
//       <section className="self-start rounded-xl border border-indigo-100 bg-white p-4">
//         <h2 className="text-sm font-bold text-slate-800">{surgery.patientName}</h2><p className="mt-1 text-xs text-slate-500">{surgery.id} · {surgery.paymentStatus}</p>
//         {paid ? <><p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">Payment clearance is recorded. {money(surgery.paidAmount)} paid.</p><p className="mt-3 text-xs text-slate-500">{surgery.paymentCompletedAt ? new Date(surgery.paymentCompletedAt).toLocaleString() : "Payment timestamp not recorded"}</p><button type="button" onClick={printReceipt} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"><Printer size={15} />Print receipt</button>{printError && <p role="alert" className="mt-2 text-xs text-amber-700">{printError}</p>}</> : <form onSubmit={(event) => { event.preventDefault(); onPay(); }} className="mt-5 space-y-4">
//           <label className="block text-xs font-semibold text-slate-600">Amount received (USD)<input type="number" min="0.01" step="0.01" max={balance} value={amount} onChange={(event) => setAmount(event.target.value)} required className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label>
//           <button type="button" onClick={() => setAmount(String(balance))} className="text-xs font-semibold text-indigo-600">Use full balance · {money(balance)}</button>
//           <p className="text-xs text-slate-500">Partial payments retain the remaining balance. Payment is recorded only when you confirm.</p>
//           <button type="submit" disabled={!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || Number(amount) > balance} className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-40">Confirm payment</button>
//         </form>}
//       </section>
//     </div>
//   </div>;
// }

import { Printer } from "lucide-react";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Surgery } from "../../types/surgery";

type Charge = {
  id: string;
  label: string;
  detail?: string;
  amount: number;
};

type BillingCase = Surgery & {
  cashierEstimate?: {
    lineItems?: Charge[];
    discountAmount?: number;
    insuranceCoverage?: number;
  };
  receiptNumber?: string;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

/* =========================================================
   SURGERY CHARGES
========================================================= */

export function CaseCharges({ surgery }: { surgery: Surgery }) {
  const estimate = (surgery as BillingCase).cashierEstimate;

  const lines =
    estimate?.lineItems?.filter((line) => Number.isFinite(line.amount)) ?? [];

  const itemized = lines.reduce((sum, line) => sum + line.amount, 0);

  const adjustment =
    surgery.cost -
    itemized +
    (estimate?.discountAmount ?? 0) +
    (estimate?.insuranceCoverage ?? 0);

  const balance = Math.max(0, surgery.cost - surgery.paidAmount);

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-indigo-100 bg-white">
      {/* HEADER */}
      <div className="shrink-0 border-b border-slate-100 px-4 py-3">
        <h2 className="text-[14px] font-bold text-slate-800">
          Surgery charges
        </h2>

        <p className="mt-0.5 text-[11px] text-slate-500">
          {surgery.procedure}
        </p>
      </div>

      {/* TABLE */}
      <div className="min-h-0 flex-1 px-4 pt-3">
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="w-[48%] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Procedure
                </th>

                <th className="w-[32%] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Site
                </th>

                <th className="w-[20%] px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {lines.length > 0 ? (
                lines.map((line) => (
                  <tr
                    key={line.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-3 py-2">
                      <span className="block truncate text-[11px] font-semibold text-slate-700">
                        {line.label}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      <span className="block truncate text-[11px] text-slate-500">
                        {line.detail || "—"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-2 text-right text-[11px] font-semibold text-slate-800">
                      {money(line.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-2 text-[11px] font-semibold text-slate-700">
                    {surgery.procedure}
                  </td>

                  <td className="px-3 py-2 text-[11px] text-slate-400">
                    —
                  </td>

                  <td className="px-3 py-2 text-right text-[11px] font-semibold text-slate-800">
                    {money(surgery.cost)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ADJUSTMENTS */}
        {(Math.abs(adjustment) > 0.005 ||
          !!estimate?.discountAmount ||
          !!estimate?.insuranceCoverage) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500">
            {!!lines.length && Math.abs(adjustment) > 0.005 && (
              <span>
                Recorded difference:{" "}
                <strong className="font-semibold text-slate-700">
                  {money(adjustment)}
                </strong>
              </span>
            )}

            {!!estimate?.discountAmount && (
              <span>
                Discount:{" "}
                <strong className="font-semibold text-emerald-700">
                  −{money(estimate.discountAmount)}
                </strong>
              </span>
            )}

            {!!estimate?.insuranceCoverage && (
              <span>
                Insurance:{" "}
                <strong className="font-semibold text-emerald-700">
                  −{money(estimate.insuranceCoverage)}
                </strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* TOTAL SUMMARY */}
      <div className="shrink-0 px-4 pb-4 pt-3">
        <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-slate-50">
          <div className="px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Total due
            </p>

            <p className="mt-0.5 text-[13px] font-bold text-slate-800">
              {money(surgery.cost)}
            </p>
          </div>

          <div className="px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Paid
            </p>

            <p className="mt-0.5 text-[13px] font-bold text-emerald-600">
              {money(surgery.paidAmount)}
            </p>
          </div>

          <div className="px-3 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Balance
            </p>

            <p className="mt-0.5 text-[13px] font-bold text-indigo-600">
              {money(balance)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PRINT RECEIPT
========================================================= */

function PaymentReceipt({ surgery }: { surgery: Surgery }) {
  return (
    <article>
      <h1>Payment receipt</h1>

      <p>
        {surgery.patientName} · {surgery.patientId} · {surgery.id}
      </p>

      <p>Doctor: {surgery.doctor}</p>

      <p>
        Payment recorded:{" "}
        {surgery.paymentCompletedAt
          ? new Date(surgery.paymentCompletedAt).toLocaleString()
          : "Timestamp not recorded"}
      </p>

      <CaseCharges surgery={surgery} />

      <p>Status: {surgery.paymentStatus}</p>
    </article>
  );
}

/* =========================================================
   CASHIER WORKSPACE
========================================================= */

type CashierCaseWorkspaceProps = {
  surgery: Surgery;
  amount: string;
  setAmount: (value: string) => void;
  onPay: () => void;
  onBack: () => void;
};

export function CashierCaseWorkspace({
  surgery,
  amount,
  setAmount,
  onPay,
}: CashierCaseWorkspaceProps) {
  const [printError, setPrintError] = useState("");

  const paid = surgery.paymentStatus === "Paid";

  const balance = Math.max(0, surgery.cost - surgery.paidAmount);

  function printReceipt() {
    const popup = window.open("", "_blank", "width=800,height=850");

    if (!popup) {
      setPrintError("Allow popups to print this receipt.");
      return;
    }

    popup.document.write(
      `
        <!doctype html>
        <html>
          <head>
            <title>Payment receipt</title>

            <style>
              body {
                font: 14px Arial;
                padding: 30px;
                color: #202938;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }

              th,
              td {
                padding: 10px;
                border-bottom: 1px solid #e5e7eb;
                text-align: left;
              }

              th:last-child,
              td:last-child {
                text-align: right;
              }

              h1 {
                font-size: 22px;
              }

              section {
                margin-top: 20px;
              }

              @media print {
                body {
                  padding: 0;
                }
              }
            </style>
          </head>

          <body>
            ${renderToStaticMarkup(
              <PaymentReceipt surgery={surgery} />
            )}
          </body>
        </html>
      `
    );

    popup.document.close();
    popup.focus();
    popup.print();
  }

  return (
    <div data-workspace-page="Cashier" className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50 p-3">
      <div
        className="
          grid
          min-h-0
          flex-1
          gap-3
          overflow-hidden
          lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,1fr)]
        "
      >
        {/* LEFT — CHARGES */}
        <CaseCharges surgery={surgery} />

        {/* RIGHT — PAYMENT */}
        <section className="self-start rounded-xl border border-indigo-100 bg-white p-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-[14px] font-bold text-slate-800">
              {surgery.patientName}
            </h2>

            <p className="mt-0.5 text-[11px] text-slate-500">
              {surgery.id} · {surgery.paymentStatus}
            </p>
          </div>

          {paid ? (
            <>
              <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2.5">
                <p className="text-[12px] font-medium text-emerald-700">
                  Payment clearance is recorded.
                </p>

                <p className="mt-0.5 text-[11px] text-emerald-600">
                  {money(surgery.paidAmount)} paid
                </p>
              </div>

              <p className="mt-3 text-[10px] text-slate-500">
                {surgery.paymentCompletedAt
                  ? new Date(
                      surgery.paymentCompletedAt
                    ).toLocaleString()
                  : "Payment timestamp not recorded"}
              </p>

              <button
                type="button"
                onClick={printReceipt}
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-indigo-600
                  px-3
                  py-1
                  !text-[12px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-indigo-700
                "
              >
                <Printer size={14} />

                Print receipt
              </button>

              {printError && (
                <p
                  role="alert"
                  className="mt-2 text-[10px] text-amber-700"
                >
                  {printError}
                </p>
              )}
            </>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onPay();
              }}
              className="mt-4 space-y-3"
            >
              <label className="block text-[11px] font-semibold text-slate-600">
                Amount received (USD)

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={balance}
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                  className="
                    mt-1.5
                    block
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    px-3
                    py-2.5
                    !text-[14px]
                    text-slate-800
                    outline-none
                    transition
                    focus:border-indigo-400
                    focus:ring-2
                    focus:ring-indigo-100
                  "
                />
              </label>

              <button
                type="button"
                onClick={() => setAmount(String(balance))}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Use full balance · {money(balance)}
              </button>

              <p className="text-[10px] leading-4 text-slate-500">
                Partial payments retain the remaining balance.
                Payment is recorded only when you confirm.
              </p>

              <button
                type="submit"
                disabled={
                  !amount ||
                  !Number.isFinite(Number(amount)) ||
                  Number(amount) <= 0 ||
                  Number(amount) > balance
                }
                className="
                  w-full
                  rounded-lg
                  bg-indigo-600
                  px-4
                  py-1
                  !text-[13px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-indigo-700
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                Confirm payment
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}