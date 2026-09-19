import { useLocation } from "react-router-dom";
import { useSurgeryStore } from "../../store/surgeryStore";
import { resolveSelectedCase } from "./caseContext";

export function useSelectedCase() {
  const location = useLocation();
  const surgeries = useSurgeryStore((state) => state.surgeries);
  const state = location.state as { highlightSurgeryId?: string } | null;
  return resolveSelectedCase(surgeries, location.pathname, location.search, state?.highlightSurgeryId);
}
