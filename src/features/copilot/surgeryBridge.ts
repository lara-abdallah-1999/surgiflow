import type { CopilotActionId, CopilotActions, CopilotResult } from "./types";

type Control = { available: boolean; reason: string; run: () => void };
const details: Record<CopilotActionId, { label: string; effect: string; proposedValue: string }> = {
  start: { label: "Start Surgery", effect: "Calls the existing Start Surgery handler, records the start time, and changes status to In Progress.", proposedValue: "Surgery started at confirmation time" },
  anesthesia: { label: "Record Anesthesia", effect: "Calls the existing anesthesia confirmation handler and records administration/completion time.", proposedValue: "Anesthesia administration recorded at confirmation time" },
  cut: { label: "Confirm Site & Cut", effect: "Calls the existing Site & Cut handler to record cut time. Procedure sites are not changed.", proposedValue: "Cut time recorded at confirmation time" },
  end: { label: "End Surgery", effect: "Calls the existing End Surgery handler, records completion time and duration, and changes status to Completed.", proposedValue: "Surgery completed at confirmation time" },
  awakening: { label: "Confirm Awakening", effect: "Calls the existing Patient Awakening handler in the Recovery tab.", proposedValue: "Awakening confirmed; timestamp recorded at confirmation" },
  ready: { label: "Ready for Transfer", effect: "Calls the existing Ready for Transfer checkpoint. This does not confirm transfer.", proposedValue: "Transfer readiness confirmed at confirmation time" },
  transfer: { label: "Confirm Transferred", effect: "Calls the existing Confirm Transferred handler and changes status to Recovery.", proposedValue: "Transfer confirmed at confirmation time" },
};

/** Adapts existing page controls; never implements a state mutation. */
export function createSurgeryActions(controls: Record<CopilotActionId, Control>, isCurrent: () => boolean): CopilotActions {
  return Object.fromEntries(Object.entries(controls).map(([key, control]) => [key, {
    ...details[key as CopilotActionId],
    available: control.available,
    reason: control.reason,
    execute: (): CopilotResult => {
      if (!isCurrent()) return { ok: false, message: "The case record changed. Prepare the action again from the latest workspace." };
      if (!control.available) return { ok: false, message: control.reason };
      control.run();
      return { ok: true, message: `${details[key as CopilotActionId].label} applied through the existing workspace control.` };
    },
  }]));
}

export function appendReviewedText(existing: string, reviewed: string) {
  return existing.trim() ? `${existing.trimEnd()}\n\n${reviewed.trim()}` : reviewed.trim();
}

/** The existing Post-Op report editor reads HTML. Dictation is always literal text. */
export function appendReviewedReport(existingHtml: string, reviewed: string) {
  const escaped = reviewed.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r?\n/g, "<br>");
  return `${existingHtml}${existingHtml ? "\n" : ""}<p>${escaped}</p>`;
}
