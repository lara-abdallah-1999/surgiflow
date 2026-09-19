import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";




export function ModernRecoveryDatePicker({
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
      String(date.getDate()).padStart(
        2,
        "0",
      ),
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
            ? "border-teal-300 bg-white ring-2 ring-teal-100"
            : "border-slate-200 bg-white hover:border-teal-200"
        }`}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <Calendar
            size={11}
            className={
              open
                ? "text-teal-600"
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:bg-teal-50 hover:text-teal-600"
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:bg-teal-50 hover:text-teal-600"
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
                      ? "bg-teal-600 text-white shadow-sm"
                      : current
                        ? "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200"
                        : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
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
              className="rounded-md px-2 py-1 text-[8px] font-bold text-teal-600 hover:bg-teal-50"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
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
