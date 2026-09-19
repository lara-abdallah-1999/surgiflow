import { useEffect, useState, type RefObject } from "react";
import { getPageCapacity } from "./pageCapacity";

/** Fits a paginated queue to its available space, including wrapped mobile rows. */
export function useTablePageSize(container: RefObject<HTMLDivElement | null>, rowHeight: number, initialSize = 5) {
  const [pageSize, setPageSize] = useState(initialSize);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rows = element.querySelectorAll<HTMLElement>("[data-responsive-table-row]");
        const measuredHeight = Array.from(rows).reduce((height, row) => Math.max(height, row.getBoundingClientRect().height), rowHeight);
        const next = getPageCapacity(element.clientHeight, measuredHeight);
        if (next !== null) setPageSize(current => current === next ? current : next);
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(element, { childList: true, subtree: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [container, rowHeight]);

  return pageSize;
}
