import { type RoomItem } from "../types";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, CalendarDays, Building2, ChevronRight } from "lucide-react";
import { CompactRoomCase } from "./CompactRoomCase";





export function RoomBoardTile({
  room,
  alignRight,
  onOpen,
}: {
  room: RoomItem;
  alignRight: boolean;
  onOpen: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  const main = room.current ?? room.next;
  const next = room.current ? room.next : undefined;
  const running =
    room.current?.status === "In Progress";

  useEffect(() => {
    if (!open) return;

    const dismiss = (event: PointerEvent) => {
      if (
        !root.current?.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      dismiss,
    );

    return () =>
      document.removeEventListener(
        "pointerdown",
        dismiss,
      );
  }, [open]);

  return (
    <div
      ref={root}
      className="relative min-w-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          event.stopPropagation();
        }
      }}
      onBlur={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget,
          )
        ) {
          setOpen(false);
        }
      }}
    >
      <div className="overflow-hidden rounded-xl bg-white transition hover:border-slate-300 hover:shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`room-panel-${room.room.replaceAll(
            " ",
            "-",
          )}`}
          onClick={() => main && onOpen(main.id)}
          className={`group block w-full min-w-0 bg-white px-3 py-2.5 text-left transition focus-visible:outline-none ${main ? "cursor-pointer hover:bg-slate-50/55" : "cursor-default"}`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  running
                    ? "bg-violet-500"
                    : main
                      ? "bg-blue-500"
                      : "bg-slate-300"
                }`}
              />

              <span className="truncate text-[11px] font-bold text-slate-900">
                {room.room}
              </span>
            </div>

            <span
              className={`rounded-full px-2.5 text-[8px] font-semibold ${
                running
                  ? "bg-violet-50 text-violet-700"
                  : main
                    ? "bg-blue-50 text-blue-700"
                    : "bg-slate-50 text-slate-400"
              }`}
            >
              {running
                ? "In Surgery"
                : main
                  ? "Next Surgery"
                  : "Available"}
            </span>
          </div>

          {main ? (
            <div className="mt-2">
              <p className="truncate text-[11px] font-semibold text-slate-800">
                {main.patientName}
              </p>

              <p className="mt-1 truncate text-[9.5px] font-medium text-slate-400">
                MRN: {main.mrn || "Not recorded"}
              </p>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-[10px] font-medium text-slate-400">
                No active patient
              </p>

              <p className="mt-1 text-[9px] text-slate-300">
                MRN: —
              </p>
            </div>
          )}
        </button>

        {running && next ? (
          <button
            type="button"
            onClick={() => onOpen(next.id)}
            className="group/next flex h-[30px] w-full items-center justify-between border-t border-violet-100 bg-violet-50/45 px-3 text-left transition hover:bg-violet-50/80"
          >
            <div className="flex items-center gap-2">
              <ArrowRight
                size={9}
                className="text-violet-500"
              />

              <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-violet-500">
                Next Operation
              </span>
            </div>

            <span className="text-[9.5px] font-bold tabular-nums text-violet-700">
              {next.time}
            </span>
          </button>
        ) : main ? (
          <div className="flex h-[30px] w-full items-center justify-between border-t border-blue-100 bg-blue-50/40 px-3">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={9}
                className="text-blue-500"
              />

              <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-blue-500">
                Scheduled Operation
              </span>
            </div>

            <span className="text-[9.5px] font-bold tabular-nums text-blue-700">
              {main.time}
            </span>
          </div>
        ) : (
          <div className="flex h-[30px] w-full items-center justify-between border-t border-slate-100 bg-slate-50/55 px-3">
            <div className="flex items-center gap-2">
              <CalendarDays
                size={9}
                className="text-slate-300"
              />

              <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                No Operation
              </span>
            </div>

            <span className="text-[9px] font-medium text-slate-300">
              —
            </span>
          </div>
        )}
      </div>

      {open && main && (
        <div
          id={`room-panel-${room.room.replaceAll(
            " ",
            "-",
          )}`}
          className={`absolute top-[calc(100%+7px)] z-[220] w-[350px] ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.16)]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-violet-50/45 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-violet-600 ring-1 ring-violet-100">
                  <Building2 size={11} />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-800">
                    {room.room}
                  </p>

                  <p className="text-[8.5px] text-slate-400">
                    {running
                      ? "Current operation"
                      : "Scheduled operation"}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                  running
                    ? "bg-violet-100 text-violet-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {running
                  ? "In Surgery"
                  : main.status}
              </span>
            </div>

            <div className="p-2">
              <CompactRoomCase
                surgery={main}
                title={
                  running
                    ? "Current Surgery"
                    : "Surgery"
                }
                tone="violet"
                onOpen={onOpen}
              />

              {running && next && (
                <div className="mt-2 rounded-lg border border-violet-100 bg-violet-50/45 px-2.5 py-2">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="text-[8px] font-bold uppercase tracking-wide text-violet-600">
                      Next Operation
                    </p>

                    <span className="text-[9px] font-bold tabular-nums text-violet-700">
                      {next.time}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpen(next.id)}
                    className="flex w-full items-center justify-between gap-2 text-left"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[10.5px] font-semibold text-slate-700">
                        {next.patientName}
                      </p>

                      <p className="mt-0.5 truncate text-[8.5px] text-slate-400">
                        {next.procedure} · {next.doctor}
                      </p>
                    </div>

                    <ChevronRight
                      size={10}
                      className="shrink-0 text-violet-400"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
