import { type Surgery } from "../../../types/surgery";


export type StatusKey =
  | "Pre-Op"
  | "Ready"
  | "In Progress"
  | "Completed";


export type Tone =
  | "amber"
  | "emerald"
  | "violet"
  | "blue";


export type PendingMove = {
  surgery: Surgery;
  targetRoom: string;
} | null;
