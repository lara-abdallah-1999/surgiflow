import { Check, ChevronLeft, ChevronRight } from "lucide-react";

/* ====================================================================== */
/* COMPONENTS                                                             */
/* ====================================================================== */

export function CompactInfoCell({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-lg border border-slate-100 bg-slate-50/45 px-2 py-1.5 ${
        full ? "col-span-2" : ""
      }`}
    >
      <p className="text-[8.5px] font-medium text-slate-400">
        {label}
      </p>

      <p
        className="mt-0.5 truncate text-[10px] font-semibold text-slate-700"
        title={value}
      >
        {value || "—"}
      </p>
    </div>
  );
}


export function CompactJourneyMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 bg-white px-2.5 py-1.5">
      <p className="text-[8px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className="mt-0.5 truncate text-[9.5px] font-semibold text-slate-700"
        title={value}
      >
        {value || "—"}
      </p>
    </div>
  );
}


export function CompactJourneyStep({
  index,
  stage,
  completed,
  current,
}: {
  index: number;
  stage: string;
  completed: boolean;
  current: boolean;
}) {
  return (
    <div
      className={`flex min-h-0 items-center gap-2 rounded-lg border px-2 py-1.5 ${
        current
          ? "border-fuchsia-200 bg-fuchsia-50"
          : completed
            ? "border-emerald-100 bg-emerald-50/45"
            : "border-slate-100 bg-slate-50/70"
      }`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          completed
            ? "border-emerald-200 bg-white text-emerald-600"
            : current
              ? "border-fuchsia-200 bg-white text-fuchsia-600"
              : "border-slate-200 bg-white text-slate-400"
        }`}
      >
        {completed ? (
          <Check size={10} />
        ) : (
          <span className="text-[8px] font-bold">
            {index + 1}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <p
            className={`truncate text-[9.5px] font-semibold ${
              current
                ? "text-fuchsia-700"
                : completed
                  ? "text-emerald-700"
                  : "text-slate-600"
            }`}
          >
            {stage}
          </p>

          {current && (
            <span className="shrink-0 rounded-full bg-fuchsia-600 px-1.5 py-0.5 text-[7px] font-bold text-white">
              NOW
            </span>
          )}
        </div>

        <p className="mt-0.5 text-[8px] text-slate-400">
          {completed
            ? "Completed"
            : current
              ? "Current stage"
              : "Pending"}
        </p>
      </div>
    </div>
  );
}


export function PatientInfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/45 px-2 py-1.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-fuchsia-50 text-fuchsia-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-medium text-slate-400">
          {label}
        </p>

        <p
          className="mt-0.5 truncate text-[10.5px] font-semibold text-slate-700"
          title={value}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}


export function IdentityMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-600">
        {icon}
      </div>

      <div>
        <p className="text-[9px] font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 max-w-[150px] truncate text-[10.5px] font-semibold text-slate-700">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}


export function HistoryPager({
  page,
  totalPages,
  onPrevious,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onPrevious}
        disabled={page === 0}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ChevronLeft size={10} />
      </button>

      <span className="min-w-[34px] text-center text-[9.5px] font-semibold text-slate-400">
        {page + 1}/{totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages - 1}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ChevronRight size={10} />
      </button>
    </div>
  );
}


export function JourneyMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-400">
        <span className="text-fuchsia-500">
          {icon}
        </span>
        {label}
      </div>

      <p
        className="mt-1 truncate text-[10.5px] font-semibold text-slate-700"
        title={value}
      >
        {value || "—"}
      </p>
    </div>
  );
}


export function JourneyStep({
  index,
  stage,
  completed,
  current,
}: {
  index: number;
  stage: string;
  completed: boolean;
  current: boolean;
}) {
  return (
    <div
      className={`relative flex min-h-0 flex-col justify-between overflow-hidden rounded-xl border p-2.5 ${
        current
          ? "border-fuchsia-200 bg-fuchsia-50"
          : completed
            ? "border-emerald-100 bg-emerald-50/45"
            : "border-slate-100 bg-slate-50/70"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
            completed
              ? "border-emerald-200 bg-white text-emerald-600"
              : current
                ? "border-fuchsia-200 bg-white text-fuchsia-600"
                : "border-slate-200 bg-white text-slate-400"
          }`}
        >
          {completed ? (
            <Check size={11} />
          ) : (
            <span className="text-[9px] font-bold">
              {index + 1}
            </span>
          )}
        </div>

        {current && (
          <span className="rounded-full bg-fuchsia-600 px-1.5 py-0.5 text-[8px] font-bold text-white">
            NOW
          </span>
        )}
      </div>

      <div className="mt-2 min-w-0">
        <p
          className={`text-[10.5px] font-semibold leading-tight ${
            current
              ? "text-fuchsia-700"
              : completed
                ? "text-emerald-700"
                : "text-slate-600"
          }`}
        >
          {stage}
        </p>

        <p className="mt-1 text-[9px] text-slate-400">
          {completed
            ? "Completed"
            : current
              ? "Current stage"
              : "Pending"}
        </p>
      </div>
    </div>
  );
}


export function PatientStatus({
  status,
  compact = false,
}: {
  status: string;
  compact?: boolean;
}) {
  const styles: Record<string, string> = {
    "In Surgery":
      "bg-violet-50 text-violet-700 ring-violet-100",
    Confirmed:
      "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Booked:
      "bg-sky-50 text-sky-700 ring-sky-100",
    "Patient Arrived":
      "bg-amber-50 text-amber-700 ring-amber-100",
    Reception:
      "bg-amber-50 text-amber-700 ring-amber-100",
    "Payment Pending":
      "bg-indigo-50 text-indigo-700 ring-indigo-100",
    "Pre-Op":
      "bg-blue-50 text-blue-700 ring-blue-100",
    Ready:
      "bg-indigo-50 text-indigo-700 ring-indigo-100",
    "In Progress":
      "bg-violet-50 text-violet-700 ring-violet-100",
    Completed:
      "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Recovery:
      "bg-teal-50 text-teal-700 ring-teal-100",
    "Today":
      "bg-rose-50 text-rose-700 ring-rose-100",
    "Follow-up":
      "bg-cyan-50 text-cyan-700 ring-cyan-100",
    Discharged:
      "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full font-semibold ring-1 ring-inset ${
        compact
          ? "h-[20px] max-w-[108px] truncate px-2 text-[9px]"
          : "h-[22px] px-2.5 text-[9.5px]"
      } ${
        styles[status] ??
        "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
      title={status}
    >
      {status}
    </span>
  );
}
