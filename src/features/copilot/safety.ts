import type { CopilotActionId, CopilotActions, CopilotResult } from "./types";

export type PendingCopilotAction = {
  action: CopilotActionId;
  caseId: string;
  patientName: string;
  workflowVersion: string;
  originalCommand: string;
  source: "voice" | "text";
  preparedAt: string;
};

/** Called only from an explicit UI confirmation, never by the intent parser or microphone. */
export function confirmPendingAction(pending: PendingCopilotAction, caseId: string, workflowVersion: string, actions: CopilotActions): CopilotResult {
  if (pending.caseId !== caseId) return { ok: false, message: "The selected case changed. Cancel and prepare the action for the current patient." };
  if (pending.workflowVersion !== workflowVersion) return { ok: false, message: "The workflow changed after this action was prepared. Cancel and prepare it again using the latest state." };
  const action = actions[pending.action];
  if (!action?.available) return { ok: false, message: action?.reason ?? "Open the current Surgery workspace to prepare this action." };
  try { return action.execute(); }
  catch { return { ok: false, message: "The action could not be completed. Verify the workspace record before trying again." }; }
}
