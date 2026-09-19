import { type SortKey, type SortDirection } from "../types";
import { ArrowUpDown } from "lucide-react";




export function SortHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const active = activeKey === sortKey;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`group flex w-fit items-center gap-1.5 text-left !text-[12px] font-medium transition ${
        active ? "text-slate-700" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <span>{label}</span>
      {active ? (
        <span className="text-[12px] font-semibold leading-none text-amber-600">
          {direction === "asc" ? "↑" : "↓"}
        </span>
      ) : (
        <ArrowUpDown
          size={11}
          className="text-slate-300 transition group-hover:text-slate-400"
        />
      )}
    </button>
  );
}
