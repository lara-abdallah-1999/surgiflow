import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FileText, Printer } from "lucide-react";
import type { Surgery } from "../../types/surgery";
import { useSurgeryStore } from "../../store/surgeryStore";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const proceduresFor = (surgery: Surgery) => surgery.procedures?.length ? surgery.procedures : [{ name: surgery.procedure, site: undefined, code: undefined, price: undefined }];

export function AdmissionPaymentSummary({ surgery }: { surgery: Surgery }) {
  return <section className="my-3 rounded-xl border border-slate-200 bg-white p-3">
    <h3 className="mb-2 text-xs font-bold text-slate-700">Procedures & payment</h3>
    <div className="max-h-[22vh] space-y-2 overflow-y-auto">{proceduresFor(surgery).map((procedure, index) => <div key={index} className="rounded-lg bg-slate-50 p-2.5">
      <div className="flex items-start justify-between gap-3"><p className="min-w-0 break-words text-xs font-semibold text-slate-800">{procedure.name}</p><p className="shrink-0 text-xs font-semibold text-slate-700">{procedure.price != null ? money(procedure.price) : "Price not recorded"}</p></div>
      <p className="mt-1 text-[11px] text-slate-500">Code: {procedure.code || "Not recorded"} <span className="mx-2">/</span> Site: {procedure.site || "Not recorded"}</p>
    </div>)}</div>
    <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
      <div className="flex justify-between font-semibold text-slate-800"><dt>Total charges</dt><dd>{money(surgery.cost)}</dd></div>
      <div className="flex justify-between text-slate-500"><dt>Already paid</dt><dd>{money(surgery.paidAmount)}</dd></div>
      <div className="flex justify-between font-bold text-amber-700"><dt>Balance due</dt><dd>{money(Math.max(0, surgery.cost - surgery.paidAmount))}</dd></div>
    </dl>
  </section>;
}

export function ReceptionPrintouts({ surgery }: { surgery: Surgery }) {
  const updateSurgery = useSurgeryStore((state) => state.updateSurgery);
  const [error, setError] = useState("");
  const form = surgery.receptionPrintout ?? { documentType: "Admission summary", representative: "", consentText: "", notes: "" };
  const update = (changes: Partial<typeof form>) => updateSurgery(surgery.id, { receptionPrintout: { ...form, ...changes } });
  const print = () => {
    if (form.documentType === "Consent form" && !form.consentText.trim()) { setError("Enter the consent wording before printing the consent form."); return; }
    setError("");
    const html = renderToStaticMarkup(<html><head><title>{form.documentType} - {surgery.mrn || surgery.id}</title><style>{`@page { size: A4; margin: 18mm; } body { font: 12px Arial, sans-serif; color: #172033; } h1 { font-size: 22px; margin-bottom: 6px; } h2 { font-size: 14px; margin-top: 24px; } .identity { border: 1px solid #cbd5e1; padding: 14px; margin: 20px 0; } p { line-height: 1.6; white-space: pre-wrap; overflow-wrap: anywhere; } .procedure { border-bottom: 1px solid #e2e8f0; padding: 8px 0; break-inside: avoid; } .signatures { margin-top: 40px; break-inside: avoid; } .signatures p { margin-top: 28px; }`}</style></head><body>
      <h1>{form.documentType}</h1><p>Surgery reception / Case {surgery.id}</p>
      <div className="identity"><p><strong>Patient:</strong> {surgery.patientName}<br /><strong>MRN:</strong> {surgery.mrn || "Not recorded"}<br /><strong>Scheduled:</strong> {surgery.date} at {surgery.time}<br /><strong>Surgeon:</strong> {surgery.doctor}<br /><strong>Room:</strong> {surgery.room}<br /><strong>Representative:</strong> {form.representative || "________________________"}</p></div>
      <h2>Planned procedures</h2>{proceduresFor(surgery).map((procedure, index) => <div className="procedure" key={index}><strong>{procedure.name}</strong><p>Code: {procedure.code || "Not recorded"} / Site: {procedure.site || "Not recorded"}<br />Price: {procedure.price != null ? money(procedure.price) : "Not recorded"}</p></div>)}
      <p>Total charges: {money(surgery.cost)} / Paid: {money(surgery.paidAmount)} / Balance: {money(Math.max(0, surgery.cost - surgery.paidAmount))}</p>
      {form.documentType === "Consent form" && <><h2>Consent</h2><p>{form.consentText}</p></>}
      {form.notes && <><h2>Additional notes</h2><p>{form.notes}</p></>}
      <div className="signatures"><p>Patient / representative signature: ________________________</p><p>Clinician / witness name and signature: ________________________</p><p>Date and time signed: ________________________</p></div>
    </body></html>);
    const frame = document.createElement("iframe");
    frame.title = "Patient print preview";
    frame.style.cssText = "position:fixed;width:0;height:0;border:0;";
    frame.onload = () => {
      const target = frame.contentWindow;
      if (!target) { setError("Print preview could not be opened. Please try again."); frame.remove(); return; }
      target.addEventListener("afterprint", () => frame.remove(), { once: true });
      target.focus();
      target.print();
    };
    frame.srcdoc = "<!doctype html>" + html;
    document.body.appendChild(frame);
  };
  const input = "mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 focus:border-amber-400";
  return <section className="rounded-xl border border-amber-100 bg-amber-50/30 p-3">
    <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-700"><FileText size={14} className="text-amber-600" />Consents and printouts</h3>
    <p className="mt-1 text-[11px] text-slate-500">Patient and operation details are filled automatically.</p>
    <div className="my-3 rounded-lg border border-slate-100 bg-white p-2.5"><p className="text-xs font-semibold text-slate-800">{surgery.patientName}</p><p className="mt-1 text-[11px] text-slate-500">{surgery.mrn || "MRN not recorded"}</p><p className="mt-1 text-[11px] text-slate-500">{surgery.date} / {surgery.time} / {surgery.room}</p></div>
    <div className="space-y-2.5">
      <label className="block text-[11px] font-medium text-slate-600">Document<select value={form.documentType} onChange={(event) => update({ documentType: event.target.value as typeof form.documentType })} className={input}><option>Admission summary</option><option>Consent form</option></select></label>
      <label className="block text-[11px] font-medium text-slate-600">Patient representative (if applicable)<input value={form.representative} onChange={(event) => update({ representative: event.target.value })} className={input} /></label>
      {form.documentType === "Consent form" && <label className="block text-[11px] font-medium text-slate-600">Consent wording<textarea rows={5} value={form.consentText} onChange={(event) => update({ consentText: event.target.value })} placeholder="Enter the consent wording for this procedure" className={input} /></label>}
      <label className="block text-[11px] font-medium text-slate-600">Additional notes<textarea rows={2} value={form.notes} onChange={(event) => update({ notes: event.target.value })} className={input} /></label>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <button type="button" onClick={print} className="flex w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"><Printer size={14} />Print {form.documentType.toLowerCase()}</button>
    </div>
  </section>;
}
