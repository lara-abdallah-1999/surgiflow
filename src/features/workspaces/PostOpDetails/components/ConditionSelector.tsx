import { type PatientCondition } from "../types";




export function ConditionSelector({
  value,
  onChange,
}: {
  value: PatientCondition;
  onChange: (
    value: PatientCondition,
  ) => void;
}) {
  return (
    <div className="flex h-10 rounded-lg border border-slate-200 bg-cyan-100/70 p-0.5">
      {(
        [
          "Improving",
          "Stable",
          "Needs Attention",
        ] as PatientCondition[]
      ).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() =>
            onChange(item)
          }
          className={`flex-1 rounded-md px-5 !text-[11px] font-semibold transition ${
            value === item
              ? item ===
                "Needs Attention"
                ? "bg-white text-red-600 shadow-sm"
                : "bg-white text-cyan-700 shadow-sm"
              : "text-cyan-700"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
