


export type Period = "Day" | "Week" | "Month";


export type SortKey =
  | "patient"
  | "case"
  | "mrn"
  | "procedures"
  | "doctor"
  | "date"
  | "total"
  | "paid"
  | "payment"
  | "status";


export type SortDirection = "asc" | "desc";


export type ToastState = {
  type: "success" | "error";
  title: string;
  message: string;
} | null;
