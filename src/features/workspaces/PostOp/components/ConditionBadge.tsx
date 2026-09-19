import { type PatientCondition } from "../types";



export function ConditionBadge({
  condition,
}: {
  condition: PatientCondition;
}) {
  const styles = {
    Improving:
      "bg-cyan-50 text-cyan-700",
    Stable:
      "bg-emerald-50 text-emerald-700",
    "Needs Attention":
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2 py-1 text-[9px] font-semibold ${styles[condition]}`}
    >
      {condition}
    </span>
  );
}
