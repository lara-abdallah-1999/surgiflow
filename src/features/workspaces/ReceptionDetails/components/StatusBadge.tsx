import { type PatientStatus } from "../types";



export function StatusBadge({ status }: { status: PatientStatus }) {
  const styles: Record<
    PatientStatus,
    { shell: string; dot: string }
  > = {
    Expected: {
      shell: "border-slate-200 bg-slate-50 text-slate-600",
      dot: "bg-slate-400",
    },
    Arrived: {
      shell: "border-blue-200 bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
    },
    "Reception In Progress": {
      shell: "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    "Ready for Admission": {
      shell: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },
    "Sent to Cashier": {
      shell: "border-slate-200 bg-slate-50 text-slate-600",
      dot: "bg-slate-400",
    },
    "On Hold": {
      shell: "border-red-200 bg-red-50 text-red-700",
      dot: "bg-red-500",
    },
  };

  const style = styles[status];

  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[7px] font-semibold ${style.shell}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
