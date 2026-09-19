import { type ResourceMode, type CalendarSurgery } from "../types";
import { useMemo } from "react";
import { isSameDay, getDayHourRange, formatHourLabel, getInitials, layoutDaySurgeries, formatTime } from "../utils";
import { PIXELS_PER_HOUR, STATUS_STYLES } from "../config";
import { EmptyState } from "./EmptyState";
import { Building2 } from "lucide-react";



/* ==========================================================================
   DAY VIEW
   ========================================================================== */

export function DayView({
  anchorDate,
  resources,
  resourceMode,
  surgeries,
  onSelectSurgery,
}: {
  anchorDate: Date;
  resources: string[];
  resourceMode: ResourceMode;
  surgeries: CalendarSurgery[];
  onSelectSurgery: (
    id: string,
  ) => void;
}) {
  const daySurgeries =
    useMemo(
      () =>
        surgeries.filter(
          (
            surgery,
          ) =>
            isSameDay(
              surgery.start,
              anchorDate,
            ),
        ),
      [
        surgeries,
        anchorDate,
      ],
    );

  const {
    startHour,
    endHour,
  } =
    useMemo(
      () =>
        getDayHourRange(
          daySurgeries,
        ),
      [
        daySurgeries,
      ],
    );

  const hours =
    useMemo(
      () => {
        const list: number[] =
          [];

        for (
          let hour =
            startHour;
          hour <=
          endHour;
          hour++
        ) {
          list.push(
            hour,
          );
        }

        return list;
      },
      [
        startHour,
        endHour,
      ],
    );

  const totalHeight =
    (endHour -
      startHour) *
    PIXELS_PER_HOUR;

  if (
    resources.length ===
    0
  ) {
    return (
      <EmptyState
        title="Nothing to display"
        message="No doctors or rooms match the current filters."
      />
    );
  }

  const now =
    new Date();

  const showNow =
    isSameDay(
      anchorDate,
      now,
    ) &&
    now.getHours() >=
      startHour &&
    now.getHours() <=
      endHour;

  const nowTop =
    ((now.getHours() *
      60 +
      now.getMinutes() -
      startHour *
        60) *
      PIXELS_PER_HOUR) /
    60;

  return (
    <div className="h-full min-h-0 overflow-auto">
      <div className="flex min-w-[760px]">
        <div className="w-14 shrink-0">
          <div className="h-9" />

          <div
            className="relative"
            style={{
              height:
                totalHeight,
            }}
          >
            {hours.map(
              (hour) => (
                <div
                  key={
                    hour
                  }
                  className="absolute right-2 -translate-y-1/2 text-[8px] font-medium text-slate-400"
                  style={{
                    top:
                      (hour -
                        startHour) *
                      PIXELS_PER_HOUR,
                  }}
                >
                  {
                    formatHourLabel(
                      hour,
                    )
                  }
                </div>
              ),
            )}
          </div>
        </div>

        <div
          className="grid flex-1 gap-2"
          style={{
            gridTemplateColumns: `repeat(${resources.length}, minmax(175px, 1fr))`,
          }}
        >
          {resources.map(
            (
              resource,
            ) => {
              const items =
                daySurgeries.filter(
                  (
                    surgery,
                  ) =>
                    resourceMode ===
                    "doctor"
                      ? surgery.doctor ===
                        resource
                      : surgery.displayRoom ===
                        resource,
                );

              return (
                <div
                  key={
                    resource
                  }
                  className="flex min-w-0 flex-col"
                >
                  <div className="mb-1 flex h-9 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-[8px] font-bold text-slate-500 shadow-sm">
                      {resourceMode ===
                      "doctor" ? (
                        getInitials(
                          resource,
                        )
                      ) : (
                        <Building2
                          size={11}
                        />
                      )}
                    </div>

                    <span className="truncate text-[9px] font-semibold text-slate-700">
                      {
                        resource
                      }
                    </span>

                    <span className="ml-auto rounded-full bg-white px-1.5 py-0.5 text-[7px] font-bold text-slate-400">
                      {
                        items.length
                      }
                    </span>
                  </div>

                  <div
                    className="relative rounded-lg border border-slate-100 bg-slate-50/35"
                    style={{
                      height:
                        totalHeight,
                    }}
                  >
                    {hours.map(
                      (
                        hour,
                      ) => (
                        <div
                          key={
                            hour
                          }
                          className="absolute left-0 right-0 border-t border-slate-100"
                          style={{
                            top:
                              (hour -
                                startHour) *
                              PIXELS_PER_HOUR,
                          }}
                        />
                      ),
                    )}

                    {showNow && (
                      <div
                        className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
                        style={{
                          top:
                            nowTop,
                        }}
                      >
                        <span className="h-2 w-2 -translate-x-1/2 rounded-full bg-red-500" />

                        <span className="h-px flex-1 bg-red-400" />
                      </div>
                    )}

                    {layoutDaySurgeries(
                      items,
                    ).map(
                      ({
                        surgery,
                        laneIndex,
                        laneCount,
                      }) => {
                        const startMinutes =
                          surgery.start.getHours() *
                            60 +
                          surgery.start.getMinutes();

                        const top =
                          ((startMinutes -
                            startHour *
                              60) *
                            PIXELS_PER_HOUR) /
                          60;

                        const durationMinutes =
                          Math.max(
                            30,
                            (surgery.end.getTime() -
                              surgery.start.getTime()) /
                              60000,
                          );

                        const height =
                          Math.max(
                            34,
                            (durationMinutes *
                              PIXELS_PER_HOUR) /
                              60 -
                              3,
                          );

                        const style =
                          STATUS_STYLES[
                            surgery.bucket
                          ];

                        const widthPercent =
                          100 / laneCount;

                        const leftPercent =
                          laneIndex *
                          widthPercent;

                        return (
                          <button
                            key={
                              surgery.id
                            }
                            type="button"
                            onClick={() =>
                              onSelectSurgery(
                                surgery.id,
                              )
                            }
                            className={`absolute z-10 overflow-hidden border-l-2 border-y-0 border-r-0 px-1.5 py-1 text-left transition hover:z-30 hover:shadow-md ${style.bg} ${style.border}`}
                            style={{
                              top,
                              height,
                              left: `calc(${leftPercent}% + 2px)`,
                              width: `calc(${widthPercent}% - 4px)`,
                            }}
                          >
                            {surgery.conflict && (
                              <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-red-500" />
                            )}

                            <div className="flex min-w-0 items-center gap-1">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
                              />

                              <p
                                className={`truncate text-[9px] font-bold ${style.text}`}
                              >
                                {
                                  surgery.patientName
                                }
                              </p>

                              {laneCount >
                                1 && (
                                <span className="ml-auto shrink-0 bg-white/70 px-1 text-[7px] font-bold text-slate-500">
                                  {laneIndex +
                                    1}
                                  /
                                  {
                                    laneCount
                                  }
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 truncate text-[8px] font-medium text-slate-500">
                              {
                                surgery.displayProcedure
                              }
                            </p>

                            <p className="mt-0.5 truncate text-[7px] text-slate-400">
                              {formatTime(
                                surgery.start,
                              )}{" "}
                              –{" "}
                              {formatTime(
                                surgery.end,
                              )}
                            </p>
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
