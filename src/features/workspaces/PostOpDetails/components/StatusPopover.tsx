import { useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";



export function StatusPopover({
  open,
  onOpenChange,
  value,
  options,
  tone,
  onChange,
}: {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
  value: string;
  options: string[];
  tone:
    | "cyan"
    | "amber"
    | "violet";
  onChange: (
    value: string,
  ) => void;
}) {
  const panelRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const target =
        event.target as Node | null;

      if (
        target &&
        panelRef.current &&
        !panelRef.current.contains(
          target,
        )
      ) {
        onOpenChange(false);
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
    onOpenChange,
  ]);

  const toneStyles = {
    cyan: {
      active:
        "border-cyan-200 bg-cyan-50 text-cyan-700",
      dot: "bg-cyan-500",
    },
    amber: {
      active:
        "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    violet: {
      active:
        "border-violet-200 bg-violet-50 text-violet-700",
      dot: "bg-violet-500",
    },
  };

  const style =
    toneStyles[tone];

  return (
    <div
      ref={panelRef}
      className="relative shrink-0"
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      <button
        type="button"
        onClick={() =>
          onOpenChange(!open)
        }
        className={`inline-flex h-6 items-center gap-1 rounded-md border px-2 !text-[10px] font-semibold transition ${
          open
            ? style.active
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
        />

        {value}

        <ChevronDown size={9} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+5px)] z-[95] w-[145px] rounded-lg border border-slate-200 bg-white p-1.5 shadow-[0_10px_26px_rgba(15,23,42,0.16)]">
          <p className="px-1.5 pb-1.5 text-[8px] font-semibold uppercase tracking-wide text-slate-400">
            Change status
          </p>

          <div className="space-y-1">
            {options.map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(
                      option,
                    );
                    onOpenChange(
                      false,
                    );
                  }}
                  className={`flex h-7 w-full items-center justify-between rounded-md px-2 text-left !text-[11px] font-semibold transition ${
                    value === option
                      ? style.active
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>
                    {option}
                  </span>

                  {value ===
                    option && (
                    <Check
                      size={10}
                      strokeWidth={3}
                    />
                  )}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
