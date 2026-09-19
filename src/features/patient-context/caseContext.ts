import type { Surgery } from "../../types/surgery";
import { analyzeSurgery } from "../copilot/analyzeSurgery";

/** The URL identifies a case; the store remains the only case record. */
export function resolveSelectedCase(surgeries: readonly Surgery[], pathname: string, search = "", highlightedId?: string): Surgery | undefined {
  const detail = /^\/(reception|pre-op|surgery|post-op|patients)\/([^/]+)(?:\/report)?\/?$/.exec(pathname);
  if (detail) {
    let id: string;
    try { id = decodeURIComponent(detail[2]); } catch { return undefined; }
    const exact = surgeries.find((surgery) => surgery.id === id);
    if (exact || detail[1] !== "patients") return exact;
    const linked = surgeries.filter((surgery) => surgery.patientId === id);
    return linked.length === 1 ? linked[0] : undefined;
  }
  if (!["/accounting", "/reception", "/pre-op", "/surgery", "/post-op"].includes(pathname)) return undefined;
  const id = new URLSearchParams(search).get("case") ?? (pathname === "/accounting" ? highlightedId : undefined);
  return surgeries.find((surgery) => surgery.id === id);
}

export type JourneyState = "complete" | "current" | "pending";
export function getCaseJourney(surgery: Surgery) {
  const stage = analyzeSurgery(surgery).stage;
  const current = ({ Payment: "Cashier", Recovery: "Surgery", Discharged: "Post-Op" } as Record<string, string>)[stage] ?? stage;
  const id = encodeURIComponent(surgery.id);
  const transferred = Boolean((surgery as Surgery & { transferredAt?: string }).transferredAt);
  const items = [
    { label: "Reception", path: `/reception/${id}`, complete: Boolean(surgery.receptionCompletedAt) },
    { label: "Cashier", path: `/accounting?case=${id}`, complete: surgery.paymentStatus === "Paid" },
    { label: "Pre-Op", path: `/pre-op/${id}`, complete: surgery.preOpCompleted === true || surgery.preOpStatus === "Ready" },
    { label: "Surgery", path: `/surgery/${id}`, complete: Boolean(surgery.surgeryCompletedAt) && transferred },
    { label: "Post-Op", path: `/post-op/${id}`, complete: surgery.status === "Discharged" },
  ];
  return items.map((item) => ({
  ...item,
  state: (
    item.label === "Cashier" && surgery.paymentStatus === "Paid"
      ? "complete"
      : item.label === current && surgery.status !== "Discharged"
        ? "current"
        : item.complete
          ? "complete"
          : "pending"
  ) as JourneyState,
}));
}

/** Keep context when Copilot sends a case to a workflow list. */
export function withCaseContext(path: string, caseId: string) {
  if (!["/accounting", "/reception", "/pre-op", "/surgery", "/post-op"].includes(path)) return path;
  return `${path}?case=${encodeURIComponent(caseId)}`;
}
