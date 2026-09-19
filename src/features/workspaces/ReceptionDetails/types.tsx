


export type ReceptionToastType = "success" | "error" | "warning";


export type PatientStatus =
  | "Expected"
  | "Arrived"
  | "Reception In Progress"
  | "Ready for Admission"
  | "Sent to Cashier"
  | "On Hold";


export type ReceptionProcedure = {
  name: string;
  site?: string;
};


export type Patient = {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  procedure: string;
  procedures: ReceptionProcedure[];
  surgeon: string;
  date: string;
  time: string;
  status: PatientStatus;
  arrivalTime?: string;
  issues?: string[];
};



export type Period = "Day" | "Week" | "Month";

export type SortKey =
  | "name"
  | "case"
  | "mrn"
  | "procedures"
  | "surgeon"
  | "date"
  | "time"
  | "status";

export type SortDirection = "asc" | "desc";


export type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
};



export type ConsentQuestion = {
  id: string;
  label: string;
};


export type ConsentField = {
  id: string;
  label: string;
  kind: "text" | "phone" | "choice";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  span?: 1 | 2;
};


export type AdmissionFormItem = {
  id: string;
  label: string;
  shortLabel: string;
  fields: ConsentField[];
  questions: ConsentQuestion[];
};


export type ConsentAnswer = "" | "yes" | "no";


export type SignerRole =
  | "Patient"
  | "Parent / Guardian"
  | "Authorized Representative";


export type ApprovalMethod =
  | ""
  | "Digital signature"
  | "Paper signed";


export type ConsentFormDetails = {
  values: Record<string, string>;
  answers: Record<string, ConsentAnswer>;
  completedAt?: string;
};


export type ReceptionConsentApproval = {
  signerName: string;
  signerRole: SignerRole;
  identificationNumber: string;
  approvalMethod: ApprovalMethod;
};



export type CashierChargeRow = {
  id: string;
  category: string;
  label: string;
  site?: string;
  detail?: string;
  amount: number | null;
};
