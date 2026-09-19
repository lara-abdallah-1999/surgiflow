import { CalendarDays,Check,ChevronDown,ChevronLeft,ChevronRight,Clock3,Filter,ListChecks,Search,Stethoscope,UserRound,X } from "lucide-react";
import { DrawerInfo,ModernWaitingDatePicker,SurgeryPriority,WaitingFilterPill,WaitingSortableHeader,WaitingStatCard } from "../features/workspaces/WaitingList/components";
import { doctors,priorities } from "../features/workspaces/WaitingList/config";
import { useWaitingListWorkspace } from '../features/workspaces/WaitingList/hooks/useWaitingListWorkspace';
import { getPatientAge,getPatientGender,getPatientMrn,getPatientPhone,getProcedureItems } from "../features/workspaces/WaitingList/utils";


export default function WaitingList() {
  const { surgeries, waitingSurgeries, search, setSearch, filterRef, setFilterOpen, filterOpen, doctor, priority, setDoctor, setPriority, sortKey, sortDirection, handleSort, rowsContainerRef, visibleSurgeries, selectedId, setSelectedId, getInitials, sortedSurgeries, page, pageSize, setPage, totalPages, selectedSurgery, closeModal, selectedDate, setSelectedDate, setSelectedTime, availableTimes, selectedTime, confirmBooking } = useWaitingListWorkspace();

return (
    <div data-workspace-page="WaitingList" className="h-[calc(100vh-72px)] min-h-0 overflow-hidden bg-slate-50 p-2">
      <div className="relative flex h-full min-h-0 flex-col gap-2">
        {/* TOP STATS */}
        <section data-responsive-grid="4" className="grid shrink-0 grid-cols-4 gap-2">
          <WaitingStatCard
            label="Waiting Patients"
            value={
              surgeries.filter(
                (item) =>
                  item.status ===
                  "Today",
              ).length
            }
            icon={<ListChecks size={15} />}
          />

          <WaitingStatCard
            label="Booked"
            value={
              surgeries.filter(
                (item) =>
                  item.status === "Booked",
              ).length
            }
            icon={<CalendarDays size={15} />}
          />

          <WaitingStatCard
            label="Urgent Cases"
            value={
              waitingSurgeries.filter(
                (item) =>
                  item.priority === "Urgent",
              ).length
            }
            icon={<Clock3 size={15} />}
          />

          <WaitingStatCard
            label="Doctors"
            value={
              new Set(
                waitingSurgeries.map(
                  (item) => item.doctor,
                ),
              ).size
            }
            icon={<Stethoscope size={15} />}
          />
        </section>

        {/* WAITING LIST TABLE */}
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div data-page-toolbar="true" className="flex min-h-[58px] shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-4 py-2.5">
            <div className="flex items-center gap-2">


              <div>
                <h2 className="text-[12px] font-semibold text-slate-800">
                  Today's Surgeries List
                </h2>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Review pending cases and book an available surgery slot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-[270px]">
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
                  placeholder="Search patient, case, MRN, number, procedure or surgeon..."
                  className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 !text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-50"
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
                      (current) => !current,
                    )
                  }
                  className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 !text-[11px] font-semibold transition ${
                    filterOpen ||
                    doctor !== "All Doctors" ||
                    priority !== "All"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Filter size={11} />
                  Filters

                  {(doctor !== "All Doctors"
                    ? 1
                    : 0) +
                    (priority !== "All"
                      ? 1
                      : 0) >
                    0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[7px] font-bold text-white">
                      {(doctor !==
                      "All Doctors"
                        ? 1
                        : 0) +
                        (priority !== "All"
                          ? 1
                          : 0)}
                    </span>
                  )}

                  <ChevronDown size={10} />
                </button>

                {filterOpen && (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-40 w-[360px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold text-slate-700">
                          Table Filters
                        </p>
                        <p className="mt-0.5 text-[9px] text-slate-500">
                          Refine today's surgery list
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDoctor(
                            "All Doctors",
                          );
                          setPriority("All");
                        }}
                        className="text-[9px] font-semibold text-rose-600 hover:text-rose-700"
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
                          (item) => (
                            <WaitingFilterPill
                              key={item}
                              label={item}
                              active={
                                doctor === item
                              }
                              onClick={() =>
                                setDoctor(item)
                              }
                            />
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        Priority
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {priorities.map(
                          (item) => (
                            <WaitingFilterPill
                              key={item}
                              label={item}
                              active={
                                priority === item
                              }
                              onClick={() =>
                                setPriority(item)
                              }
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TABLE HEADER */}
          <div data-responsive-table-header="true" className="grid shrink-0 grid-cols-[minmax(155px,1.2fr)_85px_100px_110px_minmax(150px,1fr)_135px_85px_24px] items-center border-b border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <WaitingSortableHeader
              label="Patient"
              sortKey="patient"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <WaitingSortableHeader
              label="Case #"
              sortKey="case"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <WaitingSortableHeader
              label="MRN"
              sortKey="mrn"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <WaitingSortableHeader
              label="Number"
              sortKey="number"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <WaitingSortableHeader
              label="Procedure"
              sortKey="procedure"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <WaitingSortableHeader
              label="Surgeon"
              sortKey="doctor"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <WaitingSortableHeader
              label="Priority"
              sortKey="priority"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <span />
          </div>

          {/* ROWS */}
          <div data-table-body="true"
            ref={rowsContainerRef}
            className="min-h-0 flex-1 overflow-visible"
          >
            {visibleSurgeries.length ===
            0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <UserRound
                    size={20}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-[10px] font-semibold text-slate-600">
                    No waiting patients found
                  </p>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Try changing your search or filters.
                  </p>
                </div>
              </div>
            ) : (
              visibleSurgeries.map(
                (surgery, rowIndex) => {
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

                  const active =
                    surgery.id ===
                    selectedId;

                  return (
                    <button data-responsive-table-row="true"
                      key={surgery.id}
                      type="button"
                      onClick={() =>
                        setSelectedId(
                          surgery.id,
                        )
                      }
                      className={`group relative grid min-h-[48px] w-full grid-cols-[minmax(155px,1.2fr)_85px_100px_110px_minmax(150px,1fr)_135px_85px_24px] items-center border-b border-slate-100 px-3 py-1.5 text-left transition ${
                        active
                          ? "bg-rose-50/55"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <span 
                        className={`absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full ${
                          active
                            ? "bg-rose-700"
                            : "bg-rose-500"
                        }`}
                      />

                      {/* PATIENT */}
                      <div data-cell-label="Patient"  className="flex min-w-0 items-center gap-2">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                            active
                              ? "bg-rose-600 text-white"
                              : "bg-rose-50 text-rose-700"
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

                      {/* CASE */}
                      <span data-cell-label="Case #"  className="truncate text-[10px] font-semibold text-rose-700">
                        {surgery.id}
                      </span>

                      {/* MRN */}
                      <span data-cell-label="MRN"  className="truncate text-[9.5px] font-semibold text-slate-500">
                        {getPatientMrn(
                          surgery,
                        )}
                      </span>

                      {/* NUMBER */}
                      <span data-cell-label="Number" className="truncate text-[9.5px] font-medium text-slate-500">
                        {getPatientPhone(
                          surgery,
                        ) || "—"}
                      </span>

                      {/* PROCEDURE */}
                      <div data-cell-label="Procedure" className="group/procedures relative flex min-w-0 items-center gap-2 pr-2">
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
                                visibleSurgeries.length -
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
                      <div data-cell-label="Surgeon" className="flex min-w-0 items-center gap-1.5">
                        <Stethoscope
                          size={11}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate text-[10px] font-medium text-slate-600">
                          {surgery.doctor}
                        </span>
                      </div>

                      {/* PRIORITY */}
                      <SurgeryPriority
                        priority={
                          surgery.priority
                        }
                      />

                      <ChevronRight
                        size={14}
                        className={
                          active
                            ? "text-amber-500"
                            : "text-slate-300 group-hover:text-amber-500"
                        }
                      />
                    </button>
                  );
                },
              )
            )}
          </div>

          {/* PAGINATION */}
          {sortedSurgeries.length > 0 && (
            <div className="flex h-10 shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3">
              <p className="text-[9px] font-medium text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {page * pageSize + 1}–
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
                  disabled={page === 0}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(
                        0,
                        current - 1,
                      ),
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-35"
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
                          ? "border-rose-500 bg-rose-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  ))}

                <button
                  type="button"
                  disabled={
                    page >=
                    totalPages - 1
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages - 1,
                        current + 1,
                      ),
                    )
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight size={11} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* BOOKING DRAWER */}
        {selectedSurgery && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/15"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeModal();
              }
            }}
          >
            <aside
              className="absolute right-0 top-0 flex h-full w-full max-w-[540px] flex-col border-l border-slate-200 bg-white shadow-[-18px_0_45px_rgba(15,23,42,0.14)]"
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              {/* DRAWER HEADER */}
              <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-rose-50/80 via-white to-white px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-10 w-1 rounded-full bg-rose-600" />

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-700">
                      {getInitials(
                        selectedSurgery.patientName,
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-[13px] font-semibold text-slate-800">
                          Book Surgery
                        </h2>

                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[7.5px] font-bold ${
                            selectedSurgery.status ===
                            "Booked"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {selectedSurgery.status}
                        </span>
                      </div>

                      <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-slate-500">
                        <span className="truncate font-semibold text-slate-600">
                          {
                            selectedSurgery.patientName
                          }
                        </span>

                        <span className="text-slate-300">
                          •
                        </span>

                        <span className="shrink-0">
                          {selectedSurgery.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                    aria-label="Close booking drawer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* DRAWER BODY */}
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-4">
                  {/* PATIENT / CASE SUMMARY */}
                  <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                    <div data-responsive-grid="3" className="grid grid-cols-3 gap-x-4 gap-y-3">
                      <DrawerInfo
                        label="MRN"
                        value={getPatientMrn(
                          selectedSurgery,
                        )}
                      />

                      <DrawerInfo
                        label="Case #"
                        value={selectedSurgery.id}
                      />

                      <DrawerInfo
                        label="Age"
                        value={`${getPatientAge(
                          selectedSurgery,
                        )} yrs`}
                      />

                      <DrawerInfo
                        label="Gender"
                        value={getPatientGender(
                          selectedSurgery,
                        )}
                      />

                      <DrawerInfo
                        label="Surgeon"
                        value={
                          selectedSurgery.doctor
                        }
                      />

                      <DrawerInfo
                        label="Priority"
                        value={
                          selectedSurgery.priority
                        }
                      />

                      <DrawerInfo
                        label="Phone"
                        value={
                          getPatientPhone(
                            selectedSurgery,
                          ) || "—"
                        }
                      />
                    </div>
                  </section>

                  {/* PROCEDURES */}
                  <section>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope
                          size={13}
                          className="text-rose-600"
                        />

                        <p className="text-[10px] font-semibold text-slate-700">
                          Procedure
                        </p>
                      </div>

                      <span className="text-[8px] font-medium text-slate-400">
                        {
                          getProcedureItems(
                            selectedSurgery,
                          ).length
                        }{" "}
                        procedure
                        {getProcedureItems(
                          selectedSurgery,
                        ).length === 1
                          ? ""
                          : "s"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {getProcedureItems(
                        selectedSurgery,
                      ).map(
                        (
                          procedure,
                          index,
                        ) => (
                          <div
                            key={`${procedure.name}-${procedure.site ?? index}`}
                            className="inline-flex min-w-0 items-center overflow-hidden rounded-full border border-rose-100 bg-rose-50/70"
                          >
                            <span className="max-w-[220px] truncate px-2.5 py-1 text-[8.5px] font-semibold text-rose-800">
                              {procedure.name}
                            </span>

                            {procedure.site && (
                              <>
                                <span className="h-3 w-px shrink-0 bg-rose-200" />

                                <span className="max-w-[120px] truncate bg-white/70 px-2 py-1 text-[8px] font-semibold text-slate-500">
                                  {procedure.site}
                                </span>
                              </>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </section>

                  {/* DATE */}
                  <section>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={13}
                          className="text-rose-600"
                        />

                        <span className="text-[10px] font-semibold text-slate-700">
                          Surgery Date
                        </span>
                      </div>

                      <span className="text-[8px] font-medium text-slate-400">
                        Choose from surgeon availability
                      </span>
                    </div>

                    <ModernWaitingDatePicker
                      value={selectedDate}
                      onChange={(value) => {
                        setSelectedDate(
                          value,
                        );
                        setSelectedTime(null);
                      }}
                    />
                  </section>

                  {/* TIME */}
                  <section>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock3
                          size={13}
                          className="text-rose-600"
                        />

                        <span className="text-[10px] font-semibold text-slate-700">
                          Available Time
                        </span>
                      </div>

                      {availableTimes.length >
                        0 && (
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[8px] font-bold text-rose-700">
                          {
                            availableTimes.length
                          }{" "}
                          slots
                        </span>
                      )}
                    </div>

                    {availableTimes.length >
                    0 ? (
                      <div data-responsive-grid="4" className="grid grid-cols-4 gap-2">
                        {availableTimes.map(
                          (time) => {
                            const isSelected =
                              selectedTime ===
                              time;

                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() =>
                                  setSelectedTime(
                                    time,
                                  )
                                }
                                className={`flex h-8 items-center justify-center gap-1.5 rounded-lg border text-[9.5px] font-semibold transition ${
                                  isSelected
                                    ? "border-rose-600 bg-rose-600 text-white shadow-sm"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                                }`}
                              >
                                {isSelected && (
                                  <Check
                                    size={10}
                                  />
                                )}

                                {time}
                              </button>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      <div className="flex min-h-[68px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-600">
                            No available times
                          </p>

                          <p className="mt-1 text-[8px] text-slate-400">
                            Choose another date to view available slots.
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              </div>

              {/* DRAWER FOOTER */}
              <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    {selectedTime ? (
                      <>
                        <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Selected Slot
                        </p>

                        <p className="mt-0.5 truncate text-[9.5px] font-bold text-slate-700">
                          {new Date(
                            `${selectedDate}T00:00:00`,
                          ).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}{" "}
                          · {selectedTime}
                        </p>
                      </>
                    ) : (
                      <p className="text-[8.5px] font-medium text-slate-400">
                        Select an available time to continue.
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex h-8 w-[92px] items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[9.5px] font-semibold text-slate-500 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={!selectedTime}
                      onClick={confirmBooking}
                      className="group inline-flex h-8 min-w-[150px] items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-4 text-[9.5px] font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                    >
                      <CalendarDays
                        size={11}
                      />

                      {selectedSurgery.status ===
                      "Booked"
                        ? "Update Booking"
                        : "Book Surgery"}

                      <ChevronRight
                        size={10}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

      </div>
    </div>
  );
}
