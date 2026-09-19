import { Search } from "lucide-react";



export function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <div className="relative w-[150px]">
      <Search
        size={12}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Search patient, case, procedure..."
        className="h-7 w-full rounded-lg border border-slate-200 bg-slate-50 pl-7.5 pr-2.5 !text-[10px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-50"
      />
    </div>
  );
}
