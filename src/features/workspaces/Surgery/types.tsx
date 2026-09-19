


export type Period = "Day" | "Week" | "Month";


export type SortKey =
  | "patient"
  | "caseNumber"
  | "procedures"
  | "doctor"
  | "room"
  | "note"
  | "status";


export type SortDirection = "asc" | "desc";


export type SurgeryProcedureItem = {
  name: string;
  site?: string;
};
