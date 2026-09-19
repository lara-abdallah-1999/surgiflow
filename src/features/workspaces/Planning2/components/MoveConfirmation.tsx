import { type Surgery } from "../../../../types/surgery";
import { useRef, useState, useEffect } from "react";
import { conflictsFor, plannedMinutes, startMinutes, endTime } from "../../../../utils/planning";
import { Route, X, Stethoscope, ChevronRight, AlertTriangle } from "lucide-react";
import { field } from "../config";



export function MoveConfirmation({
  surgery,
  targetRoom,
  surgeries,
  onCancel,
  onConfirm,
}: {
  surgery: Surgery;
  targetRoom: string;
  surgeries: Surgery[];
  onCancel: () => void;
  onConfirm: (
    updates: Partial<Surgery>,
  ) => void;
}) {
  const dialog =
    useRef<HTMLDialogElement>(
      null,
    );

  const [time, setTime] =
    useState(
      surgery.time,
    );

  const [error, setError] =
    useState("");

  const roomChanged =
    targetRoom !==
    surgery.room;

  const timeChanged =
    time !== surgery.time;

  const candidate = {
    ...surgery,
    room: targetRoom,
    time,
  };

  const overlaps =
    conflictsFor(
      candidate,
      surgeries,
    );

  const duration =
    plannedMinutes(
      surgery,
    );

  const hasChange =
    roomChanged ||
    timeChanged;

  useEffect(() => {
    const element =
      dialog.current;

    element?.showModal();

    return () =>
      element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      onCancel={onCancel}
      className="fixed inset-0 m-auto w-[min(500px,calc(100vw-32px))] rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_24px_70px_rgba(15,23,42,0.24)] backdrop:bg-slate-900/30"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (!hasChange) {
            setError(
              "Change the start time, or drag the surgery to a different room.",
            );
            return;
          }

          if (
            !/^\d{2}:\d{2}$/.test(
              time,
            ) ||
            startMinutes(
              time,
            ) +
              duration >
              1440
          ) {
            setError(
              "Choose a valid start time that keeps the operation within the selected day.",
            );
            return;
          }

          if (
            overlaps.length >
            0
          ) {
            setError(
              "This change creates an overlapping room or surgeon booking. Choose another room or time.",
            );
            return;
          }

          onConfirm({
            room: targetRoom,
            time,
          });
        }}
      >
        <div className="flex items-start justify-between border-b border-slate-100 bg-violet-50/55 px-4 py-3">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <Route
                size={14}
              />
            </div>

            <div>
              <h2 className="text-[12px] font-bold text-slate-800">
                Confirm planning change
              </h2>

              <p className="mt-0.5 text-[8.5px] leading-4 text-slate-400">
                Review the room and start time before updating this operation.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close confirmation"
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
          >
            <X
              size={14}
            />
          </button>
        </div>

        <div className="space-y-3.5 p-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/55 p-3">
            <p className="text-[10.5px] font-bold text-slate-800">
              {
                surgery.patientName
              }
            </p>

            <p className="mt-0.5 text-[8.5px] text-slate-500">
              {
                surgery.procedure
              }
            </p>

            <div className="mt-2 flex items-center gap-1.5 text-[8px] font-semibold text-slate-400">
              <Stethoscope
                size={9}
                className="text-violet-500"
              />
              {
                surgery.doctor
              }
              <span>
                ·
              </span>
              {surgery.status}
            </div>
          </div>

          <div data-responsive-grid="3" className="grid grid-cols-[1fr_30px_1fr] items-stretch gap-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-[6.5px] font-bold uppercase tracking-wide text-slate-400">
                Current plan
              </p>

              <p className="mt-2 text-[9.5px] font-bold text-slate-700">
                {
                  surgery.room
                }
              </p>

              <p className="mt-0.5 text-[8px] font-semibold tabular-nums text-slate-500">
                {
                  surgery.time
                }{" "}
                –{" "}
                {endTime(
                  surgery,
                )}
              </p>
            </div>

            <div className="flex items-center justify-center text-slate-300">
              <ChevronRight
                size={14}
              />
            </div>

            <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-3">
              <p className="text-[6.5px] font-bold uppercase tracking-wide text-violet-500">
                New plan
              </p>

              <p className="mt-2 text-[9.5px] font-bold text-violet-700">
                {
                  targetRoom
                }
              </p>

              <p className="mt-0.5 text-[8px] font-semibold tabular-nums text-violet-600">
                {time}
                {" – "}
                {endTime(
                  candidate,
                )}
              </p>
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-[8px] font-semibold text-slate-500">
              Start time
            </span>

            <div className="flex items-center gap-2">
              <input
                required
                type="time"
                value={time}
                onChange={(
                  event,
                ) => {
                  setTime(
                    event.target
                      .value,
                  );
                  setError("");
                }}
                className={`${field} flex-1`}
              />

              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[7.5px] font-semibold text-slate-400">
                {duration} min
              </span>
            </div>
          </label>

          <div data-responsive-grid="2" className="grid grid-cols-2 gap-2">
            <div
              className={`rounded-lg border px-2.5 py-2 ${
                roomChanged
                  ? "border-violet-200 bg-violet-50 text-violet-700"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <p className="text-[6.5px] font-bold uppercase tracking-wide opacity-70">
                Room
              </p>
              <p className="mt-0.5 text-[8px] font-semibold">
                {roomChanged
                  ? `${surgery.room} → ${targetRoom}`
                  : "No room change"}
              </p>
            </div>

            <div
              className={`rounded-lg border px-2.5 py-2 ${
                timeChanged
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <p className="text-[6.5px] font-bold uppercase tracking-wide opacity-70">
                Time
              </p>
              <p className="mt-0.5 text-[8px] font-semibold">
                {timeChanged
                  ? `${surgery.time} → ${time}`
                  : "No time change"}
              </p>
            </div>
          </div>

          {overlaps.length >
            0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-amber-800">
                <AlertTriangle
                  size={11}
                />
                Scheduling conflict
              </div>

              <div className="mt-1.5 space-y-1">
                {overlaps
                  .slice(0, 3)
                  .map(
                    (
                      other,
                    ) => (
                      <p
                        key={
                          other.id
                        }
                        className="text-[7.5px] text-amber-700"
                      >
                        {other.time} · {other.room} · {other.patientName} · {other.doctor}
                      </p>
                    ),
                  )}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-2.5 py-2 text-[7.5px] text-slate-500">
            The workflow state stays{" "}
            <span className="font-bold text-slate-700">
              {surgery.status}
            </span>
            . Drag & drop only changes planning room/time.
          </div>

          {error && (
            <p
              role="alert"
              className="text-[8.5px] font-semibold text-red-600"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[8.5px] font-semibold text-slate-500 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              !hasChange
            }
            className="h-8 rounded-lg bg-violet-600 px-4 text-[8.5px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Confirm change
          </button>
        </div>
      </form>
    </dialog>
  );
}
