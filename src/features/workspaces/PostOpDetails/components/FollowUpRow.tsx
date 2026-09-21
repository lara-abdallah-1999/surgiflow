import { HoverDetailsPanel } from "./HoverDetailsPanel";
import { type FollowUpOrder, type OrderStatus } from "../types";
import { useState } from "react";
import { FlaskConical, Image, X } from "lucide-react";
import { formatShortDate } from "../utils";
import { HoverDetail } from "./HoverDetail";
import { StatusPopover } from "./StatusPopover";
import { ItemActions } from "./ItemActions";



export function FollowUpRow({
  item,
  onStatusChange,
  onResultChange,
  onEdit,
  onDelete,
  showHoverDetails = true,
}: {
  item: FollowUpOrder;
  onStatusChange: (
    status: OrderStatus,
  ) => void;
  onResultChange: (
    result: string,
  ) => void;
  onEdit: (
    item: FollowUpOrder,
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
    useState(item);

  const [resultDraft, setResultDraft] =
    useState(item.result || "");

  return (
    <div className="group/item relative flex min-h-[52px] min-w-0 items-center gap-2 rounded-lg border border-amber-100 bg-slate-50/50 px-2.5 py-1.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600">
        {item.type ===
        "Lab Test" ? (
          <FlaskConical size={11} />
        ) : (
          <Image size={11} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-bold text-slate-700">
          {item.name}
        </p>

        <p className="mt-0.5 truncate text-[9px] text-slate-500">
          {item.type} •{" "}
          {formatShortDate(
            item.dueDate,
          )}
          {item.result && (
            <>
              {" "}
              •{" "}
              <span className="font-semibold text-emerald-600">
                Result recorded
              </span>
            </>
          )}
        </p>
      </div>

      {showHoverDetails && (
        <HoverDetailsPanel>
          <div className="mb-2 border-b border-slate-100 pb-2">
            <p className="text-[10px] font-bold text-slate-700">
              {item.name}
            </p>
            <p className="text-[8px] text-slate-400">
              Test & imaging details
            </p>
          </div>

          <div data-responsive-grid="2" className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <HoverDetail
              label="Type"
              value={item.type}
            />
            <HoverDetail
              label="Status"
              value={item.status}
            />
            <HoverDetail
              label="Due date"
              value={formatShortDate(
                item.dueDate,
              )}
            />
            <HoverDetail
              label="Result"
              value={
                item.result ||
                "Not recorded"
              }
            />
          </div>
        </HoverDetailsPanel>
      )}

      <StatusPopover
        open={statusOpen}
        onOpenChange={setStatusOpen}
        value={item.status}
        options={[
          "Requested",
          "Scheduled",
          "Completed",
        ]}
        tone="amber"
        onChange={(status) =>
          onStatusChange(
            status as OrderStatus,
          )
        }
      />

      <ItemActions
        onResult={() => {
          setResultDraft(
            item.result || "",
          );
          setResultOpen(true);
          setStatusOpen(false);
        }}
        resultLabel={
          item.result
            ? "Edit Result"
            : "Add Result"
        }
        onEdit={() => {
          setEditDraft(item);
          setEditOpen(true);
        }}
        onDelete={onDelete}
      />

      {resultOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-900/10 p-4">
          <div className="w-[400px] max-w-[92vw] rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
            <p className="text-[10px] font-bold text-slate-700">
              Record Result
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              {item.name}
            </p>

            <textarea
              value={resultDraft}
              onChange={(event) =>
                setResultDraft(
                  event.target.value,
                )
              }
              placeholder="Enter test or imaging result..."
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
                className="h-7 rounded-lg bg-emerald-600 px-3 text-[9px] font-semibold text-white"
              >
                Save Result
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 z-[215] flex items-center justify-center bg-slate-900/10 p-4">
          <div className="w-[430px] max-w-[92vw] rounded-2xl border border-amber-100 bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-700">
                  Edit Test / Imaging
                </p>
                <p className="text-[9px] text-slate-400">
                  Update request details
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

            <div className="space-y-2">
              <div>
                <p className="mb-1 text-[9px] font-semibold text-slate-500">
                  Type
                </p>
                <select
                  value={editDraft.type}
                  onChange={(event) =>
                    setEditDraft(
                      (current) => ({
                        ...current,
                        type:
                          event.target.value as FollowUpOrder["type"],
                      }),
                    )
                  }
                  className="h-8 w-full rounded-lg border border-slate-200 px-2 text-[10px] text-slate-700"
                >
                  {[
                    "Lab Test",
                    "X-Ray",
                    "MRI",
                    "CT Scan",
                    "Ultrasound",
                  ].map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div data-responsive-grid="2" className="grid grid-cols-[1fr_130px] gap-2">
                <div>
                  <p className="mb-1 text-[9px] font-semibold text-slate-500">
                    Name
                  </p>
                  <input
                    value={editDraft.name}
                    onChange={(event) =>
                      setEditDraft(
                        (current) => ({
                          ...current,
                          name:
                            event.target.value,
                        }),
                      )
                    }
                    className="h-8 w-full rounded-lg border border-slate-200 px-2 text-[10px] text-slate-700"
                  />
                </div>

                <div>
                  <p className="mb-1 text-[9px] font-semibold text-slate-500">
                    Due date
                  </p>
                  <input
                    type="date"
                    value={editDraft.dueDate}
                    onChange={(event) =>
                      setEditDraft(
                        (current) => ({
                          ...current,
                          dueDate:
                            event.target.value,
                        }),
                      )
                    }
                    className="h-8 w-full rounded-lg border border-slate-200 px-2 text-[10px] text-slate-700"
                  />
                </div>
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
                className="h-7 rounded-lg bg-amber-600 px-3 text-[9px] font-semibold text-white"
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
