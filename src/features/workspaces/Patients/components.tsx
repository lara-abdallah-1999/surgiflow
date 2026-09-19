import { useState, useRef, useEffect, type ReactNode } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { type SortKey, type SortDirection } from "./types";


export function ModernPatientDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const initialDate = value
    ? new Date(`${value}T00:00:00`)
    : new Date();

  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] =
    useState(initialDate);

  const pickerRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node | null;

      if (
        target &&
        pickerRef.current &&
        !pickerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleMouseDown,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleMouseDown,
      );
  }, [open]);

  useEffect(() => {
    if (!value) return;

    const next = new Date(
      `${value}T00:00:00`,
    );

    if (!Number.isNaN(next.getTime())) {
      setViewDate(next);
    }
  }, [value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1,
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const startOffset =
    firstDay === 0
      ? 6
      : firstDay - 1;

  const cells = Array.from(
    {
      length:
        Math.ceil(
          (startOffset + daysInMonth) / 7,
        ) * 7,
    },
    (_, index) => {
      const day =
        index - startOffset + 1;

      return day > 0 &&
        day <= daysInMonth
        ? day
        : null;
    },
  );

  const selectedDate = value
    ? new Date(`${value}T00:00:00`)
    : null;

  const toDateValue = (date: Date) =>
    [
      date.getFullYear(),
      String(
        date.getMonth() + 1,
      ).padStart(2, "0"),
      String(
        date.getDate(),
      ).padStart(2, "0"),
    ].join("-");

  const isSelected = (day: number) =>
    selectedDate?.getFullYear() === year &&
    selectedDate?.getMonth() === month &&
    selectedDate?.getDate() === day;

  const today = new Date();

  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  return (
    <div
      ref={pickerRef}
      className="relative min-w-0"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className={`flex h-7 w-full items-center justify-between rounded-lg border px-2 transition ${
          open
            ? "border-fuchsia-300 bg-white ring-2 ring-fuchsia-100"
            : "border-slate-200 bg-white hover:border-fuchsia-200"
        }`}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <Calendar
            size={11}
            className={
              open
                ? "text-fuchsia-600"
                : "text-slate-400"
            }
          />

          <span className="truncate text-[9px] font-semibold text-slate-600">
            {selectedDate
              ? selectedDate.toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )
              : "Select date"}
          </span>
        </div>

        <ChevronDown
          size={10}
          className={`text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+7px)] right-0 z-[100] w-[244px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_-14px_40px_rgba(15,23,42,0.14)]">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setViewDate(
                  new Date(
                    year,
                    month - 1,
                    1,
                  ),
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:bg-fuchsia-50 hover:text-fuchsia-600"
            >
              <ChevronLeft size={13} />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-bold text-slate-700">
                {viewDate.toLocaleDateString(
                  "en-US",
                  { month: "long" },
                )}
              </p>

              <p className="text-[8px] font-semibold text-slate-400">
                {year}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setViewDate(
                  new Date(
                    year,
                    month + 1,
                    1,
                  ),
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:bg-fuchsia-50 hover:text-fuchsia-600"
            >
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7">
            {[
              "Mo",
              "Tu",
              "We",
              "Th",
              "Fr",
              "Sa",
              "Su",
            ].map((day) => (
              <div
                key={day}
                className="flex h-6 items-center justify-center text-[7px] font-bold uppercase text-slate-400"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-[2px]">
            {cells.map((day, index) => {
              if (!day) {
                return (
                  <div
                    key={index}
                    className="h-7"
                  />
                );
              }

              const selected =
                isSelected(day);

              const current =
                isToday(day);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    onChange(
                      toDateValue(
                        new Date(
                          year,
                          month,
                          day,
                        ),
                      ),
                    );
                    setOpen(false);
                  }}
                  className={`relative flex h-7 items-center justify-center rounded-lg text-[9px] font-semibold transition ${
                    selected
                      ? "bg-fuchsia-600 text-white shadow-sm"
                      : current
                        ? "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-inset ring-fuchsia-200"
                        : "text-slate-600 hover:bg-fuchsia-50 hover:text-fuchsia-700"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewDate(now);
                onChange(toDateValue(now));
                setOpen(false);
              }}
              className="rounded-md px-2 py-1 text-[8px] font-bold text-fuchsia-600 hover:bg-fuchsia-50"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              className="rounded-md px-2 py-1 text-[8px] font-semibold text-slate-400 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




export function PatientSortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (
    key: SortKey,
  ) => void;
}) {
  const active =
    sortKey === activeKey;

  return (
    <button
      type="button"
      onClick={() =>
        onSort(sortKey)
      }
      className={`flex min-w-0 items-center gap-1 text-left !text-[10px] font-semibold uppercase tracking-wide transition ${
        active
          ? "text-fuchsia-600"
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      <span className="truncate">
        {label}
      </span>

      {active ? (
        direction === "asc" ? (
          <ArrowUp size={9} />
        ) : (
          <ArrowDown size={9} />
        )
      ) : (
        <ArrowUpDown
          size={9}
          className="opacity-50"
        />
      )}
    </button>
  );
}


export function PatientStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-fuchsia-500" />

      <div className="flex items-center justify-between gap-3 pl-1">
        <div className="min-w-0">
          <p className="truncate text-[8.5px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-[20px] font-bold leading-none text-fuchsia-700">
            {value}
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fuchsia-50 text-fuchsia-600">
          {icon}
        </div>
      </div>
    </div>
  );
}


export function PatientFilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2 py-1 !text-[11px] font-semibold transition ${
        active
          ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}


export function PatientStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Surgery": "bg-violet-50 text-violet-700 ring-violet-100",
    Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    "Pre-Op": "bg-blue-50 text-blue-700 ring-blue-100",
    "Today": "bg-rose-50 text-rose-700 ring-rose-100",
    "Follow-up": "bg-cyan-50 text-cyan-700 ring-cyan-100",
    Discharged: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex h-[20px] items-center rounded-full px-2 text-[9px] font-semibold ring-1 ring-inset ${
        styles[status] ??
        "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {status}
    </span>
  );
}
