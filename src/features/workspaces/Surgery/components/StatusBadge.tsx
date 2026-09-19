



export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Financially Cleared": "bg-emerald-50 text-emerald-700",
    Admitted: "bg-indigo-50 text-indigo-700",
    "Pre-Op": "bg-orange-50 text-orange-700",
    Ready: "bg-emerald-50 text-emerald-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Completed: "bg-violet-50 text-violet-700",
    Recovery: "bg-emerald-50 text-emerald-700",
    Discharged: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2 py-1 text-[8px] font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
