import { type CalendarSurgery } from "../types";
import { STATUS_STYLES } from "../config";
import { getInitials, surgeryCaseNumber, surgeryGender, formatTime } from "../utils";
import { X, AlertTriangle, CalendarDays, Clock3, Stethoscope, Building2, ExternalLink } from "lucide-react";
import { PreviewCard } from "./PreviewCard";



export function SurgeryPreview({
  surgery,
  onClose,
  onOpen,
}: {
  surgery: CalendarSurgery;
  onClose: () => void;
  onOpen: () => void;
}) {
  const style =
    STATUS_STYLES[
      surgery.bucket
    ];

  return (
    <>
      <button
        type="button"
        aria-label="Close surgery preview"
        onClick={
          onClose
        }
        className="fixed inset-0 z-[70] bg-slate-900/10"
      />

      <aside className="fixed bottom-4 right-4 top-4 z-[80] flex w-[390px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
        <div className="relative border-b border-slate-100 bg-gradient-to-r from-blue-50/60 via-white to-white px-4 py-3">
          <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-blue-500" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                {getInitials(
                  surgery.patientName,
                )}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-[13px] font-bold text-slate-800">
                  {
                    surgery.patientName
                  }
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[8px] text-slate-400">
                  <span>
                    {
                      surgeryCaseNumber(
                        surgery,
                      )
                    }
                  </span>

                  {surgeryGender(
                    surgery,
                  ) && (
                    <>
                      <span>
                        •
                      </span>
                      <span>
                        {surgeryGender(
                          surgery,
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
            >
              <X
                size={13}
              />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 p-3">
          {surgery.conflict && (
            <div className="mb-3 rounded-xl border border-red-100 bg-red-50 p-2.5">
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={13}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>
                  <p className="text-[9px] font-bold text-red-700">
                    Scheduling conflict
                  </p>

                  <p className="mt-0.5 text-[8px] leading-4 text-red-600">
                    {surgery.doctorConflict &&
                    surgery.roomConflict
                      ? "Both surgeon and operating room overlap another scheduled case."
                      : surgery.doctorConflict
                        ? "The surgeon has another overlapping scheduled case."
                        : "The operating room has another overlapping scheduled case."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div data-responsive-grid="2" className="grid grid-cols-2 gap-2">
            <PreviewCard
              icon={
                <CalendarDays
                  size={12}
                />
              }
              label="Surgery Date"
              value={surgery.start.toLocaleDateString(
                "en-US",
                {
                  month:
                    "short",
                  day:
                    "numeric",
                  year:
                    "numeric",
                },
              )}
            />

            <PreviewCard
              icon={
                <Clock3
                  size={12}
                />
              }
              label="Time"
              value={`${formatTime(
                surgery.start,
              )} – ${formatTime(
                surgery.end,
              )}`}
            />

            <PreviewCard
              icon={
                <Stethoscope
                  size={12}
                />
              }
              label="Surgeon"
              value={
                surgery.doctor
              }
            />

            <PreviewCard
              icon={
                <Building2
                  size={12}
                />
              }
              label="Operating Room"
              value={
                surgery.displayRoom
              }
            />
          </div>

          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/45 p-3">
            <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">
              Procedure
            </p>

            <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-700">
              {
                surgery.displayProcedure
              }
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                Current Status
              </p>

              <p
                className={`mt-1 text-[10px] font-bold ${style.text}`}
              >
                {
                  style.label
                }
              </p>
            </div>

            <span
              className={`h-3 w-3 rounded-full ${style.dot}`}
            />
          </div>
        </div>

        <div className="flex h-12 shrink-0 items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/40 px-3">
          <button
            type="button"
            onClick={
              onClose
            }
            className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-semibold text-slate-500 transition hover:bg-slate-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={
              onOpen
            }
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-[9px] font-semibold text-white transition hover:bg-blue-700"
          >
            <ExternalLink
              size={11}
            />
            Open Surgery
          </button>
        </div>
      </aside>
    </>
  );
}
