



export function ModuleStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?:
    | "blue"
    | "green"
    | "indigo"
    | "violet";
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-blue-500" />

      <div className="flex items-center justify-between gap-3 pl-1">
        <div className="min-w-0">
          <p className="truncate text-[8.5px] font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-[20px] font-bold leading-none text-blue-700">
            {value}
          </p>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
