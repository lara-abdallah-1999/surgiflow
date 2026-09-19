import { type ReactNode } from "react";



export function ToolbarButton({
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
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
    >
      {children}
    </button>
  );
}
