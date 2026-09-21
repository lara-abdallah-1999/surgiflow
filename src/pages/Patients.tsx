import { Activity,ChevronDown,ChevronLeft,ChevronRight,Filter,HeartPulse,Search,UserRoundCheck,Users } from "lucide-react";
import { ModernPatientDatePicker,PatientFilterPill,PatientSortableHeader,PatientStat,PatientStatus } from "../features/workspaces/Patients/components";
import { statusOptions } from "../features/workspaces/Patients/config";
import { usePatientsWorkspace } from '../features/workspaces/Patients/hooks/usePatientsWorkspace';
import { type Period } from "../features/workspaces/Patients/types";


export default function Patients() {
  const { totalPatients, activePatients, waitingPatients, dischargedPatients, search, setSearch, filterRef, setFilterOpen, filterOpen, selectedDoctors, selectedStatuses, selectedDate, period, clearFilters, doctors, toggleDoctor, toggleStatus, setPeriod, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visiblePatients, navigate, firstVisible, lastVisible, sortedPatients, pageSize, page, totalPages } = usePatientsWorkspace();

return (
    <div data-workspace-page="Patients" className="h-[calc(100vh-72px)] min-h-0 overflow-hidden bg-slate-50 p-2">
      <div className="flex h-full min-h-0 flex-col gap-2">
        <div data-responsive-grid="4" className="grid shrink-0 grid-cols-4 gap-2">
          <PatientStat
            label="Total Patients"
            value={totalPatients}
            icon={<Users size={15} />}
          />

          <PatientStat
            label="Active Cases"
            value={activePatients}
            icon={<Activity size={15} />}
          />

          <PatientStat
            label="Waiting"
            value={waitingPatients}
            icon={<HeartPulse size={15} />}
          />

          <PatientStat
            label="Discharged"
            value={dischargedPatients}
            icon={<UserRoundCheck size={15} />}
          />
        </div>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-fuchsia-100 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
          <div data-page-toolbar="true" className="flex min-h-[58px] shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-4 py-2.5">
            <div className="flex items-center gap-2">

              <div>
                <h2 className="text-[12px] font-semibold text-slate-800">
                  Patient Directory
                </h2>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Browse and manage registered patients
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
                    setSearch(event.target.value)
                  }
                  placeholder="Search patient, case, MRN, phone or procedure..."
                  className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 !text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-300 focus:bg-white focus:ring-2 focus:ring-fuchsia-50"
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
                    selectedStatuses.length >
                      0 ||
                    Boolean(
                      selectedDate,
                    ) ||
                    period !== "Day"
                      ? "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Filter size={11} />
                  Filters

                  {(selectedDoctors.length +
                    selectedStatuses.length +
                    (selectedDate
                      ? 1
                      : 0) +
                    (period !== "Day"
                      ? 1
                      : 0)) >
                    0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-600 px-1 text-[7px] font-bold text-white">
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
                          Refine the patient directory
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                        className="text-[9px] font-semibold text-fuchsia-600 hover:text-fuchsia-700"
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
                            <PatientFilterPill
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
                        Status
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {statusOptions
                          .filter(
                            (item) =>
                              item !== "All",
                          )
                          .map(
                            (statusItem) => (
                              <PatientFilterPill
                                key={
                                  statusItem
                                }
                                label={
                                  statusItem
                                }
                                active={selectedStatuses.includes(
                                  statusItem,
                                )}
                                onClick={() =>
                                  toggleStatus(
                                    statusItem,
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
                                    ? "bg-white text-fuchsia-600 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                              >
                                {item}
                              </button>
                            ),
                          )}
                        </div>

                        <ModernPatientDatePicker
                          value={selectedDate}
                          onChange={(value) => {
                            setSelectedDate(value);
                            setPage(1);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div data-responsive-table-header="true" className="grid shrink-0 grid-cols-[minmax(165px,1.25fr)_82px_95px_112px_minmax(150px,1.05fr)_130px_96px_76px_24px] items-center border-b border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <PatientSortableHeader
              label="Patient"
              sortKey="patient"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <PatientSortableHeader
              label="Case #"
              sortKey="case"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <PatientSortableHeader
              label="MRN"
              sortKey="mrn"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <PatientSortableHeader
              label="Phone"
              sortKey="phone"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <PatientSortableHeader
              label="Procedure"
              sortKey="procedure"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <PatientSortableHeader
              label="Doctor"
              sortKey="doctor"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <PatientSortableHeader
              label="Date"
              sortKey="date"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <PatientSortableHeader
              label="Status"
              sortKey="status"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />

            <span />
          </div>

          <div data-table-body="true" ref={rowsContainerRef} className="min-h-0 flex-1 overflow-hidden">
            {visiblePatients.map((patient) => (
              <button data-responsive-table-row="true"
                key={patient.id}
                type="button"
                onClick={() => navigate(`/patients/${patient.id}`)}
                className="group relative grid min-h-[48px] w-full grid-cols-[minmax(165px,1.25fr)_82px_95px_112px_minmax(150px,1.05fr)_130px_96px_76px_24px] items-center border-b border-slate-100 bg-white px-3 py-1.5 text-left transition hover:bg-fuchsia-50/45"
              >
                <span  className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full bg-fuchsia-500" />

                <div data-cell-label="Patient"  className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fuchsia-50 text-[10px] font-semibold text-fuchsia-700 ring-1 ring-fuchsia-100">
                    {patient.initials}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-[11px] font-semibold text-slate-700">
                      {patient.name}
                    </div>

                    <div className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400">
                      <span>
                        {patient.age != null ? `${patient.age} yrs` : "—"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>{patient.gender}</span>
                    </div>
                  </div>
                </div>

                <div data-cell-label="Case #"  className="truncate text-[10px] font-semibold text-fuchsia-600">
                  {patient.id}
                </div>

                <div data-cell-label="MRN"  className="truncate text-[10px] font-medium text-slate-500">
                  {patient.mrn}
                </div>

                <div data-cell-label="Phone"  className="truncate pr-2 text-[10px] font-medium text-slate-500">
                  {patient.phone}
                </div>

                <div data-cell-label="Procedure"  className="min-w-0 pr-2">
                  <div className="truncate text-[10px] font-medium text-slate-600">
                    {patient.procedure}
                  </div>
                </div>

                <div data-cell-label="Doctor"  className="truncate pr-2 text-[10px] text-slate-600">
                  {patient.surgeon}
                </div>

                <div data-cell-label="Date"  className="truncate text-[10px] text-slate-500">
                  {patient.surgeryDate}
                </div>

                <div data-cell-label="Status">
                  <PatientStatus status={patient.status} />
                </div>

                <ChevronRight
                  size={13}
                  className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-fuchsia-500"
                />
              </button>
            ))}

            {visiblePatients.length === 0 && (
              <div className="flex h-full min-h-[160px] items-center justify-center">
                <div className="text-center">
                  <div className="text-[10px] font-semibold text-slate-600">
                    No patients found
                  </div>
                  <div className="mt-1 text-[8.5px] text-slate-400">
                    Try changing your search or filters.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex min-h-[48px] shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/30 px-3">
            <div className="flex items-center gap-2 text-[9px] text-slate-400">
              <span>
                Showing{" "}
                <span className="font-semibold text-slate-500">
                  {firstVisible}–{lastVisible}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-500">
                  {sortedPatients.length}
                </span>
              </span>
              <span className="text-slate-300">•</span>
              <span>{pageSize} rows/page</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={13} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[9px] font-semibold transition ${
                    page === pageNumber
                      ? "border-fuchsia-500 bg-fuchsia-500 text-white shadow-sm shadow-fuchsia-200"
                      : "border-slate-200 bg-white text-slate-600 hover:border-fuchsia-200 hover:text-fuchsia-600"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1),
                  )
                }
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
