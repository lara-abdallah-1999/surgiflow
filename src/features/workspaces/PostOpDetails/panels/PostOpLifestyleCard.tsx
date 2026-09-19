import { ChevronDown,Footprints,Leaf,Plus,X } from "lucide-react";
import { EmptyState,LifestyleHabitRow,LifestyleTypeIcon,ViewAllButton,WorkspaceCard } from "../components";
import { lifestyleHabitTypes } from "../config";
import { type ExpandedList,type LifestyleHabitType,type PostOpState } from "../types";
import { getLifestylePlaceholder } from "../utils";

type Props = {
  postOp: PostOpState;
  setAddingLifestyle: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  setNewLifestyleInstruction: import("react").Dispatch<import("react").SetStateAction<string>>;
  addingLifestyle: boolean;
  setLifestyleTypePanelOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  lifestyleTypePanelOpen: boolean;
  newLifestyleType: LifestyleHabitType;
  setNewLifestyleType: import("react").Dispatch<import("react").SetStateAction<LifestyleHabitType>>;
  newLifestyleInstruction: string;
  addLifestyleHabit: () => void;
  updateLifestyleHabit: (id: string, instruction: string) => void;
  removeLifestyleHabit: (id: string) => void;
  setExpandedList: import("react").Dispatch<import("react").SetStateAction<ExpandedList>>;
};

export function PostOpLifestyleCard({ postOp, setAddingLifestyle, setNewLifestyleInstruction, addingLifestyle, setLifestyleTypePanelOpen, lifestyleTypePanelOpen, newLifestyleType, setNewLifestyleType, newLifestyleInstruction, addLifestyleHabit, updateLifestyleHabit, removeLifestyleHabit, setExpandedList }: Props) {
  return (<WorkspaceCard
                    title="Lifestyle"
                    subtitle="Add the habits and restrictions this patient should follow"
                    icon={
                      <Leaf size={13} />
                    }
                    tone="emerald"
                    count={
                      postOp.lifestyle.length
                    }
                    action={
                      <button
                        type="button"
                        onClick={() => {
                          setAddingLifestyle(
                            (current) =>
                              !current,
                          );
                          setNewLifestyleInstruction(
                            "",
                          );
                        }}
                        className={`inline-flex h-6 items-center gap-1 rounded-md border px-2 !text-[11px] font-bold transition ${
                          addingLifestyle
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {addingLifestyle ? (
                          <X size={9} />
                        ) : (
                          <Plus size={9} />
                        )}

                        {addingLifestyle
                          ? "Cancel"
                          : "Add"}
                      </button>
                    }
                  >
                    <div className="flex h-full min-h-0 flex-col gap-1.5 overflow-hidden">
                      {addingLifestyle && (
                        <div className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50/45 p-1.5">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setLifestyleTypePanelOpen(
                                  (current) =>
                                    !current,
                                )
                              }
                              className={`flex h-7 w-full items-center justify-between rounded-md border bg-white px-2 text-left transition ${
                                lifestyleTypePanelOpen
                                  ? "border-emerald-300 ring-2 ring-emerald-50"
                                  : "border-emerald-100 hover:border-emerald-200"
                              }`}
                            >
                              <span className="flex min-w-0 items-center gap-1.5">
                                <LifestyleTypeIcon
                                  type={
                                    newLifestyleType
                                  }
                                />

                                <span className="truncate !text-[10px] font-bold text-slate-700">
                                  {
                                    newLifestyleType
                                  }
                                </span>
                              </span>

                              <ChevronDown
                                size={10}
                                className={`shrink-0 text-slate-400 transition-transform ${
                                  lifestyleTypePanelOpen
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {lifestyleTypePanelOpen && (
                              <div className="absolute left-0 right-0 top-[calc(100%+5px)] z-30 rounded-lg border border-emerald-100 bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
                                <p className="mb-1.5 text-[7px] font-bold uppercase tracking-wide text-slate-400">
                                  Choose lifestyle type
                                </p>

                                <div className="flex flex-wrap gap-1.5">
                                  {lifestyleHabitTypes.map(
                                    (type) => (
                                      <button
                                        key={type}
                                        type="button"
                                        onClick={() => {
                                          setNewLifestyleType(
                                            type,
                                          );
                                          setLifestyleTypePanelOpen(
                                            false,
                                          );
                                        }}
                                        className={`h-6 rounded-md border px-2 !text-[10px] font-bold transition ${
                                          newLifestyleType ===
                                          type
                                            ? "border-emerald-500 bg-emerald-600 text-white"
                                            : "border-emerald-100 bg-emerald-50/40 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                        }`}
                                      >
                                        {type}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-1.5 flex items-center gap-1.5">
                            <input
                              autoFocus
                              value={
                                newLifestyleInstruction
                              }
                              onChange={(event) =>
                                setNewLifestyleInstruction(
                                  event.target.value,
                                )
                              }
                              onKeyDown={(event) => {
                                if (
                                  event.key ===
                                  "Enter"
                                ) {
                                  event.preventDefault();
                                  addLifestyleHabit();
                                }
                              }}
                              placeholder={getLifestylePlaceholder(
                                newLifestyleType,
                              )}
                              className="h-6 min-w-0 flex-1 rounded-md border border-emerald-100 bg-white px-2 !text-[10px] font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50"
                            />

                            <button
                              type="button"
                              onClick={
                                addLifestyleHabit
                              }
                              className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md bg-emerald-600 px-2 !text-[10px] font-bold text-white transition hover:bg-emerald-700"
                            >
                              <Plus size={9} />
                              Add Habit
                            </button>
                          </div>
                        </div>
                      )}

                      {postOp.lifestyle.length ===
                      0 ? (
                        <EmptyState
                            icon={
                              <Footprints size={16} />
                            }
                            text="No Lifestyle recorded"
                          />
                      ) : (
                        <div data-responsive-grid="2" className="grid min-h-0 flex-1 grid-cols-2 grid-rows-3 gap-1.5 overflow-hidden">
                          {postOp.lifestyle
                            .slice(0, 6)
                            .map(
                              (habit) => (
                                <LifestyleHabitRow
                                  key={
                                    habit.id
                                  }
                                  habit={
                                    habit
                                  }
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

                          {postOp.lifestyle
                            .length > 6 && (
                            <div className="col-span-2">
                              <ViewAllButton
                                count={
                                  postOp.lifestyle
                                    .length
                                }
                                label="lifestyle instructions"
                                onClick={() =>
                                  setExpandedList(
                                    "lifestyle",
                                  )
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </WorkspaceCard>);
}
