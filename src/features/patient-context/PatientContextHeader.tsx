import { CalendarDays, ChevronDown, ClipboardList, Clock3, MapPin, Scissors, UserRound } from "lucide-react";
import { useEffect, useState, type Ref } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { Surgery } from "../../types/surgery";
import { getSurgeryProcedures } from "../../components/surgery/SurgeryPresentation";

function dateLabel(value?: string, time = false) {
  if (!value) return "Not recorded";
  const date = new Date(value.includes("T") ? value : value + "T00:00:00");
  if (Number.isNaN(date.getTime())) return value;
  return time ? date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export function PatientContextHeader({ surgery, toolsRef }: { surgery: Surgery; toolsRef: Ref<HTMLDivElement> }) {
  const compact = useMediaQuery("(max-width: 1100px), (max-height: 800px)");
  const [expanded, setExpanded] = useState(() =>
  typeof window !== "undefined"
    ? window.matchMedia("(min-width: 1024px)").matches
    : true
);
useEffect(() => {
  const mediaQuery = window.matchMedia("(min-width: 1024px)");

  const handleChange = (event: MediaQueryListEvent) => {
    setExpanded(event.matches);
  };

  mediaQuery.addEventListener("change", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
}, []);
  const record = surgery as Surgery & { age?: number; gender?: string; patientGender?: string; sex?: string; mrn?: string };
  const procedures = getSurgeryProcedures(surgery);
  return <header aria-label="Selected patient context" data-compact={compact} data-expanded={expanded} className="patient-context-header shrink-0 border-b border-slate-200 bg-white">
    {compact && 
    <button type="button" className="patient-context-toggle !border-none block lg:!hidden" aria-expanded={expanded} aria-controls="patient-context-details" onClick={() => setExpanded(value => !value)}>
      <ChevronDown size={14} className={expanded ? "rotate-180" : ""} />
    </button>}
    <div id="patient-context-details" className="patient-context-grid grid gap-1.5 p-2">
      <section className="flex min-w-0 items-center gap-2.5 rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50/60 to-white px-3 py-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600"><UserRound size={17} /></span>
        <div className="min-w-0"> 
          <h1 className="break-words text-[14px] font-extrabold text-slate-900">{surgery.patientName}</h1>
          <p className="mt-1 text-[10px] text-slate-500">{[record.mrn || surgery.patientId, record.gender || record.patientGender || record.sex, typeof record.age === "number" ? record.age + " y" : undefined].filter(Boolean).join(" · ")}</p>
          <p className="mt-1 text-[10px] font-semibold text-slate-600">{surgery.doctor || "Doctor not recorded"}</p>
          <span className="mt-1 inline-block rounded-md bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-violet-700">{surgery.status}</span>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-2 rounded-xl border border-slate-100 px-3 py-2 text-[10px]">
        <Fact icon={ClipboardList} label="Case ID" value={surgery.id} />
        <Fact icon={CalendarDays} label="Scheduled" value={dateLabel(surgery.date) + (surgery.time ? " · " + surgery.time : "")} />
        <Fact icon={MapPin} label="OR Room" value={surgery.room || "Not assigned"} />
        <Fact icon={Clock3} label="Arrival" value={surgery.arrivedAt ? dateLabel(surgery.arrivedAt, true) : "Not recorded"} />
      </section>
      <section className="min-w-0 rounded-xl border border-slate-100 px-3 py-2">
        <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-400"><Scissors size={11} className="text-violet-500" /> Procedures & surgical sites</p>
        <ol className="mt-1.5 max-h-24 space-y-1 overflow-y-auto">
          {procedures.map((procedure, index) => <li key={index} className="flex items-start gap-1.5 text-[10px]">
            <span className="rounded bg-violet-50 px-1 text-violet-600">{index + 1}</span><div className="min-w-0 break-words"><p className="font-semibold text-slate-700">{procedure.name}</p><p className="text-[9px] text-slate-500">Site: {procedure.site || "Not recorded"}</p></div>
          </li>)}
          {!procedures.length && <li className="text-[10px] text-slate-400">Not recorded</li>}
        </ol>
      </section>
      <section className="grid grid-cols-2 gap-2 rounded-xl border border-slate-100 px-3 py-2 text-[10px]">
        <Fact label="Cashier" value={surgery.paymentStatus} />
        <Fact label="Allergies" value={surgery.allergies?.join(", ") || "None recorded"} />
        <Fact label="Anesthesia recorded" value={surgery.anesthesiaType || "Not recorded"} />
        <div ref={toolsRef} className="min-w-0 empty:hidden" />
      </section>
    </div>
  </header>;
}

function Fact({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Clock3 }) {
  return <div className="min-w-0"><p className="flex items-center gap-1 text-[9px] font-semibold text-slate-400">{Icon && <Icon size={11} className="shrink-0 text-violet-500" />}{label}</p><p className="mt-0.5 break-words font-semibold text-slate-700">{value}</p></div>;
}
