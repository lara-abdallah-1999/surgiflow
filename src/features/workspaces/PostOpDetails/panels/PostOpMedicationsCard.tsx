import { Pill } from "lucide-react";
import { EmptyState,MedicationForm,MedicationRow,SmallAddButton,ViewAllButton,WorkspaceCard } from "../components";
import { type ExpandedList,type Medication,type MedicationStatus,type PostOpState } from "../types";

type Props = {
  postOp: PostOpState;
  setAddingMedication: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  addingMedication: boolean;
  medicationDraft: { name: string; dose: string; frequency: string; duration: string; };
  setMedicationDraft: import("react").Dispatch<import("react").SetStateAction<{ name: string; dose: string; frequency: string; duration: string; }>>;
  addMedication: () => void;
  updateMedicationStatus: (id: string, status: MedicationStatus, stopReason?: string) => void;
  updateMedication: (id: string, nextItem: Medication) => void;
  deleteMedication: (id: string) => void;
  setExpandedList: import("react").Dispatch<import("react").SetStateAction<ExpandedList>>;
};

export function PostOpMedicationsCard({ postOp, setAddingMedication, addingMedication, medicationDraft, setMedicationDraft, addMedication, updateMedicationStatus, updateMedication, deleteMedication, setExpandedList }: Props) {
  return (<WorkspaceCard
                    title="Medications"
                    subtitle="Post-operative prescriptions"
                    icon={
                      <Pill size={13} />
                    }
                    tone="cyan"
                    count={
                      postOp.medications
                        .length
                    }
                    action={
                      <SmallAddButton
                        onClick={() =>
                          setAddingMedication(
                            true,
                          )
                        }
                        label="Medication"
                      />
                    }
                  >
                    <div className="flex h-full min-h-0 flex-col gap-1.5">
                      {addingMedication && (
                        <MedicationForm
                          value={
                            medicationDraft
                          }
                          onChange={
                            setMedicationDraft
                          }
                          onCancel={() =>
                            setAddingMedication(
                              false,
                            )
                          }
                          onSave={
                            addMedication
                          }
                        />
                      )}

                      {!addingMedication &&
                        postOp.medications
                          .slice(0, 3)
                          .map((item) => (
                            <MedicationRow
                              key={item.id}
                              item={item}
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
                          ))}

                      {!addingMedication &&
                        postOp.medications
                          .length ===
                          0 && (
                          <EmptyState
                            icon={
                              <Pill size={16} />
                            }
                            text="No medications recorded"
                          />
                        )}

                      {!addingMedication &&
                        postOp.medications
                          .length > 3 && (
                          <ViewAllButton
                            count={
                              postOp.medications
                                .length
                            }
                            label="medications"
                            onClick={() =>
                              setExpandedList(
                                "medications",
                              )
                            }
                          />
                        )}
                    </div>
                  </WorkspaceCard>);
}
