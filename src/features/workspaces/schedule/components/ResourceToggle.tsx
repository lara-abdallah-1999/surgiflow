import { type ResourceMode } from "../types";
import { Stethoscope, Building2 } from "lucide-react";



export function ResourceToggle({
  value,
  onChange,
}: {
  value: ResourceMode;
  onChange: (
    value: ResourceMode,
  ) => void;
}) {
  return (
    <div className="flex h-7 items-center rounded-lg border border-slate-200 bg-white p-0.5">
      <button
        type="button"
        onClick={() =>
          onChange(
            "doctor",
          )
        }
        className={`flex h-5 items-center gap-1 rounded-md px-1.5 !text-[11px] font-semibold transition ${
          value ===
          "doctor"
            ? "bg-slate-100 text-slate-700"
            : "text-slate-400"
        }`}
      >
        <Stethoscope
          size={9}
        />
        Doctors
      </button>

      <button
        type="button"
        onClick={() =>
          onChange(
            "room",
          )
        }
        className={`flex h-5 items-center gap-1 rounded-md px-1.5 !text-[11px] font-semibold transition ${
          value ===
          "room"
            ? "bg-slate-100 text-slate-700"
            : "text-slate-400"
        }`}
      >
        <Building2
          size={9}
        />
        Rooms
      </button>
    </div>
  );
}
