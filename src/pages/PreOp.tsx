import { Activity,CheckCircle2,ChevronDown,ChevronLeft,ChevronRight,Clock3,Filter,Receipt,Search,Stethoscope,Syringe,UserCheck,X } from "lucide-react";
import { WorkspaceNotification } from '../components/layout/WorkspaceNotification';
import { FilterPill,ModernPreOpDatePicker,ModuleStatCard,PreOpStatusBadge,SortableHeader } from "../features/workspaces/PreOp/components";
import { usePreOpWorkspace } from '../features/workspaces/PreOp/hooks/usePreOpWorkspace';
import { type Period } from "../features/workspaces/PreOp/types";
import { getDoctor,getInitials,getPatientAge,getPatientCode,getPatientGender,getPatientName,getPreOpWorkflowStatus,getProcedures,getSurgeryClock,getSurgeryDate } from "../features/workspaces/PreOp/utils";


export default function PreOp() {
  const { activePreOpCount, readyCasesCount, paidCasesCount, anesthesiaRecordedCount, search, setSearch, filterRef, setFilterOpen, filterOpen, selectedDoctors, selectedStatuses, period, clearFilters, doctors, toggleDoctor, statuses, toggleStatus, setPeriod, selectedDate, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visibleCases, selectedId, highlightedRowId, selectPatient, setAdmitCandidateId, beginPreOp, sortedCases, page, pageSize, totalPages, admitCandidate, confirmAdmission, toast, setToast } = usePreOpWorkspace();

return (
    <div data-workspace-page="PreOp" className="h-[calc(100vh-72px)] min-h-0 overflow-hidden bg-slate-50 p-2">
      <div className="flex h-full min-h-0 flex-col gap-2">
        <section data-responsive-grid="4" className="grid shrink-0 grid-cols-4 gap-2">
          <ModuleStatCard
            label="In Pre-Op"
            value={activePreOpCount}
            icon={<Activity size={15} />}
            tone="blue"
          />
          <ModuleStatCard
            label="Ready"
            value={readyCasesCount}
            icon={<CheckCircle2 size={15} />}
            tone="green"
          />
          <ModuleStatCard
            label="Payment Cleared"
            value={paidCasesCount}
            icon={<Receipt size={15} />}
            tone="indigo"
          />
          <ModuleStatCard
            label="Anesthesia Recorded"
            value={anesthesiaRecordedCount}
            icon={<Syringe size={15} />}
            tone="violet"
          />
        </section>
        {/* PATIENT LIST */}
        <div className="relative min-h-0 flex-1">
          <section className="flex h-full min-h-0 flex-col overflow-visible rounded-xl border border-slate-200 bg-white">
            {/* LIST HEADER */}
            <div data-page-toolbar="true" className="flex min-h-[58px] shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-4 py-2.5">
              <div>
                <h2 className="text-[12px] font-semibold text-slate-800">
                  Pre-Op Patients
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  All surgery patients remain visible; Pre-Op actions are enabled only when the workflow reaches this module
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-[260px]">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Search patient, ID or procedure..."
                    className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 !text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
                  />
                </div>

                <div ref={filterRef} className="relative">
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
                      selectedDoctors.length > 0 ||
                      selectedStatuses.length > 0 ||
                      period !== "Day"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Filter size={12} />
                    Filters

                    {(selectedDoctors.length +
                      selectedStatuses.length +
                      (period !== "Day" ? 1 : 0)) >
                      0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[7px] font-bold text-white">
                        {selectedDoctors.length +
                          selectedStatuses.length +
                          (period !== "Day"
                            ? 1
                            : 0)}
                      </span>
                    )}

                    <ChevronDown
                      size={11}
                    />
                  </button>

                  {filterOpen && (
                    <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-[350px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
                      <div className="mb-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-700">
                            Table Filters
                          </p>

                          <p className="mt-0.5 text-[9px] text-slate-500">
                            Refine the Pre-Op patient list
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={
                            clearFilters
                          }
                          className="text-[8px] font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Clear all
                        </button>
                      </div>

                      <div className="mb-3">
                        <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Doctor
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {doctors.map(
                            (doctor) => (
                              <FilterPill
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
                        <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Status
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {statuses.map(
                            (status) => (
                              <FilterPill
                                key={
                                  status
                                }
                                label={
                                  status
                                }
                                active={selectedStatuses.includes(
                                  status,
                                )}
                                onClick={() =>
                                  toggleStatus(
                                    status,
                                  )
                                }
                              />
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Surgery Date
                        </p>

                        <div data-responsive-grid="2" className="grid grid-cols-[1fr_135px] gap-2">
                          <div className="flex h-7 items-center rounded-lg border text-[11px] border-slate-200 bg-slate-50 p-0.5">
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
                                  className={`h-6 flex-1 rounded-md text-[8px] font-semibold transition ${
                                    period ===
                                    item
                                      ? "bg-white text-blue-600 shadow-sm"
                                      : "text-slate-400 hover:text-slate-600"
                                  }`}
                                >
                                  {
                                    item
                                  }
                                </button>
                              ),
                            )}
                          </div>

                          <ModernPreOpDatePicker
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

            {/* TABLE HEADER */}
            <div data-responsive-table-header="true" className="grid shrink-0 grid-cols-[minmax(150px,1.15fr)_82px_minmax(150px,1.05fr)_135px_112px_82px_110px_116px] items-center border-b border-slate-100 bg-slate-50/80 px-3 py-1.5">
              <SortableHeader
                label="Patient"
                sortKey="patient"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <SortableHeader
                label="Case #"
                sortKey="case"
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
                sortKey="surgeon"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <SortableHeader
                label="Date"
                sortKey="date"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <SortableHeader
                label="Time"
                sortKey="time"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <SortableHeader
                label="Status"
                sortKey="preOpStatus"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <span className="text-right !text-[11px] uppercase tracking-wide text-slate-400">
                Admit
              </span>
            </div>

            {/* TABLE ROWS */}
            <div data-table-body="true"
              ref={rowsContainerRef}
              className="min-h-0 flex-1 divide-y divide-slate-100 overflow-visible bg-white"
            >
              {visibleCases.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Search size={18} />
                  </div>

                  <p className="text-[12px] font-medium text-slate-600">
                    No patients found
                  </p>

                  <p className="mt-1 max-w-[250px] text-[10px] leading-4 text-slate-400">
                    Try changing your search or filters.
                  </p>
                </div>
              ) : (
                visibleCases.map(
                  (surgery, rowIndex) => {
                    const isSelected =
                      surgery.id ===
                      selectedId;

                    const highlightedRow =
                      surgery.id ===
                      highlightedRowId;

                    const name =
                      getPatientName(
                        surgery,
                      );

                    const procedures =
                      getProcedures(
                        surgery,
                      );

                    const doctor =
                      getDoctor(
                        surgery,
                      );

                    const preOpStatus =
                      getPreOpWorkflowStatus(
                        surgery,
                      );

                    const primaryProcedure =
                      procedures[0] ?? {
                        name: "Procedure",
                        site: undefined,
                      };

                    const extraProcedures =
                      Math.max(
                        procedures.length -
                          1,
                        0,
                      );

                    return (
                      <div data-responsive-table-row="true"
                        key={surgery.id}
                        role={
                          surgery.status === "Pre-Op" ||
                          surgery.status === "Ready"
                            ? "button"
                            : undefined
                        }
                        tabIndex={
                          surgery.status === "Pre-Op" ||
                          surgery.status === "Ready"
                            ? 0
                            : -1
                        }
                        onClick={() => {
                          if (
                            surgery.status === "Pre-Op" ||
                            surgery.status === "Ready"
                          ) {
                            selectPatient(surgery.id);
                          }
                        }}
                        onKeyDown={(event) => {
                          if (
                            (event.key === "Enter" ||
                              event.key === " ") &&
                            (surgery.status === "Pre-Op" ||
                              surgery.status === "Ready")
                          ) {
                            event.preventDefault();
                            selectPatient(surgery.id);
                          }
                        }}
                        className={`group relative grid min-h-[48px] w-full grid-cols-[minmax(150px,1.15fr)_82px_minmax(150px,1.05fr)_135px_112px_82px_110px_116px] items-center px-3 py-1.5 text-left transition-all duration-500 ${
                          highlightedRow
                            ? "z-10 bg-blue-100/80 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.35),0_0_20px_rgba(59,130,246,0.24)]"
                            : isSelected
                              ? "bg-blue-50/50"
                              : surgery.status === "Pre-Op" ||
                                  surgery.status === "Ready"
                                ? "cursor-pointer bg-white hover:bg-slate-50/70"
                                : "bg-white"
                        }`}
                      >
                        <span 
                          className={`absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full ${
                            highlightedRow
                              ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.75)]"
                              : "bg-blue-500"
                          }`}
                        />

                        {highlightedRow && (
                          <span className="pointer-events-none absolute inset-0 animate-pulse ring-2 ring-inset ring-blue-300/70" />
                        )}

                        {/* PATIENT */}
                        <div data-cell-label="Patient"  className="flex min-w-0 items-center gap-2">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${
                              isSelected ||
                              highlightedRow
                                ? "bg-blue-600 text-white"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {getInitials(name)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <span className="truncate text-[10px] font-semibold text-slate-800">
                                {name}
                              </span>

                              {surgery.status ===
                                "Financially Cleared" && (
                                <span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-0.5 text-[7px] font-semibold text-amber-700">
                                  Awaiting Admit
                                </span>
                              )}

                              {surgery.status ===
                                "Admitted" && (
                                <span className="shrink-0 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[7px] font-semibold text-indigo-700">
                                  Admitted
                                </span>
                              )}

                              {surgery.status ===
                                "Ready" && (
                                <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-600">
                                  Ready
                                </span>
                              )}
                            </div>

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
                        <span data-cell-label="Case #"  className="truncate text-[10px] font-semibold text-blue-700">
                          {surgery.id}
                        </span>

                        {/* PROCEDURE */}
                        <div data-cell-label="Procedure"  className="group/procedures relative flex min-w-0 items-center gap-2 pr-2">
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
                                  visibleCases.length -
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
                                      Case{" "}
                                      {
                                        surgery.id
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
                        <div data-cell-label="Surgeon" className="flex min-w-0 items-center gap-1.5 pr-2">
                          <Stethoscope
                            size={11}
                            className="shrink-0 text-slate-400"
                          />

                          <span className="truncate text-[10px] font-medium text-slate-600">
                            {doctor}
                          </span>
                        </div>

                        {/* DATE */}
                        <span data-cell-label="Date" className="truncate text-[10px] font-medium text-slate-500">
                          {getSurgeryDate(
                            surgery,
                          )}
                        </span>

                        {/* TIME */}
                        <div data-cell-label="Time" className="flex items-center gap-1.5">
                          <Clock3
                            size={11}
                            className="shrink-0 text-slate-400"
                          />

                          <span className="truncate text-[10px] font-medium text-slate-600">
                            {getSurgeryClock(
                              surgery,
                            )}
                          </span>
                        </div>

                        {/* STATUS */}
                        <PreOpStatusBadge
                          status={
                            preOpStatus
                          }
                        />

                        <div data-cell-label="Admit"
                          className="flex justify-end"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          {surgery.status ===
                          "Financially Cleared" ? (
                            <button
                              type="button"
                              onClick={() =>
                                setAdmitCandidateId(
                                  surgery.id,
                                )
                              }
                              className="h-7 rounded-lg bg-blue-600 px-2.5 !text-[11px] font-semibold text-white transition hover:bg-blue-700"
                            >
                              Admit
                            </button>
                          ) : surgery.status ===
                            "Admitted" ? (
                            <button
                              type="button"
                              onClick={() =>
                                beginPreOp(
                                  surgery.id,
                                )
                              }
                              className="h-7 rounded-lg border border-blue-200 bg-blue-50 px-2.5 !text-[10px] font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                              Start Pre-Op
                            </button>
                          ) : surgery.status === "Pre-Op" ||
                            surgery.status === "Ready" ? (
                            <button
                              type="button"
                              onClick={() =>
                                selectPatient(
                                  surgery.id,
                                )
                              }
                              aria-label={`Open pre-op for ${getPatientName(surgery)}`}
                              title="Open Pre-Op"
                              id={`pre-op-open-${surgery.id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                              <ChevronRight
                                size={16}
                              />
                            </button>
                          ) : (
                            <span
                              className="inline-flex h-7 items-center rounded-lg border border-slate-200 bg-slate-50 px-2 text-[7.5px] font-semibold text-slate-400"
                              title="This patient stays visible here, but Pre-Op actions are not available at the current workflow stage."
                            >
                              View only
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  },
                )
              )}
            </div>

            {/* PAGINATION */}
            {sortedCases.length > 0 && (
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
                      sortedCases.length,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-600">
                    {
                      sortedCases.length
                    }
                  </span>

                  <span className="ml-2 text-slate-300">
                    •
                  </span>

                  <span className="ml-2 font-medium text-slate-400">
                    {pageSize}{" "}
                    rows/page
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
                            current -
                              1,
                          ),
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-35"
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
                          totalPages -
                            4,
                        ),
                      ),
                      Math.max(
                        0,
                        Math.min(
                          page - 1,
                          totalPages -
                            4,
                        ),
                      ) + 4,
                    )
                    .map(
                      (pageIndex) => (
                        <button
                          key={
                            pageIndex
                          }
                          type="button"
                          onClick={() =>
                            setPage(
                              pageIndex,
                            )
                          }
                          className={`flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-[10px] font-semibold transition ${
                            page ===
                            pageIndex
                              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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
                            totalPages -
                              1,
                            current +
                              1,
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
            )}
          </section>

        {/* OR ADMISSION CONFIRMATION */}
        {admitCandidate && (
          <>
            <button
              type="button"
              aria-label="Close admission confirmation"
              onClick={() =>
                setAdmitCandidateId(null)
              }
              className="fixed inset-0 z-[70] bg-slate-900/25"
            />

            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="admit-patient-title"
              className="fixed left-1/2 top-1/2 z-[80] w-[min(440px,calc(100vw-28px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]"
            >
              <div className="flex items-start justify-between border-b border-blue-100 bg-blue-50/60 px-4 py-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <UserCheck size={14} />
                  </div>

                  <div>
                    <h3 id="admit-patient-title" className="text-[13px] font-bold text-slate-800">
                      Admit Patient to OR Section
                    </h3>
                    <p className="mt-0.5 text-[9px] leading-4 text-slate-500">
                      Confirm that the patient has physically entered the surgical area. Pre-Op remains locked until admission is confirmed.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setAdmitCandidateId(null)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="p-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-slate-800">
                        {getPatientName(admitCandidate)}
                      </p>
                      <p className="mt-0.5 text-[9px] text-slate-600">
                        {getPatientCode(admitCandidate)}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[7.5px] font-bold text-emerald-700">
                      Financially Cleared
                    </span>
                  </div>

                  <div data-responsive-grid="3" className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">OR</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-700">
                        {admitCandidate.room}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Time</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-700">
                        {getSurgeryClock(admitCandidate)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-100 bg-white px-2.5 py-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Surgeon</p>
                      <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-700">
                        {getDoctor(admitCandidate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-2">

                  <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50/55 px-3 py-2">
                    <UserCheck size={12} className="shrink-0 text-blue-600" />
                    <span className="text-[10px] font-medium text-blue-800">
                      I confirm this patient is physically inside the OR section
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3">
                <button
                  type="button"
                  onClick={() =>
                    setAdmitCandidateId(null)
                  }
                  className="h-7 rounded-lg border border-slate-200 bg-white px-3 !text-[11px] font-semibold text-slate-500 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmAdmission}
                  className="h-7 rounded-lg bg-blue-600 px-3.5 !text-[11px] font-semibold text-white transition hover:bg-blue-700"
                >
                  Confirm Admission
                </button>
              </div>
            </section>
          </>
        )}

        {/* DRAWER */}
        <WorkspaceNotification notice={toast} onClose={() => setToast(null)} />


        </div>
      </div>
    </div>
  );
}
