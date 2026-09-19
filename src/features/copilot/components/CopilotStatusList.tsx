import { CheckCircle2, Circle } from "lucide-react";
import type { CopilotItem } from "../types";

export function CopilotStatusList({ items }: { items: CopilotItem[] }) {
  const completed = items.filter((item) => item.complete);
  const pending = items.filter((item) => !item.complete);
  return <section className="space-y-3">
    {[{ title: "Completed / recorded", entries: completed, open: true }, { title: "Still missing / not recorded", entries: pending, open: false }].map((group) =>
      <details key={group.title} open={group.open} className="rounded-xl border border-slate-200 bg-white p-3">
        <summary className="cursor-pointer text-sm font-bold text-slate-700">{group.title} <span className="font-normal text-slate-400">({group.entries.length})</span></summary>
        <ul className="mt-3 space-y-2">{group.entries.map((item) => <li key={item.id} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
          {item.complete ? <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" /> : <Circle size={15} className="mt-0.5 shrink-0 text-slate-400" />}{item.label}
        </li>)}</ul>
        {!group.entries.length && <p className="mt-2 text-xs text-slate-500">None in the available records.</p>}
      </details>)}
  </section>;
}
