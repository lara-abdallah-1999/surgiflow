import React, { createContext, useCallback, useContext } from "react";
import { dismissNotification, showNotification } from "./notifications/showNotification";

type ToastItem = { message: string; actionLabel?: string; onAction?: () => void };
const ToastContext = createContext<{ show: (t: ToastItem) => string; dismiss: (id: string) => void } | null>(null);
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const show = useCallback((t: ToastItem) => showNotification({ type: "info", title: t.message, actionLabel: t.actionLabel, onAction: t.onAction }), []);
  return <ToastContext.Provider value={{ show, dismiss: dismissNotification }}>{children}</ToastContext.Provider>;
}
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
export default ToastProvider;
