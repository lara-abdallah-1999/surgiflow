import { type OrderStatus } from "../types";



export function FollowUpStatus({
  status,
}: {
  status: OrderStatus;
}) {
  const styles = {
    Requested:
      "bg-amber-50 text-amber-700",
    Scheduled:
      "bg-blue-50 text-blue-700",
    Completed:
      "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[9px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
