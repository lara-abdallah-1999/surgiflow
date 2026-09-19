import { type CalendarSurgery } from "../types";
import { useMemo } from "react";
import { getMonthGrid, isSameDay, isToday } from "../utils";
import { AlertTriangle, CalendarDays, ChevronRight } from "lucide-react";
import { STATUS_STYLES } from "../config";



/* ==========================================================================
   MONTH VIEW
   ========================================================================== */

export function MonthView({
  anchorDate,
  surgeries,
  onSelectDay,
}: {
  anchorDate: Date;
  surgeries: CalendarSurgery[];
  onSelectSurgery: (
    id: string,
  ) => void;
  onSelectDay: (
    date: Date,
  ) => void;
}) {
  const days =
    useMemo(
      () =>
        getMonthGrid(
          anchorDate,
        ),
      [
        anchorDate,
      ],
    );

  const weekdayLabels = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid h-7 shrink-0 grid-cols-7 items-center border-b border-slate-100 bg-slate-50/45">
        {weekdayLabels.map(
          (label) => (
            <div
              key={label}
              className="text-center text-[9px] font-semibold uppercase tracking-wide text-slate-400"
            >
              {label}
            </div>
          ),
        )}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-1.5 pt-1.5">
        {days.map((day) => {
          const inMonth =
            day.getMonth() ===
            anchorDate.getMonth();

          const daySurgeries =
            surgeries
              .filter((surgery) =>
                isSameDay(
                  surgery.start,
                  day,
                ),
              )
              .sort(
                (a, b) =>
                  a.start.getTime() -
                  b.start.getTime(),
              );

          const count =
            daySurgeries.length;

          const conflicts =
            daySurgeries.filter(
              (surgery) =>
                surgery.conflict,
            ).length;

          const visible =
            count === 1
              ? daySurgeries.slice(
                  0,
                  1,
                )
              : [];

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() =>
                onSelectDay(day)
              }
              className={`group/day relative flex min-h-0 flex-col overflow-hidden rounded-lg border text-left transition-all duration-150 ${
                inMonth
                  ? count > 0
                    ? "border-blue-100 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.025)] hover:border-blue-200 hover:shadow-[0_3px_10px_rgba(15,23,42,0.06)]"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/45"
                  : "border-slate-50 bg-slate-50/45 opacity-60"
              }`}
            >
              {count > 0 &&
                inMonth && (
                  <span className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full bg-blue-500" />
                )}

              <div
                className={`flex h-7 shrink-0 items-center justify-between gap-1 border-b px-2 ${
                  count > 0 &&
                  inMonth
                    ? "border-blue-50 bg-blue-50/25"
                    : "border-slate-50"
                }`}
              >
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[9px] font-semibold ${
                    isToday(day)
                      ? "bg-blue-600 text-white shadow-sm"
                      : inMonth
                        ? "text-slate-600"
                        : "text-slate-300"
                  }`}
                >
                  {day.getDate()}
                </span>

                {count > 0 && (
                  <div className="flex min-w-0 items-center gap-1">
                    {conflicts >
                      0 && (
                      <span
                        title={`${conflicts} scheduling conflict${conflicts === 1 ? "" : "s"}`}
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500"
                      >
                        <AlertTriangle
                          size={8}
                        />
                      </span>
                    )}

                    <span className="inline-flex h-5 shrink-0 items-center gap-1 rounded-md border border-blue-100 bg-white px-1.5 text-[8px] font-bold text-blue-700 shadow-[0_1px_1px_rgba(15,23,42,0.03)]">
                      <CalendarDays
                        size={8}
                      />
                      {count}
                      <span className="font-semibold text-blue-500">
                        {count === 1
                          ? "surgery"
                          : "surgeries"}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {count === 1 ? (
                <div className="flex min-h-0 flex-1 items-center px-1.5 py-1">
                  {visible.map(
                    (surgery) => {
                      const style =
                        STATUS_STYLES[
                          surgery.bucket
                        ];

                      return (
                        <div
                          key={
                            surgery.id
                          }
                          className="flex w-full min-w-0 items-center gap-1.5 overflow-hidden rounded-md border border-slate-100 bg-slate-50/70 px-1.5 transition group-hover/day:border-blue-100 group-hover/day:bg-white"
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
                          />

                          <span className="w-[34px] shrink-0 rounded bg-white px-1 text-center text-[7px] font-bold text-slate-500 ring-1 ring-inset ring-slate-100">
                            {surgery.displayTime}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[8.5px] font-semibold leading-none text-slate-700">
                              {
                                surgery.patientName
                              }
                            </p>
                          </div>

                          <ChevronRight
                            size={9}
                            className="shrink-0 text-slate-300"
                          />
                        </div>
                      );
                    },
                  )}
                </div>
              ) : count > 1 ? (
                <div className="flex min-h-0 flex-1 items-center justify-center px-2">
                  <div className="flex items-center gap-1 rounded-md bg-blue-50/60 px-2 py-1 text-[8px] font-semibold text-blue-600 transition group-hover/day:bg-blue-50">
                    <span>
                      View surgeries
                    </span>

                    <ChevronRight
                      size={9}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex min-h-0 flex-1 items-center justify-center">
                  <span className="h-1 w-1 rounded-full bg-slate-200" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
