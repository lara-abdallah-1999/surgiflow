import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";



export function ItemActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] =
    useState(false);

  const ref =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleOutside(
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
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside,
      );
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      <button
        type="button"
        aria-label="Additional settings"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
        className={`flex h-6 w-6 items-center justify-center rounded-md border transition ${
          open
            ? "border-slate-300 bg-slate-100 text-slate-700"
            : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        }`}
      >
        <MoreVertical size={11} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+5px)] z-[150] w-[130px] rounded-lg border border-slate-200 bg-white p-1.5 shadow-[0_10px_26px_rgba(15,23,42,0.16)]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-[9px] font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <Pencil size={10} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-[9px] font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={10} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
