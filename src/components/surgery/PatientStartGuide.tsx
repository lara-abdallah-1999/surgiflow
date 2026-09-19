import { ArrowRight, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

export function PatientStartGuide() {
  return <section aria-label="Start a patient workflow" className="flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-xl border border-violet-100 bg-white px-3 py-2">
    <div className="flex items-center gap-2"><UsersRound size={17} className="shrink-0 text-violet-600" /><div><h2 className="text-xs font-bold text-slate-800">Start by choosing a patient</h2><p className="text-[11px] text-slate-500">Open the Patients table and select a patient to view their records and Surgical Journey.</p></div></div>
    <Link to="/patients" className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">Choose patient <ArrowRight size={13} /></Link>
  </section>;
}
