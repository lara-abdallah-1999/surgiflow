import type { Surgery } from "../../types/surgery";

export type CopilotDestination = {
  path: string;
  label: string;
  section?: "surgery" | "recovery" | "pre-tests" | "anesthesia";
  focus?: "milestones" | "anesthesia" | "cut" | "equipment" | "awakening" | "assessment" | "transfer" | "notes";
  equipmentFilter?: "All" | "In Use" | "Returned" | "Available";
  state?: { highlightSurgeryId: string };
};

export type CopilotItem = {
  id: string;
  label: string;
  complete: boolean;
  blocking: boolean;
  reason: string;
  destination: CopilotDestination;
};

/** Read-only inputs supplied by the workspace that owns the state. */
export type CopilotContext = {
  preOp?: { completedTests: readonly string[]; planConfirmed: boolean };
  operatingRoom?: {
    started: boolean;
    anesthesiaRecorded: boolean;
    cutRecorded: boolean;
    ended: boolean;
    everyProcedureHasSite: boolean;
    equipmentInUse: number;
    equipmentNames?: readonly string[];
    awakeningConfirmed: boolean;
    recoveryAssessment: Record<string, boolean>;
    readyForTransfer: boolean;
    transferred: boolean;
  };
  recovery?: {
    started: boolean;
    awakeningStage: number;
    assessments: readonly string[];
    stability: string;
    surgeonReport: string;
    status: string;
  };
};

export type CopilotAnalysis = {
  stage: string;
  summary: string;
  progress: { label: string; state: "passed" | "current" | "upcoming" }[];
  items: CopilotItem[];
  nextAction: { title: string; reason: string; destination: CopilotDestination } | null;
  notes: string[];
};

export type CopilotProps = {
  surgery?: Surgery;
  context?: CopilotContext;
  onDestination?: (destination: CopilotDestination, surgeryId: string) => boolean;
  actions?: CopilotActions;
  documents?: CopilotDocuments;
  /** Changes when action-relevant state changes, not on timer ticks. */
  workflowVersion?: string;
};

export type CopilotActionId = "start" | "anesthesia" | "cut" | "end" | "awakening" | "ready" | "transfer";
export type CopilotDocumentKind = "recovery-note" | "intraop-note" | "handoff" | "summary" | "operative-report";
export type CopilotResult = { ok: boolean; message: string };
export type CopilotAction = {
  label: string;
  available: boolean;
  reason: string;
  effect: string;
  proposedValue: string;
  execute: () => CopilotResult;
};
export type CopilotActions = Partial<Record<CopilotActionId, CopilotAction>>;
export type CopilotDocumentTarget = {
  label: string;
  /** Includes unsaved workspace content, so stale drafts cannot overwrite it. */
  currentValue: string;
  save: (reviewedText: string) => CopilotResult;
};
export type CopilotDocuments = Partial<Record<CopilotDocumentKind, CopilotDocumentTarget>>;
