import { type RecoveryStatus } from "../types";



export function RecoveryStatusDot({
  status,
}: {
  status: RecoveryStatus;
}) {
  const ready =
    status === "Ready for Transfer";

  const active =
    status === "Monitoring" ||
    status === "Progressing";

  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-medium ${
        ready
          ? "text-emerald-600"
          : active
            ? "text-teal-600"
            : "text-slate-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          ready
            ? "bg-emerald-500"
            : active
              ? "bg-teal-500"
              : "bg-slate-300"
        }`}
      />

      {status}
    </span>
  );
}
