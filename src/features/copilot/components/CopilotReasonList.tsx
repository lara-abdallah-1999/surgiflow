import { CircleAlert, ChevronRight } from "lucide-react";
import type { CopilotDestination, CopilotItem } from "../types";

export function CopilotReasonList({ items, onNavigate }: { items: CopilotItem[]; onNavigate: (destination: CopilotDestination) => void }) {
  const blockers = items.filter((item) => item.blocking);
  return <section>
    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800"><CircleAlert size={16} className="text-amber-600" />Outstanding requirements <span className="rounded-full bg-amber-50 px-2 text-xs text-amber-800">{blockers.length}</span></h3>
    {blockers.length ? <ul className="mt-3 space-y-2">{blockers.map((item) => <li key={item.id} className="rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-1.5">
      <p className="text-[12px] font-semibold text-slate-800">{item.label}</p>
      <p className="mt-1 text-[10px] leading-relaxed text-slate-600">{item.reason}</p>
      <button type="button" onClick={() => onNavigate(item.destination)} className="mt-2 inline-flex items-center gap-1 !text-[13px] font-semibold text-violet-700 hover:underline focus-visible:outline-2">{item.destination.label}<ChevronRight size={12} /></button>
    </li>)}</ul> : <p className="mt-2 text-sm text-slate-500">No outstanding prerequisite identified for this stage from the available records.</p>}
  </section>;
}
