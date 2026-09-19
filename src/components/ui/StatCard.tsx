import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName?: string;
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName = "bg-[#EAF6FF] text-[#1976D2]",
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-[#E6E8EC] bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-medium text-[#667085]">
            {title}
          </div>

          <div className="mt-1.5 text-[24px] font-semibold tracking-[-0.5px] text-[#202938]">
            {value}
          </div>

          {subtitle && (
            <div className="mt-1 text-[10px] text-[#98A2B3]">
              {subtitle}
            </div>
          )}
        </div>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-md ${iconClassName}`}
        >
          <Icon size={16} />
        </div>
      </div>
    </div>
  );
}