import { type Surgery } from "../../../types/surgery";
import { useRef, useState, useEffect } from "react";
import { plannedMinutes, conflictsFor, canPlan, startMinutes, endTime } from "../../../utils/planning";
import { X, UserRound, AlertTriangle } from "lucide-react";
import { field } from "./config";


export function PlanEditor({
  surgery,
  surgeries,
  rooms,
  onClose,
  onSave,
}: {
  surgery: Surgery;
  surgeries: Surgery[];
  rooms: string[];
  onClose: () => void;
  onSave: (
    updates: Partial<Surgery>,
  ) => void;
}) {
  const dialog =
    useRef<HTMLDialogElement>(null);

  const [time, setTime] =
    useState(surgery.time);

  const [room, setRoom] =
    useState(surgery.room);

  const [duration, setDuration] =
    useState(
      plannedMinutes(surgery),
    );

  const [error, setError] =
    useState("");

  const candidate = {
    ...surgery,
    time,
    room,
    durationMinutes: duration,
  };

  const overlaps = conflictsFor(
    candidate,
    surgeries,
  );

  const editable =
    canPlan(surgery);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();

    return () =>
      element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      className="fixed inset-0 m-auto w-[min(520px,calc(100vw-32px))] rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_24px_70px_rgba(15,23,42,0.24)] backdrop:bg-slate-900/30"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();

          if (!editable) {
            return;
          }

          if (
            !/^\d{2}:\d{2}$/.test(
              time,
            ) ||
            !Number.isFinite(
              duration,
            ) ||
            duration < 30 ||
            duration > 720 ||
            startMinutes(time) +
              duration >
              1440
          ) {
            setError(
              "Choose a valid time and duration of 30–720 minutes ending within this day.",
            );
            return;
          }

          if (overlaps.length) {
            setError(
              "Resolve the overlapping bookings before saving this plan.",
            );
            return;
          }

          onSave({
            time,
            room,
            durationMinutes:
              duration,
          });
        }}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-violet-50/55 px-4 py-3">
          <div>
            <h2 className="text-[12px] font-bold text-slate-800">
              {editable
                ? "Adjust Operation Plan"
                : "Operation Plan"}
            </h2>

            <p className="mt-0.5 text-[8.5px] text-slate-400">
              Change planned time, duration or operating room.
            </p>
          </div>

          <button
            aria-label="Close plan"
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <UserRound
                  size={13}
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-slate-800">
                  {
                    surgery.patientName
                  }
                </p>

                <p className="mt-0.5 text-[8.5px] text-slate-400">
                  {surgery.mrn ||
                    "MRN not recorded"}
                </p>
              </div>
            </div>

            <p className="mt-2 text-[9.5px] font-medium text-slate-600">
              {
                surgery.procedure
              }
            </p>

            <p className="mt-1 text-[8.5px] text-slate-400">
              {surgery.doctor}
            </p>
          </div>

          {!editable && (
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-[9px] text-slate-500">
              This operation is{" "}
              {surgery.status.toLowerCase()}.
              Its schedule is read-only.
            </div>
          )}

          <div data-responsive-grid="2" className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5 text-[8.5px] font-semibold text-slate-500">
              <span>
                Start time
              </span>

              <input
                required
                disabled={!editable}
                type="time"
                value={time}
                onChange={(
                  event,
                ) =>
                  setTime(
                    event.target
                      .value,
                  )
                }
                className={`${field} w-full`}
              />
            </label>

            <label className="space-y-1.5 text-[8.5px] font-semibold text-slate-500">
              <span>
                Duration
              </span>

              <div className="relative">
                <input
                  required
                  disabled={!editable}
                  type="number"
                  min={30}
                  max={720}
                  step={1}
                  value={duration}
                  onChange={(
                    event,
                  ) =>
                    setDuration(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className={`${field} w-full pr-12`}
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-slate-400">
                  min
                </span>
              </div>
            </label>
          </div>

          <div>
            <p className="mb-1.5 text-[8.5px] font-semibold text-slate-500">
              Operating room
            </p>

            <div className="flex flex-wrap gap-1.5">
              {rooms.map(
                (name) => (
                  <button
                    key={name}
                    type="button"
                    disabled={!editable}
                    onClick={() =>
                      setRoom(name)
                    }
                    className={`rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold transition ${
                      room === name
                        ? "border-violet-200 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    } disabled:cursor-default disabled:opacity-50`}
                  >
                    {name}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <span className="text-[8.5px] text-slate-400">
              Planned finish
            </span>

            <span className="text-[10px] font-bold text-slate-700">
              {endTime(
                candidate,
              )}
            </span>
          </div>

          {overlaps.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-800">
                <AlertTriangle
                  size={11}
                />
                Overlapping bookings
              </div>

              <div className="mt-2 space-y-1.5">
                {overlaps.map(
                  (other) => (
                    <p
                      key={
                        other.id
                      }
                      className="text-[8.5px] text-amber-700"
                    >
                      {
                        other.time
                      }{" "}
                      /{" "}
                      {
                        other.room
                      }{" "}
                      /{" "}
                      {
                        other.patientName
                      }{" "}
                      /{" "}
                      {other.mrn ||
                        "MRN not recorded"}{" "}
                      (
                      {other.room ===
                      room
                        ? "same room"
                        : "same doctor"}
                      )
                    </p>
                  ),
                )}
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="text-[9px] font-medium text-red-600"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-semibold text-slate-500 transition hover:bg-slate-50"
          >
            Close
          </button>

          {editable && (
            <button
              type="submit"
              className="h-8 rounded-lg bg-violet-600 px-4 text-[9px] font-semibold text-white transition hover:bg-violet-700"
            >
              Save Plan
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
}
