import { type ReactNode, useState, useRef, useEffect } from "react";
import { type SortKey, type SortDirection } from "./types";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";


export function WaitingStatCard({
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
      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-rose-500" />

      <div className="flex items-center justify-between gap-3 pl-1">
        <div className="min-w-0">
          <p className="truncate text-[8.5px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-[20px] font-bold leading-none text-rose-700">
            {value}
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
          {icon}
        </div>
      </div>
    </div>
  );
}


export function WaitingFilterPill({
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
      className={`rounded-md border px-2.5 py-1 !text-[10px] font-semibold transition ${
        active
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:bg-rose-50/50"
      }`}
    >
      {label}
    </button>
  );
}


export function WaitingSortableHeader({
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
  onSort: (key: SortKey) => void;
}) {
  const active =
    activeKey === sortKey;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`flex min-w-0 items-center gap-0.5 text-left !text-[11px] font-semibold uppercase tracking-[0.02em] transition ${
        active
          ? "text-rose-700"
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      <span className="truncate">
        {label}
      </span>

      <span className="text-[6.5px] leading-none">
        {active
          ? direction === "asc"
            ? "↑"
            : "↓"
          : "↕"}
      </span>
    </button>
  );
}


export function DrawerInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[7.5px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-[9.5px] font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}


export function ModalInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
      <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-[10px] font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}


export function ModernWaitingDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const initial = value
    ? new Date(`${value}T00:00:00`)
    : new Date();

  const [open, setOpen] =
    useState(false);

  const [viewDate, setViewDate] =
    useState(initial);

  const pickerRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const close = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node | null;

      if (
        target &&
        pickerRef.current &&
        !pickerRef.current.contains(
          target,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      close,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        close,
      );
  }, [open]);

  const year =
    viewDate.getFullYear();

  const month =
    viewDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1,
  ).getDay();

  const offset =
    firstDay === 0
      ? 6
      : firstDay - 1;

  const days = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const cells = Array.from(
    {
      length:
        Math.ceil(
          (offset + days) / 7,
        ) * 7,
    },
    (_, index) => {
      const day =
        index - offset + 1;

      return day > 0 &&
        day <= days
        ? day
        : null;
    },
  );

  const selected = new Date(
    `${value}T00:00:00`,
  );

  const toValue = (
    date: Date,
  ) =>
    [
      date.getFullYear(),
      String(
        date.getMonth() + 1,
      ).padStart(2, "0"),
      String(
        date.getDate(),
      ).padStart(2, "0"),
    ].join("-");

  return (
    <div
      ref={pickerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) => !current,
          )
        }
        className={`flex h-9 w-full items-center justify-between rounded-xl border px-3 transition ${
          open
            ? "border-rose-300 bg-white ring-2 ring-rose-100"
            : "border-slate-200 bg-white hover:border-rose-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <Calendar
            size={13}
            className="text-rose-600"
          />

          <span className="text-[10px] font-semibold text-slate-700">
            {new Date(
              `${value}T00:00:00`,
            ).toLocaleDateString(
              "en-US",
              {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )}
          </span>
        </div>

        <ChevronDown
          size={11}
          className={`text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+7px)] left-0 z-[100] w-[260px] rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_14px_40px_rgba(15,23,42,0.15)]">
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            >
              <ChevronLeft size={13} />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-bold text-slate-700">
                {viewDate.toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                  },
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
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
            {cells.map(
              (day, index) => {
                if (!day) {
                  return (
                    <div
                      key={index}
                      className="h-7"
                    />
                  );
                }

                const isSelected =
                  selected.getFullYear() ===
                    year &&
                  selected.getMonth() ===
                    month &&
                  selected.getDate() ===
                    day;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      onChange(
                        toValue(
                          new Date(
                            year,
                            month,
                            day,
                          ),
                        ),
                      );
                      setOpen(false);
                    }}
                    className={`flex h-7 items-center justify-center rounded-lg text-[9px] font-semibold transition ${
                      isSelected
                        ? "bg-rose-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                    }`}
                  >
                    {day}
                  </button>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
}



export function SurgeryPriority({
  priority,
}: {
  priority: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    "Urgent":
      "bg-[#f9c9c8] text-[#d13429]",
    "Low":
      "bg-[#ECFDF3] text-[#18794E]",
    "High":
      "bg-[#FFF7E8] text-[#B7791F]",
    "Follow-up":
      "bg-[#EAF6FF] text-[#1976D2]",
  };

  return (
    <span
      className={`
        inline-flex h-[18px] w-fit items-center justify-center
        whitespace-nowrap rounded-full px-1.5
        text-[7px] font-semibold leading-none
        ${styles[priority] ?? "bg-[#F2F4F7] text-[#667085]"}
      `}
    >
      {priority}
    </span>
  );
}
