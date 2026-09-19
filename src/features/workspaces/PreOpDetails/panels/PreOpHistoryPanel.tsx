import { AlertTriangle,CheckCircle2,ShieldAlert,Stethoscope } from "lucide-react";
import type * as React from 'react';
import { ProgressBadge,SectionEyebrow } from "../components";
import { preOpHistoryItems } from "../config";
import { type ReviewEntry,type ReviewMap,type ReviewValue } from "../types";

type Props = {
  preOpAssessmentProgress: { completed: number; total: number; };
  preOpReview: ReviewMap;
  setReviewValue: (setter: React.Dispatch<React.SetStateAction<ReviewMap>>, id: string, value: ReviewValue) => void;
  setPreOpReview: import("react").Dispatch<import("react").SetStateAction<ReviewMap>>;
  setReviewDetail: (setter: React.Dispatch<React.SetStateAction<ReviewMap>>, id: string, detail: string) => void;
};

export function PreOpHistoryPanel({ preOpAssessmentProgress, preOpReview, setReviewValue, setPreOpReview, setReviewDetail }: Props) {
  return (<div data-workspace-panel="history" data-responsive-grid="2" className="grid h-full min-h-0 gap-2.5 lg:grid-cols-[minmax(0,1.7fr)_minmax(250px,0.7fr)]">
          <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-blue-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <div data-page-toolbar="true" className="flex h-12 shrink-0 items-center justify-between border-b border-blue-100 bg-blue-50/35 px-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Stethoscope size={13} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-[10.5px] font-bold text-slate-800">
                    Relevant Pre-Operative Medical History
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ProgressBadge
                  completed={preOpAssessmentProgress.completed}
                  total={preOpAssessmentProgress.total}
                  color="blue"
                />

              </div>
            </div>

            <div data-responsive-grid="2" className="grid min-h-0 flex-1 grid-cols-2 divide-x divide-slate-100">
              {[preOpHistoryItems.slice(0, 7), preOpHistoryItems.slice(7)].map(
                (column, columnIndex) => (
                  <div
                    key={columnIndex}
                    className="grid min-h-0 grid-rows-7"
                  >
                    {column.map((item) => {
                      const entry = preOpReview[item.id] ?? {
                        value: "",
                        detail: "",
                      };

                      return (
                        <div data-responsive-grid="3"
                          key={item.id}
                          className={`grid min-h-0 grid-cols-[minmax(120px,0.92fr)_30px_minmax(105px,1fr)] items-center gap-2 border-b border-slate-100 px-2.5 last:border-b-0 ${
                            entry.value === "yes"
                              ? "bg-rose-50/45"
                              : entry.value === "no"
                                ? "bg-emerald-50/20"
                                : "bg-white"
                          }`}
                        >
                          <div className="min-w-0">
                            <p
                              className="truncate text-[10px] font-semibold leading-3 text-slate-700"
                              title={item.label}
                            >
                              {item.label}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setReviewValue(
                                setPreOpReview,
                                item.id,
                                entry.value === "yes" ? "no" : "yes",
                              )
                            }
                            aria-pressed={entry.value === "yes"}
                            className={`relative h-[14px] w-[30px] shrink-0 rounded-full transition-colors duration-200 ${
                              entry.value === "yes"
                                ? "bg-emerald-500"
                                : entry.value === "no"
                                  ? "bg-rose-500"
                                  : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`absolute top-[2px] h-[10px] w-[10px] rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.22)] transition-all duration-200 ${
                                entry.value === "yes"
                                  ? "left-[18px]"
                                  : "left-[2px]"
                              }`}
                            />
                          </button>

                          <input
                            value={entry.detail}
                            onChange={(event) =>
                              setReviewDetail(
                                setPreOpReview,
                                item.id,
                                event.target.value,
                              )
                            }
                            disabled={entry.value !== "yes"}
                            placeholder={
                              entry.value === "yes"
                                ? item.placeholder
                                : "—"
                            }
                            className="h-5 min-w-0 rounded-md border border-slate-200 bg-white px-1.5 !text-[11px] text-slate-600 outline-none placeholder:text-slate-300 focus:border-blue-300 disabled:border-transparent disabled:bg-transparent disabled:px-0 disabled:text-slate-300"
                          />
                        </div>
                      );
                    })}
                  </div>
                ),
              )}
            </div>
          </section>

          <section className="flex h-full min-h-0 flex-col rounded-xl border border-blue-100 bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <SectionEyebrow
              icon={<ShieldAlert size={13} />}
              title="Pre-Op Risk Snapshot"
              description="Positive findings are surfaced here for rapid review."
            />

            <div className="mt-2.5 flex min-h-0 flex-1 flex-col">
              <div data-responsive-grid="2" className="grid grid-cols-2 gap-1.5">
                <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-2">
                  <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                    Reviewed
                  </p>
                  <p className="mt-0.5 text-[15px] font-bold text-blue-700">
                    {preOpAssessmentProgress.completed}/{preOpAssessmentProgress.total}
                  </p>
                </div>

                <div className="rounded-lg border border-rose-100 bg-rose-50/50 p-2">
                  <p className="text-[7px] font-bold uppercase tracking-wide text-rose-400">
                    Positive
                  </p>
                  <p className="mt-0.5 text-[15px] font-bold text-rose-700">
                    {
                      Object.values(preOpReview as ReviewMap).filter(
                        (item: ReviewEntry) => item.value === "yes",
                      ).length
                    }
                  </p>
                </div>
              </div>

              <div className="mt-2.5 min-h-0 flex-1">
                <p className="mb-1.5 text-[8px] font-bold uppercase tracking-wide text-slate-400">
                  Findings requiring attention
                </p>

                <div className="space-y-1">
                  {preOpHistoryItems
                    .filter(
                      (item) =>
                        preOpReview[item.id]?.value === "yes",
                    )
                    .slice(0, 6)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="rounded-md border border-rose-100 bg-rose-50/60 px-2 py-1.5"
                      >
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle
                            size={9}
                            className="shrink-0 text-rose-500"
                          />
                          <span className="truncate text-[8px] font-bold text-rose-700">
                            {item.label}
                          </span>
                        </div>
                        {preOpReview[item.id]?.detail && (
                          <p className="mt-0.5 truncate pl-[15px] text-[7.5px] text-rose-600">
                            {preOpReview[item.id]?.detail}
                          </p>
                        )}
                      </div>
                    ))}

                  {Object.values(preOpReview as ReviewMap).every(
                    (item: ReviewEntry) => item.value !== "yes",
                  ) && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/50 p-2 text-[8px] font-semibold text-emerald-700">
                      <CheckCircle2 size={11} />
                      No positive history documented.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2.5 rounded-lg border border-blue-100 bg-blue-50/35 p-2">
                <p className="text-[8px] font-semibold leading-4 text-blue-700">
                  This screen mirrors the hospital’s “reviewed and negative unless specified” workflow while making positive risk findings immediately visible.
                </p>
              </div>
            </div>
          </section>
        </div>);
}
