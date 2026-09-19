import { type CalendarSurgery, type StatusBucket } from "../types";
import { useState, useRef, useEffect, useMemo } from "react";
import { surgeryCaseNumber, formatTime, getInitials } from "../utils";
import { CalendarDays, X, Search, Filter, ChevronDown, Stethoscope, Building2, ChevronRight, ChevronLeft } from "lucide-react";
import { STATUS_STYLES } from "../config";



/* ==========================================================================
   SURGERY PREVIEW PANEL
   ========================================================================== */

export function DaySurgeriesDrawer({
  date,
  surgeries,
  onClose,
  onOpenSurgery,
}: {
  date: Date;
  surgeries: CalendarSurgery[];
  onClose: () => void;
  onOpenSurgery: (
    id: string,
  ) => void;
}) {
  const PAGE_SIZE = 6;

  const [search, setSearch] =
    useState("");

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [selectedDoctors, setSelectedDoctors] =
    useState<string[]>([]);

  const [selectedRooms, setSelectedRooms] =
    useState<string[]>([]);

  const [selectedStatuses, setSelectedStatuses] =
    useState<StatusBucket[]>([]);

  const [page, setPage] =
    useState(0);

  const filterRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    setSearch("");
    setSelectedDoctors([]);
    setSelectedRooms([]);
    setSelectedStatuses([]);
    setPage(0);
    setFilterOpen(false);
  }, [date]);

  useEffect(() => {
    if (!filterOpen) return;

    function handleOutside(
      event: MouseEvent,
    ) {
      const target =
        event.target as Node | null;

      if (
        target &&
        filterRef.current &&
        !filterRef.current.contains(
          target,
        )
      ) {
        setFilterOpen(false);
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
  }, [filterOpen]);

  const doctors =
    useMemo(
      () =>
        Array.from(
          new Set(
            surgeries.map(
              (surgery) =>
                surgery.doctor,
            ),
          ),
        ).sort(),
      [surgeries],
    );

  const rooms =
    useMemo(
      () =>
        Array.from(
          new Set(
            surgeries.map(
              (surgery) =>
                surgery.displayRoom,
            ),
          ),
        ).sort(),
      [surgeries],
    );

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return [...surgeries]
        .filter((surgery) => {
          const matchesSearch =
            !query ||
            surgery.patientName
              .toLowerCase()
              .includes(query) ||
            surgery.displayProcedure
              .toLowerCase()
              .includes(query) ||
            surgeryCaseNumber(
              surgery,
            )
              .toLowerCase()
              .includes(query) ||
            surgery.doctor
              .toLowerCase()
              .includes(query) ||
            surgery.displayRoom
              .toLowerCase()
              .includes(query);

          const matchesDoctor =
            selectedDoctors.length ===
              0 ||
            selectedDoctors.includes(
              surgery.doctor,
            );

          const matchesRoom =
            selectedRooms.length ===
              0 ||
            selectedRooms.includes(
              surgery.displayRoom,
            );

          const matchesStatus =
            selectedStatuses.length ===
              0 ||
            selectedStatuses.includes(
              surgery.bucket,
            );

          return (
            matchesSearch &&
            matchesDoctor &&
            matchesRoom &&
            matchesStatus
          );
        })
        .sort(
          (a, b) =>
            a.start.getTime() -
            b.start.getTime(),
        );
    }, [
      surgeries,
      search,
      selectedDoctors,
      selectedRooms,
      selectedStatuses,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filtered.length /
          PAGE_SIZE,
      ),
    );

  const visibleRows =
    filtered.slice(
      page * PAGE_SIZE,
      page * PAGE_SIZE +
        PAGE_SIZE,
    );

  const activeFilterCount =
    selectedDoctors.length +
    selectedRooms.length +
    selectedStatuses.length;

  useEffect(() => {
    setPage(0);
  }, [
    search,
    selectedDoctors,
    selectedRooms,
    selectedStatuses,
  ]);

  useEffect(() => {
    if (
      page >
      totalPages - 1
    ) {
      setPage(
        Math.max(
          0,
          totalPages - 1,
        ),
      );
    }
  }, [
    page,
    totalPages,
  ]);

  function toggleDoctor(
    doctor: string,
  ) {
    setSelectedDoctors(
      (current) =>
        current.includes(
          doctor,
        )
          ? current.filter(
              (item) =>
                item !== doctor,
            )
          : [
              ...current,
              doctor,
            ],
    );
  }

  function toggleRoom(
    room: string,
  ) {
    setSelectedRooms(
      (current) =>
        current.includes(room)
          ? current.filter(
              (item) =>
                item !== room,
            )
          : [
              ...current,
              room,
            ],
    );
  }

  function toggleStatus(
    status: StatusBucket,
  ) {
    setSelectedStatuses(
      (current) =>
        current.includes(
          status,
        )
          ? current.filter(
              (item) =>
                item !== status,
            )
          : [
              ...current,
              status,
            ],
    );
  }

  function clearFilters() {
    setSelectedDoctors([]);
    setSelectedRooms([]);
    setSelectedStatuses([]);
  }

  const pageIndexes =
    Array.from(
      {
        length: totalPages,
      },
      (_, index) => index,
    ).slice(
      Math.max(
        0,
        Math.min(
          page - 1,
          totalPages - 4,
        ),
      ),
      Math.max(
        0,
        Math.min(
          page - 1,
          totalPages - 4,
        ),
      ) + 4,
    );

  return (
    <>
      <button
        type="button"
        aria-label="Close day surgeries"
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-slate-900/10 backdrop-blur-[1px]"
      />

      <aside className="fixed bottom-1.5 right-2 top-1.5 z-[80] flex w-[500px] max-w-[96vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.20)]">
        {/* HEADER */}
        <div className="relative shrink-0 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 via-white to-white px-3.5 py-2">
          <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-blue-500" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <CalendarDays
                  size={14}
                />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-[12px] font-bold text-slate-800">
                  {date.toLocaleDateString(
                    "en-US",
                    {
                      weekday:
                        "long",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </h3>

                <p className="mt-px text-[8.5px] text-slate-400">
                  {surgeries.length}{" "}
                  {surgeries.length ===
                  1
                    ? "scheduled surgery"
                    : "scheduled surgeries"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="relative z-20 shrink-0 border-b border-slate-100 bg-white px-3 py-1.5">
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search patient, case, procedure..."
                className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 !text-[10px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
              />
            </div>

            <div
              ref={filterRef}
              className="relative shrink-0"
            >
              <button
                type="button"
                onClick={() =>
                  setFilterOpen(
                    (current) =>
                      !current,
                  )
                }
                className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 !text-[10px] font-semibold transition ${
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
                  size={9}
                  className={`transition-transform ${
                    filterOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-[100] w-[360px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_14px_36px_rgba(15,23,42,0.16)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-700">
                        Day Filters
                      </p>

                      <p className="mt-0.5 text-[8px] text-slate-400">
                        Refine surgeries for this day
                      </p>
                    </div>

                    {activeFilterCount >
                      0 && (
                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                        className="text-[8px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                        Doctor
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {doctors.map(
                          (doctor) => (
                            <button
                              key={
                                doctor
                              }
                              type="button"
                              onClick={() =>
                                toggleDoctor(
                                  doctor,
                                )
                              }
                              className={`rounded-md border px-2 py-1 !text-[9px] font-semibold transition ${
                                selectedDoctors.includes(
                                  doctor,
                                )
                                  ? "border-blue-200 bg-blue-50 text-blue-700"
                                  : "border-slate-200 bg-white text-slate-500 hover:border-blue-100 hover:bg-blue-50/40"
                              }`}
                            >
                              {
                                doctor
                              }
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                        Operating Room
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {rooms.map(
                          (room) => (
                            <button
                              key={
                                room
                              }
                              type="button"
                              onClick={() =>
                                toggleRoom(
                                  room,
                                )
                              }
                              className={`rounded-md border px-2 py-1 !text-[9px] font-semibold transition ${
                                selectedRooms.includes(
                                  room,
                                )
                                  ? "border-blue-200 bg-blue-50 text-blue-700"
                                  : "border-slate-200 bg-white text-slate-500 hover:border-blue-100 hover:bg-blue-50/40"
                              }`}
                            >
                              {
                                room
                              }
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {(
                          Object.keys(
                            STATUS_STYLES,
                          ) as StatusBucket[]
                        ).map(
                          (status) => {
                            const style =
                              STATUS_STYLES[
                                status
                              ];

                            const active =
                              selectedStatuses.includes(
                                status,
                              );

                            return (
                              <button
                                key={
                                  status
                                }
                                type="button"
                                onClick={() =>
                                  toggleStatus(
                                    status,
                                  )
                                }
                                className={`flex items-center gap-1.5 rounded-md border px-2 py-1 !text-[9px] font-semibold transition ${
                                  active
                                    ? `${style.bg} ${style.border} ${style.text}`
                                    : "border-slate-200 bg-white text-slate-500"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                                />
                                {
                                  style.label
                                }
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(search ||
            activeFilterCount >
              0) && (
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[8px] text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {
                    filtered.length
                  }
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {
                    surgeries.length
                  }
                </span>
              </p>

              {(search ||
                activeFilterCount >
                  0) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    clearFilters();
                  }}
                  className="text-[8px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        {/* ROWS */}
        <div className="min-h-0 flex-1 overflow-hidden bg-slate-50/30 p-2">
          {filtered.length ===
          0 ? (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <CalendarDays
                  size={17}
                />
              </div>

              <p className="mt-2 text-[11px] font-semibold text-slate-600">
                No surgeries found
              </p>

              <p className="mt-1 max-w-[260px] text-[9px] leading-4 text-slate-400">
                Try changing the search or filters for this day.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-0 flex-col">
              <div data-responsive-table-header="true" className="grid h-6 shrink-0 grid-cols-[58px_minmax(0,1fr)_92px_18px] items-center gap-2 border-b border-slate-100 px-2.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                <span>
                  Time
                </span>
                <span>
                  Patient / Procedure
                </span>
                <span className="text-right">
                  Status
                </span>
                <span />
              </div>

              <div className="min-h-0 flex-1 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100 bg-white">
                {visibleRows.map(
                  (surgery) => {
                    const style =
                      STATUS_STYLES[
                        surgery.bucket
                      ];

                    return (
                      <button data-responsive-table-row="true"
                        key={
                          surgery.id
                        }
                        type="button"
                        onClick={() =>
                          onOpenSurgery(
                            surgery.id,
                          )
                        }
                        className="group relative grid min-h-[65px] flex-1 w-full grid-cols-[58px_minmax(0,1fr)_92px_18px] items-center gap-2 overflow-hidden px-2.5 py-1.5 text-left transition hover:bg-blue-50/30"
                      >
                        <span 
                          className={`absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full ${style.dot}`}
                        />

                        <div data-cell-label="Time" >
                          <p className="text-[10px] font-bold text-slate-700">
                            {formatTime(
                              surgery.start,
                            )}
                          </p>

                          <p className="mt-0.5 text-[8px] text-slate-400">
                            {Math.max(
                              30,
                              Math.round(
                                (surgery.end.getTime() -
                                  surgery.start.getTime()) /
                                  60000,
                              ),
                            )}{" "}
                            min
                          </p>
                        </div>

                        <div data-cell-label="Patient / Procedure"  className="min-w-0">
                          <div className="flex min-w-0 items-center gap-1.5">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[8px] font-bold text-blue-700">
                              {getInitials(
                                surgery.patientName,
                              )}
                            </span>

                            <div className="min-w-0">
                              <p className="truncate text-[10.5px] font-semibold text-slate-800">
                                {
                                  surgery.patientName
                                }
                              </p>

                              <p
                                className="mt-0.5 truncate text-[8.5px] text-slate-400"
                                title={
                                  surgery.displayProcedure
                                }
                              >
                                {
                                  surgery.displayProcedure
                                }
                              </p>
                            </div>
                          </div>

                          <div className="mt-1 flex min-w-0 items-center gap-2 text-[8px] text-slate-400">
                            <span className="flex min-w-0 items-center gap-1">
                              <Stethoscope
                                size={8}
                              />
                              <span className="truncate">
                                {
                                  surgery.doctor
                                }
                              </span>
                            </span>

                            <span className="flex shrink-0 items-center gap-1">
                              <Building2
                                size={8}
                              />
                              {
                                surgery.displayRoom
                              }
                            </span>
                          </div>
                        </div>

                        <span data-cell-label="Status"
                          className={`justify-self-end rounded-full px-2 py-1 text-[8px] font-semibold ${style.bg} ${style.text}`}
                        >
                          {
                            style.label
                          }
                        </span>

                        <ChevronRight
                          size={12}
                          className="justify-self-end text-slate-300 transition group-hover:text-blue-500"
                        />
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex h-9 shrink-0 items-center justify-between border-t border-slate-100 bg-white px-3">
          <p className="text-[8.5px] font-medium text-slate-400">
            {filtered.length >
            0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {page *
                    PAGE_SIZE +
                    1}
                  –
                  {Math.min(
                    (page + 1) *
                      PAGE_SIZE,
                    filtered.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {
                    filtered.length
                  }
                </span>
              </>
            ) : (
              "0 results"
            )}
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous page"
              disabled={
                page === 0 ||
                filtered.length ===
                  0
              }
              onClick={() =>
                setPage(
                  (current) =>
                    Math.max(
                      0,
                      current - 1,
                    ),
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft
                size={11}
              />
            </button>

            {pageIndexes.map(
              (pageIndex) => (
                <button
                  key={pageIndex}
                  type="button"
                  onClick={() =>
                    setPage(
                      pageIndex,
                    )
                  }
                  className={`flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-[9px] font-semibold transition ${
                    page ===
                    pageIndex
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {
                    pageIndex +
                    1
                  }
                </button>
              ),
            )}

            <button
              type="button"
              aria-label="Next page"
              disabled={
                page >=
                  totalPages - 1 ||
                filtered.length ===
                  0
              }
              onClick={() =>
                setPage(
                  (current) =>
                    Math.min(
                      totalPages -
                        1,
                      current + 1,
                    ),
                )
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight
                size={11}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
