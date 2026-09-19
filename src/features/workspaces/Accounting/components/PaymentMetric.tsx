




export function PaymentMetric({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-white px-3 py-2.5 ${
        emphasis
          ? "border-indigo-200"
          : "border-slate-200"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-[14px] font-semibold ${
          emphasis
            ? "text-indigo-600"
            : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
