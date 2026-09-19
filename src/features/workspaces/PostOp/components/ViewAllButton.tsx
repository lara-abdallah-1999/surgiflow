import { Maximize2 } from "lucide-react";



export function ViewAllButton({
  count,
  label,
  onClick,
}: {
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-auto flex h-7 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 bg-white text-[9px] font-semibold text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50/30 hover:text-cyan-700"
    >
      <Maximize2 size={10} />
      View all {count} {label}
    </button>
  );
}
