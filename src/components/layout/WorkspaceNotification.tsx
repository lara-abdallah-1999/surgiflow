import { useEffect, useRef } from "react";
import type { NotificationNotice } from "../notifications/NotificationCard";
import { dismissNotification, showNotification } from "../notifications/showNotification";

export function WorkspaceNotification({ notice, onClose }: { notice: NotificationNotice | null; onClose: () => void }) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!notice) return;
    const id = showNotification(notice, { duration: Infinity, onClose: () => onCloseRef.current() });
    return () => dismissNotification(id);
  }, [notice]);
  return null;
}
