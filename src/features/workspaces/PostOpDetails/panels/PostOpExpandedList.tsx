import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { FollowUpRow,LifestyleHabitRow,MedicationRow,VisitRow } from "../components";
import { type ExpandedList,type FollowUpOrder,type Medication,type MedicationStatus,type OrderStatus,type PostOpState,type PostOpVisit,type VisitStatus } from "../types";

type Props = {
  expandedList: "medications" | "followUps" | "lifestyle" | "visits";
  setExpandedList: import("react").Dispatch<import("react").SetStateAction<ExpandedList>>;
  postOp: PostOpState;
  updateMedicationStatus: (id: string, status: MedicationStatus, stopReason?: string) => void;
  updateMedication: (id: string, nextItem: Medication) => void;
  deleteMedication: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrderResult: (id: string, result: string) => void;
  updateOrder: (id: string, nextItem: FollowUpOrder) => void;
  deleteOrder: (id: string) => void;
  updateLifestyleHabit: (id: string, instruction: string) => void;
  removeLifestyleHabit: (id: string) => void;
  updateVisitStatus: (id: string, status: VisitStatus) => void;
  updateVisitResult: (id: string, result: string) => void;
  updateVisit: (id: string, nextVisit: PostOpVisit) => void;
  deleteVisit: (id: string) => void;
};

export function PostOpExpandedList({ expandedList, setExpandedList, postOp, updateMedicationStatus, updateMedication, deleteMedication, updateOrderStatus, updateOrderResult, updateOrder, deleteOrder, updateLifestyleHabit, removeLifestyleHabit, updateVisitStatus, updateVisitResult, updateVisit, deleteVisit }: Props) {
  return createPortal(<>
    <button type="button" aria-label="Close expanded list" onClick={() => setExpandedList(null)} className="fixed inset-0 z-[270] bg-slate-900/20" />
    <section role="dialog" aria-modal="true" aria-labelledby="expanded-list-title" className="expanded-list-dialog fixed inset-0 z-[280] m-auto flex h-fit max-h-[90dvh] w-[min(1100px,calc(100vw-32px))] flex-col rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
                  <div data-page-toolbar="true" className="flex min-h-[64px] shrink-0 items-center justify-between border-b border-slate-100 px-3.5">
                    <div>
                      <h3 id="expanded-list-title" className="text-[13px] font-bold text-slate-800">
                        {expandedList ===
                        "medications"
                          ? "All Medications"
                          : expandedList ===
                              "followUps"
                            ? "All Tests & Imaging"
                            : expandedList ===
                                "lifestyle"
                              ? "All Lifestyle Instructions"
                              : "All Post-Op Visits"}
                      </h3>

                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Complete patient follow-up record
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedList(null)
                      }
                      aria-label="Close expanded list"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="grid min-h-0 grid-cols-1 content-start gap-3 overflow-y-auto p-4 md:grid-cols-2 auto-rows-min">
                    {expandedList ===
                      "medications" &&
                      postOp.medications.map(
                        (item) => (
                          <MedicationRow
                            key={item.id}
                            item={item}
                            showHoverDetails={false}
                            onStatusChange={(
                              status,
                              stopReason,
                            ) =>
                              updateMedicationStatus(
                                item.id,
                                status,
                                stopReason,
                              )
                            }
                            onEdit={(
                              nextItem,
                            ) =>
                              updateMedication(
                                item.id,
                                nextItem,
                              )
                            }
                            onDelete={() =>
                              deleteMedication(
                                item.id,
                              )
                            }
                          />
                        ),
                      )}

                    {expandedList ===
                      "followUps" &&
                      postOp.followUps.map(
                        (item) => (
                          <FollowUpRow
                            key={item.id}
                            item={item}
                            showHoverDetails={false}
                            onStatusChange={(
                                status,
                              ) =>
                                updateOrderStatus(
                                item.id,
                                status,
                              )
                            }
                            onResultChange={(
                              result,
                            ) =>
                              updateOrderResult(
                                item.id,
                                result,
                              )
                            }
                            onEdit={(
                              nextItem,
                            ) =>
                              updateOrder(
                                item.id,
                                nextItem,
                              )
                            }
                            onDelete={() =>
                              deleteOrder(
                                item.id,
                              )
                            }
                          />
                        ),
                      )}

                    {expandedList ===
                      "lifestyle" &&
                      postOp.lifestyle.map(
                        (habit) => (
                          <LifestyleHabitRow
                            key={habit.id}
                            habit={habit}
                            onChange={(
                              value,
                            ) =>
                              updateLifestyleHabit(
                                habit.id,
                                value,
                              )
                            }
                            onRemove={() =>
                              removeLifestyleHabit(
                                habit.id,
                              )
                            }
                          />
                        ),
                      )}

                    {expandedList ===
                      "visits" &&
                      postOp.visits.map(
                        (visit) => (
                          <VisitRow
                            key={visit.id}
                            visit={visit}
                            showHoverDetails={false}
                            onStatusChange={(
                              status,
                            ) =>
                              updateVisitStatus(
                                visit.id,
                                status,
                              )
                            }
                            onResultChange={(
                              result,
                            ) =>
                              updateVisitResult(
                                visit.id,
                                result,
                              )
                            }
                            onEdit={(
                              nextVisit,
                            ) =>
                              updateVisit(
                                visit.id,
                                nextVisit,
                              )
                            }
                            onDelete={() =>
                              deleteVisit(
                                visit.id,
                              )
                            }
                          />
                        ),
                      )}
                  </div>
                </section></>, document.body);
}
