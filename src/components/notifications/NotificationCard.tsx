import { AlertTriangle, CheckCircle2, HeartPulse, Info, X } from "lucide-react";

export type NotificationNotice = {
  type: "success" | "warning" | "error" | "info";
  title: string;
  message?: string;
  items?: string[];
  actionLabel?: string;
  onAction?: () => void;
};
const tones = {
  success: { border: "border-emerald-200", accent: "bg-emerald-500", icon: "bg-emerald-50 text-emerald-600", title: "text-emerald-700", Icon: CheckCircle2 },
  warning: { border: "border-amber-200", accent: "bg-amber-500", icon: "bg-amber-50 text-amber-600", title: "text-amber-700", Icon: AlertTriangle },
  error: { border: "border-red-200", accent: "bg-red-500", icon: "bg-red-50 text-red-600", title: "text-red-700", Icon: HeartPulse },
  info: { border: "border-blue-200", accent: "bg-blue-500", icon: "bg-blue-50 text-blue-600", title: "text-blue-700", Icon: Info },
};
export function NotificationCard({ notice, onClose }: { notice: NotificationNotice; onClose: () => void }) {
  const tone = tones[notice.type];
  return <div role={notice.type === "error" ? "alert" : "status"} aria-atomic="true" className="w-[410px] max-w-[calc(100vw-40px)]">
    <div className={`relative overflow-hidden rounded-xl border bg-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] ${tone.border}`}>
      <span className={`absolute bottom-0 left-0 top-0 w-1 ${tone.accent}`} />
      <div className="flex max-h-[calc(100dvh-40px)] items-start gap-3 overflow-y-auto py-3.5 pl-4 pr-3.5">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}><tone.Icon size={17} /></div>
        <div className="min-w-0 flex-1">
          <p className={`break-words text-[12px] font-bold ${tone.title}`}>{notice.title}</p>
          {notice.message && <p className="mt-0.5 whitespace-pre-line break-words text-[9px] leading-4 text-slate-500">{notice.message}</p>}
          {!!notice.items?.length && <ul className="mt-1 list-disc space-y-1 pl-4 text-[9px] leading-4 text-slate-500">{notice.items.map((item, index) => <li key={index}>{item}</li>)}</ul>}
          {notice.actionLabel && <button type="button" onClick={() => { notice.onAction?.(); onClose(); }} className={`mt-2 rounded-md border px-2 py-1 text-[10px] font-semibold ${tone.border} ${tone.title}`}>{notice.actionLabel}</button>}
        </div>
        <button type="button" onClick={onClose} className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-50 hover:text-slate-500" aria-label="Dismiss notification"><X size={13} /></button>
      </div>
    </div>
  </div>;
}
