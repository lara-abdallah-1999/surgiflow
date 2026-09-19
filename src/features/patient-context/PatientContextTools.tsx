import { useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PatientHeaderHost } from "./headerHost";

export function PatientContextTools({ children }: { children: ReactNode }) {
  const host = useContext(PatientHeaderHost);
  return host ? createPortal(<div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 px-3 py-1.5 text-[10px] text-slate-600">{children}</div>, host) : null;
}
