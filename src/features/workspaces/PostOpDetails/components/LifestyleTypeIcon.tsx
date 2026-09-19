import { type LifestyleHabitType } from "../types";
import { Footprints, Activity, Salad, UtensilsCrossed, Apple, HeartPulse, ShieldCheck, FileText } from "lucide-react";



export function LifestyleTypeIcon({
  type,
}: {
  type: LifestyleHabitType;
}) {
  const icon =
    type === "Walking" ? (
      <Footprints size={10} />
    ) : type === "Exercise" ? (
      <Activity size={10} />
    ) : type === "Nutrition" ? (
      <Salad size={10} />
    ) : type === "Foods to Avoid" ? (
      <UtensilsCrossed size={10} />
    ) : type === "Hydration" ? (
      <Apple size={10} />
    ) : type === "Sleep / Rest" ? (
      <HeartPulse size={10} />
    ) : type === "Restriction" ? (
      <ShieldCheck size={10} />
    ) : (
      <FileText size={10} />
    );

  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
      {icon}
    </span>
  );
}
