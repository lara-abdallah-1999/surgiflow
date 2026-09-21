import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Render outside the scrolling card so the complete preview remains visible.
export function HoverDetailsPanel({ children }: { children: ReactNode }) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const keepOpen = () => clearTimeout(closeTimer.current);
  const closeSoon = () => { closeTimer.current = setTimeout(() => setOpen(false), 120); };

  useEffect(() => {
    const anchor = anchorRef.current?.parentElement;
    if (!anchor) return;
    const show = () => { clearTimeout(closeTimer.current); setOpen(true); };
    const hide = () => { closeTimer.current = setTimeout(() => setOpen(false), 120); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    anchor.addEventListener("mouseenter", show);
    anchor.addEventListener("mouseleave", hide);
    anchor.addEventListener("focusin", show);
    anchor.addEventListener("focusout", hide);
    document.addEventListener("keydown", escape);
    return () => {
      clearTimeout(closeTimer.current);
      anchor.removeEventListener("mouseenter", show);
      anchor.removeEventListener("mouseleave", hide);
      anchor.removeEventListener("focusin", show);
      anchor.removeEventListener("focusout", hide);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const anchor = anchorRef.current?.parentElement;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const rect = anchor.getBoundingClientRect();
      const margin = 12;
      const above = rect.top - panel.offsetHeight - 8;
      setPosition({
        left: Math.max(margin, Math.min(rect.left, window.innerWidth - panel.offsetWidth - margin)),
        top: Math.max(margin, Math.min(above >= margin ? above : rect.bottom + 8, window.innerHeight - panel.offsetHeight - margin)),
      });
    };
    update();
    const observer = new ResizeObserver(update);
    if (panelRef.current) observer.observe(panelRef.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  return <>
    <span ref={anchorRef} className="hidden" />
    {open && createPortal(<div ref={panelRef} role="tooltip" onMouseEnter={keepOpen} onMouseLeave={closeSoon}
      style={{ ...position, width: "min(380px, calc(100vw - 24px))", maxHeight: "calc(100dvh - 24px)" }}
      className="fixed z-[300] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
      {children}
    </div>, document.body)}
  </>;
}
