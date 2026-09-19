import { type Stability } from "../types";



export function PatientConditionBadge({
  stability,
}: {
  stability: Stability;
}) {
  const stable =
    stability === "stable";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold ${
        stable
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          stable
            ? "bg-emerald-500"
            : "bg-red-500"
        }`}
      />

      {stable
        ? "Stable"
        : "Unstable"}
    </span>
  );
}
