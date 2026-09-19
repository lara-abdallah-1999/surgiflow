import { type PostOpVisit } from "../types";
import { useState, useMemo } from "react";
import { getDoctorAvailableVisitSlots, formatDateInput, formatVisitTime, formatShortDate, getDoctorVisitBookingCount, isDoctorBusyWithSurgeryAtSlot } from "../utils";
import { ClinicalAddForm } from "./ClinicalAddForm";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { RequiredLabel } from "./RequiredLabel";
import { ModernPostOpDatePicker } from "./ModernPostOpDatePicker";
import { POST_OP_VISIT_SLOTS } from "../config";
import { FormInput } from "./FormInput";



export function VisitForm({
  value,
  onChange,
  doctor,
  surgeries,
  existingVisits,
  onCancel,
  onSave,
}: {
  value: {
    date: string;
    time: string;
    progress: string;
    notes: string;
  };
  onChange: React.Dispatch<
    React.SetStateAction<{
      date: string;
      time: string;
      progress: string;
      notes: string;
    }>
  >;
  doctor: string;
  surgeries: any[];
  existingVisits: PostOpVisit[];
  onCancel: () => void;
  onSave: () => void;
}) {
  const [
    timeSlotsOpen,
    setTimeSlotsOpen,
  ] = useState(false);

  const availableSlots =
    useMemo(
      () =>
        value.date
          ? getDoctorAvailableVisitSlots(
              doctor,
              value.date,
              surgeries,
              existingVisits,
            )
          : [],
      [
        doctor,
        value.date,
        surgeries,
        existingVisits,
      ],
    );

  const dateUnavailable =
    Boolean(value.date) &&
    availableSlots.length === 0;

  return (
    <ClinicalAddForm
      eyebrow="New follow-up"
      title="Post-Op Visit"
      icon={
        <CalendarDays size={12} />
      }
      tone="violet"
      onCancel={onCancel}
      onSave={onSave}
      saveLabel="Schedule Visit"
    >
      <div data-responsive-grid="2" className="grid grid-cols-[128px_1fr] gap-2">
        <div>
          <RequiredLabel>
            Visit date
          </RequiredLabel>

          <ModernPostOpDatePicker
            value={value.date}
            min={formatDateInput(
              new Date(),
            )}
            tone="violet"
            onChange={(date) =>
              onChange(
                (current) => ({
                  ...current,
                  date,
                  time: "",
                }),
              )
            }
          />
        </div>

        <div>
          <RequiredLabel>
            Available time with {doctor}
          </RequiredLabel>

          {!value.date ? (
            <div className="flex h-8 items-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-2.5 text-[9px] text-slate-400">
              Select a date first
            </div>
          ) : dateUnavailable ? (
            <div className="flex h-8 items-center rounded-lg border border-red-200 bg-red-50 px-2.5 text-[9px] font-semibold text-red-600">
              No available slots — choose another date
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  setTimeSlotsOpen(true)
                }
                className={`flex h-7 w-full items-center justify-between rounded-lg border px-2.5 !text-[11px] font-semibold transition ${
                  value.time
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-violet-200"
                }`}
              >
                <span>
                  {value.time
                    ? formatVisitTime(
                        value.time,
                      )
                    : "Choose available time"}
                </span>

                <ChevronDown size={10} />
              </button>

              {timeSlotsOpen && (
                <div
                  className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-900/10 p-4"
                  onClick={(event) => {
                    if (
                      event.target ===
                      event.currentTarget
                    ) {
                      setTimeSlotsOpen(
                        false,
                      );
                    }
                  }}
                >
                  <div className="w-[470px] max-w-[92vw] rounded-2xl border border-violet-100 bg-white p-3 shadow-[0_18px_48px_rgba(15,23,42,0.18)]">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-slate-700">
                          Post-Op Time Slots
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          {doctor} •{" "}
                          {formatShortDate(
                            value.date,
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setTimeSlotsOpen(
                            false,
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="mb-2 rounded-lg border border-violet-100 bg-violet-50/40 px-2.5 py-2">
                      <p className="text-[9px] font-semibold text-violet-700">
                        Multiple Post-Op visits can be booked in the same time slot
                      </p>

                      <p className="mt-0.5 text-[8px] leading-3.5 text-slate-400">
                        The number shown is informational only. The doctor decides whether another visit can be added.
                      </p>
                    </div>

                    <div data-responsive-grid="3" className="grid grid-cols-3 gap-1.5">
                      {POST_OP_VISIT_SLOTS.map(
                        (slot) => {
                          const booked =
                            getDoctorVisitBookingCount(
                              doctor,
                              value.date,
                              slot,
                              surgeries,
                              existingVisits,
                            );

                          const blockedBySurgery =
                            isDoctorBusyWithSurgeryAtSlot(
                              doctor,
                              value.date,
                              slot,
                              surgeries,
                            );

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={
                                blockedBySurgery
                              }
                              onClick={() => {
                                onChange(
                                  (current) => ({
                                    ...current,
                                    time: slot,
                                  }),
                                );

                                setTimeSlotsOpen(
                                  false,
                                );
                              }}
                              className={`relative min-h-[50px] rounded-lg border px-2 py-1.5 text-left transition ${
                                value.time ===
                                slot
                                  ? "border-violet-300 bg-violet-50 ring-1 ring-violet-100"
                                  : blockedBySurgery
                                    ? "cursor-not-allowed border-red-100 bg-red-50/40 opacity-60"
                                    : booked > 0
                                      ? "border-amber-200 bg-amber-50/50 hover:border-violet-200 hover:bg-violet-50/40"
                                      : "border-emerald-200 bg-emerald-50/40 hover:border-violet-200 hover:bg-violet-50/40"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-[10px] font-bold ${
                                    value.time ===
                                    slot
                                      ? "text-violet-700"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {formatVisitTime(
                                    slot,
                                  )}
                                </span>

                                <span
                                  className={`rounded-full px-1.5 py-0.5 text-[7px] font-bold ${
                                    blockedBySurgery
                                      ? "bg-red-100 text-red-700"
                                      : booked > 0
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-emerald-100 text-emerald-700"
                                  }`}
                                >
                                  {blockedBySurgery
                                    ? "Busy"
                                    : booked ===
                                        0
                                      ? "Free"
                                      : `${booked} booked`}
                                </span>
                              </div>

                              <p
                                className={`mt-1 text-[7.5px] font-semibold ${
                                  blockedBySurgery
                                    ? "text-red-500"
                                    : booked > 0
                                      ? "text-amber-600"
                                      : "text-emerald-600"
                                }`}
                              >
                                {blockedBySurgery
                                  ? "Doctor in surgery"
                                  : booked ===
                                      0
                                    ? "No visits booked"
                                    : booked ===
                                        1
                                      ? "1 visit already booked"
                                      : `${booked} visits already booked`}
                              </p>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <RequiredLabel>
          Visit purpose
        </RequiredLabel>

        <FormInput
          placeholder="e.g. Review healing and surgical progress"
          value={value.progress}
          onChange={(value) =>
            onChange(
              (current) => ({
                ...current,
                progress: value,
              }),
            )
          }
        />
      </div>

      <div>
        <RequiredLabel optional>
          Notes
        </RequiredLabel>

        <FormInput
          placeholder="Additional instructions"
          value={value.notes}
          onChange={(value) =>
            onChange(
              (current) => ({
                ...current,
                notes: value,
              }),
            )
          }
        />
      </div>
    </ClinicalAddForm>
  );
}
