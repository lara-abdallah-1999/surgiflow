import { CalendarDays } from "lucide-react";




export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <CalendarDays
          size={17}
        />
      </div>

      <p className="text-[11px] font-semibold text-slate-600">
        {title}
      </p>

      <p className="mt-1 max-w-[280px] text-[9px] leading-4 text-slate-400">
        {message}
      </p>
    </div>
  );
}
