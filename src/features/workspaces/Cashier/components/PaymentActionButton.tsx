import { Banknote } from "lucide-react";



export function PaymentActionButton({
  partial,
  onClick,
}: {
  partial: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex h-6 items-center gap-2 rounded-lg border px-1.5 !text-[12px] font-semibold shadow-sm transition ${
        partial
          ? "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-300 hover:bg-violet-100/70"
          : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100/70"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md ${
          partial
            ? "bg-violet-100 text-violet-600"
            : "bg-indigo-100 text-indigo-600"
        }`}
      >
        <Banknote
          size={11}
        />
      </span>

      {partial
        ? "Continue"
        : "Pay"}
    </button>
  );
}
