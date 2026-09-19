




export function CompactDetail({
  label,
  value,
  secondary,
  alert = false,
}: {
  label: string;
  value: string;
  secondary?: string;
  alert?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="!text-[10px] font-semibold text-slate-400">
        {label}
      </p>

      <p
        className={`mt-0.5 truncate text-[9.5px] font-semibold ${
          alert
            ? "text-rose-600"
            : "text-slate-700"
        }`}
        title={value}
      >
        {value}
      </p>

      {secondary && (
        <p className="mt-0.5 truncate !text-[9px] font-medium text-red-700">
          Site: {secondary}
        </p>
      )}
    </div>
  );
}
