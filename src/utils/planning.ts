import type { Surgery } from "../types/surgery";

export const isFinished = (surgery: Surgery) => ["Completed", "Recovery", "Discharged"].includes(surgery.status);
export const canPlan = (surgery: Surgery) => !isFinished(surgery) && surgery.status !== "In Progress";
export const startMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
export const plannedMinutes = (surgery: Surgery) => surgery.durationSeconds && surgery.durationSeconds > 0 ? Math.max(30, Math.round(surgery.durationSeconds / 60)) : Math.max(30, surgery.durationMinutes || 90);
export const endTime = (surgery: Surgery) => {
  const end = startMinutes(surgery.time) + plannedMinutes(surgery);
  return `${String(Math.floor(end / 60) % 24).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}${end >= 1440 ? " (+1 day)" : ""}`;
};
export const orderedCases = (surgeries: Surgery[]) => [...surgeries].sort((a, b) => a.time.localeCompare(b.time) || a.id.localeCompare(b.id));
export function conflictsFor(candidate: Surgery, surgeries: Surgery[]) {
  const start = startMinutes(candidate.time);
  const end = start + plannedMinutes(candidate);
  return surgeries.filter((other) => other.id !== candidate.id && other.date === candidate.date &&
    (other.room === candidate.room || other.doctor === candidate.doctor) &&
    start < startMinutes(other.time) + plannedMinutes(other) && startMinutes(other.time) < end);
}
