



export function SectionEyebrow({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-[10.5px] font-bold text-slate-800">
            {title}
          </h3>

          {description && (
            <p className="mt-0.5 text-[8.5px] leading-3.5 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );
}
