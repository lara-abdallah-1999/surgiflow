import { Check } from "lucide-react";



export function DischargeCheck({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2 !text-[11px] font-semibold transition ${
        checked
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-cyan-300 bg-cyan-100/50 text-slate-600 hover:bg-cyan-100/80"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          checked
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-cyan-300 bg-white text-transparent"
        }`}
      >
        <Check
          size={9}
          strokeWidth={3}
        />
      </span>

      {label}
    </button>
  );
}
