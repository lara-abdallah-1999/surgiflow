import { translateWorkflowCommand } from "../language";
import { AiConversation } from "./AiConversation";
import { captureWorkspace, workspaceVersion } from "../ai/workspace";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Sparkles, ShieldCheck, FilePenLine } from "lucide-react";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { answerQuestion, commandDestination, draftDocumentation, parseCommand } from "../commands";
import { confirmPendingAction, type PendingCopilotAction } from "../safety";
import type { CopilotAnalysis, CopilotDestination, CopilotDocumentKind, CopilotProps } from "../types";

type Props = Required<Pick<CopilotProps, "surgery">> & Omit<CopilotProps, "surgery" | "onDestination"> & {
  analysis: CopilotAnalysis;
  onNavigate: (destination: CopilotDestination) => void;
  onDirtyChange: (dirty: boolean) => void;
};
type Draft = { kind: CopilotDocumentKind; text: string; originalCommand: string; source: "voice" | "text"; baseValue?: string; caseId: string; patientName: string; aiSnapshot?: string };
const labels: Record<CopilotDocumentKind, string> = { "recovery-note": "Recovery note", "intraop-note": "Intraoperative note", handoff: "Handoff", summary: "Case summary", "operative-report": "Operative report draft" };
const buttonClass = "rounded-lg border border-slate-200 bg-white px-3 py-1 !text-sm font-semibold text-slate-700 hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-50";

export function CopilotCommandCenter({ surgery, context, analysis, actions = {}, documents = {}, workflowVersion = "", onNavigate, onDirtyChange }: Props) {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [interpretation, setInterpretation] = useState("");
  const [response, setResponse] = useState("");
  const [pending, setPending] = useState<PendingCopilotAction | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [activity, setActivity] = useState<{ time: string; label: string }[]>([]);
  const committing = useRef(false);
  const dirty = Boolean(pending || draft);
  useEffect(() => { onDirtyChange(dirty); return () => onDirtyChange(false); }, [dirty, onDirtyChange]);
  useEffect(() => {
    if (!dirty) return;
    const preventDiscard = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", preventDiscard);
    return () => window.removeEventListener("beforeunload", preventDiscard);
  }, [dirty]);
  const record = (label: string) => setActivity((current) => [{ time: new Date().toLocaleTimeString(), label }, ...current].slice(0, 12));

  function submit(raw: string, source: "voice" | "text") {
    if (!raw.trim()) return;
    setInput(raw);
    if (pending || draft) { setResponse("Review or cancel the pending action/draft before issuing another command."); return; }
    const translation = translateWorkflowCommand(raw);
    setInterpretation(translation.translated ? translation.command + (translation.narrativePreserved ? " (Note text kept in the original language.)" : "") : "");
    const intent = parseCommand(translation.command);
    if (intent.kind === "unknown") { setResponse(intent.message); record("Command not recognized; no changes made"); return; }
    if (intent.kind === "ask") { setResponse(answerQuestion(intent.question, surgery, analysis, context, actions)); record(`Answered: ${raw}`); return; }
    if (intent.kind === "navigate") {
      const destination = commandDestination(intent.target, surgery, analysis, intent.filter);
      if (destination) { record(`Opened: ${intent.target}`); onNavigate(destination); }
      else setResponse("No next workflow destination is available for this case.");
      return;
    }
    if (intent.kind === "draft") {
      committing.current = false;
      setDraft({ kind: intent.document, text: draftDocumentation(intent.document, surgery, analysis, intent.text), source, originalCommand: raw, baseValue: documents[intent.document]?.currentValue, caseId: surgery.id, patientName: surgery.patientName });
      setResponse("Draft created. Review and edit it before choosing Save. Nothing has been saved.");
      record(`Prepared ${labels[intent.document].toLowerCase()}`);
      return;
    }
    const action = actions[intent.action];
    if (!action) { setResponse("Open this case in Surgery to prepare actions against its current controls. No action was queued or executed."); return; }
    if (!action.available) { setResponse(`${action.label} is unavailable. ${action.reason}`); record(`${action.label} blocked; no changes made`); return; }
    committing.current = false;
    setPending({ action: intent.action, caseId: surgery.id, patientName: surgery.patientName, workflowVersion, originalCommand: raw, source, preparedAt: new Date().toISOString() });
    setResponse("Action prepared. Review the details and use the Confirm button to apply it.");
    record(`Prepared: ${action.label}`);
  }

  const voice = useVoiceInput((text) => submit(text, "voice"), language);
  const currentAction = pending ? actions[pending.action] : undefined;
  const stale = pending && (pending.workflowVersion !== workflowVersion || pending.caseId !== surgery.id);
  const target = draft ? documents[draft.kind] : undefined;
  const draftStale = draft && (draft.caseId !== surgery.id || draft.patientName !== surgery.patientName || target?.currentValue !== draft.baseValue || Boolean(draft.aiSnapshot && draft.aiSnapshot !== workspaceVersion(captureWorkspace(surgery.id, context))));
  const quickCommands = ["Brief me", "What is missing?", "Take me to the next step.", ...(analysis.stage === "Recovery" ? ["Which recovery checks remain?", "Show Recovery Assessment"] : analysis.stage === "Surgery" ? ["Can I end surgery?", "Show Equipment"] : ["Open Pre-Op"]), "Draft a handoff"];

  function confirm() {
    if (!pending || committing.current) return;
    committing.current = true;
    const result = confirmPendingAction(pending, surgery.id, workflowVersion, actions);
    setResponse(result.message);
    record(`${result.ok ? "Confirmed" : "Not applied"}: ${currentAction?.label ?? pending.action}`);
    // Consume even failed confirmations so a repeated click cannot retry a stale action.
    setPending(null);
  }

  function saveDraft() {
    if (!draft || !target || !draft.text.trim() || committing.current || draftStale) return;
    if (draft.aiSnapshot && draft.aiSnapshot !== workspaceVersion(captureWorkspace(surgery.id, context))) { setResponse("Application records changed after this AI draft was generated. Copy your edits, discard this draft, and generate a fresh one before saving."); return; }
    committing.current = true;
    try {
      const result = target.save(draft.text.trim());
      setResponse(result.message);
      record(`${result.ok ? "Saved reviewed" : "Could not save"} ${labels[draft.kind].toLowerCase()}`);
      if (result.ok) setDraft(null);
      else committing.current = false;
    } catch { committing.current = false; setResponse("The draft could not be saved. Your editable text is still here."); }
  }

  return <>
    <AiConversation key={surgery.id} caseId={surgery.id} context={context} disabled={dirty} onNavigate={(proposal) => onNavigate(proposal.destination)} onDraft={(generated) => {
      if (dirty) return;
      committing.current = false;
      setDraft({ ...generated, source: "text", originalCommand: "AI-generated draft from current application records", baseValue: documents[generated.kind]?.currentValue, caseId: surgery.id, patientName: surgery.patientName, aiSnapshot: workspaceVersion(captureWorkspace(surgery.id, context)) });
      setResponse("AI draft ready for review. Verify its content before saving; nothing has been saved.");
    }} />
    <details open={dirty || undefined} className="rounded-2xl border border-slate-200 bg-white p-3">
    <summary className="cursor-pointer text-xs font-semibold text-slate-600">Existing workflow controls & reviewed documentation</summary>
    <p className="my-2 text-[11px] text-slate-500">These explicit shortcuts use local workflow rules. OpenAI conversation is above; actions still require your confirmation.</p>
    <section aria-label="Copilot commands" className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50/40 p-4">
    <h4 className="flex items-center gap-2 !text-sm font-medium text-slate-900"><Sparkles size={16} className="text-violet-600" />Ask, navigate, dictate, or prepare an action</h4>
    <div className="flex flex-wrap gap-1.5">{quickCommands.map((command) => <button key={command} type="button" disabled={dirty || voice.listening} className={buttonClass} onClick={() => submit(command, "text")}>{command}</button>)}</div>
    {!Object.keys(actions).length && <button type="button" disabled={dirty || voice.listening} className={buttonClass} onClick={() => submit("Open Surgery", "text")}>Open this case's Surgery controls</button>}
    <details className="text-xs text-slate-500"><summary className="cursor-pointer">Shortcut examples / أمثلة</summary><p className="mt-2" dir="rtl">شو ناقص؟ افتح الإفاقة. لخص الحالة.</p><p className="mt-1">These local shortcuts recognize specific phrases. Use the AI conversation above for free-form English or Arabic.</p></details>
    <form onSubmit={(event) => { event.preventDefault(); submit(input, "text"); }} className="space-y-2">
      <label htmlFor="copilot-command" className="text-xs font-semibold text-slate-600">Command for {surgery.patientName} · {surgery.id}</label>
      <textarea id="copilot-command" value={input} onChange={(event) => setInput(event.target.value)} rows={2} maxLength={12000} disabled={dirty || voice.listening} placeholder="Try: Add recovery note: …" className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-violet-400 disabled:opacity-60" />
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="Command speech language" value={language} disabled={voice.listening} onChange={(event) => setLanguage(event.target.value)} className="rounded-lg border border-slate-200 bg-white p-2 text-xs"><option value="en-US">English</option><option value="ar-LB">العربية · لبنان</option><option value="ar-SA">العربية</option></select>
        <button type="submit" disabled={!input.trim() || dirty || voice.listening} className={buttonClass}><Send size={14} className="mr-1 inline" />Send command</button>
        {voice.listening ? <><button type="button" onClick={voice.stop} className={buttonClass}><MicOff size={14} className="mr-1 inline" />Stop & process</button><button type="button" onClick={voice.cancel} className={buttonClass}>Cancel listening</button></> : <button type="button" disabled={!voice.supported || dirty} onClick={voice.start} className={buttonClass}><Mic size={14} className="mr-1 inline" />Speak command</button>}
      </div>
      <p className="text-[11px] leading-relaxed text-slate-500">{voice.supported ? "Microphone starts only when you choose Speak. Your browser may send audio to its speech service. Use text if that service is not approved for patient data. English and supported Arabic workflow commands; one at a time. Speech processes automatically after you finish speaking." : "Voice recognition is unavailable in this browser. All commands work with text input."}</p>
      {voice.listening && <p role="status" className="text-sm text-violet-700">Listening… {voice.interim}</p>}
      {voice.error && <p role="alert" className="text-xs text-amber-800">{voice.error}</p>}
    </form>
    {interpretation && <p className="rounded-lg bg-white p-2 text-xs text-violet-700">Interpreted command: {interpretation}</p>}
    {response && <div role="status" aria-live="polite" className="whitespace-pre-wrap rounded-xl border border-violet-100 bg-white p-3 text-sm leading-relaxed text-slate-700">{response}</div>}
    {pending && <section aria-label="Pending action" className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
      <h4 className="flex items-center gap-2 text-xs font-extrabold tracking-wide text-amber-900"><ShieldCheck size={17} />ACTION REQUIRES CONFIRMATION</h4>
      <dl className="space-y-2 text-xs text-slate-700">
        {[["Patient", pending.patientName], ["Case ID", pending.caseId], ["Action", currentAction?.label ?? pending.action], ["Proposed value", currentAction?.proposedValue ?? "Unavailable"], ["Prepared at", new Date(pending.preparedAt).toLocaleString()], ["Timestamp", "The existing control records the actual confirmation time."], [`Original ${pending.source} command`, pending.originalCommand], ["Effect of confirmation", currentAction?.effect ?? "Action unavailable"]].map(([label, value]) => <div key={label}><dt className="font-bold">{label}</dt><dd className="mt-0.5 whitespace-pre-wrap break-words">{value}</dd></div>)}
      </dl>
      {(stale || !currentAction?.available) && <p role="alert" className="text-xs font-semibold text-amber-900">{stale ? "Workflow changed. Cancel and prepare this action again." : currentAction?.reason}</p>}
      <div className="flex justify-end gap-2"><button type="button" className={buttonClass} onClick={() => { setPending(null); setResponse("Action cancelled. No changes made."); record("Cancelled pending action"); }}>Cancel</button><button type="button" disabled={Boolean(stale) || !currentAction?.available} className={`${buttonClass} !border-violet-600 !bg-violet-600 !text-white`} onClick={confirm}>Confirm</button></div>
    </section>}
    {draft && <section aria-label="Documentation draft" className="space-y-3 rounded-xl border border-blue-200 bg-white p-4">
      <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800"><FilePenLine size={17} />{labels[draft.kind]} · Unsaved</h4>
      <p className="text-xs text-slate-600">{surgery.patientName} · {draft.caseId}</p>
      <p className="text-xs text-slate-500">Original {draft.source} command: {draft.originalCommand}</p>
      <label htmlFor="copilot-draft" className="block text-xs font-semibold">Review and edit</label>
      <textarea id="copilot-draft" rows={9} maxLength={30000} value={draft.text} onChange={(event) => setDraft({ ...draft, text: event.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-sm focus:border-violet-400" />
      <p className="text-xs text-slate-500">{target ? `Save appends your reviewed text to ${target.label}. Existing text is preserved.` : "Saving is available inside the case's Surgery workspace. No documentation has been persisted."}</p>
      {draftStale && <p role="alert" className="text-xs text-amber-800">The case records or destination note changed. Copy your draft, then discard and prepare a fresh draft before saving.</p>}
      <div className="flex flex-wrap justify-end gap-2"><button type="button" className={buttonClass} onClick={async () => { try { await navigator.clipboard.writeText(draft.text); setResponse("Draft copied. It has not been saved to the case."); } catch { setResponse("Clipboard unavailable. Select the draft text and copy it manually."); } }}>Copy draft</button><button type="button" className={buttonClass} onClick={() => { setDraft(null); setResponse("Draft discarded. Nothing saved."); record("Discarded documentation draft"); }}>Discard</button><button type="button" className={buttonClass} disabled={!target || !draft.text.trim() || Boolean(draftStale)} onClick={saveDraft}>Save reviewed draft</button></div>
    </section>}
    {!!activity.length && <details className="rounded-xl border border-slate-200 bg-white p-3"><summary className="cursor-pointer text-xs font-bold text-slate-600">Recent Copilot activity ({activity.length})</summary><p className="mt-2 text-[11px] text-slate-400">This drawer session only. Not a clinical audit log.</p><ol className="mt-2 space-y-2">{activity.map((entry, index) => <li key={`${entry.time}-${index}`} className="text-xs text-slate-600"><span className="mr-2 text-slate-400">{entry.time}</span>{entry.label}</li>)}</ol></details>}
  </section></details></>;
}
