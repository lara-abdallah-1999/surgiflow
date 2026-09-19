import { Activity,Check,ClipboardCheck,ShieldAlert,Stethoscope } from "lucide-react";
import type * as React from 'react';
import { anesthesiaHistoryItems,anesthesiaTypes } from "../config";
import { type AnesthesiaExamState,type ReviewMap,type ReviewValue } from "../types";

type Props = {
  anesthesiaReview: ReviewMap;
  setReviewValue: (setter: React.Dispatch<React.SetStateAction<ReviewMap>>, id: string, value: ReviewValue) => void;
  setAnesthesiaReview: import("react").Dispatch<import("react").SetStateAction<ReviewMap>>;
  anesthesiaExam: AnesthesiaExamState;
  setAnesthesiaExam: import("react").Dispatch<import("react").SetStateAction<AnesthesiaExamState>>;
  handleSelectAnesthesia: (type: string) => void;
  anesthesia: string;
  selectedPlanConfirmed: boolean;
  confirmAnesthesiaPlan: () => void;
};

export function AnesthesiaPanel({ anesthesiaReview, setReviewValue, setAnesthesiaReview, anesthesiaExam, setAnesthesiaExam, handleSelectAnesthesia, anesthesia, selectedPlanConfirmed, confirmAnesthesiaPlan }: Props) {
  return (<section data-workspace-panel="anesthesia" className="grid h-full min-h-0 grid-rows-[116px_minmax(0,1fr)_104px] gap-0 overflow-hidden bg-white">

          {/* =========================================================
              1. MEDICAL HISTORY REVIEW
          ========================================================== */}
          <section className="flex min-h-0 flex-col overflow-hidden border-b border-purple-100 bg-white">

            <div data-responsive-grid="4" className="grid min-h-0 flex-1 grid-cols-4 gap-2 px-2 py-1.5">
              {[
                {
                  title: "Core Systems",
                  icon: <Activity size={11} />,
                  items: anesthesiaHistoryItems.slice(0, 3),
                },
                {
                  title: "Neuro / Renal",
                  icon: <Stethoscope size={11} />,
                  items: anesthesiaHistoryItems.slice(3, 6),
                },
                {
                  title: "Metabolic / Blood",
                  icon: <ClipboardCheck size={11} />,
                  items: anesthesiaHistoryItems.slice(6, 9),
                },
                {
                  title: "Other History",
                  icon: <ShieldAlert size={11} />,
                  items: anesthesiaHistoryItems.slice(9),
                },
              ].map((group) => (
                <div
                  key={group.title}
                  className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50/35"
                >
                  <div className="flex h-8 shrink-0 items-center gap-2 border-b border-slate-100 bg-white px-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-50 text-purple-600">
                      {group.icon}
                    </span>

                    <span className="truncate text-[8.5px] font-bold text-slate-700">
                      {group.title}
                    </span>
                  </div>

                  <div
                    className="grid min-h-0 flex-1"
                    style={{
                      gridTemplateRows: `repeat(${Math.max(
                        group.items.length,
                        1,
                      )}, minmax(0, 1fr))`,
                    }}
                  >
                    {group.items.map((item, index) => {
                      const entry =
                        anesthesiaReview[item.id] ?? {
                          value: "",
                          detail: "",
                        };

                      const checked =
                        entry.value === "yes";

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setReviewValue(
                              setAnesthesiaReview,
                              item.id,
                              checked ? "" : "yes",
                            )
                          }
                          className={`group flex min-h-0 items-center gap-2 px-2.5 text-left transition ${
                            index < group.items.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          } ${
                            checked
                              ? "bg-purple-50/45"
                              : "bg-white hover:bg-purple-50/20"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition ${
                              checked
                                ? "border-purple-600 bg-purple-600 text-white"
                                : "border-slate-300 bg-white text-transparent group-hover:border-purple-300"
                            }`}
                          >
                            <Check
                              size={9}
                              strokeWidth={3}
                            />
                          </span>

                          <span
                            className={`min-w-0 flex-1 truncate text-[8.5px] font-semibold ${
                              checked
                                ? "text-purple-800"
                                : "text-slate-650"
                            }`}
                            title={item.label}
                          >
                            {item.label}
                          </span>

                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                              checked
                                ? "bg-purple-500"
                                : "bg-slate-200"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================
              2. FUNCTIONAL & PHYSICAL EXAM
          ========================================================== */}
          <section className="flex min-h-0 flex-col overflow-hidden border-b border-purple-100 bg-white">

            <div data-responsive-grid="3" className="grid min-h-0 flex-1 grid-cols-[0.82fr_1.03fr_1.25fr] gap-2 px-2 py-1.5">
              {/* FUNCTIONAL STATUS */}
              <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="flex h-8 shrink-0 items-center gap-2 border-b border-slate-100 bg-slate-50/65 px-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                    <Activity size={11} />
                  </span>

                  <p className="text-[8.5px] font-bold text-slate-700">
                    Functional Status
                  </p>
                </div>

                <div data-responsive-grid="2" className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-1.5 p-2">
                  {[
                    {
                      key: "functionalCapacity" as const,
                      label: "Travels",
                    },
                    {
                      key: "canLieFlat" as const,
                      label: "Can lie flat",
                    },
                    {
                      key: "smoking" as const,
                      label: "Smoke",
                    },
                    {
                      key: "recentUri" as const,
                      label: "Recent URI",
                    },
                  ].map((item) => {
                    const checked =
                      anesthesiaExam[item.key] ===
                      "yes";

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setAnesthesiaExam(
                            (current) => ({
                              ...current,
                              [item.key]:
                                current[item.key] ===
                                "yes"
                                  ? ""
                                  : "yes",
                            }),
                          )
                        }
                        className={`flex min-h-0 items-center gap-2 rounded-md border px-2 text-left transition ${
                          checked
                            ? "border-purple-200 bg-purple-50/45"
                            : "border-slate-200 bg-slate-50/55 hover:border-purple-200 hover:bg-purple-50/20"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
                            checked
                              ? "border-purple-600 bg-purple-600 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          <Check
                            size={9}
                            strokeWidth={3}
                          />
                        </span>

                        <span className="truncate text-[8.5px] font-semibold text-slate-650">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AIRWAY & CARDIO-RESPIRATORY */}
              <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="flex h-8 shrink-0 items-center gap-2 border-b border-slate-100 bg-slate-50/65 px-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-50 text-purple-600">
                    <Stethoscope size={11} />
                  </span>

                  <p className="text-[8.5px] font-bold text-slate-700">
                    Airway & Cardio-Respiratory
                  </p>
                </div>

                <div data-responsive-grid="2" className="grid grid-cols-2 gap-x-3 gap-y-2 p-3">
                  {[
                    ["airway", "Airway"],
                    ["dental", "Dental"],
                    ["heart", "Heart / COR"],
                    ["lungs", "Lungs"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex min-h-0 min-w-0 items-center gap-2"
                    >
                      <span className="w-[48px] shrink-0 text-[7.5px] font-bold text-slate-500">
                        {label}
                      </span>

                      <input
                        value={
                          anesthesiaExam[
                            key as keyof AnesthesiaExamState
                          ] as string
                        }
                        onChange={(event) =>
                          setAnesthesiaExam(
                            (current) => ({
                              ...current,
                              [key]:
                                event.target.value,
                            }),
                          )
                        }
                        placeholder="Finding"
                        className="h-7 min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-50/45 px-2 !text-[9px] font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-50"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* VITALS & ADDITIONAL INFO */}
              <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="flex h-8 shrink-0 items-center gap-2 border-b border-slate-100 bg-slate-50/65 px-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                    <ClipboardCheck size={11} />
                  </span>

                  <p className="text-[8.5px] font-bold text-slate-700">
                    Vitals & Additional Information
                  </p>
                </div>

                <div data-responsive-grid="2" className="grid grid-cols-[0.55fr_1.45fr] gap-3 p-3">
                  <div className="grid content-start gap-2">
                    <label className="min-h-0">
                      <span className="block text-[8px] font-bold tracking-wide text-slate-600">
                        Height
                      </span>

                      <div className="mt-1 flex h-7 items-center rounded-md border border-slate-200 bg-slate-50/45 px-2">
                        <input
                          value={
                            anesthesiaExam.height
                          }
                          onChange={(event) =>
                            setAnesthesiaExam(
                              (current) => ({
                                ...current,
                                height:
                                  event.target
                                    .value,
                              }),
                            )
                          }
                          placeholder="—"
                          className="min-w-0 flex-1 bg-transparent !text-[9px] font-semibold text-slate-700 outline-none"
                        />

                        <span className="text-[7px] font-medium text-slate-400">
                          cm
                        </span>
                      </div>
                    </label>

                    <label className="min-h-0">
                      <span className="block text-[8px] font-bold tracking-wide text-slate-600">
                        Weight
                      </span>

                      <div className="mt-1 flex h-7 items-center rounded-md border border-slate-200 bg-slate-50/45 px-2">
                        <input
                          value={
                            anesthesiaExam.weight
                          }
                          onChange={(event) =>
                            setAnesthesiaExam(
                              (current) => ({
                                ...current,
                                weight:
                                  event.target
                                    .value,
                              }),
                            )
                          }
                          placeholder="—"
                          className="min-w-0 flex-1 bg-transparent !text-[9px] font-semibold text-slate-700 outline-none"
                        />

                        <span className="text-[7px] font-medium text-slate-400">
                          kg
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="grid min-h-0 grid-rows-2 gap-1.5">
                    <label className="min-h-0">
                      <span className="block text-[8px] font-bold tracking-wide text-slate-600">
                        Current medications
                      </span>

                      <input
                        value={
                          anesthesiaExam.currentMedications
                        }
                        onChange={(event) =>
                          setAnesthesiaExam(
                            (current) => ({
                              ...current,
                              currentMedications:
                                event.target.value,
                            }),
                          )
                        }
                        placeholder="Medication list / instructions"
                        className="mt-1 h-7 w-full rounded-md border border-slate-200 bg-slate-50/45 px-2 !text-[9px] font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-50"
                      />
                    </label>

                    <label className="min-h-0">
                      <span className="block text-[8px] font-bold tracking-wide text-slate-600">
                        Prior / Family Anesthesia
                      </span>

                      <input
                        value={
                          anesthesiaExam.priorAnesthesiaHistory
                        }
                        onChange={(event) =>
                          setAnesthesiaExam(
                            (current) => ({
                              ...current,
                              priorAnesthesiaHistory:
                                event.target.value,
                            }),
                          )
                        }
                        placeholder="Previous complications, difficult airway, family history"
                        className="mt-1 h-7 w-full rounded-md border border-slate-200 bg-slate-50/45 px-2 !text-[9px] font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-50"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              3. ANESTHESIA PLAN & CLEARANCE
          ========================================================== */}
          <section className="grid min-h-0 grid-cols-[1.18fr_0.92fr_0.9fr_1fr_150px] items-stretch overflow-hidden border-t border-purple-100 bg-white">
            {/* PLANNED TYPE */}
            <div className="flex min-w-0 flex-col justify-center border-r border-slate-100 px-2.5 py-2">
              <p className="mb-2 block text-[8px] font-bold tracking-wide text-slate-600">
                Planned anesthesia
              </p>

              <div className="flex h-8 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                {anesthesiaTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      handleSelectAnesthesia(type)
                    }
                    className={`min-w-0 flex-1 border-r border-slate-200 px-1 !text-[8px] font-semibold last:border-r-0 ${
                      anesthesia === type
                        ? "bg-purple-600 text-white"
                        : "text-slate-500 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* ASA + NPO */}
            <div className="grid min-w-0 grid-rows-[1fr_auto] border-r border-slate-100 px-2 py-2">
              <div>
                <p className="mb-2 block text-[8px] font-bold tracking-wide text-slate-600">
                  ASA Class
                </p>

                <div className="flex h-7 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                  {[
                    "I",
                    "II",
                    "III",
                    "IV",
                    "V",
                    "VI",
                  ].map((asa) => (
                    <button
                      key={asa}
                      type="button"
                      onClick={() =>
                        setAnesthesiaExam(
                          (current) => ({
                            ...current,
                            asaClass: asa,
                          }),
                        )
                      }
                      className={`min-w-0 flex-1 border-r border-slate-200 !text-[8px] font-bold last:border-r-0 ${
                        anesthesiaExam.asaClass === asa
                          ? "bg-purple-600 text-white"
                          : "text-slate-500 hover:bg-purple-50"
                      }`}
                    >
                      {asa}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAnesthesiaExam(
                    (current) => ({
                      ...current,
                      npoConfirmed:
                        current.npoConfirmed === "yes"
                          ? ""
                          : "yes",
                    }),
                  )
                }
                className="mt-1.5 flex h-7 items-center justify-between rounded-md border border-slate-200 bg-slate-50/55 px-2 text-left transition hover:border-purple-200 hover:bg-purple-50/25"
              >
                <span>
                  <span className="block text-[8px] font-bold tracking-wide text-slate-600">
                    NPO
                  </span>
                  <span className="block text-[8px] font-semibold text-slate-500">
                    Fasting confirmed
                  </span>
                </span>

                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                    anesthesiaExam.npoConfirmed === "yes"
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-300 bg-white text-transparent"
                  }`}
                >
                  <Check size={9} strokeWidth={3} />
                </span>
              </button>
            </div>

            {/* EKG + LABS */}
            <div className="grid min-w-0 grid-rows-2 gap-1.5 border-r border-slate-100 px-2 py-2">
              <label data-responsive-grid="2" className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)] items-center gap-1.5">
                <span className="block text-[8px] font-bold tracking-wide text-slate-600">
                  EKG
                </span>

                <input
                  value={anesthesiaExam.ekg}
                  onChange={(event) =>
                    setAnesthesiaExam(
                      (current) => ({
                        ...current,
                        ekg: event.target.value,
                      }),
                    )
                  }
                  placeholder="Result"
                  className="h-7 min-w-0 rounded-md border border-slate-200 bg-slate-50/45 px-2 !text-[8px] text-slate-700 outline-none placeholder:text-slate-300 focus:border-purple-300 focus:bg-white"
                />
              </label>

              <label data-responsive-grid="2" className="grid min-w-0 grid-cols-[28px_minmax(0,1fr)] items-center gap-1.5">
                <span className="block text-[8px] font-bold tracking-wide text-slate-600">
                  Labs
                </span>

                <input
                  value={anesthesiaExam.labs}
                  onChange={(event) =>
                    setAnesthesiaExam(
                      (current) => ({
                        ...current,
                        labs: event.target.value,
                      }),
                    )
                  }
                  placeholder="Findings"
                  className="h-7 min-w-0 rounded-md border border-slate-200 bg-slate-50/45 px-2 !text-[8px] text-slate-700 outline-none placeholder:text-slate-300 focus:border-purple-300 focus:bg-white"
                />
              </label>
            </div>

            {/* COMMENTS */}
            <div className="flex min-w-0 flex-col justify-center border-r border-slate-100 px-2 py-2">
              <p className="mb-1 block text-[8px] font-bold tracking-wide text-slate-600">
                Comments
              </p>

              <textarea
                value={anesthesiaExam.other}
                onChange={(event) =>
                  setAnesthesiaExam(
                    (current) => ({
                      ...current,
                      other: event.target.value,
                    }),
                  )
                }
                placeholder="Additional anesthesia notes..."
                className="h-[60px] resize-none rounded-md border border-slate-200 bg-slate-50/45 px-2 py-1.5 !text-[8px] text-slate-700 outline-none placeholder:text-slate-300 focus:border-purple-300 focus:bg-white"
              />
            </div>

            {/* PLAN — explicit confirmation checkbox */}
            <div className="flex min-w-0 flex-col justify-center px-2.5 py-2">
              <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
                Plan
              </p>

              <p className="mt-1 min-h-[22px] text-[8px] font-bold leading-3 text-slate-700">
                {selectedPlanConfirmed
                  ? `${anesthesia} type confirmed`
                  : anesthesia
                    ? `${anesthesia} selected — confirm the type below`
                    : "No anesthesia type selected"}
              </p>

              <button
                type="button"
                onClick={confirmAnesthesiaPlan}
                disabled={
                  !anesthesiaTypes.includes(
                    anesthesia,
                  ) ||
                  selectedPlanConfirmed
                }
                className={`mt-1.5 flex h-8 w-full items-center gap-2 rounded-md border px-2.5 text-left transition ${
                  selectedPlanConfirmed
                    ? "border-purple-200 bg-purple-50 text-purple-700"
                    : anesthesiaTypes.includes(
                          anesthesia,
                        )
                      ? "border-purple-300 bg-white text-purple-700 hover:bg-purple-50"
                      : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
                    selectedPlanConfirmed
                      ? "border-purple-600 bg-purple-600 text-white"
                      : anesthesiaTypes.includes(
                            anesthesia,
                          )
                        ? "border-purple-300 bg-white text-transparent"
                        : "border-slate-300 bg-white text-transparent"
                  }`}
                >
                  <Check
                    size={9}
                    strokeWidth={3}
                  />
                </span>

                <span className="min-w-0">
                  <span className="block !text-[8px] font-bold leading-none">
                    {selectedPlanConfirmed
                      ? "Type confirmed"
                      : "Confirm Plan"}
                  </span>

                  <span className="mt-0.5 block truncate !text-[6.5px] font-medium opacity-70">
                    {selectedPlanConfirmed
                      ? `${anesthesia} is confirmed`
                      : anesthesia
                        ? `Confirm ${anesthesia}`
                        : "Choose Planned anesthesia first"}
                  </span>
                </span>
              </button>
            </div>
          </section>
        </section>);
}
