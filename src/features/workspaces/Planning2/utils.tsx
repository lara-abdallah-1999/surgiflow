import { type StatusKey, type Tone } from "./types";
import { STATUS_COLUMNS } from "./config";


export function isBoardStatus(
  status: string,
): status is StatusKey {
  return STATUS_COLUMNS.some(
    (column) =>
      column.key === status,
  );
}


export function getToneClasses(
  tone: Tone,
) {
  if (tone === "amber") {
    return {
      header:
        "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
      accent: "bg-amber-500",
      soft: "bg-amber-50/40",
      time:
        "border-amber-100 bg-amber-50/55 text-amber-700",
    };
  }

  if (tone === "emerald") {
    return {
      header:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
      accent: "bg-emerald-500",
      soft: "bg-emerald-50/35",
      time:
        "border-emerald-100 bg-emerald-50/55 text-emerald-700",
    };
  }

  if (tone === "violet") {
    return {
      header:
        "border-violet-200 bg-violet-50 text-violet-700",
      dot: "bg-violet-500",
      accent: "bg-violet-500",
      soft: "bg-violet-50/35",
      time:
        "border-violet-100 bg-violet-50/55 text-violet-700",
    };
  }

  return {
    header:
      "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    accent: "bg-blue-500",
    soft: "bg-blue-50/35",
    time:
      "border-blue-100 bg-blue-50/55 text-blue-700",
  };
}
