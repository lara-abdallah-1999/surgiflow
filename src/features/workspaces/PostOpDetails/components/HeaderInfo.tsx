




export function HeaderInfo({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        className={`mt-0.5 truncate text-[9.5px] font-semibold ${
          accent
            ? "text-cyan-700"
            : "text-slate-700"
        }`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
