import { DoorOpen, Play } from "lucide-react";
import type { Surgery } from "../../types/surgery";
import { useSurgeryStore } from "../../store/surgeryStore";

export function PreOpAdmissionStep({ surgery, onMessage }: { surgery: Surgery; onMessage: (message: string) => void }) {
  const admit = useSurgeryStore((state) => state.admitPatient);
  const start = useSurgeryStore((state) => state.startPreOp);
  if (!["Today", "Booked", "Waiting List", "Payment Pending", "Financially Cleared", "Admitted"].includes(surgery.status)) return null;
  const admitted = surgery.status === "Admitted" && Boolean(surgery.admittedAt);
  const canAdmit = surgery.paymentStatus === "Paid" && ["Financially Cleared", "Admitted"].includes(surgery.status);
  return <section className="shrink-0 rounded-xl border border-blue-100 bg-white p-3" aria-label="OR section admission">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="flex items-center gap-2 text-xs font-bold text-slate-800"><DoorOpen size={16} className="text-blue-600" />OR section admission</h2>
        <p className="mt-1 text-[11px] text-slate-500">{admitted ? "Entry to the OR section is recorded. Start Pre-Op to continue preparation." : canAdmit ? "Confirm when the patient has entered the OR section." : "Complete Reception and payment clearance before recording OR entry."}</p></div>
      <button type="button" disabled={!admitted && !canAdmit} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1 !text-[13px] font-semibold text-white disabled:opacity-40" onClick={() => {
        if (admitted) { start(surgery.id); onMessage("Pre-Op started. Continue preparation below."); }
        else { admit(surgery.id); onMessage("Patient entry to the OR section recorded."); }
      }}>{admitted ? <Play size={14} /> : <DoorOpen size={14} />}{admitted ? "Start Pre-Op" : "Admit · Patient entered OR section"}</button>
    </div>
  </section>;
}
