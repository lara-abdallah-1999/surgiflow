import { type FilterState, type StatusBucket } from "../types";
import { useRef, useEffect } from "react";
import { FilterPill } from "./FilterPill";
import { STATUS_STYLES } from "../config";
import { AlertTriangle, Check } from "lucide-react";



export function FiltersPanel({
  open,
  doctors,
  rooms,
  filters,
  onChange,
  onClose,
}: {
  open: boolean;
  doctors: string[];
  rooms: string[];
  filters: FilterState;
  onChange: (
    next: FilterState,
  ) => void;
  onClose: () => void;
}) {
  const ref =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const target =
        event.target as Node | null;

      if (
        target &&
        ref.current &&
        !ref.current.contains(
          target,
        )
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
  }, [
    open,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  function toggleDoctor(
    doctor: string,
  ) {
    onChange({
      ...filters,
      doctors:
        filters.doctors.includes(
          doctor,
        )
          ? filters.doctors.filter(
              (item) =>
                item !==
                doctor,
            )
          : [
              ...filters.doctors,
              doctor,
            ],
    });
  }

  function toggleRoom(
    room: string,
  ) {
    onChange({
      ...filters,
      rooms:
        filters.rooms.includes(
          room,
        )
          ? filters.rooms.filter(
              (item) =>
                item !== room,
            )
          : [
              ...filters.rooms,
              room,
            ],
    });
  }

  function toggleStatus(
    status: StatusBucket,
  ) {
    onChange({
      ...filters,
      statuses:
        filters.statuses.includes(
          status,
        )
          ? filters.statuses.filter(
              (item) =>
                item !==
                status,
            )
          : [
              ...filters.statuses,
              status,
            ],
    });
  }

  const activeCount =
    filters.doctors.length +
    filters.rooms.length +
    filters.statuses.length +
    (filters.conflictsOnly
      ? 1
      : 0);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-[calc(100%+6px)] z-50 w-[350px] rounded-xl border border-slate-200 bg-white p-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.16)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-700">
            Schedule Filters
          </p>

          <p className="mt-0.5 text-[8px] text-slate-400">
            Narrow the calendar without losing context
          </p>
        </div>

        {activeCount >
          0 && (
          <button
            type="button"
            onClick={() =>
              onChange({
                doctors: [],
                rooms: [],
                statuses: [],
                conflictsOnly:
                  false,
              })
            }
            className="text-[9px] font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
            Doctors
          </p>

          <div className="flex flex-wrap gap-1.5">
            {doctors.map(
              (doctor) => (
                <FilterPill
                  key={
                    doctor
                  }
                  label={
                    doctor
                  }
                  active={filters.doctors.includes(
                    doctor,
                  )}
                  onClick={() =>
                    toggleDoctor(
                      doctor,
                    )
                  }
                />
              ),
            )}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
            Operating Rooms
          </p>

          <div className="flex flex-wrap gap-1.5">
            {rooms.map(
              (room) => (
                <FilterPill
                  key={room}
                  label={room}
                  active={filters.rooms.includes(
                    room,
                  )}
                  onClick={() =>
                    toggleRoom(
                      room,
                    )
                  }
                />
              ),
            )}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
            Status
          </p>

          <div className="flex flex-wrap gap-1.5">
            {(
              Object.keys(
                STATUS_STYLES,
              ) as StatusBucket[]
            ).map(
              (status) => (
                <button
                  key={
                    status
                  }
                  type="button"
                  onClick={() =>
                    toggleStatus(
                      status,
                    )
                  }
                  className={`flex items-center gap-1.5 rounded-md border px-2 py-1 !text-[11px] font-semibold transition ${
                    filters.statuses.includes(
                      status,
                    )
                      ? `${STATUS_STYLES[status].bg} ${STATUS_STYLES[status].border} ${STATUS_STYLES[status].text}`
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLES[status].dot}`}
                  />
                  {
                    STATUS_STYLES[
                      status
                    ].label
                  }
                </button>
              ),
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              conflictsOnly:
                !filters.conflictsOnly,
            })
          }
          className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left transition ${
            filters.conflictsOnly
              ? "border-red-200 bg-red-50"
              : "border-slate-200 bg-slate-50/50"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={12}
              className={
                filters.conflictsOnly
                  ? "text-red-600"
                  : "text-slate-400"
              }
            />

            <div>
              <p
                className={`text-[9px] font-semibold ${
                  filters.conflictsOnly
                    ? "text-red-700"
                    : "text-slate-600"
                }`}
              >
                Conflicts only
              </p>

              <p className="text-[8px] text-slate-400">
                Same doctor or room booked at overlapping times
              </p>
            </div>
          </div>

          <span
            className={`flex h-4 w-4 items-center justify-center rounded border ${
              filters.conflictsOnly
                ? "border-red-500 bg-red-500 text-white"
                : "border-slate-300 bg-white text-transparent"
            }`}
          >
            <Check
              size={9}
              strokeWidth={3}
            />
          </span>
        </button>
      </div>
    </div>
  );
}
