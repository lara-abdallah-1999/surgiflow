import { type PostOpVisit, type VisitStatus } from "../types";
import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { formatShortDate, formatVisitTime } from "../utils";
import { HoverDetail } from "./HoverDetail";
import { StatusPopover } from "./StatusPopover";
import { ItemActions } from "./ItemActions";



export function VisitRow({
  visit,
  onStatusChange,
  onResultChange,
  onEdit,
  onDelete,
  showHoverDetails = true,
}: {
  visit: PostOpVisit;
  onStatusChange: (
    status: VisitStatus,
  ) => void;
  onResultChange: (
    result: string,
  ) => void;
  onEdit: (
    visit: PostOpVisit,
  ) => void;
  onDelete: () => void;
  showHoverDetails?: boolean;
}) {
  const [statusOpen, setStatusOpen] =
    useState(false);

  const [resultOpen, setResultOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [editDraft, setEditDraft] =
    useState(visit);

  const [resultDraft, setResultDraft] =
    useState(
      visit.result || "",
    );

  return (
    <div className="group/item relative flex min-h-[52px] min-w-0 items-center gap-2 rounded-lg border border-violet-100 bg-slate-50/50 px-2.5 py-1.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-600">
        <CalendarDays size={11} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-bold text-slate-700">
          {formatShortDate(
            visit.date,
          )}
          {visit.time
            ? ` • ${formatVisitTime(
                visit.time,
              )}`
            : ""}
        </p>

        <p className="mt-0.5 truncate text-[9px] text-slate-500">
          {visit.progress ||
            "Review surgical result and healing"}

          {visit.result && (
            <>
              {" "}
              •{" "}
              <span className="font-semibold text-violet-600">
                Result recorded
              </span>
            </>
          )}
        </p>
      </div>

      {showHoverDetails && (
        <div className="pointer-events-none invisible absolute bottom-[calc(100%+6px)] left-0 z-[120] w-[310px] translate-y-1 rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition-all duration-150 group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:opacity-100">
          <div data-responsive-grid="2" className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <HoverDetail
              label="Status"
              value={visit.status}
            />
            <HoverDetail
              label="Condition"
              value={visit.condition}
            />
            <HoverDetail
              label="Time"
              value={
                visit.time
                  ? formatVisitTime(
                      visit.time,
                    )
                  : "Not set"
              }
            />
            <div className="col-span-2">
              <HoverDetail
                label="Planned review"
                value={
                  visit.progress ||
                  "Not specified"
                }
              />
            </div>
            {visit.notes && (
              <div className="col-span-2">
                <HoverDetail
                  label="Notes"
                  value={visit.notes}
                />
              </div>
            )}
            <div className="col-span-2">
              <HoverDetail
                label="Result"
                value={
                  visit.result ||
                  "Not recorded"
                }
              />
            </div>
          </div>
        </div>
      )}

      <StatusPopover
        open={statusOpen}
        onOpenChange={setStatusOpen}
        value={visit.status}
        options={[
          "Upcoming",
          "Completed",
          "Missed",
        ]}
        tone="violet"
        onChange={(status) =>
          onStatusChange(
            status as VisitStatus,
          )
        }
      />

      <ItemActions
        onResult={() => {
          setResultDraft(
            visit.result || "",
          );
          setResultOpen(true);
          setStatusOpen(false);
        }}
        resultLabel={
          visit.result
            ? "Edit Result"
            : "Add Result"
        }
        onEdit={() => {
          setEditDraft(visit);
          setEditOpen(true);
        }}
        onDelete={onDelete}
      />

      {resultOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-900/10 p-4">
          <div className="w-[410px] max-w-[92vw] rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
            <p className="text-[10px] font-bold text-slate-700">
              Post-Op Visit Result
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              {formatShortDate(
                visit.date,
              )}
            </p>

            <textarea
              value={resultDraft}
              onChange={(event) =>
                setResultDraft(
                  event.target.value,
                )
              }
              placeholder="Record healing progress, examination findings and outcome..."
              className="mt-2 h-[90px] w-full resize-none rounded-lg border border-slate-200 p-2.5 text-[10px] leading-4 text-slate-700 outline-none"
            />

            <div className="mt-2 flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setResultOpen(false)
                }
                className="h-7 rounded-lg border border-slate-200 px-3 text-[9px] font-semibold text-slate-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onResultChange(
                    resultDraft.trim(),
                  );
                  setResultOpen(false);
                }}
                className="h-7 rounded-lg bg-violet-600 px-3 text-[9px] font-semibold text-white"
              >
                Save Result
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 z-[215] flex items-center justify-center bg-slate-900/10 p-4">
          <div className="w-[460px] max-w-[92vw] rounded-2xl border border-violet-100 bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-700">
                  Edit Post-Op Visit
                </p>
                <p className="text-[9px] text-slate-400">
                  Update visit details
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditOpen(false)
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400"
              >
                <X size={12} />
              </button>
            </div>

            <div data-responsive-grid="2" className="grid grid-cols-2 gap-2">
              <div>
                <p className="mb-1 text-[9px] font-semibold text-slate-500">
                  Date
                </p>
                <input
                  type="date"
                  value={editDraft.date}
                  onChange={(event) =>
                    setEditDraft(
                      (current) => ({
                        ...current,
                        date:
                          event.target.value,
                      }),
                    )
                  }
                  className="h-8 w-full rounded-lg border border-slate-200 px-2 text-[10px] text-slate-700"
                />
              </div>

              <div>
                <p className="mb-1 text-[9px] font-semibold text-slate-500">
                  Time
                </p>
                <input
                  type="time"
                  value={editDraft.time}
                  onChange={(event) =>
                    setEditDraft(
                      (current) => ({
                        ...current,
                        time:
                          event.target.value,
                      }),
                    )
                  }
                  className="h-8 w-full rounded-lg border border-slate-200 px-2 text-[10px] text-slate-700"
                />
              </div>

              <div className="col-span-2">
                <p className="mb-1 text-[9px] font-semibold text-slate-500">
                  Visit purpose
                </p>
                <input
                  value={editDraft.progress}
                  onChange={(event) =>
                    setEditDraft(
                      (current) => ({
                        ...current,
                        progress:
                          event.target.value,
                      }),
                    )
                  }
                  className="h-8 w-full rounded-lg border border-slate-200 px-2 text-[10px] text-slate-700"
                />
              </div>

              <div className="col-span-2">
                <p className="mb-1 text-[9px] font-semibold text-slate-500">
                  Notes
                </p>
                <textarea
                  value={editDraft.notes}
                  onChange={(event) =>
                    setEditDraft(
                      (current) => ({
                        ...current,
                        notes:
                          event.target.value,
                      }),
                    )
                  }
                  className="h-[70px] w-full resize-none rounded-lg border border-slate-200 p-2 text-[10px] text-slate-700"
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditOpen(false)
                }
                className="h-7 rounded-lg border border-slate-200 px-3 text-[9px] font-semibold text-slate-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onEdit(editDraft);
                  setEditOpen(false);
                }}
                className="h-7 rounded-lg bg-violet-600 px-3 text-[9px] font-semibold text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
