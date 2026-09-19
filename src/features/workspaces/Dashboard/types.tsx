import { type Surgery } from "../../../types/surgery";


/* ==========================================================================
   TYPES
   ========================================================================== */

export type Tone =
  | "amber"
  | "indigo"
  | "blue"
  | "violet"
  | "teal"
  | "cyan"
  | "slate"
  | "red";



export type RoomItem = {
  room: string;
  current?: Surgery;
  next?: Surgery;
};


export type SortKey =
  | "time"
  | "patient"
  | "notes"
  | "procedure"
  | "surgeon"
  | "room"
  | "status";


export type SortDirection = "asc" | "desc";


export type OperatingFilter =
  | "Ready"
  | "In Progress"
  | "Recovery";


export type Period = "Day" | "Week" | "Month";
