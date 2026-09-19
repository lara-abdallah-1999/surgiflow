import { CalendarDays,Check,CheckCircle2,ChevronDown,ChevronLeft,ChevronRight,Clock3,Filter,Play,Search,Square } from "lucide-react";
import { FilterPill,FilterSection,ModernSurgeryDatePicker,ModuleStatCard,SortableHeader,StatusBadge } from "../features/workspaces/Surgery/components";
import { doctors,states } from "../features/workspaces/Surgery/config";
import { useSurgeryWorkspace } from '../features/workspaces/Surgery/hooks/useSurgeryWorkspace';
import { type Period } from "../features/workspaces/Surgery/types";
import { formatRunningDuration,getCaseNumber,getInitials,getPatientAge,getPatientGender,getProcedureItems,getSurgeryNote } from "../features/workspaces/Surgery/utils";


export default function Surgery() {
  const { totalCount, readyCount, inProgressCount, completedCount, search, setSearch, setPage, filterRef, setFilterOpen, filterOpen, hasActiveFilters, activeFilterCount, clearFilters, selectedDoctors, toggleDoctor, selectedStates, toggleState, setPeriod, period, selectedDate, setSelectedDate, sortKey, sortDirection, handleSort, rowsContainerRef, filteredSurgeries, visibleSurgeries, highlightedRowId, navigate, startSurgery, completeSurgery, sortedSurgeries, page, pageSize, totalPages } = useSurgeryWorkspace();

return (
    <div data-workspace-page="Surgery" className="h-[calc(100vh-72px)] min-h-0 overflow-hidden bg-slate-50 p-2">
      <div className="flex h-full min-h-0 flex-col gap-2">
        <section data-responsive-grid="4" className="grid shrink-0 grid-cols-4 gap-2">
          <ModuleStatCard
            label="Total Surgeries"
            value={totalCount}
            icon={<CalendarDays size={15} />}
            tone="violet"
          />
          <ModuleStatCard
            label="Ready"
            value={readyCount}
            icon={<CheckCircle2 size={15} />}
            tone="green"
          />
          <ModuleStatCard
            label="In Progress"
            value={inProgressCount}
            icon={<Clock3 size={15} />}
            tone="blue"
          />
          <ModuleStatCard
            label="Completed"
            value={completedCount}
            icon={<Check size={15} />}
            tone="violet"
          />
        </section>

        <section className="flex min-h-0 flex-1 flex-col overflow-visible rounded-xl border border-slate-200 bg-white">
          <div data-page-toolbar="true" className="flex min-h-[58px] shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <CalendarDays size={13} />
              </div>
              <div>
                <h2 className="text-[12px] font-semibold text-slate-800">
                  Surgical Schedule
                </h2>
                <p className="mt-0.5 text-[9px] text-slate-400">
                  Manage and monitor surgical cases
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-[220px]">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(0);
                  }}
                  placeholder="Search patient, ID, procedure or doctor..."
                  className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 !text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-50"
                />
              </div>

              <div ref={filterRef} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setFilterOpen(
                      (value) => !value,
                    )
                  }
                  className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 !text-[11px] font-semibold transition ${
                    filterOpen ||
                    hasActiveFilters
                      ? "border-violet-200 bg-violet-50 text-violet-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Filter size={12} />

                  Filters

                  {activeFilterCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[7px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}

                  <ChevronDown
                    size={11}
                    className={`transition-transform ${
                      filterOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-[350px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="!text-[12px] font-semibold text-slate-700">
                          Table Filters
                        </p>

                        <p className="mt-0.5 !text-[10px] text-slate-400">
                          Refine the surgical schedule
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-[8px] font-semibold text-violet-600 transition hover:text-violet-700"
                      >
                        Clear all
                      </button>
                    </div>

                    <FilterSection
                      label="Doctor"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {doctors
                          .filter(
                            (doctor) =>
                              doctor !==
                              "All Doctors",
                          )
                          .map((doctor) => (
                            <FilterPill
                              key={doctor}
                              label={doctor}
                              active={selectedDoctors.includes(
                                doctor,
                              )}
                              onClick={() =>
                                toggleDoctor(
                                  doctor,
                                )
                              }
                            />
                          ))}
                      </div>
                    </FilterSection>

                    <FilterSection
                      label="Surgery Status"
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {states
                          .filter(
                            (state) =>
                              state !==
                              "All States",
                          )
                          .map((state) => (
                            <FilterPill
                              key={state}
                              label={state}
                              active={selectedStates.includes(
                                state,
                              )}
                              onClick={() =>
                                toggleState(
                                  state,
                                )
                              }
                            />
                          ))}
                      </div>
                    </FilterSection>

                    <FilterSection
                      label="Surgery Date"
                    >
                      <div data-responsive-grid="2" className="grid grid-cols-[1fr_145px] gap-2">
                        <div className="flex h-7 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                          {(
                            [
                              "Day",
                              "Week",
                              "Month",
                            ] as Period[]
                          ).map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setPeriod(
                                  item,
                                );
                                setPage(0);
                              }}
                              className={`h-6 flex-1 rounded-md !text-[10px] font-semibold transition ${
                                period === item
                                  ? "bg-white text-violet-700 shadow-sm"
                                  : "text-slate-400 hover:text-slate-600"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>

                        <ModernSurgeryDatePicker
                          value={
                            selectedDate
                          }
                          onChange={(
                            value,
                          ) => {
                            setSelectedDate(
                              value,
                            );
                            setPage(0);
                          }}
                        />
                      </div>
                    </FilterSection>
                  </div>
                )}
              </div>            </div>
          </div>

          <div data-responsive-table-header="true" className="grid shrink-0 grid-cols-[minmax(160px,1.15fr)_102px_minmax(155px,1fr)_145px_70px_108px_minmax(170px,1.25fr)] items-center border-b border-slate-100 bg-slate-50/80 px-3 py-1.5">
            <SortableHeader
              label="Patient"
              sortKey="patient"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Case #"
              sortKey="caseNumber"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Procedure"
              sortKey="procedures"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Surgeon"
              sortKey="doctor"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="OR"
              sortKey="room"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Status"
              sortKey="status"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <SortableHeader
              label="Note"
              sortKey="note"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
          </div>

          <div data-table-body="true"
            ref={rowsContainerRef}
            className="min-h-0 flex-1 divide-y divide-slate-100 overflow-visible bg-white"
          >
            {filteredSurgeries.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <Search
                    size={20}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-[10px] font-semibold text-slate-600">
                    No surgeries found
                  </p>
                </div>
              </div>
            ) : (
              visibleSurgeries.map(
                (surgery, rowIndex) => {
                  const isReady =
                    surgery.status ===
                    "Ready";

                  const isInProgress =
                    surgery.status ===
                    "In Progress";

                  const highlightedRow =
                    surgery.id ===
                    highlightedRowId;

                  const procedures =
                    getProcedureItems(
                      surgery,
                    );

                  const primaryProcedure =
                    procedures[0] ?? {
                      name:
                        surgery.procedure ||
                        "Procedure",
                      site: undefined,
                    };

                  const extraProcedures =
                    Math.max(
                      procedures.length - 1,
                      0,
                    );

                  return (
                    <button data-responsive-table-row="true"
                      key={surgery.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/surgery/${surgery.id}`,
                        )
                      }
                      className={`group relative grid min-h-[48px] w-full grid-cols-[minmax(160px,1.15fr)_102px_minmax(155px,1fr)_145px_70px_108px_minmax(170px,1.25fr)] items-center px-3 py-1.5 text-left transition-all duration-500 ${
                        highlightedRow
                          ? "z-10 bg-violet-100/80 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35),0_0_20px_rgba(139,92,246,0.24)]"
                          : "bg-white hover:bg-slate-50/70"
                      }`}
                    >
                      <span 
                        className={`absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full ${
                          highlightedRow
                            ? "bg-violet-600 shadow-[0_0_10px_rgba(124,58,237,0.75)]"
                            : "bg-violet-500"
                        }`}
                      />

                      {highlightedRow && (
                        <span className="pointer-events-none absolute inset-0 animate-pulse ring-2 ring-inset ring-violet-300/70" />
                      )}

                      {/* PATIENT */}
                      <div data-cell-label="Patient"  className="flex min-w-0 items-center gap-2">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${
                            highlightedRow
                              ? "bg-violet-600 text-white"
                              : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          {getInitials(
                            surgery.patientName,
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-semibold text-slate-800">
                            {
                              surgery.patientName
                            }
                          </p>

                          <p className="mt-0.5 truncate text-[8.5px] font-medium text-slate-400">
                            {getPatientAge(
                              surgery,
                            )}{" "}
                            yrs ·{" "}
                            {getPatientGender(
                              surgery,
                            )}
                          </p>
                        </div>
                      </div>

                      {/* CASE # */}
                      <span data-cell-label="Case #"  className="truncate text-[10px] font-semibold text-violet-700">
                        {getCaseNumber(
                          surgery,
                        )}
                      </span>

                      {/* PROCEDURE */}
                      <div data-cell-label="Procedure" className="group/procedures relative flex min-w-0 items-center gap-2 pr-2">
                        <div className="flex min-w-0 items-center gap-1">
                          <span className="truncate text-[10px] font-semibold text-slate-700">
                            {
                              primaryProcedure.name
                            }
                          </span>

                          {primaryProcedure.site && (
                            <>
                              <span className="shrink-0 text-[10px] text-slate-300">
                                •
                              </span>

                              <span className="truncate text-[9px] font-medium text-slate-400">
                                {
                                  primaryProcedure.site
                                }
                              </span>
                            </>
                          )}
                        </div>

                        {extraProcedures >
                          0 && (
                          <>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200">
                              +
                              {
                                extraProcedures
                              }
                            </span>

                            <div
                              className={`pointer-events-none invisible absolute left-0 z-50 w-[290px] rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_32px_rgba(15,23,42,0.16)] transition-all duration-150 group-hover/procedures:visible group-hover/procedures:translate-y-0 group-hover/procedures:opacity-100 ${
                                rowIndex >=
                                visibleSurgeries.length -
                                  2
                                  ? "bottom-[calc(100%+7px)] -translate-y-1"
                                  : "top-[calc(100%+7px)] translate-y-1"
                              }`}
                            >
                              <div className="mb-2 flex items-center justify-between gap-2">
                                <div>
                                  <p className="text-[9px] font-bold text-slate-700">
                                    All
                                    Procedures
                                  </p>

                                  <p className="mt-0.5 text-[8px] text-slate-400">
                                    {
                                      getCaseNumber(
                                        surgery,
                                      )
                                    }
                                  </p>
                                </div>

                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500">
                                  {
                                    procedures.length
                                  }
                                </span>
                              </div>

                              <div className="space-y-1">
                                {procedures.map(
                                  (
                                    procedure,
                                    index,
                                  ) => (
                                    <div
                                      key={`${surgery.id}-${procedure.name}-${procedure.site ?? index}`}
                                      className="flex items-center gap-2 rounded-lg bg-slate-50/80 px-2.5 py-1.5"
                                    >
                                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[7px] font-bold text-slate-500">
                                        {index +
                                          1}
                                      </span>

                                      <div className="flex min-w-0 flex-1 items-center gap-1">
                                        <span className="truncate text-[9px] font-semibold text-slate-700">
                                          {
                                            procedure.name
                                          }
                                        </span>

                                        {procedure.site && (
                                          <>
                                            <span className="shrink-0 text-[9px] text-slate-300">
                                              •
                                            </span>

                                            <span className="truncate text-[9px] font-medium text-slate-400">
                                              {
                                                procedure.site
                                              }
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* SURGEON */}
                      <span data-cell-label="Surgeon" className="truncate pr-3 text-[10px] font-medium text-slate-600">
                        {surgery.doctor}
                      </span>

                      {/* OR */}
                      <span data-cell-label="OR" className="truncate text-[10px] font-medium text-slate-500">
                        {surgery.room || "—"}
                      </span>

                      {/* STATUS */}
                      <div data-cell-label="Status" className="min-w-0">
                        <StatusBadge
                          status={
                            surgery.status
                          }
                        />

                        {isInProgress && (
                          <div className="mt-0.5 flex items-center gap-1 text-[7px] font-semibold text-blue-600">
                            <Clock3
                              size={8}
                            />
                            {formatRunningDuration(
                              surgery.surgeryStartedAt,
                            )}
                          </div>
                        )}
                      </div>

                      {/* NOTE */}
                      <div data-cell-label="Note" className="flex min-w-0 items-center justify-between gap-2">
                        <span
                          className="truncate text-[10px] font-medium text-slate-500"
                          title={getSurgeryNote(
                            surgery,
                          )}
                        >
                          {getSurgeryNote(
                            surgery,
                          )}
                        </span>

                        {(isReady ||
                          isInProgress) && (
                          <div className="relative z-10 shrink-0">
                            {isReady ? (
                              <button
                                type="button"
                                aria-label="Start surgery"
                                onClick={(
                                  event,
                                ) =>
                                  startSurgery(
                                    event,
                                    surgery.id,
                                  )
                                }
                                className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                              >
                                <Play
                                  size={10}
                                  fill="currentColor"
                                />
                              </button>
                            ) : (
                              <button
                                type="button"
                                aria-label="Complete surgery"
                                onClick={(
                                  event,
                                ) =>
                                  completeSurgery(
                                    event,
                                    surgery.id,
                                  )
                                }
                                className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                              >
                                <Square
                                  size={9}
                                  fill="currentColor"
                                />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                },
              )
            )}
          </div>

          {sortedSurgeries.length > 0 && (
            <div className="flex h-10 shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3">
              <p className="text-[9px] font-medium text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {page *
                    pageSize +
                    1}
                  –
                  {Math.min(
                    (page + 1) *
                      pageSize,
                    sortedSurgeries.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {
                    sortedSurgeries.length
                  }
                </span>

                <span className="ml-2 text-slate-300">
                  •
                </span>

                <span className="ml-2 font-medium text-slate-400">
                  {pageSize} rows/page
                </span>
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page === 0}
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          0,
                          current - 1,
                        ),
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft
                    size={11}
                  />
                </button>

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index,
                )
                  .slice(
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
                  )
                  .map(
                    (pageIndex) => (
                      <button
                        key={pageIndex}
                        type="button"
                        onClick={() =>
                          setPage(
                            pageIndex,
                          )
                        }
                        className={`flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-[10px] font-semibold transition ${
                          page ===
                          pageIndex
                            ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        }`}
                      >
                        {pageIndex +
                          1}
                      </button>
                    ),
                  )}

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={
                    page >=
                    totalPages - 1
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.min(
                          totalPages - 1,
                          current + 1,
                        ),
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight
                    size={11}
                  />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
