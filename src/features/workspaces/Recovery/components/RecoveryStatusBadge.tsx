import { type RecoveryStatus } from "../types";



export function RecoveryStatusBadge({
  status,
}: {
  status: RecoveryStatus;
}) {
  const classes =
    status === "Ready for Transfer"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Monitoring"
        ? "bg-amber-50 text-amber-700"
        : status === "Progressing"
          ? "bg-teal-50 text-teal-700"
          : "bg-slate-100 text-slate-500";

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-[9px] font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}
