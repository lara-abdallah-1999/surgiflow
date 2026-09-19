import { CalendarDays,ChevronDown,ChevronLeft,ChevronRight,ClipboardCheck,Filter,FlaskConical,HeartPulse,Pill,Search,Stethoscope } from "lucide-react";
import { WorkspaceNotification } from '../components/layout/WorkspaceNotification';
import { ConditionBadge,ModernPostOpDatePicker,PostOpFilterPill,PostOpSortableHeader,PostOpStatCard } from "../features/workspaces/PostOp/components";
import { usePostOpWorkspace } from '../features/workspaces/PostOp/hooks/usePostOpWorkspace';
import { type PatientCondition,type Period } from "../features/workspaces/PostOp/types";
import { formatPostOpSurgeryDate,getInitials,getPatientAge,getPatientGender,getProcedureItems,hasReachedPostOp,loadPostOp } from "../features/workspaces/PostOp/utils";


export default function PostOp() {
  const { reachedPostOpCount, activeMedicationCount, pendingOrderCount, upcomingVisitCount, search, setSearch, filterRef, setFilterOpen, filterOpen, selectedDoctors, selectedConditions, selectedDate, period, clearFilters, doctors, toggleDoctor, toggleCondition, setPeriod, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visibleCases, selectedId, selectPatient, sortedCases, page, pageSize, totalPages, toast, setToast } = usePostOpWorkspace();

return (
    <div data-workspace-page="PostOp" className="h-[calc(100vh-72px)] min-h-0 overflow-hidden bg-slate-50 p-2">
      <div className="relative flex h-full min-h-0 flex-col gap-2">
        {/* ================================================================ */}
        {/* TOP STATS                                                        */}
        {/* ================================================================ */}

        <section data-responsive-grid="4" className="grid shrink-0 grid-cols-4 gap-2">
          <PostOpStatCard
            label="Post-Op Patients"
            value={reachedPostOpCount}
            icon={
              <HeartPulse size={15} />
            }
            tone="cyan"
          />

          <PostOpStatCard
            label="Active Medications"
            value={activeMedicationCount}
            icon={<Pill size={15} />}
            tone="blue"
          />

          <PostOpStatCard
            label="Pending Follow-Ups"
            value={pendingOrderCount}
            icon={
              <FlaskConical
                size={15}
              />
            }
            tone="amber"
          />

          <PostOpStatCard
            label="Upcoming Visits"
            value={upcomingVisitCount}
            icon={
              <CalendarDays
                size={15}
              />
            }
            tone="violet"
          />
        </section>

        {/* ================================================================ */}
        {/* TABLE                                                            */}
        {/* ================================================================ */}

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div data-page-toolbar="true" className="flex min-h-[58px] shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                <HeartPulse size={13} />
              </div>

              <div>
                <h2 className="text-[12px] font-semibold text-slate-800">
                  Post-Operative Follow-Up
                </h2>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Medications, requested investigations, and post-op visits
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-[260px]">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search patient, ID, procedure or surgeon..."
                  className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 !text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-50"
                />
              </div>

              <div
                ref={filterRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() =>
                    setFilterOpen(
                      (current) =>
                        !current,
                    )
                  }
                  className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 !text-[11px] font-semibold transition ${
                    filterOpen ||
                    selectedDoctors.length >
                      0 ||
                    selectedConditions.length >
                      0 ||
                    Boolean(
                      selectedDate,
                    ) ||
                    period !== "Day"
                      ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Filter size={11} />
                  Filters

                  {(selectedDoctors.length +
                    selectedConditions.length +
                    (selectedDate
                      ? 1
                      : 0) +
                    (period !== "Day"
                      ? 1
                      : 0)) >
                    0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-600 px-1 text-[7px] font-bold text-white">
                      {selectedDoctors.length +
                        selectedConditions.length +
                        (selectedDate
                          ? 1
                          : 0) +
                        (period !== "Day"
                          ? 1
                          : 0)}
                    </span>
                  )}

                  <ChevronDown
                    size={10}
                  />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-[360px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="!text-[11px] font-semibold text-slate-700">
                          Table Filters
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-500">
                          Refine the Post-Op patient list
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                        className="text-[9px] font-semibold text-cyan-600 hover:text-cyan-700"
                      >
                        Clear all
                      </button>
                    </div>

                    <div className="mb-3">
                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Doctor
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {doctors.map(
                          (doctor) => (
                            <PostOpFilterPill
                              key={
                                doctor
                              }
                              label={
                                doctor
                              }
                              active={selectedDoctors.includes(
                                doctor,
                              )}
                              onClick={() =>
                                toggleDoctor(
                                  doctor,
                                )
                              }
                            />
                          ),
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Condition
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {(
                          [
                            "Improving",
                            "Stable",
                            "Needs Attention",
                          ] as PatientCondition[]
                        ).map(
                          (
                            condition,
                          ) => (
                            <PostOpFilterPill
                              key={
                                condition
                              }
                              label={
                                condition
                              }
                              active={selectedConditions.includes(
                                condition,
                              )}
                              onClick={() =>
                                toggleCondition(
                                  condition,
                                )
                              }
                            />
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Surgery Date
                      </p>

                      <div data-responsive-grid="2" className="grid grid-cols-[1fr_138px] gap-2">
                        <div className="flex h-7 items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                          {(
                            [
                              "Day",
                              "Week",
                              "Month",
                            ] as Period[]
                          ).map(
                            (item) => (
                              <button
                                key={
                                  item
                                }
                                type="button"
                                onClick={() =>
                                  setPeriod(
                                    item,
                                  )
                                }
                                className={`h-6 flex-1 rounded-md !text-[11px] font-semibold transition ${
                                  period ===
                                  item
                                    ? "bg-white text-cyan-600 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                              >
                                {item}
                              </button>
                            ),
                          )}
                        </div>

                        <ModernPostOpDatePicker
                            value={selectedDate}
                            onChange={(value) => {
                              setSelectedDate(value);
                              setPage(0);
                            }}
                          />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div data-responsive-table-header="true" className="grid shrink-0 grid-cols-[minmax(165px,1.25fr)_100px_minmax(150px,1fr)_140px_105px_110px_105px_24px] items-center border-b border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <PostOpSortableHeader
              label="Patient"
              sortKey="patient"
              activeKey={sortKey}
              direction={
                sortDirection
              }
              onSort={
                handleSort
              }
            />

            <PostOpSortableHeader
              label="Case #"
              sortKey="patientId"
              activeKey={sortKey}
              direction={
                sortDirection
              }
              onSort={
                handleSort
              }
            />

            <PostOpSortableHeader
              label="Procedures"
              sortKey="procedures"
              activeKey={sortKey}
              direction={
                sortDirection
              }
              onSort={
                handleSort
              }
            />

            <PostOpSortableHeader
              label="Surgeon"
              sortKey="surgeon"
              activeKey={sortKey}
              direction={
                sortDirection
              }
              onSort={
                handleSort
              }
            />

            <PostOpSortableHeader
              label="Surgery Date"
              sortKey="date"
              activeKey={sortKey}
              direction={
                sortDirection
              }
              onSort={
                handleSort
              }
            />

            <PostOpSortableHeader
              label="Condition"
              sortKey="condition"
              activeKey={sortKey}
              direction={
                sortDirection
              }
              onSort={
                handleSort
              }
            />

            <PostOpSortableHeader
              label="Follow-Up"
              sortKey="followUp"
              activeKey={sortKey}
              direction={
                sortDirection
              }
              onSort={
                handleSort
              }
            />

            <span />
          </div>

          <div data-table-body="true"
            ref={rowsContainerRef}
            className="min-h-0 flex-1 overflow-visible"
          >
            {visibleCases.length ===
            0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <HeartPulse
                    size={20}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-[10px] font-semibold text-slate-600">
                    No patients found
                  </p>
                </div>
              </div>
            ) : (
              visibleCases.map(
                (surgery, rowIndex) => {
                  const active =
                    surgery.id ===
                    selectedId;

                  const stored =
                    loadPostOp(
                      surgery.id,
                    );

                  const reachedPostOp =
                    hasReachedPostOp(
                      surgery,
                    );

                  const pending =
                    reachedPostOp
                      ? stored.followUps.filter(
                          (item) =>
                            item.status !==
                            "Completed",
                        ).length
                      : 0;

                  return (
                    <button data-responsive-table-row="true"
                      key={surgery.id}
                      type="button"
                      disabled={!reachedPostOp}
                      onClick={() => {
                        if (
                          reachedPostOp
                        ) {
                          selectPatient(
                            surgery.id,
                          );
                        }
                      }}
                      title={
                        reachedPostOp
                          ? "Open Post-Op"
                          : "Post-Op has not started for this patient yet."
                      }
                      className={`group relative grid min-h-[48px] w-full grid-cols-[minmax(165px,1.25fr)_100px_minmax(150px,1fr)_140px_105px_110px_105px_24px] items-center border-b border-slate-100 px-3 py-1.5 text-left transition ${
                        active
                          ? "bg-cyan-50/55"
                          : reachedPostOp
                            ? "bg-white hover:bg-slate-50"
                            : "cursor-default bg-slate-50/45 opacity-75"
                      }`}
                    >
                      <span 
                        className={`absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full ${
                          active
                            ? "bg-cyan-600"
                            : "bg-cyan-500"
                        }`}
                      />

                      <div data-cell-label="Patient"  className="flex min-w-0 items-center gap-2">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                            active
                              ? "bg-cyan-600 text-white"
                              : "bg-cyan-50 text-cyan-600"
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
                            )} yrs ·{" "}
                            {getPatientGender(
                              surgery,
                            )}
                          </p>
                        </div>
                      </div>

                      <span data-cell-label="Case #"  className="truncate text-[10px] font-semibold text-cyan-700">
                        {surgery.id}
                      </span>

                      <div data-cell-label="Procedures"  className="group/procedures relative flex min-w-0 items-center gap-2 pr-2">
                        {(() => {
                          const procedures =
                            getProcedureItems(
                              surgery,
                            );

                          const primary =
                            procedures[0] ?? {
                              name:
                                surgery.procedure ||
                                "Procedure",
                              site: undefined,
                            };

                          const extra = Math.max(
                            procedures.length - 1,
                            0,
                          );

                          return (
                            <>
                              <div className="flex min-w-0 items-center gap-1">
                                <span className="truncate text-[10px] font-semibold text-slate-700">
                                  {primary.name}
                                </span>

                                {primary.site && (
                                  <>
                                    <span className="shrink-0 text-[10px] text-slate-300">
                                      •
                                    </span>

                                    <span className="truncate text-[9px] font-medium text-slate-400">
                                      {primary.site}
                                    </span>
                                  </>
                                )}
                              </div>

                              {extra > 0 && (
                                <>
                                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200">
                                    +{extra}
                                  </span>

                                  <div
                                    className={`pointer-events-none invisible absolute left-0 z-50 w-[300px] rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_32px_rgba(15,23,42,0.16)] transition-all duration-150 group-hover/procedures:visible group-hover/procedures:translate-y-0 group-hover/procedures:opacity-100 ${
                                      rowIndex >=
                                      visibleCases.length -
                                        2
                                        ? "bottom-[calc(100%+7px)] -translate-y-1"
                                        : "top-[calc(100%+7px)] translate-y-1"
                                    }`}
                                  >
                                    <div className="mb-2 flex items-center justify-between">
                                      <div>
                                        <p className="text-[9px] font-bold text-slate-700">
                                          All Procedures
                                        </p>

                                        <p className="mt-0.5 text-[8px] text-slate-400">
                                          {surgery.id}
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
                                              {index + 1}
                                            </span>

                                            <div className="flex min-w-0 flex-1 items-center gap-1">
                                              <span className="truncate text-[9px] font-semibold text-slate-700">
                                                {procedure.name}
                                              </span>

                                              {procedure.site && (
                                                <>
                                                  <span className="shrink-0 text-[9px] text-slate-300">
                                                    •
                                                  </span>

                                                  <span className="truncate text-[9px] font-medium text-slate-400">
                                                    {procedure.site}
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
                            </>
                          );
                        })()}
                      </div>

                      <div data-cell-label="Surgeon"  className="flex min-w-0 items-center gap-1.5">
                        <Stethoscope
                          size={11}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate text-[10px] font-medium text-slate-600">
                          {
                            surgery.doctor
                          }
                        </span>
                      </div>

                      <span data-cell-label="Surgery Date"  className="truncate text-[10px] font-medium text-slate-500">
                        {formatPostOpSurgeryDate(
                          surgery,
                        )}
                      </span>

                      {reachedPostOp ? (
                        <ConditionBadge
                          condition={
                            stored.condition
                          }
                        />
                      ) : (
                        <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-semibold text-slate-400">
                          Not Started
                        </span>
                      )}

                      {reachedPostOp ? (
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[8px] font-semibold text-slate-600">
                          <ClipboardCheck
                            size={9}
                          />
                          {pending} pending
                        </span>
                      ) : (
                        <span className="text-[8px] font-semibold text-slate-300">
                          —
                        </span>
                      )}

                      <ChevronRight
                        size={14}
                        className={
                          reachedPostOp
                            ? active
                              ? "text-cyan-500"
                              : "text-slate-300 group-hover:text-cyan-500"
                            : "text-slate-200"
                        }
                      />
                    </button>
                  );
                },
              )
            )}
          </div>

          {sortedCases.length > 0 && (
            <div className="flex h-10 shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3">
              <p className="text-[9px] font-medium text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {page * pageSize + 1}–
                  {Math.min(
                    (page + 1) * pageSize,
                    sortedCases.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {sortedCases.length}
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
                    setPage((current) =>
                      Math.max(
                        0,
                        current - 1,
                      ),
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft size={11} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index,
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
                  .map((pageIndex) => (
                    <button
                      key={pageIndex}
                      type="button"
                      onClick={() =>
                        setPage(pageIndex)
                      }
                      className={`flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-[10px] font-semibold transition ${
                        page === pageIndex
                          ? "border-cyan-600 bg-cyan-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  ))}

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={
                    page >= totalPages - 1
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages - 1,
                        current + 1,
                      ),
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight size={11} />
                </button>
              </div>
            </div>
          )}
        </section>

        <WorkspaceNotification notice={toast} onClose={() => setToast(null)} />


      </div>
    </div>
  );
}
