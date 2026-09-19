import { Plus } from "lucide-react";



export function SmallAddButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-6 items-center gap-1 rounded-md border border-slate-300 bg-white px-2 !text-[11px] font-bold text-slate-600 hover:bg-slate-50"
    >
      <Plus size={9} />
      {label}
    </button>
  );
}
