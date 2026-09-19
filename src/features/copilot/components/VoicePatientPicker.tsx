import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Surgery } from "../../../types/surgery";
import { BackendVoiceControl } from "./BackendVoiceControl";
import { findPatientCases } from "../patientLookup";

export function VoicePatientPicker({ surgeries, disabled, onSelect, onOpen }: { surgeries: Surgery[]; disabled: boolean; onSelect: (id: string) => void; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("auto");
  const results = findPatientCases(surgeries, query);
  return <section className="mb-4 space-y-2 rounded-xl border border-violet-100 bg-violet-50/40 p-3" aria-label="Choose a surgery case">
    <h3 className="text-sm font-bold text-slate-800">Choose a surgery case</h3>
    <p className="text-xs text-slate-500">Say the patient's name and MRN, or type below.</p>
    <select aria-label="Patient search speech language" value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-lg border border-slate-200 bg-white p-2 text-xs"><option value="auto">Auto</option><option value="ar">Arabic</option><option value="en">English</option></select>
    <BackendVoiceControl language={language} disabled={disabled} onTranscript={setQuery} />
    <input aria-label="Search patient name or MRN" value={query} disabled={disabled} onChange={(event) => setQuery(event.target.value)} placeholder="Patient name, MRN, or case ID" className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 !text-xs" />
    <div className="max-h-52 space-y-2 overflow-y-auto">{results.map((surgery) => <div key={surgery.id} className="rounded-lg border border-slate-100 bg-white p-2"><p className="text-xs font-bold text-slate-700">{surgery.patientName}</p><p className="mt-1 text-[11px] text-slate-500">{(surgery as Surgery & { mrn?: string }).mrn || "MRN not recorded"} · {surgery.id}</p><div className="mt-2 flex flex-wrap gap-3"><button type="button" disabled={disabled} className="!text-xs font-semibold text-violet-600" onClick={() => onSelect(surgery.id)}>View guidance</button><button type="button" disabled={disabled} className="inline-flex items-center gap-1 !text-xs font-semibold text-violet-600" onClick={() => onOpen(surgery.id)}>Open record <ArrowRight size={12} /></button></div></div>)}</div>
    {!results.length && <p role="status" className="text-xs text-slate-500">No matching case. Try the MRN digits or the name as recorded.</p>}
  </section>;
}
