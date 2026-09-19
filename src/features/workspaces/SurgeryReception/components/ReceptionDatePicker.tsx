import { useState, useRef, useMemo, useEffect } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { formatSurgeryDate } from "../utils";




export function ReceptionDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const parsedValue = useMemo(() => {
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [value]);

  const [viewDate, setViewDate] = useState(
    () =>
      new Date(
        parsedValue.getFullYear(),
        parsedValue.getMonth(),
        1,
      ),
  );

  useEffect(() => {
    setViewDate(
      new Date(
        parsedValue.getFullYear(),
        parsedValue.getMonth(),
        1,
      ),
    );
  }, [parsedValue]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
  }, []);

  const formatInputDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - mondayOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [viewDate]);

  const todayKey = formatInputDate(new Date());
  const selectedKey = value;

  return (
    <div ref={pickerRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-8 w-full items-center justify-between gap-2 rounded-lg border bg-white px-2.5 text-left transition ${
          open
            ? "border-amber-300 ring-2 ring-amber-100"
            : "border-slate-200 hover:border-amber-200"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600">
            <CalendarDays size={11} />
          </span>

          <span className="truncate text-[10px] font-semibold text-slate-600">
            {formatSurgeryDate(value)}
          </span>
        </div>

        <ChevronDown
          size={10}
          className={`shrink-0 text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+7px)] right-0 z-[80] w-[244px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_-14px_40px_rgba(15,23,42,0.14)]">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setViewDate(
                  (current) =>
                    new Date(
                      current.getFullYear(),
                      current.getMonth() - 1,
                      1,
                    ),
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              aria-label="Previous month"
            >
              <ChevronLeft size={12} />
            </button>

            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-700">
                {viewDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setViewDate(
                  (current) =>
                    new Date(
                      current.getFullYear(),
                      current.getMonth() + 1,
                      1,
                    ),
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              aria-label="Next month"
            >
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {["M", "T", "W", "T", "F", "S", "S"].map(
              (day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="flex h-5 items-center justify-center text-[7px] font-bold uppercase text-slate-400"
                >
                  {day}
                </div>
              ),
            )}

            {days.map((date) => {
              const key = formatInputDate(date);
              const isSelected = key === selectedKey;
              const isToday = key === todayKey;
              const isCurrentMonth =
                date.getMonth() === viewDate.getMonth();

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={`flex h-7 w-full items-center justify-center rounded-md text-[8.5px] font-semibold transition ${
                    isSelected
                      ? "bg-amber-500 text-white shadow-sm"
                      : isToday
                        ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
                        : isCurrentMonth
                          ? "text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                          : "text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const key = formatInputDate(today);
                onChange(key);
                setViewDate(
                  new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1,
                  ),
                );
                setOpen(false);
              }}
              className="rounded-md px-2 py-1 text-[8px] font-bold text-amber-700 transition hover:bg-amber-50"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-[8px] font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
