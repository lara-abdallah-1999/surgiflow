import type { CopilotActionId, CopilotAnalysis, CopilotContext, CopilotDestination, CopilotDocumentKind, CopilotActions } from "./types";
import type { Surgery } from "../../types/surgery";
import { asRecord, recoveryChecks } from "./utils";

export type Question = "next" | "missing" | "payment" | "preop" | "start-time" | "duration" | "anesthesia" | "site" | "equipment" | "end" | "checks" | "awakening" | "ready" | "brief" | "allergies" | "procedures" | "surgeon";
export type Intent =
  | { kind: "ask"; question: Question }
  | { kind: "navigate"; target: string; filter?: CopilotDestination["equipmentFilter"] }
  | { kind: "act"; action: CopilotActionId }
  | { kind: "draft"; document: CopilotDocumentKind; text?: string }
  | { kind: "unknown"; message: string };

const actionPhrases: [RegExp, CopilotActionId][] = [
  [/^(?:start|begin) (?:the )?surgery(?: now)?$/, "start"],
  [/^(?:record|confirm) anesthesia(?: administration)?(?: now)?$/, "anesthesia"],
  [/^(?:record|confirm) (?:the )?(?:cut(?: time)?|site (?:and|&) cut)(?: now)?$/, "cut"],
  [/^(?:end|complete) (?:the )?surgery(?: now)?$/, "end"],
  [/^confirm (?:patient )?awakening(?: now)?$/, "awakening"],
  [/^(?:mark|confirm)(?: patient)? ready for transfer(?: now)?$/, "ready"],
  [/^confirm (?:patient )?(?:transfer|transferred)(?: now)?$/, "transfer"],
];

/** Only whole, explicit commands prepare writes. Questions, negations and compound requests never do. */
export function parseCommand(raw: string): Intent {
  const text = raw.trim().replace(/[.!?]+$/, "").replace(/^please\s+/i, "").replace(/’/g, "'").toLowerCase().replace(/\s+/g, " ");
  const dictated = raw.trim().match(/^(?:please\s+)?(?:add|dictate)(?: a)? (recovery|intraoperative|intra-op) note(?:\s*:\s*|\s+)([\s\S]+)$/i);
  if (dictated) return { kind: "draft", document: dictated[1].toLowerCase() === "recovery" ? "recovery-note" : "intraop-note", text: dictated[2].trim() };
  if (/^(?:draft|create)(?: a| an)? (?:handoff|hand-off)$/.test(text)) return { kind: "draft", document: "handoff" };
  if (/^(?:summarize (?:this|the) (?:surgery|case)|(?:draft|create)(?: a)? case summary)$/.test(text)) return { kind: "draft", document: "summary" };
  if (/^draft(?: an| a)? operative report$/.test(text)) return { kind: "draft", document: "operative-report" };
  if (/^brief me$/.test(text)) return { kind: "ask", question: "brief" };
  const navigation = text.match(/^(?:open|show|go to|take me to|focus)(?: the)? (next step|pre-op|preop|payment|cashier|surgery|anesthesia|site and cut|site & cut|equipment|recovery|recovery assessment|patient awakening|ready for transfer|recovery notes)$/);
  if (navigation) return { kind: "navigate", target: navigation[1] };
  const filter = text.match(/^(?:show|filter)(?: equipment)? (in use|returned|available|all)(?: equipment)?$/);
  if (filter) return { kind: "navigate", target: "equipment", filter: ({ "in use": "In Use", returned: "Returned", available: "Available", all: "All" } as const)[filter[1] as "in use"] };
  for (const [pattern, action] of actionPhrases) if (pattern.test(text)) return { kind: "act", action };
  const questions: [RegExp, Question][] = [
    [/^(?:what allergies are recorded|show (?:recorded )?allergies|patient allergies)$/, "allergies"],
    [/^(?:what procedures are planned|show (?:the )?procedures|planned procedures)$/, "procedures"],
    [/^(?:who is (?:the )?(?:surgeon|doctor)|show surgeon)$/, "surgeon"],
    [/^(?:what (?:do i need to do next|is next|should i do next)|next step)$/, "next"],
    [/^(?:what(?:'s| is) (?:missing|blocking (?:this|the) surgery)|show blockers|what remains)$/, "missing"],
    [/^(?:has payment been completed|is payment (?:complete|completed|paid)|payment status)$/, "payment"],
    [/^(?:is pre-?op (?:finished|complete|completed)|has pre-?op been completed)$/, "preop"],
    [/^what time did (?:the )?surgery start$/, "start-time"],
    [/^how long has (?:the )?surgery been running$/, "duration"],
    [/^has anesthesia been recorded$/, "anesthesia"],
    [/^has (?:the )?(?:surgical )?site been recorded$/, "site"],
    [/^what equipment is still in use$/, "equipment"],
    [/^(?:can i end surgery|why can(?:not|'t) i end surgery)$/, "end"],
    [/^(?:which recovery checks remain|what recovery checks (?:remain|are missing))$/, "checks"],
    [/^has awakening been confirmed$/, "awakening"],
    [/^(?:are we ready for transfer|ready for transfer|can i mark ready for transfer)$/, "ready"],
  ];
  for (const [pattern, question] of questions) if (pattern.test(text)) return { kind: "ask", question };
  return { kind: "unknown", message: "I could not match that to one supported command. Try “What is missing?”, “Open Recovery”, or “Add recovery note: …”. Use the on-screen Confirm button for pending actions; spoken confirmation never executes them." };
}

export function commandDestination(target: string, surgery: Surgery, analysis: CopilotAnalysis, filter?: CopilotDestination["equipmentFilter"]): CopilotDestination | null {
  const path = `/surgery/${encodeURIComponent(surgery.id)}`;
  if (target === "next step") return analysis.nextAction?.destination ?? null;
  if (["pre-op", "preop"].includes(target)) return { path: `/pre-op/${encodeURIComponent(surgery.id)}`, label: "Open Pre-Op" };
  if (["payment", "cashier"].includes(target)) return { path: "/cashier", label: "Open Cashier", state: { highlightSurgeryId: surgery.id } };
  const focus: Record<string, CopilotDestination["focus"]> = { anesthesia: "anesthesia", "site and cut": "cut", "site & cut": "cut", equipment: "equipment", "recovery assessment": "assessment", "patient awakening": "awakening", "ready for transfer": "transfer", "recovery notes": "notes", surgery: "milestones" };
  return { path, label: `Open ${target}`, section: ["recovery", "recovery assessment", "patient awakening", "ready for transfer", "recovery notes"].includes(target) ? "recovery" : "surgery", focus: focus[target], equipmentFilter: filter };
}

function time(value: unknown) {
  const date = new Date(String(value));
  return value && Number.isFinite(date.getTime()) ? date.toLocaleString() : "Not recorded";
}

export function caseBrief(surgery: Surgery, analysis: CopilotAnalysis) {
  return `${surgery.patientName} · ${surgery.id}\nProcedure: ${surgery.procedure}\nRecorded status: ${surgery.status}\nPayment: ${surgery.paymentStatus}\nPre-Op: ${surgery.preOpStatus}\nStart: ${time(surgery.surgeryStartedAt)}\nEnd: ${time(surgery.surgeryCompletedAt)}\n${awakeningSummary(surgery)}\nNext: ${analysis.nextAction?.title ?? "No pending surgery workflow action"}\n${analysis.nextAction?.reason ?? "Discharge is recorded."}`;
}

function awakeningSummary(surgery: Surgery) {
  const observations = surgery.recoveryAwakeningObservations ?? [];
  const last = observations.at(-1);
  const pending = observations.filter((item) => item.reviewRequested && !item.reviewedAt);
  return last ? `Latest awakening observation: ${last.response} at ${time(last.observedAt)}.${last.note ? " " + last.note : ""}\nClinician reviews outstanding: ${pending.length}. ${last.notifiedClinician ? "Notification recorded to " + last.notifiedClinician + "." : "Clinician notification is not recorded for this observation."}` : "Awakening observations: none recorded.";
}

export function answerQuestion(question: Question, surgery: Surgery, analysis: CopilotAnalysis, context: CopilotContext = {}, actions: CopilotActions = {}, now = Date.now()): string {
  const record = asRecord(surgery);
  const or = context.operatingRoom;
  const item = (id: string) => analysis.items.find((entry) => entry.id === id);
  switch (question) {
    case "brief": return caseBrief(surgery, analysis);
    case "next": return analysis.nextAction ? `${analysis.nextAction.title}. ${analysis.nextAction.reason}` : "No pending surgery workflow action. Discharge is recorded.";
    case "missing": { const missing = analysis.items.filter((entry) => entry.blocking); return missing.length ? missing.map((entry) => `${entry.label}: ${entry.reason}`).join("\n") : "No blocking prerequisite identified from the available records. Review the next workflow action."; }
    case "payment": return `Recorded payment status: ${surgery.paymentStatus}. Total: $${surgery.cost.toLocaleString()}. Paid: $${surgery.paidAmount.toLocaleString()}. Remaining: $${Math.max(0, surgery.cost - surgery.paidAmount).toLocaleString()}. ${surgery.paymentStatus === "Paid" ? "Payment clearance is recorded." : "Payment clearance has not been completed."}`;
    case "allergies": return surgery.allergies?.length ? `Recorded allergies: ${surgery.allergies.join(", ")}.` : "No allergies are recorded in this case. This does not establish the absence of allergies.";
    case "procedures": return (surgery.procedures?.length ? surgery.procedures : [{ name: surgery.procedure }]).map((procedure) => `${procedure.name} · Site: ${procedure.site || "Not recorded"}`).join("\n");
    case "surgeon": return `Recorded surgeon: ${surgery.doctor || "Not recorded"}.`;
    case "preop": return item("preop")?.complete ? "Pre-Op completion is recorded in the workflow." : "Pre-Op completion is not recorded. Open Pre-Op to review its requirements.";
    case "start-time": return `Surgery start: ${time(record.surgeryStartedAt ?? record.startAt ?? record.startTime)}.`;
    case "duration": {
      const start = Date.parse(String(record.surgeryStartedAt ?? record.startAt ?? record.startTime));
      const endValue = record.surgeryCompletedAt ?? record.endAt ?? record.endTime;
      const end = endValue ? Date.parse(String(endValue)) : now;
      if (!Number.isFinite(start) || !Number.isFinite(end) || end < start || start > now) return "A valid start/end timestamp is unavailable; elapsed time cannot be calculated.";
      if (!endValue && surgery.status !== "In Progress") return "The case is not recorded as In Progress and has no end timestamp. Review the timing record.";
      const seconds = Math.floor((end - start) / 1000);
      return `${endValue ? "Recorded duration" : "Elapsed at the time of this answer"}: ${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m ${seconds % 60}s.`;
    }
    case "anesthesia": return item("anesthesia")?.complete ? "Anesthesia administration/induction time is recorded." : "Anesthesia administration is not recorded. A confirmed plan alone does not record administration.";
    case "site": return or ? `${or.everyProcedureHasSite ? "Every procedure has a recorded site." : "At least one procedure site is missing."} Site & Cut ${or.cutRecorded ? "is recorded" : "has not been recorded"}.` : "Open Surgery to verify every procedure site and the Site & Cut milestone.";
    case "equipment": return or?.equipmentNames ? (or.equipmentNames.length ? `Still In Use: ${or.equipmentNames.join(", ")}.` : "No reusable equipment remains In Use.") : "Open Equipment in Surgery to inspect the current list.";
    case "end": return actions.end ? (actions.end.available ? "The existing End Surgery control is available. Ending requires a separate explicit confirmation." : `End Surgery is unavailable. ${actions.end.reason}`) : `Open Surgery to check the authoritative End Surgery control. ${item("equipment")?.label ?? "Equipment state needs verification."}`;
    case "checks": { const missing = recoveryChecks.filter(([key, field]) => !(or ? or.recoveryAssessment[key] : record[field])).map(([, , label]) => label); return missing.length ? `Recovery checks not recorded: ${missing.join(", ")}.` : "All six recovery checks are recorded."; }
    case "awakening": return ((or?.awakeningConfirmed ?? Boolean(record.recoveryAwakeningConfirmed)) ? "Patient Awakening confirmation is recorded." : "Patient Awakening confirmation is not recorded.") + "\n" + awakeningSummary(surgery);
    case "ready": return (or?.readyForTransfer ?? Boolean(record.readyForTransferAt)) ? "Ready for Transfer confirmation is recorded." : actions.ready ? (actions.ready.available ? "The Ready for Transfer checkpoint is available and still requires confirmation." : `Ready for Transfer is unavailable. ${actions.ready.reason}`) : "Open the Recovery tab in Surgery to verify awakening and all six checks. Readiness is a workflow checkpoint, not a medical assessment.";
  }
}

export function draftDocumentation(kind: CopilotDocumentKind, surgery: Surgery, analysis: CopilotAnalysis, dictated?: string) {
  if (dictated !== undefined) return dictated;
  const title = kind === "handoff" ? "Workflow handoff" : kind === "operative-report" ? "Operative report draft — workflow facts only" : "Case summary";
  return `${title}\n${caseBrief(surgery, analysis)}\n\nRecorded checkpoints:\n${analysis.items.filter((item) => item.complete).map((item) => `- ${item.label}`).join("\n")}\n\nOutstanding workflow requirements:\n${analysis.items.filter((item) => item.blocking).map((item) => `- ${item.label}`).join("\n") || "None identified from available records."}${kind === "operative-report" ? "\n\nProcedural narrative, findings, complications, and instructions: not supplied in this draft. Complete from the clinical record before saving." : ""}`;
}
