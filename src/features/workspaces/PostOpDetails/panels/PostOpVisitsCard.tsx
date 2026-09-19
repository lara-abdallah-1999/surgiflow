import { CalendarDays } from "lucide-react";
import { EmptyState,SmallAddButton,ViewAllButton,VisitForm,VisitRow,WorkspaceCard } from "../components";
import { type ExpandedList,type PostOpState,type PostOpVisit,type VisitStatus } from "../types";

type Props = {
  postOp: PostOpState;
  setAddingVisit: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  addingVisit: boolean;
  visitDraft: { date: string; time: string; progress: string; notes: string; };
  setVisitDraft: import("react").Dispatch<import("react").SetStateAction<{ date: string; time: string; progress: string; notes: string; }>>;
  selected: import("../../../../types/surgery").Surgery;
  surgeries: import("../../../../types/surgery").Surgery[];
  addVisit: () => void;
  updateVisitStatus: (id: string, status: VisitStatus) => void;
  updateVisitResult: (id: string, result: string) => void;
  updateVisit: (id: string, nextVisit: PostOpVisit) => void;
  deleteVisit: (id: string) => void;
  setExpandedList: import("react").Dispatch<import("react").SetStateAction<ExpandedList>>;
};

export function PostOpVisitsCard({ postOp, setAddingVisit, addingVisit, visitDraft, setVisitDraft, selected, surgeries, addVisit, updateVisitStatus, updateVisitResult, updateVisit, deleteVisit, setExpandedList }: Props) {
  return (<WorkspaceCard
                    title="Post-Op Visits"
                    subtitle="Follow-up appointments"
                    icon={
                      <CalendarDays
                        size={13}
                      />
                    }
                    tone="violet"
                    count={
                      postOp.visits.length
                    }
                    action={
                      <SmallAddButton
                        onClick={() =>
                          setAddingVisit(
                            true,
                          )
                        }
                        label="Visit"
                      />
                    }
                  >
                    <div className="flex h-full min-h-0 flex-col gap-1.5">
                      {addingVisit && (
                        <div
                          className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-900/10 p-4"
                          onMouseDown={(event) => {
                            if (
                              event.target ===
                              event.currentTarget
                            ) {
                              setAddingVisit(
                                false,
                              );
                            }
                          }}
                        >
                          <div className="w-[620px] max-w-[94vw]">
                            <VisitForm
                              value={
                                visitDraft
                              }
                              onChange={
                                setVisitDraft
                              }
                              doctor={
                                selected.doctor
                              }
                              surgeries={
                                surgeries
                              }
                              existingVisits={
                                postOp.visits
                              }
                              onCancel={() =>
                                setAddingVisit(
                                  false,
                                )
                              }
                              onSave={
                                addVisit
                              }
                            />
                          </div>
                        </div>
                      )}

                      {!addingVisit &&
                        postOp.visits
                          .slice(0, 3)
                          .map((visit) => (
                            <VisitRow
                              key={visit.id}
                              visit={visit}
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
                          ))}

                      {!addingVisit &&
                        postOp.visits
                          .length ===
                          0 && (
                          <EmptyState
                            icon={
                              <CalendarDays
                                size={16}
                              />
                            }
                            text="No post-op visits scheduled"
                          />
                        )}

                      {!addingVisit &&
                        postOp.visits
                          .length > 3 && (
                          <ViewAllButton
                            count={
                              postOp.visits
                                .length
                            }
                            label="visits"
                            onClick={() =>
                              setExpandedList(
                                "visits",
                              )
                            }
                          />
                        )}
                    </div>
                  </WorkspaceCard>);
}
