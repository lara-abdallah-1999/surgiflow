import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";



export function ModernDatePicker({
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

    function handleOutside(event: MouseEvent) {
      const target = event.target as Node | null;

      if (
        target &&
        pickerRef.current &&
        !pickerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside,
      );
    };
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
    firstDay === 0 ? 6 : firstDay - 1;

  const cells = Array.from(
    {
      length:
        Math.ceil(
          (startOffset + daysInMonth) /
            7,
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

  const formatValue = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const toInputDate = (date: Date) =>
    [
      date.getFullYear(),
      String(
        date.getMonth() + 1,
      ).padStart(2, "0"),
      String(
        date.getDate(),
      ).padStart(2, "0"),
    ].join("-");

  const selectDay = (day: number) => {
    const date = new Date(
      year,
      month,
      day,
    );

    onChange(toInputDate(date));
    setOpen(false);
  };

  const isSelected = (
    day: number,
  ) =>
    selectedDate?.getFullYear() ===
      year &&
    selectedDate?.getMonth() ===
      month &&
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
        className={`flex h-7 w-full items-center justify-between rounded-lg border px-2 transition-all duration-200 ${
          open
            ? "border-indigo-300 bg-white ring-2 ring-indigo-100"
            : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/20"
        }`}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition ${
              open
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-50 text-slate-400"
            }`}
          >
            <CalendarDays size={10} />
          </div>

          <span className="truncate !text-[9px] font-semibold text-slate-600">
            {selectedDate
              ? formatValue(selectedDate)
              : "Select date"}
          </span>
        </div>

        <ChevronDown
          size={10}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+7px)] right-0 z-[100] w-[244px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_-14px_40px_rgba(15,23,42,0.14)]">
          <div className="mb-2 flex items-center justify-between px-0.5">
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 transition hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <ChevronLeft size={13} />
            </button>

            <div className="text-center">
              <p className="!text-[11px] font-bold text-slate-700">
                {viewDate.toLocaleDateString(
                  "en-US",
                  { month: "long" },
                )}
              </p>

              <p className="!text-[8px] font-semibold text-slate-400">
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 transition hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600"
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
                className="flex h-6 items-center justify-center !text-[7px] font-bold uppercase tracking-wide text-slate-400"
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

                const active =
                  isSelected(day);

                const current =
                  isToday(day);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      selectDay(day)
                    }
                    className={`relative flex h-7 items-center justify-center rounded-lg !text-[9px] font-semibold transition-all ${
                      active
                        ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                        : current
                          ? "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
                          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    {day}

                    {current &&
                      !active && (
                        <span className="absolute bottom-1 h-[2px] w-[2px] rounded-full bg-indigo-500" />
                      )}
                  </button>
                );
              },
            )}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewDate(now);
                onChange(toInputDate(now));
                setOpen(false);
              }}
              className="rounded-md px-2 py-1 !text-[8px] font-bold text-indigo-600 transition hover:bg-indigo-50"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 !text-[8px] font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
