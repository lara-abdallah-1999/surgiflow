import { AlertTriangle, CheckCircle2, X } from "lucide-react";

type Notice = {
  type: "success" | "error";
  title: string;
  message: string;
  items?: string[];
};

export function WorkspaceNotification({ notice, onClose }: { notice: Notice | null; onClose: () => void }) {
  if (!notice) return null;
  const success = notice.type === "success";
  const Icon = success ? CheckCircle2 : AlertTriangle;
  return (
    <aside role={success ? "status" : "alert"} aria-atomic="true" className={`fixed bottom-4 right-4 z-[300] max-h-[60dvh] w-96 max-w-[calc(100vw-32px)] overflow-auto rounded-xl border bg-white p-4 shadow-xl ${success ? "border-emerald-200" : "border-red-200"}`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className={`shrink-0 ${success ? "text-emerald-600" : "text-red-600"}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800">{notice.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{notice.message}</p>
          {!!notice.items?.length && <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">{notice.items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>}
        </div>
        <button type="button" aria-label="Close notification" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-violet-600"><X size={16} /></button>
      </div>
    </aside>
  );
}
