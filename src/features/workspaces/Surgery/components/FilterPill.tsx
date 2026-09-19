



export function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2 py-1 !text-[10px] font-semibold transition ${
        active
          ? "border-violet-200 bg-violet-50 text-violet-700"
          : "border-slate-200 bg-white text-slate-500 hover:border-violet-100 hover:bg-violet-50/40 hover:text-violet-700"
      }`}
    >
      {label}
    </button>
  );
}
