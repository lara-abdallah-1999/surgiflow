import { AlertTriangle,CalendarDays,CheckCircle2,ChevronDown,ChevronLeft,ChevronRight,CircleDot,Clock3,Filter } from "lucide-react";
import { useMemo,useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgendaView,DaySurgeriesDrawer,DayView,FiltersPanel,MetricCard,ModernScheduleDatePicker,MonthView,ResourceToggle,SearchBox,StatusLegendItem,SurgeryPreview,ViewToggle,WeekView } from "../features/workspaces/schedule/components";
import { STATUS_STYLES } from "../features/workspaces/schedule/config";
import { type CalendarSurgery,type FilterState,type ResourceMode,type StatusBucket,type ViewMode } from "../features/workspaces/schedule/types";
import { addDays,addMinutes,addMonths,applyConflictData,combineDateTime,dateKey,formatCompactDate,formatTime,getDurationMinutes,getStatusBucket,getWeekDays,isSameDay,surgeryCaseNumber,surgeryDate,surgeryProcedure,surgeryRoom,surgeryTime } from "../features/workspaces/schedule/utils";
import { useSurgeryStore } from "../store/surgeryStore";


/* ==========================================================================
   PAGE
   ========================================================================== */

export default function Schedule() {
  const navigate =
    useNavigate();

  const surgeries =
    useSurgeryStore(
      (
        state,
      ) =>
        state.surgeries,
    );

  const [
    viewMode,
    setViewMode,
  ] =
    useState<ViewMode>(
      "month",
    );

  const [
    resourceMode,
    setResourceMode,
  ] =
    useState<ResourceMode>(
      "doctor",
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    filterOpen,
    setFilterOpen,
  ] =
    useState(false);

  const [
    filters,
    setFilters,
  ] =
    useState<FilterState>({
      doctors: [],
      rooms: [],
      statuses: [],
      conflictsOnly:
        false,
    });

  const [
    selectedSurgeryId,
    setSelectedSurgeryId,
  ] =
    useState<
      string | null
    >(null);

  const [
    selectedDay,
    setSelectedDay,
  ] =
    useState<Date | null>(
      null,
    );

  const [
    currentDate,
    setCurrentDate,
  ] =
    useState<Date>(
      () => {
        if (
          surgeries.length ===
          0
        ) {
          return new Date();
        }

        const valid =
          surgeries
            .map(
              (
                surgery,
              ) => {
                const date =
                  surgeryDate(
                    surgery,
                  );

                if (
                  !date
                ) {
                  return null;
                }

                return combineDateTime(
                  date,
                  surgeryTime(
                    surgery,
                  ),
                );
              },
            )
            .filter(
              (
                value,
              ): value is Date =>
                value !== null &&
                !Number.isNaN(
                  value.getTime(),
                ),
            );

        if (
          valid.length ===
          0
        ) {
          return new Date();
        }

        return valid.reduce(
          (
            earliest,
            current,
          ) =>
            current <
            earliest
              ? current
              : earliest,
        );
      },
    );

  const calendarSurgeries =
    useMemo(
      () => {
        const mapped =
          surgeries
            .map(
              (
                surgery,
              ) => {
                const date =
                  surgeryDate(
                    surgery,
                  );

                if (
                  !date
                ) {
                  return null;
                }

                const start =
                  combineDateTime(
                    date,
                    surgeryTime(
                      surgery,
                    ),
                  );

                if (
                  Number.isNaN(
                    start.getTime(),
                  )
                ) {
                  return null;
                }

                const end =
                  addMinutes(
                    start,
                    getDurationMinutes(
                      surgery,
                    ),
                  );

                return {
                  ...surgery,
                  start,
                  end,
                  bucket:
                    getStatusBucket(
                      (
                        surgery as any
                      ).status,
                    ),
                  displayProcedure:
                    surgeryProcedure(
                      surgery,
                    ),
                  displayRoom:
                    surgeryRoom(
                      surgery,
                    ),
                  displayTime:
                    surgeryTime(
                      surgery,
                    ) ||
                    formatTime(
                      start,
                    ),
                };
              },
            )
            .filter(
              (
                value,
              ): value is Omit<
                CalendarSurgery,
                | "conflict"
                | "doctorConflict"
                | "roomConflict"
              > =>
                Boolean(
                  value,
                ),
            );

        return applyConflictData(
          mapped,
        );
      },
      [
        surgeries,
      ],
    );

  const doctors =
    useMemo(
      () =>
        Array.from(
          new Set(
            calendarSurgeries.map(
              (
                surgery,
              ) =>
                surgery.doctor,
            ),
          ),
        )
          .filter(Boolean)
          .sort(),
      [
        calendarSurgeries,
      ],
    );

  const rooms =
    useMemo(
      () =>
        Array.from(
          new Set(
            calendarSurgeries.map(
              (
                surgery,
              ) =>
                surgery.displayRoom,
            ),
          ),
        )
          .filter(Boolean)
          .sort(),
      [
        calendarSurgeries,
      ],
    );

  const filteredSurgeries =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        return calendarSurgeries.filter(
          (
            surgery,
          ) => {
            if (
              filters.doctors.length >
                0 &&
              !filters.doctors.includes(
                surgery.doctor,
              )
            ) {
              return false;
            }

            if (
              filters.rooms.length >
                0 &&
              !filters.rooms.includes(
                surgery.displayRoom,
              )
            ) {
              return false;
            }

            if (
              filters.statuses.length >
                0 &&
              !filters.statuses.includes(
                surgery.bucket,
              )
            ) {
              return false;
            }

            if (
              filters.conflictsOnly &&
              !surgery.conflict
            ) {
              return false;
            }

            if (
              !query
            ) {
              return true;
            }

            return [
              surgery.patientName,
              surgery.id,
              surgeryCaseNumber(
                surgery,
              ),
              surgery.displayProcedure,
              surgery.doctor,
              surgery.displayRoom,
            ]
              .join(
                " ",
              )
              .toLowerCase()
              .includes(
                query,
              );
          },
        );
      },
      [
        calendarSurgeries,
        filters,
        search,
      ],
    );

  const rangeSurgeries =
    useMemo(
      () => {
        if (
          viewMode ===
          "month"
        ) {
          return filteredSurgeries.filter(
            (
              surgery,
            ) =>
              surgery.start.getMonth() ===
                currentDate.getMonth() &&
              surgery.start.getFullYear() ===
                currentDate.getFullYear(),
          );
        }

        if (
          viewMode ===
          "week"
        ) {
          const days =
            getWeekDays(
              currentDate,
            );

          return filteredSurgeries.filter(
            (
              surgery,
            ) =>
              days.some(
                (
                  day,
                ) =>
                  isSameDay(
                    day,
                    surgery.start,
                  ),
              ),
          );
        }

        if (
          viewMode ===
          "day"
        ) {
          return filteredSurgeries.filter(
            (
              surgery,
            ) =>
              isSameDay(
                surgery.start,
                currentDate,
              ),
          );
        }

        return filteredSurgeries;
      },
      [
        filteredSurgeries,
        viewMode,
        currentDate,
      ],
    );

  const resources =
    useMemo(
      () => {
        if (
          resourceMode ===
          "doctor"
        ) {
          if (
            filters.doctors.length >
            0
          ) {
            return filters.doctors;
          }

          return doctors;
        }

        if (
          filters.rooms.length >
          0
        ) {
          return filters.rooms;
        }

        return rooms;
      },
      [
        resourceMode,
        filters.doctors,
        filters.rooms,
        doctors,
        rooms,
      ],
    );

  const stats =
    useMemo(
      () => ({
        total:
          rangeSurgeries.length,
        scheduled:
          rangeSurgeries.filter(
            (
              surgery,
            ) =>
              surgery.bucket ===
                "scheduled" ||
              surgery.bucket ===
                "ready",
          ).length,
        inProgress:
          rangeSurgeries.filter(
            (
              surgery,
            ) =>
              surgery.bucket ===
              "in-progress",
          ).length,
        conflicts:
          rangeSurgeries.filter(
            (
              surgery,
            ) =>
              surgery.conflict,
          ).length,
      }),
      [
        rangeSurgeries,
      ],
    );

  const rangeLabel =
    useMemo(
      () => {
        if (
          viewMode ===
          "month"
        ) {
          return currentDate.toLocaleDateString(
            "en-US",
            {
              month:
                "long",
              year:
                "numeric",
            },
          );
        }

        if (
          viewMode ===
          "week"
        ) {
          const days =
            getWeekDays(
              currentDate,
            );

          return `${formatCompactDate(
            days[0],
          )} – ${formatCompactDate(
            days[6],
          )}, ${days[6].getFullYear()}`;
        }

        if (
          viewMode ===
          "day"
        ) {
          return currentDate.toLocaleDateString(
            "en-US",
            {
              weekday:
                "long",
              month:
                "long",
              day:
                "numeric",
              year:
                "numeric",
            },
          );
        }

        return "All scheduled surgeries";
      },
      [
        viewMode,
        currentDate,
      ],
    );

  const selectedSurgery =
    useMemo(
      () =>
        selectedSurgeryId
          ? calendarSurgeries.find(
              (
                surgery,
              ) =>
                surgery.id ===
                selectedSurgeryId,
            ) ?? null
          : null,
      [
        selectedSurgeryId,
        calendarSurgeries,
      ],
    );

  const selectedDaySurgeries =
    useMemo(
      () =>
        selectedDay
          ? filteredSurgeries.filter(
              (surgery) =>
                isSameDay(
                  surgery.start,
                  selectedDay,
                ),
            )
          : [],
      [
        selectedDay,
        filteredSurgeries,
      ],
    );

  const activeFilterCount =
    filters.doctors.length +
    filters.rooms.length +
    filters.statuses.length +
    (filters.conflictsOnly
      ? 1
      : 0);

  function goPrev() {
    if (
      viewMode ===
      "month"
    ) {
      setCurrentDate(
        (
          date,
        ) =>
          addMonths(
            date,
            -1,
          ),
      );

      return;
    }

    if (
      viewMode ===
      "week"
    ) {
      setCurrentDate(
        (
          date,
        ) =>
          addDays(
            date,
            -7,
          ),
      );

      return;
    }

    if (
      viewMode ===
      "day"
    ) {
      setCurrentDate(
        (
          date,
        ) =>
          addDays(
            date,
            -1,
          ),
      );
    }
  }

  function goNext() {
    if (
      viewMode ===
      "month"
    ) {
      setCurrentDate(
        (
          date,
        ) =>
          addMonths(
            date,
            1,
          ),
      );

      return;
    }

    if (
      viewMode ===
      "week"
    ) {
      setCurrentDate(
        (
          date,
        ) =>
          addDays(
            date,
            7,
          ),
      );

      return;
    }

    if (
      viewMode ===
      "day"
    ) {
      setCurrentDate(
        (
          date,
        ) =>
          addDays(
            date,
            1,
          ),
      );
    }
  }

  function openDayView(
    date: Date,
  ) {
    setCurrentDate(
      date,
    );

    setViewMode(
      "day",
    );
  }

  function openDayDrawer(
    date: Date,
  ) {
    setSelectedSurgeryId(
      null,
    );

    setSelectedDay(
      date,
    );
  }

  return (
    <div data-workspace-page="schedule" className="flex h-full min-h-0 flex-col gap-2 p-2">
      {/* =============================================================== */}
      {/* METRICS                                                         */}
      {/* =============================================================== */}

      <div data-responsive-grid="4" className="grid shrink-0 grid-cols-4 gap-2">
        <MetricCard
          label="Scheduled Cases"
          value={
            stats.total
          }
          hint="visible range"
          icon={
            <CalendarDays
              size={14}
            />
          }
          tone="blue"
        />

        <MetricCard
          label="Upcoming / Ready"
          value={
            stats.scheduled
          }
          hint="waiting to start"
          icon={
            <CircleDot
              size={14}
            />
          }
          tone="violet"
        />

        <MetricCard
          label="In Progress"
          value={
            stats.inProgress
          }
          hint="currently active"
          icon={
            <Clock3
              size={14}
            />
          }
          tone="amber"
        />

        <MetricCard
          label="Conflicts"
          value={
            stats.conflicts
          }
          hint={
            stats.conflicts >
            0
              ? "needs attention"
              : "schedule clear"
          }
          icon={
            stats.conflicts >
            0 ? (
              <AlertTriangle
                size={14}
              />
            ) : (
              <CheckCircle2
                size={14}
              />
            )
          }
          tone={
            stats.conflicts >
            0
              ? "red"
              : "emerald"
          }
        />
      </div>

      {/* =============================================================== */}
      {/* SCHEDULE CARD                                                   */}
      {/* =============================================================== */}

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* HEADER */}

        <div data-page-toolbar="true" className="flex h-[58px] shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentDate(
                  new Date(),
                )
              }
              className="h-7 rounded-lg border border-slate-200 bg-white px-3 !text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Today
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={
                  goPrev
                }
                disabled={
                  viewMode ===
                  "agenda"
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft
                  size={13}
                />
              </button>

              <button
                type="button"
                onClick={
                  goNext
                }
                disabled={
                  viewMode ===
                  "agenda"
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight
                  size={13}
                />
              </button>
            </div>

            <div className="min-w-0 pl-1">
              <p className="truncate text-[12px] font-bold text-slate-700">
                {
                  rangeLabel
                }
              </p>

              <p className="mt-0.5 text-[8px] text-slate-400">
                Surgery Schedule
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <SearchBox
              value={
                search
              }
              onChange={
                setSearch
              }
            />

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setFilterOpen(
                    (
                      current,
                    ) =>
                      !current,
                  )
                }
                className={`inline-flex h-7 items-center gap-1 rounded-lg border px-2 !text-[11px] font-semibold transition ${
                  filterOpen ||
                  activeFilterCount >
                    0
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Filter
                  size={11}
                />
                Filters

                {activeFilterCount >
                  0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[7px] font-bold text-white">
                    {
                      activeFilterCount
                    }
                  </span>
                )}

                <ChevronDown
                  size={10}
                />
              </button>

              <FiltersPanel
                open={
                  filterOpen
                }
                doctors={
                  doctors
                }
                rooms={
                  rooms
                }
                filters={
                  filters
                }
                onChange={
                  setFilters
                }
                onClose={() =>
                  setFilterOpen(
                    false,
                  )
                }
              />
            </div>

            {(viewMode ===
              "day" ||
              viewMode ===
                "week") && (
              <ResourceToggle
                value={
                  resourceMode
                }
                onChange={
                  setResourceMode
                }
              />
            )}

            <ViewToggle
              value={
                viewMode
              }
              onChange={
                setViewMode
              }
            />
          </div>
        </div>

        {/* LEGEND / DATE JUMP */}

        <div data-page-toolbar="true" className="flex h-[38px] shrink-0 items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/55 px-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
              Legend
            </span>

            <div className="h-4 w-px bg-slate-200" />

            {(
              Object.keys(
                STATUS_STYLES,
              ) as StatusBucket[]
            ).map(
              (
                bucket,
              ) => (
                <StatusLegendItem
                  key={
                    bucket
                  }
                  bucket={
                    bucket
                  }
                />
              ),
            )}

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-1.5">
              <span className="h-3 w-[3px] rounded-full bg-red-500" />

              <span className="text-[9px] font-semibold text-slate-500">
                Conflict
              </span>
            </div>
          </div>

          {viewMode !==
            "agenda" && (
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="!text-[9px] font-semibold text-slate-400">
                Jump to
              </span>

              <ModernScheduleDatePicker
                value={dateKey(
                  currentDate,
                )}
                onChange={(value) =>
                  setCurrentDate(
                    new Date(
                      `${value}T00:00:00`,
                    ),
                  )
                }
              />
            </div>
          )}
        </div>

        {/* BODY */}

        <div className="min-h-0 flex-1 overflow-hidden p-2">
          {viewMode ===
            "month" && (
            <MonthView
              anchorDate={
                currentDate
              }
              surgeries={
                filteredSurgeries
              }
              onSelectSurgery={
                setSelectedSurgeryId
              }
              onSelectDay={
                openDayDrawer
              }
            />
          )}

          {viewMode ===
            "week" && (
            <WeekView
              anchorDate={
                currentDate
              }
              resources={
                resources
              }
              resourceMode={
                resourceMode
              }
              surgeries={
                filteredSurgeries
              }
              onSelectSurgery={
                setSelectedSurgeryId
              }
              onSelectDay={
                openDayView
              }
            />
          )}

          {viewMode ===
            "day" && (
            <DayView
              anchorDate={
                currentDate
              }
              resources={
                resources
              }
              resourceMode={
                resourceMode
              }
              surgeries={
                filteredSurgeries
              }
              onSelectSurgery={
                setSelectedSurgeryId
              }
            />
          )}

          {viewMode ===
            "agenda" && (
            <div className="h-full overflow-y-auto">
              <AgendaView
                surgeries={
                  filteredSurgeries
                }
                onSelectSurgery={
                  setSelectedSurgeryId
                }
              />
            </div>
          )}
        </div>
      </section>

      {selectedDay && (
        <DaySurgeriesDrawer
          date={selectedDay}
          surgeries={selectedDaySurgeries}
          onClose={() =>
            setSelectedDay(
              null,
            )
          }
          onOpenSurgery={(id) => {
            setSelectedDay(null);
            navigate(
              `/surgery/${id}`,
            );
          }}
        />
      )}

      {selectedSurgery && (
        <SurgeryPreview
          surgery={
            selectedSurgery
          }
          onClose={() =>
            setSelectedSurgeryId(
              null,
            )
          }
          onOpen={() =>
            navigate(
              `/surgery/${selectedSurgery.id}`,
            )
          }
        />
      )}
    </div>
  );
}
