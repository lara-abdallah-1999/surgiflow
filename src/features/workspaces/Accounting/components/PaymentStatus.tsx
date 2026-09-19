



/* ========================================================================== */
/* STATUS BADGES                                                              */
/* ========================================================================== */

export function PaymentStatus({
  status,
}: {
  status: string;
}) {
  const styles =
    status === "Paid"
      ? {
          wrapper:
            "bg-emerald-50 text-emerald-700",
          dot: "bg-emerald-500",
        }
      : status ===
          "Partially Paid"
        ? {
            wrapper:
              "bg-violet-50 text-violet-700",
            dot: "bg-violet-500",
          }
        : {
            wrapper:
              "bg-amber-50 text-amber-700",
            dot: "bg-amber-500",
          };

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${styles.wrapper}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
      />

      {status}
    </span>
  );
}
