import { ChevronLeft, ChevronRight } from "lucide-react";




export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const items: Array<
    number | "ellipsis-left" | "ellipsis-right"
  > = [];

  if (totalPages <= 7) {
    for (
      let current = 1;
      current <= totalPages;
      current += 1
    ) {
      items.push(current);
    }
  } else {
    items.push(1);

    if (page > 4) {
      items.push("ellipsis-left");
    }

    const start = Math.max(
      2,
      page - 1,
    );
    const end = Math.min(
      totalPages - 1,
      page + 1,
    );

    for (
      let current = start;
      current <= end;
      current += 1
    ) {
      items.push(current);
    }

    if (page < totalPages - 3) {
      items.push("ellipsis-right");
    }

    items.push(totalPages);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() =>
          onChange(
            Math.max(1, page - 1),
          )
        }
        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ChevronLeft size={12} />
      </button>

      {items.map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            onClick={() =>
              onChange(item)
            }
            className={`flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-[9.5px] font-semibold transition ${
              item === page
                ? "bg-violet-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item}
          </button>
        ) : (
          <span
            key={item}
            className="flex h-7 w-5 items-center justify-center text-[9.5px] font-semibold text-slate-400"
          >
            ...
          </span>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() =>
          onChange(
            Math.min(
              totalPages,
              page + 1,
            ),
          )
        }
        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ChevronRight size={12} />
      </button>
    </div>
  );
}
