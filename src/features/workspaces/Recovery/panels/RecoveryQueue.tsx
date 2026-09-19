import { ChevronDown,ChevronLeft,ChevronRight,Filter,Search,Stethoscope } from "lucide-react";
import { ModernRecoveryDatePicker,PatientConditionBadge,RecoveryFilterPill,RecoverySortableHeader,RecoveryStatusBadge } from "../components";
import { type Period,type RecoveryState,type RecoveryStatus,type SortDirection,type SortKey } from "../types";
import { formatRecoverySurgeryDate,formatSurgeryDuration,getInitials,getPatientAge,getPatientGender,getSurgeryProcedures } from "../utils";

type Props = {
  search: string;
  setSearch: import("react").Dispatch<import("react").SetStateAction<string>>;
  filterRef: import("react").RefObject<HTMLDivElement | null>;
  setFilterOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  filterOpen: boolean;
  selectedDoctors: string[];
  selectedStatuses: string[];
  selectedDate: string;
  period: Period;
  clearFilters: () => void;
  doctors: string[];
  toggleDoctor: (doctor: string) => void;
  statuses: RecoveryStatus[];
  toggleStatus: (status: string) => void;
  setPeriod: import("react").Dispatch<import("react").SetStateAction<Period>>;
  setSelectedDate: import("react").Dispatch<import("react").SetStateAction<string>>;
  setPage: import("react").Dispatch<import("react").SetStateAction<number>>;
  sortKey: SortKey;
  sortDirection: SortDirection;
  handleSort: (key: SortKey) => void;
  rowsContainerRef: import("react").RefObject<HTMLDivElement | null>;
  visibleCases: import("../../../../types/surgery").Surgery[];
  selectedId: string | null;
  loadRecovery: (id: string) => RecoveryState;
  selectPatient: (id: string) => void;
  sortedCases: import("../../../../types/surgery").Surgery[];
  page: number;
  pageSize: number;
  totalPages: number;
};

export function RecoveryQueue({ search, setSearch, filterRef, setFilterOpen, filterOpen, selectedDoctors, selectedStatuses, selectedDate, period, clearFilters, doctors, toggleDoctor, statuses, toggleStatus, setPeriod, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visibleCases, selectedId, loadRecovery, selectPatient, sortedCases, page, pageSize, totalPages }: Props) {
  return (<section className="flex h-full min-h-0 flex-col overflow-visible rounded-xl border border-slate-200 bg-white">
            {/* LIST HEADER */}
            <div data-page-toolbar="true" className="flex min-h-[58px] shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-4 py-2.5">
              <div>
                <h2 className="text-[12px] font-semibold text-slate-800">
                  Recovery Patients
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Select a patient to open their recovery workspace
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
                    className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 !text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-50"
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
                      selectedDoctors.length > 0 ||
                      selectedStatuses.length > 0 ||
                      Boolean(selectedDate) ||
                      period !== "Day"
                        ? "border-teal-200 bg-teal-50 text-teal-700"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Filter size={12} />
                    Filters

                    {(selectedDoctors.length +
                      selectedStatuses.length +
                      (selectedDate ? 1 : 0) +
                      (period !== "Day"
                        ? 1
                        : 0)) >
                      0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[7px] font-bold text-white">
                        {selectedDoctors.length +
                          selectedStatuses.length +
                          (selectedDate
                            ? 1
                            : 0) +
                          (period !== "Day"
                            ? 1
                            : 0)}
                      </span>
                    )}

                    <ChevronDown size={11} />
                  </button>

                  {filterOpen && (
                    <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-[350px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-700">
                            Table Filters
                          </p>

                          <p className="mt-0.5 text-[9px] text-slate-500">
                            Refine the Recovery patient list
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-[9px] font-semibold text-teal-600 hover:text-teal-700"
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
                              <RecoveryFilterPill
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
                            ),
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          Recovery Status
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {statuses.map(
                            (status) => (
                              <RecoveryFilterPill
                                key={status}
                                label={status}
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
                        <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          Surgery Date
                        </p>

                        <div data-responsive-grid="2" className="grid grid-cols-[1fr_135px] gap-2">
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
                                  key={item}
                                  type="button"
                                  onClick={() =>
                                    setPeriod(
                                      item,
                                    )
                                  }
                                  className={`h-6 flex-1 rounded-md !text-[11px] font-semibold transition ${
                                    period === item
                                      ? "bg-white text-teal-600 shadow-sm"
                                      : "text-slate-400 hover:text-slate-600"
                                  }`}
                                >
                                  {item}
                                </button>
                              ),
                            )}
                          </div>

                          <ModernRecoveryDatePicker
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
            <div data-responsive-table-header="true" className="grid shrink-0 grid-cols-[minmax(165px,1.2fr)_100px_minmax(145px,1fr)_140px_105px_90px_95px_120px_24px] items-center border-b border-slate-100 bg-slate-50/80 px-3 py-2.5">
              <RecoverySortableHeader
                label="Patient"
                sortKey="patient"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <RecoverySortableHeader
                label="Case #"
                sortKey="patientId"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <RecoverySortableHeader
                label="Procedures"
                sortKey="procedures"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <RecoverySortableHeader
                label="Surgeon"
                sortKey="surgeon"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <RecoverySortableHeader
                label="Surgery Date"
                sortKey="date"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <RecoverySortableHeader
                label="Duration"
                sortKey="duration"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <RecoverySortableHeader
                label="Condition"
                sortKey="condition"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <RecoverySortableHeader
                label="Status"
                sortKey="recoveryStatus"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />

              <span />
            </div>

            {/* TABLE ROWS */}
            <div data-table-body="true"
              ref={rowsContainerRef}
              className="min-h-0 flex-1 overflow-visible"
            >
              {visibleCases.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Search size={18} />
                  </div>

                  <p className="text-[12px] font-medium text-slate-600">
                    No recovery patients found
                  </p>

                  <p className="mt-1 max-w-[250px] text-[10px] leading-4 text-slate-400">
                    Try changing your search or filters.
                  </p>
                </div>
              ) : (
                visibleCases.map(
                  (surgery, rowIndex) => {
                    const active =
                      surgery.id ===
                      selectedId;

                    const stored =
                      loadRecovery(
                        surgery.id,
                      );

                    const procedures =
                      getSurgeryProcedures(
                        surgery,
                      );

                    return (
                      <button data-responsive-table-row="true"
                        key={surgery.id}
                        type="button"
                        onClick={() =>
                          selectPatient(
                            surgery.id,
                          )
                        }
                        className={`group relative grid min-h-[48px] w-full grid-cols-[minmax(165px,1.2fr)_100px_minmax(145px,1fr)_140px_105px_90px_95px_120px_24px] items-center border-b border-slate-100 px-3 py-1.5 text-left transition ${
                          active
                            ? "bg-teal-50/60"
                            : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <span 
                          className={`absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full ${
                            active
                              ? "bg-teal-600"
                              : "bg-teal-500"
                          }`}
                        />

                        {/* PATIENT */}
                        <div data-cell-label="Patient"  className="flex min-w-0 items-center gap-2.5">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${
                              active
                                ? "bg-teal-600 text-white"
                                : "bg-teal-50 text-teal-600"
                            }`}
                          >
                            {getInitials(
                              surgery.patientName,
                            )}
                          </div>

                          <div className="min-w-0">
                            <span className="block truncate text-[10px] font-semibold text-slate-800">
                              {surgery.patientName}
                            </span>

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

                        {/* CASE # */}
                        <span data-cell-label="Case #"  className="truncate pr-2 text-[10px] font-semibold text-teal-700">
                          {surgery.id}
                        </span>

                        {/* PROCEDURES */}
                        <div data-cell-label="Procedures"  className="group/procedures relative flex min-w-0 items-center gap-2 pr-2">
                          <div className="flex min-w-0 items-center gap-1">
                            <span className="truncate text-[10px] font-semibold text-slate-700">
                              {procedures[0]?.name ??
                                "Procedure"}
                            </span>

                            {procedures[0]?.site && (
                              <>
                                <span className="shrink-0 text-[10px] text-slate-300">
                                  •
                                </span>
                                <span className="truncate text-[9px] font-medium text-slate-400">
                                  {procedures[0].site}
                                </span>
                              </>
                            )}
                          </div>

                          {procedures.length > 1 && (
                            <>
                              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200">
                                +{procedures.length - 1}
                              </span>

                              <div
                                className={`pointer-events-none invisible absolute left-0 z-50 w-[300px] rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_32px_rgba(15,23,42,0.16)] transition-all duration-150 group-hover/procedures:visible group-hover/procedures:translate-y-0 group-hover/procedures:opacity-100 ${
                                  rowIndex >=
                                  visibleCases.length - 2
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
                                    {procedures.length}
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
                        </div>

                        {/* SURGEON */}
                        <div data-cell-label="Surgeon" className="flex min-w-0 items-center gap-1.5 pr-2">
                          <Stethoscope
                            size={11}
                            className="shrink-0 text-slate-400"
                          />

                          <span className="truncate text-[10px] font-medium text-slate-600">
                            {surgery.doctor}
                          </span>
                        </div>

                        {/* DATE */}
                        <span data-cell-label="Surgery Date" className="truncate text-[10px] font-medium text-slate-500">
                          {formatRecoverySurgeryDate(
                            surgery,
                          )}
                        </span>

                        {/* DURATION */}
                        <span data-cell-label="Duration" className="truncate text-[10px] font-semibold text-slate-600">
                          {formatSurgeryDuration(
                            surgery,
                          )}
                        </span>

                        {/* CONDITION */}
                        <PatientConditionBadge
                          stability={
                            stored.stability
                          }
                        />

                        {/* STATUS */}
                        <RecoveryStatusBadge
                          status={
                            stored.status
                          }
                        />

                        <ChevronRight
                          size={14}
                          className={`transition ${
                            active
                              ? "text-teal-500"
                              : "text-slate-300 group-hover:text-slate-500"
                          }`}
                        />
                      </button>
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
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-35"
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
                            ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
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
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            )}
          </section>);
}
