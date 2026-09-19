import { type ReactNode } from "react";



export function ReportToolbarButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) =>
        event.preventDefault()
      }
      onClick={onClick}
      className="flex h-6 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
    >
      {children}
    </button>
  );
}
