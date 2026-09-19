import { type Surgery } from "../../../types/surgery";


/* ==========================================================================
   TYPES
   ========================================================================== */

export type ViewMode =
  | "month"
  | "week"
  | "day"
  | "agenda";


export type ResourceMode =
  | "doctor"
  | "room";


export type StatusBucket =
  | "scheduled"
  | "ready"
  | "in-progress"
  | "completed"
  | "recovery"
  | "discharged";


export type CalendarSurgery = Surgery & {
  start: Date;
  end: Date;
  bucket: StatusBucket;
  displayProcedure: string;
  displayRoom: string;
  displayTime: string;
  conflict: boolean;
  doctorConflict: boolean;
  roomConflict: boolean;
};


export type FilterState = {
  doctors: string[];
  rooms: string[];
  statuses: StatusBucket[];
  conflictsOnly: boolean;
};


export type Tone =
  | "blue"
  | "violet"
  | "amber"
  | "emerald"
  | "teal"
  | "slate"
  | "red";


export type SurgeryTimeGroup = {
  key: string;
  time: string;
  items: CalendarSurgery[];
};
