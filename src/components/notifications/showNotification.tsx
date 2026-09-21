import { toast } from "sonner";
import { NotificationCard, type NotificationNotice } from "./NotificationCard";

let notificationSequence = 0;

export function showNotification(notice: NotificationNotice, options: { duration?: number; onClose?: () => void } = {}) {
  const id = "notification-" + Date.now() + "-" + ++notificationSequence;
  toast.custom(() => <NotificationCard notice={notice} onClose={() => { toast.dismiss(id); options.onClose?.(); }} />, {
    id, duration: options.duration ?? 5000, position: "bottom-right",
  });
  return id;
}
export function dismissNotification(id: string) { toast.dismiss(id); }
