


export type TabKey =
  | "preop-assessment"
  | "pre-tests"
  | "anesthesia"
  | "intra-op";


export type IntraSection = "supplies" | "notes";


export type Period = "Day" | "Week" | "Month";


export type SortKey =
  | "patient"
  | "case"
  | "procedures"
  | "surgeon"
  | "date"
  | "time"
  | "preOpStatus";


export type SortDirection = "asc" | "desc";


export type ToastState = {
  type: "success" | "error";
  title: string;
  message: string;
  items?: string[];
} | null;



export type SupplySection =
  | "required"
  | "additional";


export type SafetyNote = {
  exceptions: string[];
  acknowledged: boolean;
};


export type IntraNote = {
  id: string;
  type:
    | "routine"
    | "unexpected"
    | "critical";
  text: string;
  createdAt: string;
};


export type SupplyItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  checked: boolean;
  additional?: boolean;
};


export type ProcedureItem = {
  name: string;
  site?: string;
};


export type PreOpMeta = {
  [key: string]: unknown;
};


export type ReviewValue = "" | "yes" | "no";


export type ReviewEntry = {
  value: ReviewValue;
  detail: string;
};


export type ReviewMap = Record<string, ReviewEntry>;


export type AnesthesiaExamState = {
  functionalCapacity: ReviewValue;
  canLieFlat: ReviewValue;
  smoking: ReviewValue;
  recentUri: ReviewValue;
  airway: string;
  dental: string;
  heart: string;
  lungs: string;
  height: string;
  weight: string;
  currentMedications: string;
  priorAnesthesiaHistory: string;
  familyAnesthesiaHistory: string;
  ekg: string;
  labs: string;
  other: string;
  npoConfirmed: ReviewValue;
  asaClass: string;
};


export type PreOpWorkflowStatus =
  | "Awaiting Admit"
  | "Admitted"
  | "Not Started"
  | "In Progress"
  | "Complete";
