import { type ViewMode, type StatusBucket } from "./types";


/* ==========================================================================
   CONSTANTS
   ========================================================================== */

export const PIXELS_PER_HOUR = 62;


export const VIEW_OPTIONS: {
  key: ViewMode;
  label: string;
}[] = [
  {
    key: "day",
    label: "Day",
  },
  {
    key: "week",
    label: "Week",
  },
  {
    key: "month",
    label: "Month",
  },
  {
    key: "agenda",
    label: "Agenda",
  },
];


export const STATUS_STYLES: Record<
  StatusBucket,
  {
    bg: string;
    border: string;
    text: string;
    dot: string;
    label: string;
  }
> = {
  scheduled: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
    label: "Scheduled",
  },
  ready: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    dot: "bg-violet-500",
    label: "Ready",
  },
  "in-progress": {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "In Progress",
  },
  completed: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Completed",
  },
  recovery: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    dot: "bg-teal-500",
    label: "Recovery",
  },
  discharged: {
    bg: "bg-slate-100",
    border: "border-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
    label: "Discharged",
  },
};
