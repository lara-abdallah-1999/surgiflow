import { useMemo, useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";




export function DashboardDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const parsedValue = useMemo(() => {
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [value]);

  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    () =>
      new Date(
        parsedValue.getFullYear(),
        parsedValue.getMonth(),
        1,
      ),
  );

  const pickerRef = useRef<HTMLDivElement | null>(null);

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
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside,
      );
  }, [open]);

  const toValue = (date: Date) =>
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

  const formatValue = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1,
  ).getDay();

  const offset =
    firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const cells = Array.from(
    {
      length:
        Math.ceil(
          (offset + daysInMonth) / 7,
        ) * 7,
    },
    (_, index) => {
      const day = index - offset + 1;

      return day > 0 &&
        day <= daysInMonth
        ? day
        : null;
    },
  );

  const today = new Date();

  return (
    <div
      ref={pickerRef}
      className="relative min-w-0 flex-1"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className={`flex h-8 w-full min-w-[158px] items-center justify-between rounded-lg border px-2.5 transition-all duration-200 ${
          open
            ? "border-violet-300 bg-white ring-2 ring-violet-100"
            : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/20"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-600">
            <CalendarDays size={10} />
          </span>

          <span className="truncate !text-[9px] font-semibold text-slate-600">
            {formatValue(parsedValue)}
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
        <div className="absolute bottom-[calc(100%+7px)] right-0 z-[160] w-[250px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_-14px_40px_rgba(15,23,42,0.15)]">
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 transition hover:border-violet-100 hover:bg-violet-50 hover:text-violet-600"
              aria-label="Previous month"
            >
              <ChevronLeft size={12} />
            </button>

            <div className="text-center">
              <p className="!text-[10px] font-bold text-slate-700">
                {viewDate.toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                  },
                )}
              </p>

              <p className="mt-0.5 !text-[8px] font-semibold text-slate-400">
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
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 transition hover:border-violet-100 hover:bg-violet-50 hover:text-violet-600"
              aria-label="Next month"
            >
              <ChevronRight size={12} />
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
            ].map((label) => (
              <div
                key={label}
                className="flex h-6 items-center justify-center !text-[7px] font-bold uppercase tracking-wide text-slate-400"
              >
                {label}
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

              const date = new Date(
                year,
                month,
                day,
              );

              const key = toValue(date);

              const selected =
                key === value;

              const current =
                today.getFullYear() ===
                  year &&
                today.getMonth() ===
                  month &&
                today.getDate() === day;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={`relative flex h-7 items-center justify-center rounded-lg !text-[9px] font-semibold transition-all ${
                    selected
                      ? "bg-violet-600 text-white shadow-sm hover:bg-violet-500"
                      : current
                        ? "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200"
                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  {day}

                  {current &&
                    !selected && (
                      <span className="absolute bottom-1 h-[2px] w-[2px] rounded-full bg-violet-500" />
                    )}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => {
                const now = new Date();

                setViewDate(
                  new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1,
                  ),
                );

                onChange(toValue(now));
                setOpen(false);
              }}
              className="rounded-md px-2 py-1 !text-[8px] font-bold text-violet-600 transition hover:bg-violet-50"
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
