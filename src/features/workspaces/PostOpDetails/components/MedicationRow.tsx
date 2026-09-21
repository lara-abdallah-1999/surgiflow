import { HoverDetailsPanel } from "./HoverDetailsPanel";
import { type Medication, type MedicationStatus } from "../types";
import { useState } from "react";
import { Pill, X } from "lucide-react";
import { HoverDetail } from "./HoverDetail";
import { StatusPopover } from "./StatusPopover";
import { ItemActions } from "./ItemActions";



export function MedicationRow({
  item,
  onStatusChange,
  onEdit,
  onDelete,
  showHoverDetails = true,
}: {
  item: Medication;
  onStatusChange: (
    status: MedicationStatus,
    stopReason?: string,
  ) => void;
  onEdit: (
    item: Medication,
  ) => void;
  onDelete: () => void;
  showHoverDetails?: boolean;
}) {
  const [open, setOpen] =
    useState(false);

  const [
    stopReasonOpen,
    setStopReasonOpen,
  ] = useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [editDraft, setEditDraft] =
    useState(item);

  const [
    stopReasonDraft,
    setStopReasonDraft,
  ] = useState(
    item.stopReason || "",
  );

  function requestStatusChange(
    status: string,
  ) {
    if (
      status === "Stopped"
    ) {
      setOpen(false);
      setStopReasonDraft(
        item.stopReason || "",
      );
      setStopReasonOpen(true);
      return;
    }

    onStatusChange(
      status as MedicationStatus,
    );
  }

  return (
    <div className="group/item relative flex min-h-[52px] min-w-0 items-center gap-2 rounded-lg border border-cyan-100 bg-slate-50/50 px-2.5 py-1.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-cyan-600">
        <Pill size={11} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-bold text-slate-700">
          {item.name}{" "}
          <span className="font-semibold text-slate-400">
            {item.dose}
          </span>
        </p>

        <p className="mt-0.5 truncate text-[9px] text-slate-500">
          {item.frequency} •{" "}
          {item.duration}
        </p>
      </div>

      {showHoverDetails && (
        <HoverDetailsPanel>
          <div className="mb-2 border-b border-slate-100 pb-2">
            <p className="text-[10px] font-bold text-slate-700">
              {item.name}
            </p>
            <p className="text-[8px] text-slate-400">
              Medication details
            </p>
          </div>

          <div data-responsive-grid="2" className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <HoverDetail
              label="Dose"
              value={item.dose}
            />
            <HoverDetail
              label="Status"
              value={item.status}
            />
            <HoverDetail
              label="Frequency"
              value={item.frequency}
            />
            <HoverDetail
              label="Duration"
              value={item.duration}
            />
            {item.stopReason && (
              <div className="col-span-2">
                <HoverDetail
                  label="Stop reason"
                  value={item.stopReason}
                />
              </div>
            )}
          </div>
        </HoverDetailsPanel>
      )}

      <StatusPopover
        open={open}
        onOpenChange={setOpen}
        value={item.status}
        options={[
          "Active",
          "Completed",
          "Stopped",
        ]}
        tone="cyan"
        onChange={
          requestStatusChange
        }
      />

      <ItemActions
        onEdit={() => {
          setEditDraft(item);
          setEditOpen(true);
        }}
        onDelete={onDelete}
      />

      {stopReasonOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-slate-900/10 p-4">
          <div className="w-[360px] max-w-[92vw] rounded-xl border border-red-100 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
            <p className="text-[10px] font-bold text-slate-700">
              Reason for stopping
            </p>

            <p className="mt-0.5 text-[9px] leading-4 text-slate-400">
              A reason is required before marking this medication Stopped.
            </p>

            <textarea
              value={stopReasonDraft}
              onChange={(event) =>
                setStopReasonDraft(
                  event.target.value,
                )
              }
              placeholder="Enter reason..."
              className="mt-2 h-[78px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50/50 p-2.5 text-[10px] leading-4 text-slate-700 outline-none focus:border-red-300"
            />

            <div className="mt-2 flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setStopReasonOpen(
                    false,
                  )
                }
                className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-semibold text-slate-500"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  !stopReasonDraft.trim()
                }
                onClick={() => {
                  const reason =
                    stopReasonDraft.trim();

                  if (!reason) return;

                  onStatusChange(
                    "Stopped",
                    reason,
                  );

                  setStopReasonOpen(
                    false,
                  );
                }}
                className="h-7 rounded-lg bg-red-600 px-3 text-[9px] font-semibold text-white disabled:bg-slate-200"
              >
                Confirm Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="fixed inset-0 z-[215] flex items-center justify-center bg-slate-900/10 p-4">
          <div className="w-[430px] max-w-[92vw] rounded-2xl border border-cyan-100 bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-700">
                  Edit Medication
                </p>
                <p className="text-[9px] text-slate-400">
                  Update prescription details
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
              {[
                ["name", "Medication name"],
                ["dose", "Dose"],
                ["frequency", "Frequency"],
                ["duration", "Duration"],
              ].map(
                ([key, label]) => (
                  <div key={key}>
                    <p className="mb-1 text-[9px] font-semibold text-slate-500">
                      {label}
                    </p>
                    <input
                      value={
                        String(
                          editDraft[
                            key as keyof Medication
                          ] ?? "",
                        )
                      }
                      onChange={(event) =>
                        setEditDraft(
                          (current) => ({
                            ...current,
                            [key]:
                              event.target.value,
                          }),
                        )
                      }
                      className="h-8 w-full rounded-lg border border-slate-200 px-2.5 text-[10px] text-slate-700 outline-none focus:border-cyan-300"
                    />
                  </div>
                ),
              )}
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
                className="h-7 rounded-lg bg-cyan-600 px-3 text-[9px] font-semibold text-white"
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
