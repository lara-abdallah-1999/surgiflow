import { AlertTriangle,ArrowLeft,CalendarDays,CheckCircle2,ChevronDown,ChevronLeft,ChevronRight,Clock3,Filter,IdCard,Search,ShieldCheck,Stethoscope,UserCheck } from "lucide-react";
import { ChecklistRow,ReceptionCompletedPanel,ReceptionDatePicker,SortHeader,StatusBadge,SummaryCard,WorkflowStep } from "../features/workspaces/ReceptionDetails/components";
import { checklistItems,PAGE_SIZE } from "../features/workspaces/ReceptionDetails/config";
import { useReceptionDetailsWorkspace } from '../features/workspaces/ReceptionDetails/hooks/useReceptionDetailsWorkspace';
import { ReceptionAdmissionForm } from '../features/workspaces/ReceptionDetails/panels/ReceptionAdmissionForm';
import { ReceptionPrintCenter } from '../features/workspaces/ReceptionDetails/panels/ReceptionPrintCenter';
import { type Period } from "../features/workspaces/ReceptionDetails/types";
import { formatSurgeryDate,getInitials } from "../features/workspaces/ReceptionDetails/utils";


export default function ReceptionDetails() {
  const { selectedPatient, navigate, workflowActiveStep, arrivalCompleted, eligibilityCompleted, cashierCompleted, expectedCount, arrivedCount, readyCount, holdCount, search, setSearch, setPage, setFilterOpen, selectedDoctors, selectedStatuses, filterOpen, clearTableFilters, availableDoctors, toggleDoctorFilter, availableStatuses, toggleStatusFilter, setPeriod, period, selectedDate, setSelectedDate, sortKey, sortDirection, handleSort, paginatedPatients, selectedId, selectPatient, highlightSurgeryId, filteredPatients, page, totalPages, markPatientArrived, allChecked, completedCount, checkedItems, setCheckedItems, isMissingHighlighted, allAdmissionFormsComplete, completedAdmissionForms, requiredAdmissionForms, getConsentDetails, updateConsentField, consentApproval, setConsentApprovalField, setShowPrintCenter, selectedSurgery, sendToCashier, setReceptionStatus, setShowHoldModal, approvalReady, completeReception, receptionReady, showPrintCenter, showHoldModal, holdReason, setHoldReason, holdPatient } = useReceptionDetailsWorkspace();

if (!selectedPatient) {
    return (
      <div className="flex h-[calc(100vh-58px)] items-center justify-center bg-slate-50/60 p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <IdCard size={18} />
          </div>
          <h2 className="mt-3 text-[13px] font-bold text-slate-800">Reception case not found</h2>
          <p className="mt-1 text-[9px] text-slate-400">This patient is not available in the current Reception queue.</p>
          <button
            type="button"
            onClick={() => navigate("/reception")}
            className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-500 px-3 text-[9px] font-bold text-white hover:bg-amber-600"
          >
            <ArrowLeft size={12} />
            Back to Reception
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-workspace-page="ReceptionDetails" className="flex h-[calc(100vh-58px)] min-h-0 flex-col gap-2 overflow-hidden bg-slate-50/60 p-2">
      {/* Header */}
      <section className="hidden">
        {/* Workflow */}
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center">
              <WorkflowStep
                number={1}
                label="Confirm Arrival"
                active={workflowActiveStep === 1}
                completed={arrivalCompleted}
              />

              <div className={`mx-3 h-px w-12 ${arrivalCompleted ? "bg-amber-300" : "bg-slate-200"}`} />

              <WorkflowStep
                number={2}
                label="Eligibility & Documents"
                active={workflowActiveStep === 2}
                completed={eligibilityCompleted}
              />

              <div className={`mx-3 h-px w-12 ${eligibilityCompleted ? "bg-amber-300" : "bg-slate-200"}`} />

              <WorkflowStep
                number={3}
                label="Send to Cashier"
                active={workflowActiveStep === 3}
                completed={cashierCompleted}
              />
            </div>

            <div className="flex shrink-0 items-center gap-2 text-[9px] text-slate-400">
              <CalendarDays size={13} />
              <span>Monday, September 7, 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <div className="hidden">
        <div data-responsive-grid="4" className="grid grid-cols-4 gap-2">
          <SummaryCard
            label="Expected Today"
            value={expectedCount}
            icon={CalendarDays}
            tone="orange"
          />

          <SummaryCard
            label="Arrived"
            value={arrivedCount}
            icon={UserCheck}
            tone="orange"
          />

          <SummaryCard
            label="Ready for Admission"
            value={readyCount}
            icon={CheckCircle2}
            tone="orange"
          />

          <SummaryCard
            label="On Hold"
            value={holdCount}
            icon={AlertTriangle}
            tone="orange"
          />
        </div>
      </div>

      {/* Main */}
      <div className="flex min-h-0 flex-1">
        {/* Patient Queue lives on the Reception list page */}
        <div className="hidden">
          {/* Queue Header */}
          <div className="shrink-0 border-b border-slate-100 px-3 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[11px] font-semibold text-slate-700">
                  Surgery Reception Queue
                </h2>
                <p className="mt-0.5 text-[9px] text-slate-400">
                  Patients scheduled for surgery
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
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
                    placeholder="Search name, MRN or procedure..."
                    className="h-7 w-[270px] rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 !text-[11px] font-medium text-slate-600 outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:bg-white focus:ring-1 focus:ring-amber-100"
                  />
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen((value) => !value)}
                    className={`flex h-7 items-center gap-1.5 rounded-md border px-2.5 !text-[11px] font-semibold transition ${
                      selectedDoctors.length > 0 || selectedStatuses.length > 0
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Filter size={12} />
                    Filters
                    <ChevronDown size={11} />
                  </button>

                  {filterOpen && (
                    <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-[310px] rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.14)]">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-700">
                            Reception Filters
                          </p>
                          <p className="mt-0.5 text-[8px] text-slate-400">
                            Filter by doctor, status and date range
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={clearTableFilters}
                          className="text-[8px] font-semibold text-amber-700 hover:underline"
                        >
                          Clear all
                        </button>
                      </div>

                      <div>
                        <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Doctor
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {availableDoctors.map((doctor) => {
                            const active = selectedDoctors.includes(doctor);
                            return (
                              <button
                                key={doctor}
                                type="button"
                                onClick={() => toggleDoctorFilter(doctor)}
                                className={`rounded-md border px-2 py-1 !text-[10px] font-semibold transition ${
                                  active
                                    ? "border-amber-200 bg-amber-50 text-amber-700"
                                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {doctor}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Status
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {availableStatuses.map((status) => {
                            const active = selectedStatuses.includes(status);
                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => toggleStatusFilter(status)}
                                className={`rounded-md border px-2 py-1 !text-[10px] font-semibold transition ${
                                  active
                                    ? "border-amber-200 bg-amber-50 text-amber-700"
                                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                          Date
                        </p>

                        <div className="flex items-center gap-2">
                          <div className="flex h-8 items-center rounded-md border border-slate-200 bg-slate-50 p-0.5">
                            {(["Day", "Week", "Month"] as Period[]).map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setPeriod(item);
                                  setPage(0);
                                }}
                                className={`h-7 rounded-[5px] px-2 !text-[10px] font-semibold transition ${
                                  period === item
                                    ? "bg-white text-amber-700 shadow-sm"
                                    : "text-slate-500"
                                }`}
                              >
                                {item}
                              </button>
                            ))}
                          </div>

                          <ReceptionDatePicker
                            value={selectedDate}
                            onChange={(date) => {
                              setSelectedDate(date);
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
          </div>

          {/* Table Header - Dashboard style */}
          <div data-responsive-table-header="true" className="grid shrink-0 grid-cols-[minmax(150px,1.25fr)_86px_94px_minmax(170px,1.35fr)_135px_105px_76px_128px] items-center border-b border-slate-100 bg-slate-50/80 px-3 py-1.5">
            <SortHeader
              label="Patient"
              sortKey="name"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortHeader
              label="Case #"
              sortKey="case"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortHeader
              label="MRN"
              sortKey="mrn"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortHeader
              label="Procedure"
              sortKey="procedures"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortHeader
              label="Surgeon"
              sortKey="surgeon"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortHeader
              label="Date"
              sortKey="date"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortHeader
              label="Time"
              sortKey="time"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortHeader
              label="Status"
              sortKey="status"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
          </div>

          {/* Table Rows - same visual language as Dashboard */}
          <div className="min-h-0 flex-1 divide-y divide-slate-100 bg-white">
            {paginatedPatients.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <Search size={18} className="mx-auto text-slate-300" />
                  <p className="mt-2 text-[10px] font-semibold text-slate-600">
                    No reception patients found
                  </p>
                  <p className="mt-1 text-[8px] text-slate-400">
                    Try changing your search or filters.
                  </p>
                </div>
              </div>
            ) : (
              paginatedPatients.map((patient, rowIndex) => {
                const selected = patient.id === selectedId;
                const primaryProcedure =
                  patient.procedures[0] ?? {
                    name: patient.procedure,
                    site: undefined,
                  };
                const extraProcedures = Math.max(
                  patient.procedures.length - 1,
                  0,
                );

                return (
                  <button data-responsive-table-row="true"
                    key={patient.id}
                    type="button"
                    onClick={() => selectPatient(patient)}
                    className={`group relative grid min-h-[48px] w-full grid-cols-[minmax(150px,1.25fr)_86px_94px_minmax(170px,1.35fr)_135px_105px_76px_128px] items-center px-3 py-1.5 text-left transition-all duration-300 ${
                      patient.id === highlightSurgeryId
                        ? "z-10 bg-amber-50/70 ring-1 ring-inset ring-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.18)]"
                        : selected
                          ? "bg-amber-50/45"
                          : "bg-white hover:bg-slate-50/70"
                    }`}
                  >
                    <span  className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full bg-amber-500" />

                    {/* Patient */}
                    <div data-cell-label="Patient"  className="flex min-w-0 items-center gap-2">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                          selected
                            ? "bg-amber-500 text-white"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {getInitials(patient.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-semibold text-slate-800">
                          {patient.name}
                        </p>
                        <p className="mt-0.5 truncate text-[8.5px] font-medium text-slate-400">
                          {patient.age} yrs · {patient.gender}
                        </p>
                      </div>
                    </div>

                    {/* Case Number */}
                    <span data-cell-label="Case #"  className="truncate text-[10px] font-semibold text-amber-700">
                      {patient.id}
                    </span>

                    {/* MRN */}
                    <span data-cell-label="MRN"  className="truncate text-[10px] font-medium text-slate-500">
                      {patient.mrn}
                    </span>

                    {/* Procedure */}
                    <div data-cell-label="Procedure" className="group/procedures relative flex min-w-0 items-center gap-2 pr-3">
                      <div className="flex min-w-0 items-center gap-1">
                        <span className="truncate text-[10px] font-semibold text-slate-700">
                          {primaryProcedure.name}
                        </span>

                        {primaryProcedure.site && (
                          <>
                            <span className="shrink-0 text-[10px] text-slate-300">
                              •
                            </span>
                            <span className="truncate text-[9px] font-medium text-slate-400">
                              {primaryProcedure.site}
                            </span>
                          </>
                        )}
                      </div>

                      {extraProcedures > 0 && (
                        <>
                          <span className="shrink-0 cursor-default rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200">
                            +{extraProcedures}
                          </span>

                          <div
                            className={`pointer-events-none invisible absolute left-0 z-50 w-[290px] rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_32px_rgba(15,23,42,0.16)] transition-all duration-150 group-hover/procedures:visible group-hover/procedures:translate-y-0 group-hover/procedures:opacity-100 ${
                              rowIndex >= paginatedPatients.length - 2
                                ? "bottom-[calc(100%+7px)] -translate-y-1"
                                : "top-[calc(100%+7px)] translate-y-1"
                            }`}
                          >
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <div>
                                <p className="text-[9px] font-bold text-slate-700">
                                  All Procedures
                                </p>
                                <p className="mt-0.5 text-[8px] text-slate-400">
                                  Case {patient.id}
                                </p>
                              </div>

                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-500">
                                {patient.procedures.length}
                              </span>
                            </div>

                            <div className="space-y-1">
                              {patient.procedures.map((procedure, index) => (
                                <div
                                  key={`${patient.id}-hover-${procedure.name}-${procedure.site ?? index}`}
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
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Surgeon */}
                    <div data-cell-label="Surgeon" className="flex min-w-0 items-center gap-1.5 pr-3">
                      <Stethoscope size={11} className="shrink-0 text-slate-400" />
                      <span className="truncate text-[10px] font-medium text-slate-700">
                        {patient.surgeon}
                      </span>
                    </div>

                    {/* Date */}
                    <div data-cell-label="Date" className="flex min-w-0 items-center gap-1.5">
                      <CalendarDays size={11} className="shrink-0 text-slate-400" />
                      <span className="truncate text-[10px] font-medium text-slate-600">
                        {formatSurgeryDate(patient.date)}
                      </span>
                    </div>

                    {/* Time */}
                    <div data-cell-label="Time" className="flex items-center gap-1.5">
                      <Clock3 size={11} className="shrink-0 text-slate-400" />
                      <span className="text-[10.5px] font-semibold text-slate-800">
                        {patient.time}
                      </span>
                    </div>

                    {/* Status */}
                    <div data-cell-label="Status" className="flex min-w-0 items-center justify-between gap-2">
                      <StatusBadge status={patient.status} />
                      <ChevronRight
                        size={12}
                        className={`shrink-0 transition group-hover:translate-x-0.5 ${
                          selected ? "text-amber-500" : "text-slate-300"
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Pagination - Dashboard style */}
          {filteredPatients.length > 0 && (
            <div className="flex h-10 shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3">
              <p className="text-[9px] font-medium text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {page * PAGE_SIZE + 1}–{Math.min(
                    (page + 1) * PAGE_SIZE,
                    filteredPatients.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {filteredPatients.length}
                </span>
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page === 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft size={11} />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index)
                  .slice(
                    Math.max(0, Math.min(page - 1, totalPages - 4)),
                    Math.max(0, Math.min(page - 1, totalPages - 4)) + 4,
                  )
                  .map((pageIndex) => (
                    <button
                      key={pageIndex}
                      type="button"
                      onClick={() => setPage(pageIndex)}
                      className={`flex h-7 min-w-7 items-center justify-center rounded-md border px-2 text-[10px] font-semibold transition ${
                        page === pageIndex
                          ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  ))}

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page >= totalPages - 1}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages - 1, current + 1))
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight size={11} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Patient Reception Drawer */}
        {selectedPatient && (
          <>
            <div className="hidden" />

            <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/45 shadow-[0_4px_18px_rgba(15,23,42,0.05)]">

              {/* STEP-SPECIFIC CONTENT — never scrolls */}
              <div className="min-h-0 flex-1 overflow-hidden p-2">
                {selectedPatient.status === "Expected" && (
                  <div className="flex h-full items-center justify-center">
                    <section className="w-full max-w-[610px] overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                      <div className="flex items-center gap-3 border-b border-amber-100 bg-gradient-to-r from-amber-50/85 to-white px-4 py-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                          <UserCheck size={19} />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[12px] font-bold text-slate-800">
                            Confirm patient arrival
                          </p>

                          <p className="mt-1 text-[10px] leading-4 text-slate-500">
                            Arrival must be confirmed before Eligibility, Consents and Printouts can be completed.
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="rounded-xl border border-amber-100 bg-amber-50/30 px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <ShieldCheck
                              size={13}
                              className="text-amber-600"
                            />

                            <p className="text-[11px] font-bold text-slate-700">
                              Next step
                            </p>
                          </div>

                          <p className="mt-1 text-[11px] leading-4 text-slate-500">
                            Complete the one-column Eligibility Checklist, collect required patient consents, then review printouts before handing the case to Cashier.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={markPatientArrived}
                          className="mt-3 flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-amber-500 !text-[12px] font-bold text-white transition hover:bg-amber-600"
                        >
                          <UserCheck size={14} />
                          Confirm Patient Arrival
                        </button>
                      </div>
                    </section>
                  </div>
                )}

                {(selectedPatient.status === "Arrived" ||
                  selectedPatient.status === "Reception In Progress") && (
                  <div data-responsive-grid="2" className="grid h-full min-h-0 grid-cols-[255px_minmax(0,1fr)] gap-2">
                    {/* ELIGIBILITY — ONE COLUMN */}
                    <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                      <div data-page-toolbar="true" className="flex h-9 shrink-0 items-center justify-between border-b border-slate-100 bg-amber-50/30 px-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                            <ShieldCheck size={13} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="text-[10px] font-bold text-slate-700">
                              Eligibility Checklist
                            </h3>
                            <p className="mt-0.5 text-[8px] text-slate-400">
                              Required reception checks.
                            </p>
                          </div>
                        </div>

                        <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${allChecked ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-500 ring-1 ring-slate-200"}`}>
                          {completedCount}/{checklistItems.length}
                        </span>
                      </div>

                      <div className="grid min-h-0 flex-1 content-start grid-cols-1 auto-rows-[44px] gap-1.5 px-2 py-2">
                        {checklistItems.map((item) => (
                          <ChecklistRow
                            key={item.id}
                            item={item}
                            checked={Boolean(checkedItems[item.id])}
                            onChange={() =>
                              setCheckedItems((current) => ({
                                ...current,
                                [item.id]: !current[item.id],
                              }))
                            }
                            highlighted={isMissingHighlighted(`checklist:${item.id}`)}
                          />
                        ))}
                      </div>

                      {selectedPatient.issues && selectedPatient.issues.length > 0 && (
                        <div className="mx-2.5 mb-2 flex shrink-0 items-start gap-2 rounded-lg border border-red-200 bg-red-50/55 px-2 py-1.5">
                          <AlertTriangle size={11} className="mt-0.5 shrink-0 text-red-500" />
                          <p className="min-w-0 truncate text-[7px] font-medium text-red-600">
                            {selectedPatient.issues[0]}
                          </p>
                        </div>
                      )}
                    </section>

                    {/* CONSENTS + PRINTOUTS — ALL INLINE */}
                    <ReceptionAdmissionForm allAdmissionFormsComplete={allAdmissionFormsComplete} completedAdmissionForms={completedAdmissionForms} requiredAdmissionForms={requiredAdmissionForms} getConsentDetails={getConsentDetails} updateConsentField={updateConsentField} isMissingHighlighted={isMissingHighlighted} consentApproval={consentApproval} setConsentApprovalField={setConsentApprovalField} setShowPrintCenter={setShowPrintCenter} selectedSurgery={selectedSurgery} />
                  </div>
                )}

                {selectedPatient.status === "Ready for Admission" && (
                  <ReceptionCompletedPanel
                    patient={selectedPatient}
                    surgery={selectedSurgery}
                    completedCount={completedCount}
                    totalChecks={checklistItems.length}
                    completedForms={completedAdmissionForms}
                    totalForms={requiredAdmissionForms.length}
                    onSend={sendToCashier}
                  />
                )}

                {selectedPatient.status === "Sent to Cashier" && (
                  <div className="flex h-full items-center justify-center">
                    <section className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                      <div className="flex flex-col items-center px-6 py-8 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                          <CheckCircle2 size={22} />
                        </div>
                        <h3 className="mt-3 text-[13px] font-bold text-emerald-800">
                          Sent to Cashier
                        </h3>
                        <p className="mt-1 max-w-[430px] text-[8.5px] leading-4 text-slate-500">
                          Reception is complete. The patient is now in the Cashier workflow for financial clearance.
                        </p>

                        <div data-responsive-grid="3" className="mt-4 grid w-full grid-cols-3 gap-2">
                          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
                            <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">Arrival</p>
                            <p className="mt-1 text-[10px] font-semibold text-slate-700">Confirmed</p>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
                            <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">Eligibility</p>
                            <p className="mt-1 text-[10px] font-semibold text-slate-700">Completed</p>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
                            <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">Handoff</p>
                            <p className="mt-1 text-[10px] font-semibold text-emerald-700">Cashier</p>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {selectedPatient.status === "On Hold" && (
                  <div className="flex h-full items-center justify-center">
                    <section className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-red-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                      <div className="flex items-start gap-3 border-b border-red-100 bg-red-50/55 px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                          <AlertTriangle size={17} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[11px] font-bold text-red-800">Patient On Hold</h3>
                          <p className="mt-0.5 text-[8px] text-red-500">Resolve the reception issue before continuing eligibility checks.</p>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">Reason</p>
                        <p className="mt-1 rounded-lg border border-red-100 bg-red-50/35 px-3 py-2 text-[9px] font-medium text-slate-700">
                          {selectedPatient.issues?.[0] || "Reception issue requires review."}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setReceptionStatus((current) => ({
                              ...current,
                              [selectedPatient.id]: "Reception In Progress",
                            }))
                          }
                          className="mt-3 flex h-9 w-full items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-[9px] font-bold text-amber-700 transition hover:bg-amber-100/60"
                        >
                          Resume Eligibility & Documents
                        </button>
                      </div>
                    </section>
                  </div>
                )}
              </div>

              {/* Actions only for the eligibility/documents step */}
              {(selectedPatient.status === "Arrived" ||
                selectedPatient.status === "Reception In Progress") && (
                <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowHoldModal(true)}
                      className="flex h-6 w-[120px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50/60 !text-[11px] font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <AlertTriangle size={12} />
                      Put on Hold
                    </button>

                    <div className="min-w-0 flex-1">
                      {(!allChecked || !allAdmissionFormsComplete || !approvalReady) && (
                        <p className="truncate text-right text-[9px] font-medium text-slate-400">
                          Complete required eligibility items, required consent fields and signer approval.
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={completeReception}
                      className={`flex h-7 w-[210px] shrink-0 items-center justify-center gap-1.5 rounded-lg !text-[12px] font-bold shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition ${
                        receptionReady
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                    >
                      {receptionReady ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <AlertTriangle size={13} />
                      )}
                      Complete Reception
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Reception Print Center */}
      {showPrintCenter && selectedSurgery && (
        <ReceptionPrintCenter selectedPatient={selectedPatient} setShowPrintCenter={setShowPrintCenter} completedAdmissionForms={completedAdmissionForms} requiredAdmissionForms={requiredAdmissionForms} selectedSurgery={selectedSurgery} />
      )}

      {/* Hold Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-[1px]">
          <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
            <div className="flex items-start gap-3 border-b border-slate-100 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <AlertTriangle size={16} />
              </div>

              <div>
                <h3 className="text-[12px] font-semibold text-slate-800">
                  Put Patient on Hold?
                </h3>

                <p className="mt-1 text-[9px] leading-4 text-slate-400">
                  The patient will not be able to proceed to admission until
                  the reception issue is resolved.
                </p>
              </div>
            </div>

            <div className="p-4">
              <label className="text-[9px] font-semibold text-slate-600">
                Reason
              </label>

              <textarea
                value={holdReason}
                onChange={(event) => setHoldReason(event.target.value)}
                placeholder="Enter reason for putting the patient on hold..."
                className="mt-1.5 h-20 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[9px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-red-300 focus:bg-white"
                />

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowHoldModal(false)}
                  className="h-8 rounded-md border border-slate-200 bg-white px-3 text-[9px] font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={holdPatient}
                  className="h-8 rounded-md bg-red-500 px-3 text-[9px] font-semibold text-white hover:bg-red-600"
                >
                  Put on Hold
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
