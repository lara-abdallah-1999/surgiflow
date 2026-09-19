


export type SortKey =
  | "patient"
  | "case"
  | "mrn"
  | "number"
  | "procedure"
  | "doctor"
  | "priority";


export type SortDirection = "asc" | "desc";


export type WaitingProcedureItem = {
  name: string;
  site?: string;
};
