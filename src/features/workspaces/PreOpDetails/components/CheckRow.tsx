import { Check, CheckCircle2 } from "lucide-react";



export function CheckRow({
  checked,
  label,
  description,
  onClick,
  color = "blue",
}: {
  checked: boolean;
  label: string;
  description?: string;
  onClick: () => void;
  color?:
    | "blue"
    | "orange"
    | "purple"
    | "green"
    | "teal";
}) {
  const accent = {
    blue: {
      checked:
        "border-blue-200 bg-blue-50/70",
      icon:
        "border-blue-500 bg-blue-500 text-white",
      hover:
        "hover:border-blue-200 hover:bg-blue-50/30",
    },
    orange: {
      checked:
        "border-orange-200 bg-orange-50/70",
      icon:
        "border-orange-500 bg-orange-500 text-white",
      hover:
        "hover:border-orange-200 hover:bg-orange-50/30",
    },
    purple: {
      checked:
        "border-purple-200 bg-purple-50/70",
      icon:
        "border-purple-500 bg-purple-500 text-white",
      hover:
        "hover:border-purple-200 hover:bg-purple-50/30",
    },
    green: {
      checked:
        "border-emerald-200 bg-emerald-50/70",
      icon:
        "border-emerald-500 bg-emerald-500 text-white",
      hover:
        "hover:border-emerald-200 hover:bg-emerald-50/30",
    },
    teal: {
      checked:
        "border-teal-200 bg-teal-50/70",
      icon:
        "border-teal-500 bg-teal-500 text-white",
      hover:
        "hover:border-teal-200 hover:bg-teal-50/30",
    },
  };

  const styles = accent[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full items-center gap-2.5 overflow-hidden rounded-lg border px-2.5 py-2 text-left transition-all duration-200 ${
        checked
          ? styles.checked
          : `border-slate-200 bg-white ${styles.hover}`
      }`}
    >
      {checked && (
        <div
          className={`absolute bottom-0 left-0 top-0 w-[2px] ${
            color === "orange"
              ? "bg-orange-500"
              : color === "purple"
              ? "bg-purple-500"
              : color === "teal"
              ? "bg-teal-500"
              : "bg-blue-500"
          }`}
        />
      )}

      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
          checked
            ? styles.icon
            : "border-slate-300 bg-white text-transparent group-hover:border-slate-400"
        }`}
      >
        {checked && (
          <Check
            size={12}
            strokeWidth={3}
          />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-[10px] font-semibold ${
            checked
              ? "text-slate-800"
              : "text-slate-700"
          }`}
        >
          {label}
        </span>

        {description && (
          <span className="mt-0.5 block text-[8px] leading-3.5 text-slate-500">
            {description}
          </span>
        )}
      </span>

      {checked && (
        <CheckCircle2
          size={13}
          className={
            color === "orange"
              ? "text-orange-500"
              : color === "purple"
              ? "text-purple-500"
              : "text-blue-500"
          }
        />
      )}
    </button>
  );
}
