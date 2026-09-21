import { CalendarDays,Check,ClipboardCheck,FileText,HeartPulse,Save,X } from "lucide-react";
import { PatientContextTools } from "../features/patient-context/PatientContextTools";
import { QuickFact } from "../features/workspaces/PostOpDetails/components";
import { usePostOpDetailsWorkspace } from '../features/workspaces/PostOpDetails/hooks/usePostOpDetailsWorkspace';
import { PostOpExpandedList } from '../features/workspaces/PostOpDetails/panels/PostOpExpandedList';
import { PostOpLifestyleCard } from '../features/workspaces/PostOpDetails/panels/PostOpLifestyleCard';
import { PostOpMedicationsCard } from '../features/workspaces/PostOpDetails/panels/PostOpMedicationsCard';
import { PostOpOrdersCard } from '../features/workspaces/PostOpDetails/panels/PostOpOrdersCard';
import { PostOpReportEditor } from '../features/workspaces/PostOpDetails/panels/PostOpReportEditor';
import { PostOpVisitsCard } from '../features/workspaces/PostOpDetails/panels/PostOpVisitsCard';
import { type PatientCondition } from "../features/workspaces/PostOpDetails/types";
import { formatDischargeDateTime,getNextVisitLabel,stripHtml } from "../features/workspaces/PostOpDetails/utils";
import { WorkspaceNotification } from "../components/layout/WorkspaceNotification";


export default function PostOpDetails() {
  const {
  selected,
  navigate,
  postOp,

  toast,
  setToast,

  surgeonReport,
  openSurgeonReport,

  setRecoveryNotesOpen,
  setNoteDraft,
  setNoteOpen,

  setAddingMedication,
  addingMedication,
  medicationDraft,
  setMedicationDraft,
  addMedication,
  updateMedicationStatus,
  updateMedication,
  deleteMedication,

  setExpandedList,

  setAddingOrder,
  addingOrder,
  orderDraft,
  setOrderDraft,
  addFollowUpOrder,
  updateOrderStatus,
  updateOrderResult,
  updateOrder,
  deleteOrder,

  setAddingLifestyle,
  setNewLifestyleInstruction,
  addingLifestyle,
  setLifestyleTypePanelOpen,
  lifestyleTypePanelOpen,
  newLifestyleType,
  setNewLifestyleType,
  newLifestyleInstruction,
  addLifestyleHabit,
  updateLifestyleHabit,
  removeLifestyleHabit,

  setAddingVisit,
  addingVisit,
  visitDraft,
  setVisitDraft,
  surgeries,
  addVisit,
  updateVisitStatus,
  updateVisitResult,
  updateVisit,
  deleteVisit,

  setPostOp,
  dischargeReady,
  dischargePatient,
  savePostOp,

  noteOpen,
  noteDraft,
  recoveryNotesOpen,

  reportOpen,
  reportExpanded,
  closeReportEditor,
  saveSurgeonReport,
  toggleReportExpanded,
  applyReportCommand,
  rememberReportSelection,
  reportEditorRef,
  handleReportInput,

  expandedList,
} = usePostOpDetailsWorkspace();

if (!selected) {
    return (
      <div className="flex h-[calc(100vh-72px)] items-center justify-center bg-slate-50 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <FileText size={20} className="mx-auto text-slate-300" />
          <p className="mt-2 text-[11px] font-semibold text-slate-700">
            Post-Op patient not found
          </p>
          <button
            type="button"
            onClick={() => navigate("/post-op")}
            className="mt-4 h-8 rounded-lg bg-cyan-600 px-3 text-[9px] font-bold text-white"
          >
            Back to Post-Op
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-workspace-page="PostOpDetails" className="h-[calc(100vh-72px)] min-h-0 overflow-hidden bg-slate-50 p-2">
      <WorkspaceNotification
          notice={toast}
          onClose={() => setToast(null)}
        />
      <div className="h-full min-h-0">
            <section className="flex h-full min-h-0 w-full flex-col overflow-hidden">
              <div className="postop-workspace grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2">
                {/* HEADER */}

                <PatientContextTools label="Upcoming visits">{postOp.visits.filter((item) => item.status === "Upcoming").length}</PatientContextTools>

                {/* ============================================================ */}
                {/* POST-OP CLINICAL SUMMARY                                        */}
                {/* ============================================================ */}

                <section data-responsive-grid="4" className="grid min-h-[66px] shrink-0 grid-cols-4 divide-x divide-slate-100 rounded-xl border border-cyan-100 bg-white shadow-sm">
                  <QuickFact
                    label="Surgeon Report"
                    value={
                      stripHtml(
                        surgeonReport,
                      ) ||
                      "Add surgeon post-operative report"
                    }
                    icon={
                      <ClipboardCheck
                        size={12}
                      />
                    }
                    tone="cyan"
                    onClick={
                      openSurgeonReport
                    }
                    actionLabel="Add"
                  />

                  <QuickFact
                    label="Recovery Notes"
                    value={
                      selected.surgeonNotes ||
                      "No recovery notes"
                    }
                    icon={
                      <FileText size={12} />
                    }
                    tone="teal"
                    onClick={
                      selected.surgeonNotes
                        ? () =>
                            setRecoveryNotesOpen(
                              true,
                            )
                        : undefined
                    }
                    actionLabel={
                      selected.surgeonNotes
                        ? "View"
                        : undefined
                    }
                  />

                  <QuickFact
                    label="Note"
                    value={
                      postOp.woundStatus?.trim()
                        ? postOp.woundStatus
                        : "No note added"
                    }
                    icon={
                      <FileText size={12} />
                    }
                    tone="cyan"
                    onClick={() => {
                      setNoteDraft(
                        postOp.woundStatus ||
                          "",
                      );
                      setNoteOpen(true);
                    }}
                    actionLabel={
                      postOp.woundStatus?.trim()
                        ? "Edit"
                        : "Add"
                    }
                  />

                  <QuickFact
                    label="Next Visit"
                    value={
                      getNextVisitLabel(
                        postOp.visits,
                      )
                    }
                    icon={
                      <CalendarDays
                        size={12}
                      />
                    }
                    tone="cyan"
                  />
                </section>

                {/* ============================================================ */}
                {/* MAIN WORKSPACE                                               */}
                {/* ============================================================ */}

                <div className="postop-scroll-content flex min-h-0 min-w-0 flex-col gap-2 overflow-y-auto overflow-x-hidden">
                <section
                  data-responsive-grid="4"
                  className="postop-cards grid min-h-0 min-w-0 w-full grid-cols-[repeat(4,minmax(0,1fr))] gap-2"
                  >
                  {/* MEDICATIONS */}

                  <PostOpMedicationsCard postOp={postOp} setAddingMedication={setAddingMedication} addingMedication={addingMedication} medicationDraft={medicationDraft} setMedicationDraft={setMedicationDraft} addMedication={addMedication} updateMedicationStatus={updateMedicationStatus} updateMedication={updateMedication} deleteMedication={deleteMedication} setExpandedList={setExpandedList} />

                  {/* FOLLOW-UP INVESTIGATIONS */}

                  <PostOpOrdersCard postOp={postOp} setAddingOrder={setAddingOrder} addingOrder={addingOrder} orderDraft={orderDraft} setOrderDraft={setOrderDraft} addFollowUpOrder={addFollowUpOrder} updateOrderStatus={updateOrderStatus} updateOrderResult={updateOrderResult} updateOrder={updateOrder} deleteOrder={deleteOrder} setExpandedList={setExpandedList} />

                  {/* LIFESTYLE */}

                  <PostOpLifestyleCard postOp={postOp} setAddingLifestyle={setAddingLifestyle} setNewLifestyleInstruction={setNewLifestyleInstruction} addingLifestyle={addingLifestyle} setLifestyleTypePanelOpen={setLifestyleTypePanelOpen} lifestyleTypePanelOpen={lifestyleTypePanelOpen} newLifestyleType={newLifestyleType} setNewLifestyleType={setNewLifestyleType} newLifestyleInstruction={newLifestyleInstruction} addLifestyleHabit={addLifestyleHabit} updateLifestyleHabit={updateLifestyleHabit} removeLifestyleHabit={removeLifestyleHabit} setExpandedList={setExpandedList} />

                  {/* POST-OP VISITS */}

                  <PostOpVisitsCard postOp={postOp} setAddingVisit={setAddingVisit} addingVisit={addingVisit} visitDraft={visitDraft} setVisitDraft={setVisitDraft} selected={selected} surgeries={surgeries} addVisit={addVisit} updateVisitStatus={updateVisitStatus} updateVisitResult={updateVisitResult} updateVisit={updateVisit} deleteVisit={deleteVisit} setExpandedList={setExpandedList} />
                </section>

                {/* ============================================================ */}
                {/* DISCHARGE + SAVE FOOTER                                      */}
                {/* ============================================================ */}

                <footer data-responsive-grid="2" className="workspace-actions grid h-[58px] shrink-0 grid-cols-[1fr_auto] items-center gap-3 border-t border-slate-200 bg-white px-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex shrink-0 items-center gap-1.5 pr-2">
                      <HeartPulse
                        size={13}
                        className="text-cyan-600"
                      />
                      <span className="text-[10px] font-bold text-slate-700">
                        Patient Condition
                      </span>
                    </div>

                    {(
                      [
                        "Improving",
                        "Stable",
                        "Needs Attention",
                      ] as PatientCondition[]
                    ).map((condition) => {
                      const active =
                        postOp.condition ===
                        condition;

                      return (
                        <button
                          key={condition}
                          type="button"
                          onClick={() =>
                            setPostOp(
                              (current) => ({
                                ...current,
                                condition,
                              }),
                            )
                          }
                          className={`inline-flex h-6 items-center gap-1.5 rounded-lg border px-2.5 !text-[11px] font-semibold transition ${
                            active
                              ? condition ===
                                "Needs Attention"
                                ? "border-rose-200 bg-rose-50 text-rose-700"
                                : condition ===
                                    "Improving"
                                  ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              active
                                ? condition ===
                                  "Needs Attention"
                                  ? "bg-rose-500"
                                  : condition ===
                                      "Improving"
                                    ? "bg-cyan-500"
                                    : "bg-emerald-500"
                                : "bg-slate-300"
                            }`}
                          />
                          {condition}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    {postOp.discharged &&
                      postOp.dischargedAt && (
                      <div className="mr-1 text-right">
                        <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          Discharged
                        </p>
                        <p className="mt-0.5 text-[10px] font-semibold text-emerald-700">
                          {formatDischargeDateTime(
                            postOp.dischargedAt,
                          )}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={
                        postOp.discharged ||
                        !dischargeReady
                      }
                      onClick={
                        dischargePatient
                      }
                      className={`inline-flex h-7 items-center gap-2 rounded-lg border px-3 !text-[11px] font-semibold transition ${
                        postOp.discharged
                          ? "cursor-default border-emerald-200 bg-emerald-50 text-emerald-700"
                          : dischargeReady
                            ? "border-cyan-200 bg-cyan-100/40 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                            : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          postOp.discharged
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : dischargeReady
                              ? "border-cyan-400 bg-white text-transparent"
                              : "border-slate-300 bg-white text-transparent"
                        }`}
                      >
                        <Check
                          size={9}
                          strokeWidth={3}
                        />
                      </span>

                      {postOp.discharged
                        ? "Discharged"
                        : "Discharge Patient"}
                    </button>

                    <button
                      type="button"
                      onClick={
                        savePostOp
                      }
                      className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-cyan-600 px-3 !text-[11px] font-semibold text-white transition hover:bg-cyan-700"
                    >
                      <Save size={11} />
                      Save Post-Op Plan
                    </button>
                  </div>
                </footer>
                </div>
              </div>
            </section>
            {/* NOTE ADD / EDIT PANEL */}
            {noteOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close note editor"
                  onClick={() =>
                    setNoteOpen(false)
                  }
                  className="fixed inset-0 z-[72] bg-slate-900/10"
                />

                <section className="fixed left-1/2 top-1/2 z-[82] w-[470px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-2xl">
                  <div data-page-toolbar="true" className="flex h-[56px] items-center justify-between border-b border-cyan-100 bg-cyan-50/45 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
                        <FileText size={13} />
                      </div>

                      <div>
                        <h3 className="text-[11px] font-bold text-slate-800">
                          {postOp.woundStatus?.trim()
                            ? "Edit Note"
                            : "Add Note"}
                        </h3>

                        <p className="text-[8px] text-cyan-600">
                          Post-Op clinical note
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setNoteOpen(false)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  <div className="p-4">
                    <textarea
                      value={noteDraft}
                      onChange={(event) =>
                        setNoteDraft(
                          event.target.value,
                        )
                      }
                      placeholder="Add a post-operative note..."
                      className="h-[110px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50/40 p-3 text-[11px] leading-5 text-slate-700 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-50"
                    />

                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setNoteOpen(false)
                        }
                        className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-semibold text-slate-500 hover:bg-slate-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPostOp(
                            (current) => ({
                              ...current,
                              woundStatus:
                                noteDraft.trim(),
                            }),
                          );

                          setNoteOpen(false);
                        }}
                        className="h-7 rounded-lg bg-cyan-600 px-3 text-[9px] font-semibold text-white hover:bg-cyan-700"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* RECOVERY NOTES PANEL */}
            {recoveryNotesOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close recovery notes"
                  onClick={() =>
                    setRecoveryNotesOpen(
                      false,
                    )
                  }
                  className="fixed inset-0 z-[70] bg-slate-900/10"
                />

                <section className="fixed left-1/2 top-1/2 z-[80] flex max-h-[78vh] w-[560px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-2xl">
                  <div data-page-toolbar="true" className="flex h-[56px] items-center justify-between border-b border-teal-100 bg-teal-50/45 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
                        <FileText
                          size={13}
                        />
                      </div>

                      <div>
                        <h3 className="text-[11px] font-bold text-slate-800">
                          Recovery Notes
                        </h3>

                        <p className="text-[8px] text-teal-600">
                          Recorded during Recovery
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setRecoveryNotesOpen(
                          false,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    <div className="whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50/40 p-4 text-[11px] leading-5 text-slate-700 [overflow-wrap:anywhere]">
                      {selected.surgeonNotes ||
                        "No recovery notes were recorded."}
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* SURGEON POST-OPERATIVE REPORT */}
            {reportOpen && (
              <>
                {!reportExpanded && (
                  <button
                    type="button"
                    aria-label="Close surgeon report"
                    onClick={
                      closeReportEditor
                    }
                    className="fixed inset-0 z-[70] bg-slate-900/10"
                  />
                )}

                <PostOpReportEditor reportExpanded={reportExpanded} selected={selected} saveSurgeonReport={saveSurgeonReport} toggleReportExpanded={toggleReportExpanded} closeReportEditor={closeReportEditor} applyReportCommand={applyReportCommand} rememberReportSelection={rememberReportSelection} reportEditorRef={reportEditorRef} handleReportInput={handleReportInput} />
              </>
            )}

            {/* VIEW ALL ITEMS PANEL */}
            {expandedList && (
              <>

                <PostOpExpandedList expandedList={expandedList} setExpandedList={setExpandedList} postOp={postOp} updateMedicationStatus={updateMedicationStatus} updateMedication={updateMedication} deleteMedication={deleteMedication} updateOrderStatus={updateOrderStatus} updateOrderResult={updateOrderResult} updateOrder={updateOrder} deleteOrder={deleteOrder} updateLifestyleHabit={updateLifestyleHabit} removeLifestyleHabit={removeLifestyleHabit} updateVisitStatus={updateVisitStatus} updateVisitResult={updateVisitResult} updateVisit={updateVisit} deleteVisit={deleteVisit} />
              </>
            )}


      </div>
    </div>
  );
}
