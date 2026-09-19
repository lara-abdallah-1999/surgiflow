import { type ReactNode } from "react";
import { X } from "lucide-react";



export function ClinicalAddForm({
  eyebrow,
  title,
  icon,
  tone,
  onCancel,
  onSave,
  saveLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  tone:
    | "cyan"
    | "amber"
    | "violet";
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
  children: ReactNode;
}) {
  const styles = {
    cyan: {
      border:
        "border-cyan-100",
      bg:
        "bg-gradient-to-br from-cyan-50/55 via-white to-white",
      icon:
        "bg-cyan-100 text-cyan-700",
      button:
        "bg-cyan-600 hover:bg-cyan-700",
    },
    amber: {
      border:
        "border-amber-100",
      bg:
        "bg-gradient-to-br from-amber-50/55 via-white to-white",
      icon:
        "bg-amber-100 text-amber-700",
      button:
        "bg-amber-600 hover:bg-amber-700",
    },
    violet: {
      border:
        "border-violet-100",
      bg:
        "bg-gradient-to-br from-violet-50/55 via-white to-white",
      icon:
        "bg-violet-100 text-violet-700",
      button:
        "bg-violet-600 hover:bg-violet-700",
    },
  };

  const style =
    styles[tone];

  return (
    <div
      className={`shrink-0 rounded-xl border bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.16)] ${style.border} ${style.bg}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${style.icon}`}
          >
            {icon}
          </div>

          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {eyebrow}
            </p>

            <p className="text-[10px] font-bold text-slate-700">
              {title}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-slate-600"
        >
          <X size={11} />
        </button>
      </div>

      <div className="space-y-2">
        {children}
      </div>

      <div className="mt-2 flex justify-end gap-1.5 border-t border-slate-100 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-7 rounded-lg border border-slate-200 bg-slate-100 px-3 !text-[11px] font-semibold text-slate-500 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSave}
          className={`h-7 rounded-lg px-3 !text-[11px] font-semibold text-white shadow-sm transition ${style.button}`}
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
