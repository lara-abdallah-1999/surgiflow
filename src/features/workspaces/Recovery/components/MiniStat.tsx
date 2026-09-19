import { HeartPulse, CheckCircle2 } from "lucide-react";



/* ========================================================================== */
/* UI HELPERS                                                                 */
/* ========================================================================== */

export function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "teal" | "blue";
}) {
  const styles =
    tone === "teal"
      ? {
          card: "border-teal-200 bg-gradient-to-br from-teal-50 to-white",
          icon: "bg-teal-100 text-teal-600",
          value: "text-teal-700",
        }
      : {
          card: "border-blue-200 bg-gradient-to-br from-blue-50 to-white",
          icon: "bg-blue-100 text-blue-600",
          value: "text-blue-700",
        };

  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${styles.card}`}
    >
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">
          {label}
        </p>

        <p className={`mt-0.5 text-[15px] font-bold ${styles.value}`}>
          {value}
        </p>
      </div>

      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${styles.icon}`}>
        {tone === "teal" ? (
          <HeartPulse size={13} />
        ) : (
          <CheckCircle2 size={13} />
        )}
      </div>
    </div>
  );
}
