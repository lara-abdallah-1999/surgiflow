import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { CopilotAnalysis, CopilotDestination } from "../types";

export function CopilotNextAction({ action, onNavigate }: {
  action: CopilotAnalysis["nextAction"];
  onNavigate: (destination: CopilotDestination) => void;
}) {
  return <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
    <p className="text-[9px] font-bold uppercase tracking-widest text-violet-600">Next workflow action</p>
    <h3 className="mt-2 text-md font-bold leading-snug text-slate-900">{action?.title ?? "Workflow complete"}</h3>
    {action ? <>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{action.reason}</p>
      <button type="button" onClick={() => onNavigate(action.destination)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-2.5 py-1 !text-sm font-semibold text-white shadow-sm hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500">
        {action.destination.label}<ArrowRight size={16} aria-hidden="true" />
      </button>
    </> : <p className="mt-3 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 size={18} />Discharge is recorded. No next action.</p>}
  </section>;
}
