import { Activity,AlertTriangle,CheckCircle2,ChevronRight,Clock3,FileText,HeartPulse,Save,Scissors,ShieldCheck,Stethoscope,UserRound } from "lucide-react";
import { WorkspaceNotification } from '../components/layout/WorkspaceNotification';
import { SurgeryCopilotDrawer } from "../features/copilot/components/SurgeryCopilotDrawer";
import { RecoveryStatCard,SectionTitle,SummaryItem } from "../features/workspaces/Recovery/components";
import { recoveryAssessments } from "../features/workspaces/Recovery/config";
import { useRecoveryWorkspace } from '../features/workspaces/Recovery/hooks/useRecoveryWorkspace';
import { RecoveryObservations } from '../features/workspaces/Recovery/panels/RecoveryObservations';
import { RecoveryQueue } from '../features/workspaces/Recovery/panels/RecoveryQueue';
import { RecoveryReport } from '../features/workspaces/Recovery/panels/RecoveryReport';
import { formatClock,getInitials,getPatientGender,getSurgeryProcedures } from "../features/workspaces/Recovery/utils";


export default function Recovery() {
  const { selected, selectedId, selectPatient, recoveryCases, loadRecovery, search, setSearch, filterRef, setFilterOpen, filterOpen, selectedDoctors, selectedStatuses, selectedDate, period, clearFilters, doctors, toggleDoctor, statuses, toggleStatus, setPeriod, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visibleCases, sortedCases, page, pageSize, totalPages, toast, setToast, setSelectedId, setRecovery, recovery, assessmentProgress, updateRecoveryStage, allAssessmentsComplete, toggleAssessment, transientRecoveryRef, reportExpanded, collapseReport, toggleReportExpanded, applyReportCommand, rememberReportSelection, reportEditorRef, handleReportInput, readyForTransfer, saveRecovery, confirmReadyForTransfer } = useRecoveryWorkspace();

return (
    <div data-workspace-page="Recovery" className="h-[calc(100vh-72px)] min-h-0 overflow-hidden bg-slate-50 p-2">
      <SurgeryCopilotDrawer surgery={selected} context={selected ? { recovery } : undefined}
        onDestination={(destination, surgeryId) => {
          if (destination.path !== "/recovery") return false;
          if (selectedId !== surgeryId) selectPatient(surgeryId);
          return true;
        }} />
      <div className="relative flex h-full min-h-0 flex-col gap-2">
        {/* ================================================================ */}
        {/* TOP STAT CARDS                                                   */}
        {/* ================================================================ */}

        <section data-responsive-grid="4" className="grid shrink-0 grid-cols-4 gap-2">
          <RecoveryStatCard
            label="Post-Op Patients"
            value={
              recoveryCases.filter(
                (item) =>
                  item.status === "Completed",
              ).length
            }
            icon={<CheckCircle2 size={15} />}
            tone="blue"
          />

          <RecoveryStatCard
            label="In Recovery"
            value={
              recoveryCases.filter(
                (item) =>
                  item.status === "Recovery",
              ).length
            }
            icon={<HeartPulse size={15} />}
            tone="teal"
          />

          <RecoveryStatCard
            label="Ready for Transfer"
            value={
              recoveryCases.filter((item) => {
                const saved = loadRecovery(
                  item.id,
                );

                return (
                  saved.status ===
                  "Ready for Transfer"
                );
              }).length
            }
            icon={<ShieldCheck size={15} />}
            tone="green"
          />

          <RecoveryStatCard
            label="Needs Monitoring"
            value={
              recoveryCases.filter((item) => {
                const saved = loadRecovery(
                  item.id,
                );

                return (
                  saved.stability ===
                    "unstable" ||
                  saved.status ===
                    "Monitoring" ||
                  saved.status ===
                    "Progressing"
                );
              }).length
            }
            icon={<AlertTriangle size={15} />}
            tone="orange"
          />
        </section>

        {/* ================================================================ */}
        {/* RECOVERY PATIENT TABLE — MATCHES PRE-OP TABLE                       */}
        {/* ================================================================ */}

        <div className="relative min-h-0 flex-1">
          <RecoveryQueue search={search} setSearch={setSearch} filterRef={filterRef} setFilterOpen={setFilterOpen} filterOpen={filterOpen} selectedDoctors={selectedDoctors} selectedStatuses={selectedStatuses} selectedDate={selectedDate} period={period} clearFilters={clearFilters} doctors={doctors} toggleDoctor={toggleDoctor} statuses={statuses} toggleStatus={toggleStatus} setPeriod={setPeriod} setSelectedDate={setSelectedDate} setPage={setPage} sortKey={sortKey} sortDirection={sortDirection} handleSort={handleSort} rowsContainerRef={rowsContainerRef} visibleCases={visibleCases} selectedId={selectedId} loadRecovery={loadRecovery} selectPatient={selectPatient} sortedCases={sortedCases} page={page} pageSize={pageSize} totalPages={totalPages} />
        </div>

        <WorkspaceNotification notice={toast} onClose={() => setToast(null)} />

        {/* ================================================================ */}
        {/* RECOVERY DRAWER                                                   */}
        {/* ================================================================ */}

        {selected && (
          <>
            {/* BACKDROP */}
            <button
              type="button"
              aria-label="Close recovery workspace"
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-40 bg-slate-900/10"
            />

            {/* RIGHT DRAWER */}
            <section className="fixed inset-y-0 right-0 z-50 flex w-[980px] max-w-[94vw] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl">
              <div className="grid h-full min-h-0 grid-rows-[94px_58px_minmax(0,1fr)_54px]">
              {/* ============================================================ */}
              {/* PATIENT HEADER                                               */}
              {/* ============================================================ */}

              <header data-page-toolbar="true" className="flex min-h-0 items-center justify-between gap-4 border-b border-slate-100 bg-white px-4">
                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[16px] font-bold text-teal-600">
                    {getInitials(
                      selected.patientName,
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-[15px] font-semibold text-slate-800">
                        {
                          selected.patientName
                        }
                      </h2>

                      <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-teal-600">
                        Recovery
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[12px] text-slate-500">
                      <span className="font-medium">
                        {selected.id}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-slate-600">
                        {getPatientGender(selected)}
                      </span>
                      <span>•</span>
                      <span className="font-medium inline-flex items-center gap-1 truncate">
                        <Stethoscope
                          size={9}
                        />
                        {
                          selected.doctor
                        }
                      </span>
                    </div>

                    <div className="mt-2 flex min-w-0 items-center gap-2">
                      <div className="flex shrink-0 items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                        <Scissors size={10} />
                        Procedures
                        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[7px] font-bold text-emerald-700">
                          {getSurgeryProcedures(selected).length}
                        </span>
                      </div>

                      <div className="flex min-w-0 flex-wrap items-center gap-1">
                        {getSurgeryProcedures(selected).map(
                          (procedure, index) => (
                            <div
                              key={`${procedure.name}-${procedure.site ?? index}`}
                              className={`inline-flex max-w-[190px] items-center gap-1 rounded-md border px-2
                                  border-emerald-200 bg-emerald-50 text-emerald-700
                              }`}
                            >
                              <span className="truncate text-[10px] font-semibold">
                                {procedure.name}
                              </span>

                              {procedure.site && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="truncate text-[10px] font-medium text-slate-400">
                                    {procedure.site}
                                  </span>
                                </>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {/* STABILITY TOGGLE */}

                  <div>
                    <p className="mb-1 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      Patient Condition
                    </p>

                    <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          setRecovery(
                            (current) => ({
                              ...current,
                              stability:
                                "stable",
                            }),
                          )
                        }
                        className={`flex h-7 items-center gap-1.5 rounded-md px-3 text-[9px] font-semibold transition ${
                          recovery.stability ===
                          "stable"
                            ? "bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <ShieldCheck
                          size={11}
                        />
                        Stable
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setRecovery(
                            (current) => ({
                              ...current,
                              stability:
                                "unstable",
                            }),
                          )
                        }
                        className={`flex h-7 items-center gap-1.5 rounded-md px-3 text-[9px] font-semibold transition ${
                          recovery.stability ===
                          "unstable"
                            ? "bg-white text-red-600 shadow-sm ring-1 ring-red-100"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <AlertTriangle
                          size={11}
                        />
                        Unstable
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Close recovery drawer"
                    onClick={() => setSelectedId(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </header>

              {/* ============================================================ */}
              {/* QUICK CLINICAL SUMMARY                                       */}
              {/* ============================================================ */}

              <section data-responsive-table-header="true" className="grid h-[58px] shrink-0 grid-cols-[1.1fr_1fr_1fr_1fr] border-b border-slate-100 bg-slate-50/40">
                <SummaryItem
                  icon={
                    <Clock3 size={12} />
                  }
                  label="Surgery End"
                  value={formatClock(
                    selected.surgeryCompletedAt,
                  )}
                />

                <SummaryItem
                  icon={
                    <Activity
                      size={12}
                    />
                  }
                  label="Recovery Status"
                  value={
                    recovery.status
                  }
                />

                <SummaryItem
                  icon={
                    <CheckCircle2
                      size={12}
                    />
                  }
                  label="Assessment"
                  value={`${assessmentProgress}/${recoveryAssessments.length} completed`}
                />

                <SummaryItem
                  icon={
                    <UserRound
                      size={12}
                    />
                  }
                  label="Operating Room"
                  value={
                    selected.room ||
                    "Not assigned"
                  }
                  last
                />
              </section>

              {/* ============================================================ */}
              {/* CONTENT — NO SCROLL                                          */}
              {/* ============================================================ */}

              <section data-responsive-grid="2" className="grid min-h-0 grid-cols-[.88fr_1.12fr] gap-2 bg-slate-50/40 p-2">
                {/* LEFT COLUMN */}

                <RecoveryObservations recovery={recovery} updateRecoveryStage={updateRecoveryStage} allAssessmentsComplete={allAssessmentsComplete} assessmentProgress={assessmentProgress} toggleAssessment={toggleAssessment} />

                {/* RIGHT COLUMN */}

                <div className="grid min-h-0 grid-rows-[.58fr_1.42fr] gap-2">
                  {/* RECOVERY NOTES */}

                  <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <SectionTitle
                      icon={
                        <FileText
                          size={13}
                        />
                      }
                      title="Recovery Notes"
                      subtitle="Post-operative observations and instructions"
                    />

                    <div className="min-h-0 flex-1 p-2.5">
                      <textarea
                        value={
                          recovery.notes
                        }
                        onChange={(
                          event,
                        ) =>
                          setRecovery(
                            (
                              current,
                            ) => {
                              const next = {
                                ...current,
                                notes:
                                  event
                                    .target
                                    .value,
                              };

                              if (
                                selectedId
                              ) {
                                transientRecoveryRef.current[
                                  selectedId
                                ] = {
                                  awakeningStage:
                                    next.awakeningStage,
                                  notes:
                                    next.notes,
                                  surgeonReport:
                                    next.surgeonReport,
                                };
                              }

                              return next;
                            },
                          )
                        }
                        placeholder="Document pain, nausea, airway, medication response, complications, transfer instructions..."
                        className="h-full w-full resize-none overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50 p-2 text-[10px] leading-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-50"
                      />
                    </div>
                  </div>

                  {/* SURGEON REPORT */}

                  {reportExpanded && (
                    <button
                      type="button"
                      aria-label="Close expanded report"
                      onClick={collapseReport}
                      className="fixed inset-0 z-[65] bg-slate-900/20"
                    />
                  )}

                  <RecoveryReport reportExpanded={reportExpanded} selected={selected} toggleReportExpanded={toggleReportExpanded} applyReportCommand={applyReportCommand} rememberReportSelection={rememberReportSelection} reportEditorRef={reportEditorRef} handleReportInput={handleReportInput} />
                </div>
              </section>

              {/* ============================================================ */}
              {/* ACTION BAR                                                   */}
              {/* ============================================================ */}

              <footer className="flex min-h-0 items-center justify-between border-t border-slate-200 bg-white px-4 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      readyForTransfer
                        ? "bg-emerald-50 text-emerald-600"
                        : recovery.stability ===
                            "unstable"
                          ? "bg-red-50 text-red-500"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {readyForTransfer ? (
                      <CheckCircle2
                        size={12}
                      />
                    ) : recovery.stability ===
                      "unstable" ? (
                      <AlertTriangle
                        size={12}
                      />
                    ) : (
                      <Clock3
                        size={12}
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="!text-[11px] font-semibold text-slate-700">
                      {readyForTransfer
                        ? "Recovery criteria completed"
                        : recovery.stability ===
                            "unstable"
                          ? "Patient requires continued monitoring"
                          : "Recovery monitoring in progress"}
                    </p>

                    <p className="truncate !text-[10px] text-slate-400">
                      {readyForTransfer
                        ? "Patient is stable and ready for transfer."
                        : "Complete awakening, assessments, and confirm stability."}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={
                      saveRecovery
                    }
                    className="inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-200 px-3 text-[9px] font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <Save
                      size={10}
                    />
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={
                      confirmReadyForTransfer
                    }
                    className={`inline-flex h-7 items-center gap-1.5 rounded-md border px-3 text-[9px] font-semibold transition ${
                      readyForTransfer
                        ? "border-teal-600 bg-teal-600 text-white shadow-sm hover:bg-teal-700"
                        : "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100/70"
                    }`}
                  >
                    {readyForTransfer ? (
                      <CheckCircle2
                        size={10}
                      />
                    ) : (
                      <AlertTriangle
                        size={10}
                      />
                    )}

                    Confirm Ready for Transfer
                  </button>
                </div>
              </footer>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
