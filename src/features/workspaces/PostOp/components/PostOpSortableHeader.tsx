import { type SortKey, type SortDirection } from "../types";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";




export function PostOpSortableHeader({
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
  onSort: (
    key: SortKey,
  ) => void;
}) {
  const active =
    sortKey === activeKey;

  return (
    <button
      type="button"
      onClick={() =>
        onSort(sortKey)
      }
      className={`flex min-w-0 items-center gap-1 text-left !text-[10px] font-semibold uppercase tracking-wide transition ${
        active
          ? "text-cyan-600"
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      <span className="truncate">
        {label}
      </span>

      {active ? (
        direction ===
        "asc" ? (
          <ArrowUp
            size={9}
          />
        ) : (
          <ArrowDown
            size={9}
          />
        )
      ) : (
        <ArrowUpDown
          size={9}
          className="opacity-50"
        />
      )}
    </button>
  );
}
