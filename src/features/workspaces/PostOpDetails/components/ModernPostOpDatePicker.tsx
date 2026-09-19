import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";




export function ModernPostOpDatePicker({
  value,
  onChange,
  min,
  tone = "cyan",
}: {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  tone?: "cyan" | "violet" | "amber";
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

  const accent =
    tone === "violet"
      ? {
          border: "border-violet-300",
          ring: "ring-violet-100",
          iconBg: "bg-violet-100",
          iconText: "text-violet-600",
          hoverBorder: "hover:border-violet-200",
          hoverBg: "hover:bg-violet-50/20",
          selected: "bg-violet-600 text-white",
          today: "bg-violet-50 text-violet-700 ring-violet-200",
          hoverDay: "hover:bg-violet-50 hover:text-violet-700",
          action: "text-violet-600 hover:bg-violet-50",
        }
      : tone === "amber"
        ? {
            border: "border-amber-300",
            ring: "ring-amber-100",
            iconBg: "bg-amber-100",
            iconText: "text-amber-600",
            hoverBorder: "hover:border-amber-200",
            hoverBg: "hover:bg-amber-50/20",
            selected: "bg-amber-500 text-white",
            today: "bg-amber-50 text-amber-700 ring-amber-200",
            hoverDay: "hover:bg-amber-50 hover:text-amber-700",
            action: "text-amber-600 hover:bg-amber-50",
          }
        : {
            border: "border-cyan-300",
            ring: "ring-cyan-100",
            iconBg: "bg-cyan-100",
            iconText: "text-cyan-600",
            hoverBorder: "hover:border-cyan-200",
            hoverBg: "hover:bg-cyan-50/20",
            selected: "bg-cyan-600 text-white",
            today: "bg-cyan-50 text-cyan-700 ring-cyan-200",
            hoverDay: "hover:bg-cyan-50 hover:text-cyan-700",
            action: "text-cyan-600 hover:bg-cyan-50",
          };

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
            ? `${accent.border} bg-white ring-2 ${accent.ring}`
            : `border-slate-200 bg-white ${accent.hoverBorder} ${accent.hoverBg}`
        }`}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition ${
              open
                ? `${accent.iconBg} ${accent.iconText}`
                : "bg-slate-50 text-slate-400"
            }`}
          >
            <CalendarDays size={10} />
          </div>

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
        <div
          className="fixed inset-0 z-[260] flex items-center justify-center bg-slate-900/10 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setOpen(false);
            }
          }}
        >
          <div className="w-[264px] max-w-[92vw] overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_18px_48px_rgba(15,23,42,0.18)]">
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
              className={`flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 transition ${accent.hoverDay}`}
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
              className={`flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 text-slate-400 transition ${accent.hoverDay}`}
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
                  disabled={
                    Boolean(min) &&
                    toDateValue(
                      new Date(
                        year,
                        month,
                        day,
                      ),
                    ) < (min ?? "")
                  }
                  onClick={() => {
                    const nextValue =
                      toDateValue(
                        new Date(
                          year,
                          month,
                          day,
                        ),
                      );

                    if (
                      min &&
                      nextValue < min
                    ) {
                      return;
                    }

                    onChange(nextValue);
                    setOpen(false);
                  }}
                  className={`relative flex h-7 items-center justify-center rounded-lg text-[9px] font-semibold transition disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent ${
                    selected
                      ? `${accent.selected} shadow-sm`
                      : current
                        ? `${accent.today} ring-1 ring-inset`
                        : `text-slate-600 ${accent.hoverDay}`
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
              className={`rounded-md px-2 py-1 text-[8px] font-bold transition ${accent.action}`}
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
        </div>
      )}
    </div>
  );
}
