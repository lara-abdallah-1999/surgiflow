import { type ReactNode } from "react";



export function SectionTitle({
  icon,
  title,
  subtitle,
  action,
  emphasis = false,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`flex h-11 shrink-0 items-center justify-between gap-3 border-b px-3 ${
        emphasis
          ? "border-blue-100 bg-blue-50/30"
          : "border-slate-100"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
            emphasis
              ? "bg-blue-100 text-blue-600"
              : "bg-teal-50 text-teal-600"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="!text-[12px] font-semibold text-slate-700">
            {title}
          </p>

          <p className="truncate !text-[10px] text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}
