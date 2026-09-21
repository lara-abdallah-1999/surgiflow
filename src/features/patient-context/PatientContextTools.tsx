import { useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PatientHeaderHost } from "./headerHost";

export function PatientContextTools({ label, children }: { label: string; children: ReactNode }) {
  const host = useContext(PatientHeaderHost);
  return host ? createPortal(<div><p className="text-[9px] font-semibold text-slate-400">{label}</p><p className="mt-0.5 break-words text-[10px] font-semibold text-red-600">{children}</p></div>, host) : null;
}
