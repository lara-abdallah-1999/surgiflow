import { Receipt } from "lucide-react";



export function ReceiptActionButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex h-6 items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-1.5 !text-[12px] font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-100/70"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
        <Receipt
          size={11}
        />
      </span>

      Receipt
    </button>
  );
}
