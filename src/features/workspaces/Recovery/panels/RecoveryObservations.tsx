import { Check,CheckCircle2,HeartPulse } from "lucide-react";
import { SectionTitle } from "../components";
import { awakeningStages,recoveryAssessments } from "../config";
import { type RecoveryState } from "../types";

type Props = {
  recovery: RecoveryState;
  updateRecoveryStage: (stage: number) => void;
  allAssessmentsComplete: boolean;
  assessmentProgress: number;
  toggleAssessment: (item: string) => void;
};

export function RecoveryObservations({ recovery, updateRecoveryStage, allAssessmentsComplete, assessmentProgress, toggleAssessment }: Props) {
  return (<div data-workspace-panel="RecoveryObservations" className="grid min-h-0 grid-rows-[.9fr_1.1fr] gap-2">
                  {/* AWAKENING */}

                  <div className="min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <SectionTitle
                      icon={
                        <HeartPulse
                          size={13}
                        />
                      }
                      title="Patient Awakening"
                      subtitle="Track emergence from anesthesia"
                      action={
                        <span className="rounded-md bg-teal-50 px-2 py-1 text-[9px] font-semibold text-teal-600">
                          {recovery.status}
                        </span>
                      }
                    />

                    <div className="flex h-[calc(100%-44px)] min-h-0 items-center px-3">
                      <div className="relative w-full">
                        <div className="absolute left-[9%] right-[9%] top-[11px] h-[2px] bg-slate-100" />

                        <div
                          className="absolute left-[9%] top-[11px] h-[2px] bg-teal-500 transition-all duration-300"
                          style={{
                            width: `${
                              (recovery.awakeningStage /
                                (awakeningStages.length -
                                  1)) *
                              82
                            }%`,
                          }}
                        />

                        <div className="relative grid grid-cols-5 gap-1">
                          {awakeningStages.map(
                            (
                              stage,
                              index,
                            ) => {
                              const complete =
                                index <
                                recovery.awakeningStage;

                              const current =
                                index ===
                                recovery.awakeningStage;

                              const next =
                                index ===
                                recovery.awakeningStage +
                                  1;

                              return (
                                <button
                                  key={stage}
                                  type="button"
                                  disabled={!next}
                                  onClick={() =>
                                    updateRecoveryStage(
                                      index,
                                    )
                                  }
                                  className={`group flex min-w-0 flex-col items-center text-center ${
                                    next
                                      ? "cursor-pointer"
                                      : "cursor-default"
                                  }`}
                                  title={
                                    next
                                      ? `Move to ${stage}`
                                      : current
                                        ? "Current awakening stage"
                                        : complete
                                          ? "Completed stage"
                                          : "Complete the previous stage first"
                                  }
                                >
                                  <span
                                    className={`relative z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full border-2 text-[8px] font-bold transition ${
                                      complete
                                        ? "border-teal-500 bg-teal-500 text-white"
                                        : current
                                          ? "border-teal-500 bg-teal-50 text-teal-700 ring-4 ring-teal-50"
                                          : next
                                            ? "border-teal-300 bg-white text-teal-600 group-hover:border-teal-500 group-hover:bg-teal-50"
                                            : "border-slate-200 bg-white text-slate-300"
                                    }`}
                                  >
                                    {complete ? (
                                      <Check
                                        size={10}
                                        strokeWidth={3}
                                      />
                                    ) : (
                                      index + 1
                                    )}
                                  </span>

                                  <span
                                    className={`mt-1.5 max-w-[86px] text-[9px] leading-3 ${
                                      complete ||
                                      current
                                        ? "font-semibold text-teal-600"
                                        : next
                                          ? "font-semibold text-teal-500"
                                          : "text-slate-400"
                                    }`}
                                  >
                                    {stage}
                                  </span>
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ASSESSMENTS */}

                  <div className="min-h-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <SectionTitle
                      icon={
                        <CheckCircle2
                          size={13}
                        />
                      }
                      title="Recovery Assessment"
                      subtitle="Required post-operative checks"
                      action={
                        <span
                          className={`rounded-md px-2 py-1 text-[9px] font-semibold ${
                            allAssessmentsComplete
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {
                            assessmentProgress
                          }
                          /
                          {
                            recoveryAssessments.length
                          }
                        </span>
                      }
                    />

                    <div data-responsive-grid="2" className="grid h-[calc(100%-44px)] min-h-0 grid-cols-2 grid-rows-3 gap-1.5 p-2">
                      {recoveryAssessments.map(
                        (item) => {
                          const checked =
                            recovery.assessments.includes(
                              item,
                            );

                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                toggleAssessment(
                                  item,
                                )
                              }
                              className={`flex min-h-0 items-center gap-2 rounded-lg border px-2.5 text-left transition ${
                                checked
                                  ? "border-emerald-200 bg-emerald-50/60"
                                  : "border-slate-200 bg-white hover:bg-slate-50"
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                  checked
                                    ? "border-emerald-500 bg-emerald-500 text-white"
                                    : "border-slate-300 bg-white text-transparent"
                                }`}
                              >
                                <Check
                                  size={
                                    11
                                  }
                                  strokeWidth={
                                    3
                                  }
                                />
                              </span>

                              <span
                                className={`text-[9px] font-semibold leading-4 ${
                                  checked
                                    ? "text-emerald-700"
                                    : "text-slate-600"
                                }`}
                              >
                                {item}
                              </span>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>);
}
