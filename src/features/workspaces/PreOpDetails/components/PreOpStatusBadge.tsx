import { type PreOpWorkflowStatus } from "../types";



export function PreOpStatusBadge({
  status,
}: {
  status: PreOpWorkflowStatus;
}) {
  const styles = {
    "Awaiting Admit":
      "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    Admitted:
      "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    "Not Started":
      "bg-slate-100 text-slate-500",
    "In Progress":
      "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    Complete:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  };

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-semibold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Complete"
            ? "bg-emerald-500"
            : status === "In Progress"
              ? "bg-blue-500"
              : status === "Admitted"
                ? "bg-indigo-500"
                : status === "Awaiting Admit"
                  ? "bg-amber-500"
                  : "bg-slate-400"
        }`}
      />

      {status}
    </span>
  );
}
