


export type ReceptionToastType = "success" | "error";


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


export type AdmissionFormItem = {
  id: string;
  label: string;
  shortLabel: string;
};
