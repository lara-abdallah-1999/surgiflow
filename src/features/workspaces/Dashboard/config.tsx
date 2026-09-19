


/* ==========================================================================
   DEMO DATE
   Keep aligned with your seeded surgeryStore demo data.
   ========================================================================== */


export const TODAY = "2026-09-03";



/* ==========================================================================
   STATUS STYLES
   ========================================================================== */

export const STATUS_STYLES: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    dot: string;
  }
> = {
  "Today": {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
  Booked: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  "Payment Pending": {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  "Pre-Op": {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  Ready: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  "In Progress": {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  Completed: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    dot: "bg-cyan-500",
  },
  Recovery: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    dot: "bg-teal-500",
  },
  Discharged: {
    bg: "bg-slate-100",
    border: "border-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
};
