import { useEffect, useState } from "react";
import { Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import type { AwakeningObservation, Surgery } from "../../types/surgery";
import { useSurgeryStore } from "../../store/surgeryStore";

export function PatientAwakening({ surgery, confirmed, confirmedAt, onConfirm }: { surgery: Surgery; confirmed: boolean; confirmedAt: string | null; onConfirm: () => void }) {
  const [response, setResponse] = useState<AwakeningObservation["response"]>("Not yet awake");
  const [note, setNote] = useState("");
  const [concern, setConcern] = useState(false);
  const [clinician, setClinician] = useState("");
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (confirmed) return;
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, [confirmed]);
  const end = Date.parse(surgery.surgeryCompletedAt ?? "");
  const observationTime = confirmedAt ? Date.parse(confirmedAt) : now;
  const minutes = Number.isFinite(end) && observationTime >= end ? Math.floor((observationTime - end) / 60000) : null;
  const observations = surgery.recoveryAwakeningObservations ?? [];
  const pending = observations.filter((item) => item.reviewRequested && !item.reviewedAt);
  function save() {
    const current = useSurgeryStore.getState().surgeries.find((item) => item.id === surgery.id);
    if (!current) return;
    const now = new Date().toISOString();
    const observation: AwakeningObservation = { id: crypto.randomUUID(), observedAt: now, response, note: note.trim(), reviewRequested: concern, ...(clinician.trim() ? { notifiedClinician: clinician.trim(), notifiedAt: now } : {}) };
    useSurgeryStore.getState().updateSurgery(surgery.id, { recoveryAwakeningObservations: [...(current.recoveryAwakeningObservations ?? []), observation] });
    setNote(""); setClinician(""); setConcern(false); setMessage("Observation saved. Awakening confirmation remains a separate checkpoint.");
  }
  return <section id="copilot-awakening" tabIndex={-1} aria-label="Patient Awakening" className="rounded-xl border border-teal-200 bg-white">
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
      <div><h3 className="flex items-center gap-2 text-[11px] font-bold text-slate-900"><Activity size={16} className="text-teal-600" />Patient Awakening {pending.length > 0 && <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">{pending.length} review requested</span>}</h3><p className="mt-1 text-[9px] text-slate-500">Record observed responses over time. No automatic wake-up deadline is assumed.</p><p className="mt-1 text-[10px] font-semibold text-teal-700">{minutes === null ? "Surgery end time not available" : `${confirmed ? "Surgery end to awakening" : "Time since surgery end"}: ${minutes} min`}</p></div>
      <button type="button" disabled={confirmed} onClick={onConfirm} className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-100/60 px-3 py-1 !text-[11px] font-bold text-teal-800 disabled:bg-emerald-50 disabled:text-emerald-700"><CheckCircle2 size={15} />{confirmed ? `Awakening confirmed${confirmedAt ? " · " + new Date(confirmedAt).toLocaleTimeString() : ""}` : "Confirm awake and responsive"}</button>
    </div>
    <details className="border-t border-slate-100 px-3 py-2" open={pending.length > 0 || undefined}>
      <summary className="cursor-pointer text-[11px] font-semibold text-teal-700">Observations & clinician review · {observations.length} recorded</summary>
      <form onSubmit={(event) => { event.preventDefault(); save(); }} className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="text-[10px] font-semibold text-slate-600">Observed response<select value={response} onChange={(event) => setResponse(event.target.value as AwakeningObservation["response"])} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 text-xs">{["Not yet awake", "Responds to voice", "Awake and responsive", "Other observation"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="text-[10px] font-semibold text-slate-600">Clinician already notified (optional)<input value={clinician} onChange={(event) => setClinician(event.target.value)} maxLength={120} placeholder="Name of clinician contacted" className="mt-1 block w-full rounded-lg border border-slate-200 p-2 text-xs" /></label>
        <label className="text-[10px] font-semibold text-slate-600 sm:col-span-2">Observation / reason for review<textarea value={note} onChange={(event) => setNote(event.target.value)} required={concern || response === "Other observation"} maxLength={3000} rows={2} className="mt-1 block w-full rounded-lg border border-slate-200 p-2 text-xs" /></label>
        <label className="flex items-center gap-2 text-xs text-amber-800"><input type="checkbox" checked={concern} onChange={(event) => setConcern(event.target.checked)} />Flag for clinician review</label>
        <button type="submit" className="justify-self-end rounded-lg bg-teal-600 px-3 py-1 !text-xs font-semibold text-white">Record observation</button>
        
      </form>
      {message && <p role="status" className="mt-2 text-xs text-teal-700">{message}</p>}
      <ol className="mt-3 max-h-44 space-y-2 overflow-y-auto">{[...observations].reverse().map((item) => <li key={item.id} className="rounded-lg border border-slate-100 p-2 text-[11px] text-slate-600">
        <div className="flex flex-wrap justify-between gap-1"><strong>{item.response}</strong><time dateTime={item.observedAt}>{new Date(item.observedAt).toLocaleString()}</time></div>
        {item.note && <p className="mt-1 whitespace-pre-wrap break-words">{item.note}</p>}
        {item.reviewRequested && <p className="mt-1 flex items-center gap-1 text-amber-700"><AlertCircle size={12} />{item.reviewedAt ? "Review recorded · " + new Date(item.reviewedAt).toLocaleString() : "Clinician review requested"}</p>}
        <p className="mt-1 text-slate-400">{item.notifiedClinician ? `Notification recorded: ${item.notifiedClinician} · ${new Date(item.notifiedAt!).toLocaleString()}` : "Clinician notification not recorded"}</p>
        {item.reviewRequested && !item.reviewedAt && <button type="button" className="mt-2 font-semibold text-teal-700" onClick={() => {
          const current = useSurgeryStore.getState().surgeries.find((record) => record.id === surgery.id);
          if (current) useSurgeryStore.getState().updateSurgery(surgery.id, { recoveryAwakeningObservations: current.recoveryAwakeningObservations?.map((record) => record.id === item.id ? { ...record, reviewedAt: new Date().toISOString() } : record) });
        }}>Record that clinician review occurred</button>}
      </li>)}</ol>
    </details>
  </section>;
}
