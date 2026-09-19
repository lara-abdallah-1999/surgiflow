import { STATUS_STYLES } from "../config";



export function StatusBadge({
  status,
}: {
  status: string;
}) {
  const style =
    STATUS_STYLES[status] ??
    STATUS_STYLES.Booked;

  return (
    <span data-cell-label="Status"
      className={`inline-flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-[9.5px] font-semibold ${style.bg} ${style.border} ${style.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
      />

      <span className="truncate">
        {status}
      </span>
    </span>
  );
}
