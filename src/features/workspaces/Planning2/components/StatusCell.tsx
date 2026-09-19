import { type Surgery } from "../../../../types/surgery";
import { type Tone, type StatusKey } from "../types";
import { getToneClasses } from "../utils";
import { canPlan, conflictsFor, endTime } from "../../../../utils/planning";
import { Stethoscope } from "lucide-react";



export function StatusCell({
  items,
  tone,
  room,
  status,
  scopedCases,
  draggedSurgery,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onEdit,
  expanded,
}: {
  items: Surgery[];
  tone: Tone;
  room: string;
  status: StatusKey;
  scopedCases: Surgery[];
  draggedSurgery: Surgery | null;
  isDragOver: boolean;
  onDragStart: (
    surgery: Surgery,
  ) => void;
  onDragEnd: () => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: (
    surgery: Surgery,
  ) => void;
  onEdit: (
    surgery: Surgery,
  ) => void;
  expanded: boolean;
}) {
  const toneClasses =
    getToneClasses(tone);

  const acceptsDrop =
    Boolean(
      draggedSurgery &&
        canPlan(
          draggedSurgery,
        ) &&
        draggedSurgery.status ===
          status,
    );

  return (
    <div
      onDragOver={(event) => {
        if (!acceptsDrop) {
          return;
        }

        event.preventDefault();
        event.dataTransfer.dropEffect =
          "move";
        onDragOver();
      }}
      onDragLeave={(event) => {
        const nextTarget =
          event.relatedTarget as
            | Node
            | null;

        if (
          nextTarget &&
          event.currentTarget.contains(
            nextTarget,
          )
        ) {
          return;
        }

        onDragLeave();
      }}
      onDrop={(event) => {
        if (
          !acceptsDrop ||
          !draggedSurgery
        ) {
          return;
        }

        event.preventDefault();
        onDrop(
          draggedSurgery,
        );
      }}
      className={`min-h-0 border-r border-slate-100 last:border-r-0 ${
        expanded
          ? "h-full overflow-hidden p-1"
          : "p-1.5"
      } ${
        toneClasses.soft
      } ${
        isDragOver &&
        acceptsDrop
          ? "relative z-10 bg-violet-50/65 ring-2 ring-inset ring-violet-300"
          : ""
      }`}
    >
      {items.length > 0 ? (
        <div
          className={
            expanded
              ? "h-full min-h-0 space-y-1 overflow-y-auto pr-0.5"
              : "space-y-2"
          }
        >
          {items.map(
            (surgery) => {
              const overlap =
                conflictsFor(
                  surgery,
                  scopedCases,
                );

              const draggable =
                canPlan(
                  surgery,
                );

              return (
                <button data-responsive-grid="2"
                  key={
                    surgery.id
                  }
                  type="button"
                  draggable={
                    draggable
                  }
                  onDragStart={(
                    event,
                  ) => {
                    if (
                      !draggable
                    ) {
                      event.preventDefault();
                      return;
                    }

                    event.dataTransfer.effectAllowed =
                      "move";

                    event.dataTransfer.setData(
                      "text/plain",
                      surgery.id,
                    );

                    onDragStart(
                      surgery,
                    );
                  }}
                  onDragEnd={
                    onDragEnd
                  }
                  onClick={() =>
                    onEdit(
                      surgery,
                    )
                  }
                  title={
                    draggable
                      ? `Drag to another room in ${status}, or drop back into ${room} to change the start time.`
                      : `${surgery.status} surgeries are read-only in Planning.`
                  }
                  className={`group relative grid w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:-translate-y-[1px] hover:border-violet-200 hover:shadow-[0_6px_16px_rgba(15,23,42,0.07)] ${
                    expanded
                      ? "grid-cols-[minmax(0,1fr)_64px]"
                      : "grid-cols-[minmax(0,1fr)_52px]"
                  } ${
                    draggable
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer"
                  } ${
                    draggedSurgery?.id ===
                    surgery.id
                      ? "opacity-45"
                      : ""
                  }`}
                >
                  <span
                    className={`absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full ${toneClasses.accent}`}
                  />

                  {/* CASE INFO */}
                  <div
                    className={`min-w-0 ${
                      expanded
                        ? "px-2 py-1.5 pl-2.5"
                        : "px-2 py-1.5 pl-2.5"
                    }`}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-1.5">
                      <div className="min-w-0">
                        <p
                          className={`truncate font-bold text-slate-800 ${
                            expanded
                              ? "text-[8.5px]"
                              : "text-[8px]"
                          }`}
                        >
                          {
                            surgery.patientName
                          }
                        </p>

                        <p
                          className={`mt-0.5 truncate font-medium text-slate-400 ${
                            expanded
                              ? "text-[7px]"
                              : "text-[6.5px]"
                          }`}
                        >
                          {surgery.mrn ||
                            surgery.id}
                        </p>
                      </div>

                      {overlap.length >
                        0 && (
                        <span className="shrink-0 rounded-full bg-red-50 px-1.5 py-0.5 text-[6.5px] font-bold text-red-600">
                          Conflict
                        </span>
                      )}
                    </div>

                    <p
                      className={`line-clamp-2 font-semibold text-slate-600 ${
                        expanded
                          ? "mt-1 text-[7.5px] leading-3"
                          : "mt-1 text-[7px] leading-3"
                      }`}
                    >
                      {
                        surgery.procedure
                      }
                    </p>

                    <div
                      className={`flex min-w-0 items-center gap-1 ${
                        expanded
                          ? "mt-1"
                          : "mt-1"
                      }`}
                    >
                      <Stethoscope
                        size={8}
                        className="shrink-0 text-violet-500"
                      />

                      <span
                        className={`truncate font-semibold text-slate-500 ${
                          expanded
                            ? "text-[7.5px]"
                            : "text-[6.5px]"
                        }`}
                      >
                        {
                          surgery.doctor
                        }
                      </span>
                    </div>
                  </div>

                  {/* TIME RAIL */}
                  <div
                    className={`flex flex-col justify-center border-l text-center ${toneClasses.time} ${
                      expanded
                        ? "min-h-[64px] px-1.5"
                        : "min-h-[86px] px-1"
                    }`}
                  >
                    <span
                      className={`font-bold uppercase tracking-wide opacity-60 ${
                        expanded
                          ? "text-[6px]"
                          : "text-[5.5px]"
                      }`}
                    >
                      Start
                    </span>

                    <span
                      className={`mt-0.5 font-extrabold tabular-nums ${
                        expanded
                          ? "text-[9px]"
                          : "text-[8px]"
                      }`}
                    >
                      {
                        surgery.time
                      }
                    </span>

                    <span className="my-1 text-[7px] font-bold opacity-40">
                      ↓
                    </span>

                    <span
                      className={`font-bold uppercase tracking-wide opacity-60 ${
                        expanded
                          ? "text-[6px]"
                          : "text-[5.5px]"
                      }`}
                    >
                      End
                    </span>

                    <span
                      className={`mt-0.5 font-extrabold tabular-nums ${
                        expanded
                          ? "text-[9px]"
                          : "text-[8px]"
                      }`}
                    >
                      {endTime(
                        surgery,
                      )}
                    </span>
                  </div>
                </button>
              );
            },
          )}
        </div>
      ) : (
        <div
          className={`flex h-full items-center justify-center rounded-xl border border-dashed transition ${
            expanded
              ? "h-full min-h-0"
              : "min-h-[104px]"
          } ${
            isDragOver &&
            acceptsDrop
              ? "border-violet-300 bg-violet-50 text-violet-500"
              : "border-slate-200 bg-white/35 text-slate-300"
          }`}
        >
          <span className="text-[8px] font-medium">
            {isDragOver &&
            acceptsDrop
              ? `Move to ${room}`
              : "—"}
          </span>
        </div>
      )}
    </div>
  );
}
