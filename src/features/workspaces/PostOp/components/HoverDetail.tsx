



export function HoverDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[7px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 break-words text-[9px] font-semibold leading-4 text-slate-600">
        {value}
      </p>
    </div>
  );
}
