import React, { createContext, useCallback, useContext, useState } from "react";

type ToastItem = {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

const ToastContext = createContext<{ show: (t: Omit<ToastItem, "id">) => string; dismiss: (id: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((t: Omit<ToastItem, "id">) => {
    const id = String(Date.now()) + Math.random().toFixed(4).slice(2);
    setToasts((s) => [...s, { id, ...t }]);
    // auto-dismiss
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 5000);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => setToasts((s) => s.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}

      <div className="fixed right-6 bottom-6 z-50 flex w-[320px] flex-col gap-3">
        {toasts.map((t) => (
          <div key={t.id} className="rounded-lg bg-white/95 p-3 shadow-md">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-[#172033]">{t.message}</div>
              <div className="flex items-center gap-2">
                {t.actionLabel && (
                  <button
                    onClick={() => {
                      t.onAction && t.onAction();
                      dismiss(t.id);
                    }}
                    className="rounded px-2 py-1 text-xs font-semibold text-[#2563EB]"
                  >
                    {t.actionLabel}
                  </button>
                )}

                <button onClick={() => dismiss(t.id)} className="text-xs text-[#98a2b3]">Dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default ToastProvider;
