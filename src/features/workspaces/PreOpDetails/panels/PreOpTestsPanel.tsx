import { Check,CheckCircle2,ClipboardCheck,Plus,ShieldAlert,X } from "lucide-react";
import { CheckRow,ProgressBadge,SectionEyebrow } from "../components";
import { tests } from "../config";
import { type SafetyNote } from "../types";

type Props = {
  testProgress: { completed: number; total: number; };
  completedTests: string[];
  toggleValue: (current: string[], value: string, setter: (value: string[]) => void) => void;
  setCompletedTests: import("react").Dispatch<import("react").SetStateAction<string[]>>;
  safety: SafetyNote;
  exceptions: string[];
  setShowExceptionForm: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  showExceptionForm: boolean;
  exceptionText: string;
  setExceptionText: import("react").Dispatch<import("react").SetStateAction<string>>;
  addException: () => void;
  removeException: (value: string) => void;
  setSafety: import("react").Dispatch<import("react").SetStateAction<SafetyNote>>;
};

export function PreOpTestsPanel({ testProgress, completedTests, toggleValue, setCompletedTests, safety, exceptions, setShowExceptionForm, showExceptionForm, exceptionText, setExceptionText, addException, removeException, setSafety }: Props) {
  return (<div data-workspace-panel="PreOpTestsPanel" data-responsive-grid="2" className="grid h-full min-h-0 gap-2.5 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)]">

          <div className="h-full min-h-0 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">

            <div className="mb-3 flex items-center justify-between">

              <SectionEyebrow
                icon={
                  <ClipboardCheck size={14} />
                }
                title="Pre-Operative Tests"
                description="Verify that all required investigations have been completed"
              />

              <ProgressBadge
                completed={
                  testProgress.completed
                }
                total={
                  testProgress.total
                }
                color="orange"
              />

            </div>

            <div data-responsive-grid="2" className="grid gap-2 sm:grid-cols-2">

              {tests.map(
                (test) => (

                  <CheckRow
                    key={
                      test.id
                    }
                    checked={completedTests.includes(
                      test.id,
                    )}
                    label={
                      test.label
                    }
                    description={
                      test.description
                    }
                    color="orange"
                    onClick={() =>
                      toggleValue(
                        completedTests,
                        test.id,
                        setCompletedTests,
                      )
                    }
                  />

                ),
              )}

            </div>

          </div>

                    {/* CLINICAL EXCEPTIONS */}
                    <section className={`flex h-full min-h-0 flex-col rounded-xl border bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)] ${
                      safety.acknowledged
                        ? "border-emerald-200"
                        : "border-orange-200"
                    }`}>
                      <div data-page-toolbar="true" className={`flex h-12 shrink-0 items-center justify-between border-b px-3 ${
                        safety.acknowledged
                          ? "border-emerald-100 bg-emerald-50/45"
                          : "border-orange-100 bg-orange-50/55"
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`relative flex h-7 w-7 items-center justify-center rounded-lg ${
                            safety.acknowledged
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-orange-100 text-orange-600"
                          }`}>
                            <ShieldAlert size={13} />

                            {exceptions.length > 0 && (
                              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-0.5 text-[6px] font-bold text-white">
                                {exceptions.length}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="text-[11px] font-bold text-slate-800">
                              Clinical Exceptions
                            </h3>

                            <p className="!text-[9px] text-slate-500">
                              Review all alerts before confirming readiness
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setShowExceptionForm((value) => !value)
                          }
                          className="flex h-6 items-center gap-1 rounded-md border border-orange-100 bg-white px-2 text-[9px] font-bold text-orange-600 transition hover:bg-orange-50"
                        >
                          <Plus size={9} />
                          Add
                        </button>
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col p-2.5">
                        {showExceptionForm ? (
                          <div className="flex shrink-0 items-center gap-1.5">
                            <input
                              value={exceptionText}
                              onChange={(event) =>
                                setExceptionText(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  addException();
                                }
                              }}
                              autoFocus
                              placeholder="Add exception..."
                              className="h-7 min-w-0 flex-1 rounded-md border border-orange-200 bg-white px-2 text-[10px] text-slate-700 outline-none focus:border-orange-300"
                            />

                            <button
                              type="button"
                              onClick={addException}
                              className="h-7 rounded-md bg-orange-500 px-2 text-[9px] font-bold text-white hover:bg-orange-600"
                            >
                              Add
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setExceptionText("");
                                setShowExceptionForm(false);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : exceptions.length > 0 ? (
                          <div className="flex min-h-0 flex-wrap content-start gap-1 overflow-hidden">
                            {exceptions.map((exception, index) => (
                              <span
                                key={`${exception}-${index}`}
                                className="inline-flex h-6 max-w-[145px] items-center gap-1 rounded-md border border-orange-100 bg-orange-50 px-2 !text-[10px] font-semibold text-orange-700"
                              >
                                <span className="truncate">
                                  {exception}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeException(exception)
                                  }
                                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-orange-400 transition hover:bg-orange-100 hover:text-red-500"
                                  title={`Remove ${exception}`}
                                >
                                  <X size={9} />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <CheckCircle2
                              size={12}
                              className="text-emerald-500"
                            />
                            No clinical exceptions recorded
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setSafety((current) => ({
                              ...current,
                              acknowledged: !current.acknowledged,
                            }))
                          }
                          className={`mt-auto flex h-9 w-full shrink-0 items-center gap-2 rounded-lg border px-2.5 text-left transition ${
                            safety.acknowledged
                              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                              : "border-orange-300 bg-orange-50 text-orange-800 shadow-[0_0_0_2px_rgba(251,146,60,0.08)] hover:bg-orange-100/70"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                              safety.acknowledged
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-orange-400 bg-white text-transparent"
                            }`}
                          >
                            <Check size={11} strokeWidth={3} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[10px] font-bold">
                              {safety.acknowledged
                                ? "Safety review acknowledged"
                                : "Acknowledge safety review"}
                            </span>

                            <span
                              className={`mt-0.5 block truncate text-[9px] font-medium ${
                                safety.acknowledged
                                  ? "text-emerald-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {safety.acknowledged
                                ? "Requirement complete."
                                : "Review exceptions, then check this before confirming Pre-Op Ready."}
                            </span>
                          </span>
                        </button>
                      </div>
                    </section>

        </div>);
}
