import { Check } from "lucide-react";
import type { CopilotAnalysis } from "../types";

export function CopilotWorkflowProgress({ progress }: Pick<CopilotAnalysis, "progress">) {
  return <section aria-label="Workflow position">
    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Workflow position</h3>
    <ol className="mt-3 flex flex-wrap gap-2">
      {progress.map((step) => <li key={step.label} aria-current={step.state === "current" ? "step" : undefined}
        className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] ${step.state === "current" ? "border-violet-300 bg-violet-100 font-bold text-violet-800" : step.state === "passed" ? "border-slate-200 bg-white text-slate-600" : "border-slate-100 bg-slate-50 text-slate-400"}`}>
        {step.state === "passed" && <Check size={12} aria-hidden="true" />}{step.label}
      </li>)}
    </ol>
</section>;
}
