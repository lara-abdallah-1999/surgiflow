import { useLocation, matchPath } from "react-router-dom";
import { useSelectedCase } from "../../patient-context/useSelectedCase";
import { SurgeryCopilotDrawer } from "./SurgeryCopilotDrawer";

export function ModuleCopilot() {
  const { pathname } = useLocation();
  const surgery = useSelectedCase();
  // These workspaces provide their own live, read-only inputs.
  if (matchPath("/surgery/:id", pathname) || matchPath("/surgery/:id/report", pathname) || matchPath("/pre-op/:id", pathname) || pathname === "/recovery") return null;
  return <SurgeryCopilotDrawer key={pathname + (surgery?.id ?? "")} surgery={surgery} />;
}
