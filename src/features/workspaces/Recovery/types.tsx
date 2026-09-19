


export type RecoveryStatus =
  | "Not Started"
  | "Monitoring"
  | "Progressing"
  | "Ready for Transfer";


export type Stability = "stable" | "unstable";


export type Period = "Day" | "Week" | "Month";


export type SortKey =
  | "patient"
  | "patientId"
  | "procedures"
  | "surgeon"
  | "date"
  | "duration"
  | "condition"
  | "recoveryStatus";


export type SortDirection = "asc" | "desc";


export type ToastState = {
  type: "success" | "error";
  title: string;
  message: string;
  items?: string[];
} | null;


export type RecoveryState = {
  started: boolean;
  awakeningStage: number;
  assessments: string[];
  notes: string;
  status: RecoveryStatus;
  stability: Stability;
  surgeonReport: string;
};
