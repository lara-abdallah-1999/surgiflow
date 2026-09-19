import type { ReactNode } from "react";

type PageHeaderProps = {
  breadcrumb?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  breadcrumb,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-5">
      {breadcrumb && (
        <div className="mb-2 flex items-center gap-1.5 text-[9px] text-[#98A2B3]">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#667085]">
            {breadcrumb}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[16px] font-semibold tracking-[-0.3px] text-[#202938]">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-[11px] leading-5 text-[#667085]">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}