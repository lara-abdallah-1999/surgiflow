import { type ResourceMode, type CalendarSurgery } from "../types";
import { useMemo } from "react";
import { getWeekDays, isToday, getInitials, isSameDay, groupSurgeriesByStartTime } from "../utils";
import { EmptyState } from "./EmptyState";
import { Building2 } from "lucide-react";
import { WeekTimeGroup } from "./WeekTimeGroup";
import { WeekCellHoverList } from "./WeekCellHoverList";



/* ==========================================================================
   WEEK VIEW
   ========================================================================== */

export function WeekView({
  anchorDate,
  resources,
  resourceMode,
  surgeries,
  onSelectSurgery,
  onSelectDay,
}: {
  anchorDate: Date;
  resources: string[];
  resourceMode: ResourceMode;
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
        getWeekDays(
          anchorDate,
        ),
      [
        anchorDate,
      ],
    );

  if (
    resources.length ===
    0
  ) {
    return (
      <EmptyState
        title="No schedule resources"
        message="No doctors or rooms match the current filters."
      />
    );
  }

  return (
    <div className="h-full min-h-0 overflow-auto">
      <div className="min-w-[900px]">
        <div data-responsive-grid="2" className="sticky top-0 z-20 grid grid-cols-[155px_repeat(7,minmax(105px,1fr))] border-b border-slate-100 bg-white">
          <div className="flex items-center px-2 py-2 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            {resourceMode ===
            "doctor"
              ? "Doctor"
              : "Operating Room"}
          </div>

          {days.map(
            (day) => (
              <button
                key={
                  day.toISOString()
                }
                type="button"
                onClick={() =>
                  onSelectDay(
                    day,
                  )
                }
                className={`border-l border-slate-50 px-2 py-2 text-center transition hover:bg-slate-50 ${
                  isToday(
                    day,
                  )
                    ? "bg-blue-50/45"
                    : ""
                }`}
              >
                <p
                  className={`text-[8px] font-semibold uppercase tracking-wide ${
                    isToday(
                      day,
                    )
                      ? "text-blue-600"
                      : "text-slate-400"
                  }`}
                >
                  {day.toLocaleDateString(
                    "en-US",
                    {
                      weekday:
                        "short",
                    },
                  )}
                </p>

                <p
                  className={`mx-auto mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                    isToday(
                      day,
                    )
                      ? "bg-blue-600 text-white"
                      : "text-slate-600"
                  }`}
                >
                  {
                    day.getDate()
                  }
                </p>
              </button>
            ),
          )}
        </div>

        {resources.map(
          (
            resource,
          ) => (
            <div data-responsive-grid="2"
              key={
                resource
              }
              className="grid grid-cols-[155px_repeat(7,minmax(105px,1fr))] border-b border-slate-50"
            >
              <div className="sticky left-0 z-10 flex items-center gap-2 bg-white px-2 py-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[8px] font-bold text-slate-500">
                  {resourceMode ===
                  "doctor" ? (
                    getInitials(
                      resource,
                    )
                  ) : (
                    <Building2
                      size={12}
                    />
                  )}
                </div>

                <span className="truncate text-[10px] font-semibold text-slate-700">
                  {
                    resource
                  }
                </span>
              </div>

              {days.map(
                (day) => {
                  const items =
                    surgeries
                      .filter(
                        (
                          surgery,
                        ) =>
                          isSameDay(
                            surgery.start,
                            day,
                          ) &&
                          (resourceMode ===
                          "doctor"
                            ? surgery.doctor ===
                              resource
                            : surgery.displayRoom ===
                              resource),
                      )
                      .sort(
                        (
                          a,
                          b,
                        ) =>
                          a.start.getTime() -
                          b.start.getTime(),
                      );

                  const timeGroups =
                    groupSurgeriesByStartTime(
                      items,
                    );

                  return (
                    <div
                      key={
                        day.toISOString()
                      }
                      className={`group/weekcell relative min-h-[76px] border-l border-slate-100 transition ${
                        isToday(
                          day,
                        )
                          ? "bg-blue-50/20"
                          : "bg-white"
                      } ${items.length > 0 ? "hover:bg-blue-50/25" : ""}`}
                    >
                      {timeGroups.length ===
                      0 ? (
                        <div className="h-full min-h-[76px]" />
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {timeGroups.map(
                            (
                              group,
                            ) => (
                              <WeekTimeGroup
                                key={
                                  group.key
                                }
                                group={
                                  group
                                }
                                onSelectSurgery={
                                  onSelectSurgery
                                }
                              />
                            ),
                          )}
                        </div>
                      )}

                      <WeekCellHoverList
                        date={day}
                        resource={resource}
                        resourceMode={resourceMode}
                        surgeries={items}
                      />
                    </div>
                  );
                },
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
