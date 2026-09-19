import { useEffect, useRef } from "react";
import type { CopilotDestination } from "../types";

const targets = new Set(["milestones", "anesthesia", "cut", "equipment", "awakening", "assessment", "transfer", "notes"]);

/** Wait for the tab to render and the drawer to release its focus trap. */
export function useCopilotFocus(incoming: CopilotDestination["focus"], navigationKey: string) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function focus(target?: CopilotDestination["focus"]) {
    if (timer.current) clearTimeout(timer.current);
    if (!target || !targets.has(target)) return;
    timer.current = setTimeout(() => {
      const element = document.getElementById(`copilot-${target}`);
      if (!element) return;
      element.focus({ preventScroll: true });
      element.scrollIntoView({ block: "nearest", behavior: "auto" });
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) element.animate([{ outline: "3px solid #a78bfa", outlineOffset: "2px" }, { outline: "3px solid transparent", outlineOffset: "2px" }], { duration: 1800 });
    }, 260);
  }
  useEffect(() => {
    focus(incoming);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [incoming, navigationKey]);
  return focus;
}
