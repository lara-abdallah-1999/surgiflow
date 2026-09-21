



export function ReceiptInfo({
  label,
  value,
  borderLeft = false,
  borderTop = false,
}: {
  label: string;
  value: string;
  borderLeft?: boolean;
  borderTop?: boolean;
}) {
  return (
    <div
      className={`min-w-0 px-3 py-2.5 ${
        borderLeft
          ? "border-l border-slate-100"
          : ""
      } ${
        borderTop
          ? "border-t border-slate-100"
          : ""
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-[12px] font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}
