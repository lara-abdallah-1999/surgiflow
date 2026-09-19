import { UserRound, Scissors, ShieldCheck, Check, Play } from "lucide-react";
import { type EquipmentState } from "./types";


/* ========================================================================== */
/* Components                                                                 */
/* ========================================================================== */

export function HeaderMeta({
  label,
  value,
  icon: Icon,
  valueClassName = "text-slate-800",
}: {
  label: string;
  value: string;
  icon: typeof UserRound;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 px-4 py-2.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-violet-400" />

      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-0.5 truncate text-xs font-semibold ${valueClassName}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}


export function VerticalTab({
  active,
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  icon: typeof Scissors;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-1 flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left transition ${
        active
          ? "border-violet-100 bg-white text-violet-700 shadow-sm"
          : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
      }`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
          active
            ? "bg-violet-100 text-violet-700"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold">{label}</p>
        <p className="mt-0.5 text-[7px] text-slate-400">{hint}</p>
      </div>
    </button>
  );
}


export function MiniReadinessPill({
  label,
  complete,
  icon: Icon,
}: {
  label: string;
  complete: boolean;
  icon: typeof ShieldCheck;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-1 rounded-md border px-1.5 py-1 ${
        complete
          ? "border-emerald-100 bg-emerald-50/70 text-emerald-700"
          : "border-slate-200 bg-white text-slate-500"
      }`}
    >
      {complete ? (
        <Check className="h-2.5 w-2.5 shrink-0" />
      ) : (
        <Icon className="h-2.5 w-2.5 shrink-0" />
      )}
      <span className="text-[7px] font-semibold">{label}</span>
    </div>
  );
}


export function SurgicalMilestone({
  number,
  label,
  time,
  statusLabel,
  complete,
  active,
  icon: Icon,
  action,
}: {
  number: string;
  label: string;
  time: string;
  statusLabel?: string;
  complete: boolean;
  active: boolean;
  icon: typeof Play;
  action?: React.ReactNode;
}) {
  const connector = complete || active
    ? "bg-violet-300"
    : "bg-slate-200";

  return (
    <div
      id={number === "02" ? "copilot-anesthesia" : number === "03" ? "copilot-cut" : undefined}
      tabIndex={-1}
      aria-label={label}
      className={`relative min-w-0 rounded-lg px-2 pb-1.5 pt-1 transition-all ${
        active
          ? "bg-violet-50/75 ring-1 ring-inset ring-violet-100"
          : "bg-transparent"
      }`}
    >
      {number !== "01" && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-[calc(-40%+2px)] right-[calc(54%+16px)] top-[17px] z-[1] h-[1.5px] rounded-full ${connector}`}
        />
      )}

      <div className="relative z-[2] flex flex-col items-center text-center">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-[0_2px_7px_rgba(15,23,42,0.06)] ${
            complete
              ? "border-violet-600 bg-violet-600 text-white"
              : active
                ? "border-violet-500 bg-white text-violet-700 ring-4 ring-violet-50"
                : "border-slate-200 bg-slate-50 text-slate-400"
          }`}
        >
          {complete ? (
            <Check size={13} strokeWidth={3} />
          ) : (
            <Icon size={13} />
          )}
        </span>

        <p className={`mt-1.5 truncate text-[11px] font-bold ${active ? "text-violet-900" : "text-slate-700"}`}>
          {label}
        </p>

        <p className={`mt-0.5 truncate text-[8.5px] font-medium ${complete || active ? "text-violet-600" : "text-slate-400"}`}>
          {time}
        </p>

        <div className="mt-1 flex h-6 items-center justify-center">
          {action ? (
            action
          ) : (
            <span
              className={`inline-flex h-5 items-center justify-center rounded-md px-2 text-[8.5px] font-bold ${
                complete
                  ? "bg-violet-50 text-violet-700"
                  : active
                    ? "bg-white text-violet-700 ring-1 ring-violet-100"
                    : "bg-slate-50 text-slate-400"
              }`}
            >
              {statusLabel ?? (complete ? "Completed" : "Waiting")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


export function StatusCounter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "violet" | "amber" | "emerald" | "slate";
}) {
  const classes = {
    violet: "border-violet-100 bg-violet-50 text-violet-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    slate: "border-slate-200 bg-slate-50 text-slate-500",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[7px] font-bold ${classes}`}
    >
      {label}
      <strong>{value}</strong>
    </span>
  );
}


export function EquipmentBadge({ state }: { state: EquipmentState }) {
  const classes = {
    Available: "border-slate-200 bg-slate-50 text-slate-500",
    "In Use": "border-amber-100 bg-amber-50 text-amber-700",
    Returned: "border-emerald-100 bg-emerald-50 text-emerald-700",
  }[state];

  return (
    <span
      className={`w-fit rounded-full border px-2 py-0.5 text-[7px] font-bold ${classes}`}
    >
      {state}
    </span>
  );
}
