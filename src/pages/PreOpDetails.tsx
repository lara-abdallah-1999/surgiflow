import { AlertTriangle,ArrowLeft,CheckCircle2,Clock3,Save } from "lucide-react";
import { WorkspaceNotification } from '../components/layout/WorkspaceNotification';
import { PreOpAdmissionStep } from "../components/surgery/PreOpAdmissionStep";
import { SurgeryCopilotDrawer } from "../features/copilot/components/SurgeryCopilotDrawer";
import { PatientContextTools } from "../features/patient-context/PatientContextTools";
import { usePreOpDetailsWorkspace } from '../features/workspaces/PreOpDetails/hooks/usePreOpDetailsWorkspace';
import { AnesthesiaPanel } from '../features/workspaces/PreOpDetails/panels/AnesthesiaPanel';
import { IntraOpPanel } from '../features/workspaces/PreOpDetails/panels/IntraOpPanel';
import { PreOpHistoryPanel } from '../features/workspaces/PreOpDetails/panels/PreOpHistoryPanel';
import { PreOpTestsPanel } from '../features/workspaces/PreOpDetails/panels/PreOpTestsPanel';
import { PreOpWorkflowTabs } from '../features/workspaces/PreOpDetails/panels/PreOpWorkflowTabs';
import { getPatientName } from "../features/workspaces/PreOpDetails/utils";
import { useSurgeryStore } from "../store/surgeryStore";


export default function PreOpDetails() {
  const { selected, navigate, hydratedWorkspaceId, notes, addClinicalNote, selectedPlanConfirmed, setActiveTab, toast, setToast, showToast, workspaceHeadingRef, closeWorkspace, hasAdmissionTime, admissionDate, anesthesiaConfirmed, activeTab, preOpAssessmentProgress, testProgress, anesthesiaProgress, requiredSuppliesProgress, preOpReview, setReviewValue, setPreOpReview, setReviewDetail, completedTests, toggleValue, setCompletedTests, safety, exceptions, setShowExceptionForm, showExceptionForm, exceptionText, setExceptionText, addException, removeException, setSafety, anesthesiaReview, setAnesthesiaReview, anesthesiaExam, setAnesthesiaExam, handleSelectAnesthesia, anesthesia, confirmAnesthesiaPlan, setIntraSection, intraSection, setSupplySection, setSupplyCategory, supplySection, additionalSupplies, filteredSupplies, updateSupply, noteText, setNoteText, allPreOpReady, saveProgress, confirmReady } = usePreOpDetailsWorkspace();

if (!selected) 
    {
    return (
      <div className="flex h-[calc(100vh-72px)] items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-sm font-bold text-slate-800">Pre-Op case not found</h2>
          <p className="mt-2 text-xs text-slate-500">
            The selected surgery is unavailable or no longer exists.
          </p>
          <button
            type="button"
            onClick={() => navigate("/pre-op")}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={12} />
            Back to Pre-Op
          </button>
        </div>
      </div>
    );
  }
  const preOpWorkspaceEnabled = [
  "Pre-Op",
  "Ready",
  "In Progress",
  "Completed",
  "Recovery",
  "Discharged",
].includes(selected.status);

  return (
    <div data-workspace-page="PreOpDetails" className="flex h-[calc(100vh-72px)] min-h-0 flex-col overflow-hidden bg-slate-50 p-2">
      <SurgeryCopilotDrawer surgery={selected} documents={hydratedWorkspaceId === selected.id ? {
        "intraop-note": {
          label: "Pre-Op intraoperative notes",
          currentValue: JSON.stringify(notes),
          save: (text) => {
            if (useSurgeryStore.getState().surgeries.find((item) => item.id === selected.id) !== selected) return { ok: false, message: "The case changed. Prepare the note again." };
            addClinicalNote(text);
            return { ok: true, message: "Reviewed note added to the existing Pre-Op notes. The workspace's existing auto-save will persist it." };
          },
        },
      } : undefined} context={hydratedWorkspaceId === selected.id ? {
        preOp: { completedTests, planConfirmed: selectedPlanConfirmed },
      } : undefined} onDestination={(destination) => {
        if (destination.path !== `/pre-op/${encodeURIComponent(selected.id)}`) return false;
        if (destination.section === "pre-tests" || destination.section === "anesthesia") setActiveTab(destination.section);
        return true;
      }} />
      <WorkspaceNotification notice={toast} onClose={() => setToast(null)} />

      <PreOpAdmissionStep surgery={selected} onMessage={(message) => showToast("success", "OR admission", message)} />
      <div className="flex h-full min-h-0 min-w-0 flex-col gap-2">
        {/* FULL-PAGE PATIENT WORKSPACE */}
            <section aria-label="Patient pre-op workspace" className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
              <div className="flex h-full min-h-0 min-w-0 flex-col gap-2">

                <h2 ref={workspaceHeadingRef} tabIndex={-1} className="sr-only">Pre-Op: {getPatientName(selected)}</h2>
                <PatientContextTools>
                  <button type="button" onClick={closeWorkspace} aria-label="Back to Pre-Op patients" className="flex h-7 items-center gap-1 rounded-lg border border-blue-100 bg-white px-2 text-blue-600 hover:bg-blue-50"><ArrowLeft size={13} /> Back</button>
                  <span>OR admission: <strong>{hasAdmissionTime && admissionDate ? admissionDate.toLocaleString() : "Not recorded"}</strong></span>
                  <span>Anesthesia plan: <strong>{anesthesiaConfirmed ? selected.anesthesiaType : "Not confirmed"}</strong></span>
                </PatientContextTools>

                {/* =====================================================
                    MAIN CONTENT
                ====================================================== */}


                <section
                  data-responsive-grid="2"
                  inert={!preOpWorkspaceEnabled}
                  aria-disabled={!preOpWorkspaceEnabled}
                  aria-label="Pre-op assessments"
                  className={`preop-workspace grid w-full min-h-0 min-w-0 flex-1 grid-cols-[116px_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-2 gap-y-1 overflow-hidden transition-opacity duration-300 ${
                    preOpWorkspaceEnabled
                      ? "opacity-100"
                      : "pointer-events-none select-none opacity-40"
                  }`}
                >
                <div className="contents">





                  {/* =====================================================
                      CLINICAL WORKSPACE — TABS USE FULL DRAWER WIDTH
                  ====================================================== */}

                  <div className="contents">


    {/* VERTICAL WORKFLOW TABS */}
    <PreOpWorkflowTabs activeTab={activeTab} setActiveTab={setActiveTab} preOpAssessmentProgress={preOpAssessmentProgress} testProgress={testProgress} anesthesiaProgress={anesthesiaProgress} requiredSuppliesProgress={requiredSuppliesProgress} />

    {/* CONTENT */}

    <div
      className={`preop-tab-content col-start-2 row-start-1 h-full w-full min-h-0 min-w-0 overflow-hidden rounded-xl ${
        activeTab === "anesthesia"
          ? "border border-purple-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
          : "bg-slate-50/70 shadow-sm"
      }`}
    >

      {activeTab === "preop-assessment" && (
        <PreOpHistoryPanel preOpAssessmentProgress={preOpAssessmentProgress} preOpReview={preOpReview} setReviewValue={setReviewValue} setPreOpReview={setPreOpReview} setReviewDetail={setReviewDetail} />
      )}

      {/* =================================================
          PRE TESTS
      ================================================== */}

      {activeTab ===
        "pre-tests" && (

        <PreOpTestsPanel testProgress={testProgress} completedTests={completedTests} toggleValue={toggleValue} setCompletedTests={setCompletedTests} safety={safety} exceptions={exceptions} setShowExceptionForm={setShowExceptionForm} showExceptionForm={showExceptionForm} exceptionText={exceptionText} setExceptionText={setExceptionText} addException={addException} removeException={removeException} setSafety={setSafety} />

      )}


      {/* =================================================
          ANESTHESIA ASSESSMENT
      ================================================== */}

      {activeTab === "anesthesia" && (
        <AnesthesiaPanel anesthesiaReview={anesthesiaReview} setReviewValue={setReviewValue} setAnesthesiaReview={setAnesthesiaReview} anesthesiaExam={anesthesiaExam} setAnesthesiaExam={setAnesthesiaExam} handleSelectAnesthesia={handleSelectAnesthesia} anesthesia={anesthesia} selectedPlanConfirmed={selectedPlanConfirmed} confirmAnesthesiaPlan={confirmAnesthesiaPlan} />
      )}


      {/* =================================================
          INTRA OP
      ================================================== */}

      {activeTab ===
        "intra-op" && (

        <IntraOpPanel setIntraSection={setIntraSection} intraSection={intraSection} requiredSuppliesProgress={requiredSuppliesProgress} notes={notes} setSupplySection={setSupplySection} setSupplyCategory={setSupplyCategory} supplySection={supplySection} additionalSupplies={additionalSupplies} filteredSupplies={filteredSupplies} updateSupply={updateSupply} noteText={noteText} setNoteText={setNoteText} addClinicalNote={addClinicalNote} />

      )}

    </div>
                  </div>
                </div>

                {/* =====================================================
                    BOTTOM ACTION BAR — COMPACT
                ====================================================== */}

                <div
                  className={`workspace-actions col-start-2 row-start-2 flex h-[44px] min-w-0 items-center justify-between gap-3 rounded-xl border bg-white px-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${
                    activeTab === "anesthesia"
                      ? "border-purple-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                        allPreOpReady
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {allPreOpReady ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <Clock3 size={10} />
                      )}
                    </div>

                    <p className="shrink-0 text-[10px] font-bold text-slate-700">
                      {allPreOpReady
                        ? "Pre-Op ready for confirmation"
                        : "Pre-Op requirements pending"}
                    </p>

                    {!allPreOpReady ? (
                      <div className="flex min-w-0 items-center gap-1 overflow-hidden">
                        {testProgress.completed < testProgress.total && (
                          <span className="whitespace-nowrap rounded-full bg-orange-50 px-1.5 py-0.5 text-[8px] font-semibold text-orange-600">
                            Pre-Operative Tests
                          </span>
                        )}

                        {!selectedPlanConfirmed && (
                          <span className="whitespace-nowrap rounded-full bg-purple-50 px-1.5 py-0.5 text-[8px] font-semibold text-purple-600">
                            Type not confirmed
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="truncate text-[7px] text-emerald-600">
                        Tests complete · Type confirmed
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={saveProgress}
                      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 !text-[12px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Save size={10} />
                      Save Progress
                    </button>

                    <button
                      type="button"
                      onClick={confirmReady}
                      className={`inline-flex h-7 items-center gap-1.5 rounded-md border px-3 !text-[12px] font-semibold transition ${
                        allPreOpReady
                          ? "border-teal-600 bg-teal-600 text-white shadow-sm hover:bg-teal-700"
                          : "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100/70"
                      }`}
                    >
                      {allPreOpReady ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <AlertTriangle size={10} />
                      )}
                      Confirm Pre-Op Ready
                    </button>
                  </div>
                </div>
                </section>
              </div>
            </section>

      </div>
    </div>
  );
}
