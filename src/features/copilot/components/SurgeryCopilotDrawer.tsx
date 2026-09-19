import { VoicePatientPicker } from "./VoicePatientPicker";
import { AiConversation } from "./AiConversation";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, X, RefreshCw } from "lucide-react";
import { useSurgeryStore } from "../../../store/surgeryStore";
import { analyzeSurgery } from "../analyzeSurgery";
import { readSavedCopilotState } from "../utils";
import type { CopilotDestination, CopilotProps } from "../types";
import { CopilotNextAction } from "./CopilotNextAction";
import { CopilotReasonList } from "./CopilotReasonList";
import { CopilotStatusList } from "./CopilotStatusList";
import { CopilotWorkflowProgress } from "./CopilotWorkflowProgress";
import { CopilotCommandCenter } from "./CopilotCommandCenter";
import { withCaseContext, getCaseJourney } from "../../patient-context/caseContext";

export function SurgeryCopilotDrawer({ surgery, context, onDestination, actions, documents, workflowVersion }: CopilotProps) {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [closeRequested, setCloseRequested] = useState(false);
  const requestClose = () => { if (dirty) setCloseRequested(true); else setOpen(false); };
  return <>
    <button type="button" aria-label="Open Surgery Copilot" title="Surgery Copilot" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}
      className="fixed bottom-16 right-8 z-[90] inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-2.5 py-2.5 text-sm font-bold text-violet-700 shadow-lg transition hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 print:hidden">
      <Sparkles size={17} aria-hidden="true" />
    </button>
    <Dialog open={open} onClose={requestClose} className="relative z-[400]">
      <DialogBackdrop transition className="fixed inset-0 bg-slate-950/30 duration-200 data-closed:opacity-0 motion-reduce:transition-none" />
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel transition className="flex h-dvh w-full max-w-lg flex-col border-l border-violet-100 bg-white shadow-2xl duration-200 data-closed:translate-x-full motion-reduce:transition-none">
          <header className="flex shrink-0 items-start justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white px-5 py-3">
            <div><DialogTitle className="flex items-center gap-2 font-bold text-slate-900"><Sparkles size={21} className="text-violet-600" />Surgery Copilot</DialogTitle>
              <Description className="mt-1 text-xs text-slate-500">Workflow guidance from your application records.</Description></div>
            <button type="button" aria-label="Close Surgery Copilot" onClick={requestClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2"><X size={20} /></button>
          </header>
          {closeRequested && <div role="alert" className="border-b border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Closing will discard the unsaved draft or pending action. Nothing will be applied.<div className="mt-2 flex gap-3"><button type="button" className="font-bold underline" onClick={() => setCloseRequested(false)}>Keep reviewing</button><button type="button" className="font-bold underline" onClick={() => { setCloseRequested(false); setDirty(false); setOpen(false); }}>Discard and close</button></div></div>}
          {open && <CopilotContent key={surgery?.id ?? "case-picker"} surgery={surgery} context={context} actions={actions} documents={documents} workflowVersion={workflowVersion} dirty={dirty} onDirtyChange={setDirty} onDestination={onDestination} onClose={() => setOpen(false)} />}
          <footer className="shrink-0 border-t border-slate-100 bg-slate-50 px-5 py-3 text-[11px] leading-relaxed text-slate-500">Workflow assistance only. Clinical decisions and confirmations remain with the care team. Opening a workspace does not change the case.</footer>
        </DialogPanel>
      </div>
    </Dialog>
  </>;
}

function CopilotContent({ surgery, context, actions, documents, workflowVersion, onDestination, onClose, dirty, onDirtyChange }: CopilotProps & { onClose: () => void; dirty: boolean; onDirtyChange: (dirty: boolean) => void }) {
  const surgeries = useSurgeryStore((state) => state.surgeries);
  const [selectedId, setSelectedId] = useState(surgery?.id ?? "");
  const [revision, refresh] = useState(0);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();
  const selected = surgeries.find((item) => item.id === (surgery?.id ?? selectedId));
  const onNavigate = (destination: CopilotDestination) => {
    if (!selected) return;
    if (dirty) { setNotice("Save or discard the draft, or cancel the pending action, before navigating."); return; }
    if (!onDestination?.(destination, selected.id)) navigate(withCaseContext(destination.path, selected.id), {
      state: { ...destination.state, ...(destination.section ? { copilotSection: destination.section } : {}), copilotFocus: destination.focus, copilotEquipmentFilter: destination.equipmentFilter },
    });
    onClose();
  };
  return <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
    {!selected && <div className="mb-4"><AiConversation disabled={dirty} onNavigate={(proposal) => {
      if (dirty) return;
      navigate(proposal.destination.path, { state: { copilotSection: proposal.destination.section } }); onClose();
    }} /></div>}
    {!surgery && <VoicePatientPicker surgeries={surgeries} disabled={dirty} onSelect={setSelectedId} onOpen={(id) => { if (dirty) return; const record = surgeries.find((item) => item.id === id); if (!record) return; navigate(getCaseJourney(record).find((step) => step.state === "current")?.path ?? `/surgery/${encodeURIComponent(id)}`); onClose(); }} />}
    {selected ? <>
      <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3">
        <div className="min-w-0"><p className="break-words text-sm font-bold text-slate-900">{selected.patientName}</p><p className="mt-1 text-xs text-slate-500">{selected.id} · {selected.procedure}</p></div>
        <button type="button" disabled={dirty} aria-label="Refresh saved workflow records" title="Refresh saved records" onClick={() => refresh(revision + 1)} className="shrink-0 rounded-lg p-2 text-violet-600 hover:bg-violet-50 focus-visible:outline-2 disabled:opacity-40"><RefreshCw size={16} /></button>
      </div>
      {notice && <p role="status" className="mb-3 text-sm text-amber-800">{notice}</p>}
      <AnalysisContent key={`${selected.id}-${revision}`} surgery={selected} context={context} actions={actions} documents={documents} workflowVersion={workflowVersion} onDirtyChange={onDirtyChange} onNavigate={onNavigate} />
    </> : <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/40 p-8 text-center"><Sparkles className="mx-auto text-violet-400" size={28} /><h3 className="mt-3 text-base font-bold text-slate-800">A clear next step for every case</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">Select a case to see its workflow position, recorded checkpoints, outstanding requirements, and where to go next.</p></div>}
  </div>;
}

function AnalysisContent({ surgery, context, actions, documents, workflowVersion, onDirtyChange, onNavigate }: Required<Pick<CopilotProps, "surgery">> & Pick<CopilotProps, "context" | "actions" | "documents" | "workflowVersion"> & { onNavigate: (destination: CopilotDestination) => void; onDirtyChange: (dirty: boolean) => void }) {
  const [saved] = useState(() => readSavedCopilotState(surgery.id));
  const analysis = analyzeSurgery(surgery, context, saved);
  return <div className="space-y-6">
    <div><span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-700">{analysis.stage}</span><p className="mt-2 text-sm text-slate-600">{analysis.summary}</p></div>
    <CopilotCommandCenter surgery={surgery} context={context} actions={actions} documents={documents} workflowVersion={workflowVersion} analysis={analysis} onNavigate={onNavigate} onDirtyChange={onDirtyChange} />
    <CopilotNextAction action={analysis.nextAction} onNavigate={onNavigate} />
    <CopilotWorkflowProgress progress={analysis.progress} />
    <CopilotReasonList items={analysis.items} onNavigate={onNavigate} />
    <CopilotStatusList items={analysis.items} />
    {!!analysis.notes.length && <section className="rounded-xl bg-slate-50 p-3"><h3 className="text-xs font-bold text-slate-600">Record context</h3><ul className="mt-2 space-y-2">{analysis.notes.map((note) => <li key={note} className="text-xs leading-relaxed text-slate-500">{note}</li>)}</ul></section>}
  </div>;
}
