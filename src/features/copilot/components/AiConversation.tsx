import { useEffect, useRef, useState } from 'react';
import { RefreshCw, Send, Sparkles, Square } from 'lucide-react';
import type { CopilotContext } from '../types';
import { getAiStatus, streamAi, type AiDraft, type AiProposal, type AiResult } from '../ai/client';
import { captureWorkspace, currentCase, workspaceVersion, type ObservedChange } from '../ai/workspace';
import { BackendVoiceControl } from './BackendVoiceControl';

type Turn = { id: string; role: 'user' | 'assistant'; text: string; version: string; error?: string; result?: AiResult; tools?: string[] };
const button = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-violet-300 disabled:opacity-50';
type Props = { caseId?: string; context?: CopilotContext; disabled?: boolean; onNavigate: (proposal: AiProposal) => void; onDraft?: (draft: AiDraft) => void };

export function AiConversation({ caseId, context, disabled = false, onNavigate, onDraft }: Props) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('auto');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [availability, setAvailability] = useState<'checking' | 'ready' | 'unavailable'>('checking');
  const [connectionError, setConnectionError] = useState('');
  const [dataSource, setDataSource] = useState('local-workspace');
  const [statusAttempt, setStatusAttempt] = useState(0);
  const [revision, setRevision] = useState(0);
  const [changes, setChanges] = useState<ObservedChange[]>([]);
  const latest = useRef({ caseId, context, disabled });
  const previous = useRef(captureWorkspace(caseId, context));
  const version = useRef(workspaceVersion(previous.current));
  const request = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { latest.current = { caseId, context, disabled }; }, [caseId, context, disabled]);
  useEffect(() => {
    const controller = new AbortController();
    getAiStatus(controller.signal).then(result => {
      if (controller.signal.aborted) return;
      setAvailability(result.configured ? 'ready' : 'unavailable');
      setDataSource(result.source);
      setConnectionError(result.configured ? '' : 'Set OPENAI_API_KEY and OPENAI_MODEL in the backend .env, then restart npm run copilot:dev.');
    }).catch(() => { if (!controller.signal.aborted) { setAvailability('unavailable'); setConnectionError('Backend unavailable. Start npm run copilot:dev, then check the connection again.'); } });
    return () => controller.abort();
  }, [statusAttempt]);
  useEffect(() => {
    const inspect = () => {
      const snapshot = captureWorkspace(latest.current.caseId, latest.current.context);
      const next = workspaceVersion(snapshot);
      if (next === version.current) return;
      const before = previous.current;
      const fields = Object.keys(snapshot).filter(key => key !== 'recentChanges' && key !== 'selected' && JSON.stringify(snapshot[key as keyof typeof snapshot]) !== JSON.stringify(before[key as keyof typeof before]));
      for (const key of new Set([...Object.keys(snapshot.selected ?? {}), ...Object.keys(before.selected ?? {})])) if (JSON.stringify(snapshot.selected?.[key]) !== JSON.stringify(before.selected?.[key])) fields.push(key);
      previous.current = snapshot; version.current = next;
      setRevision(value => value + 1);
      setChanges(items => [...items, { at: new Date().toISOString(), fields }].slice(-20));
      if (request.current) {
        request.current.abort(); request.current = null; setBusy(false);
        setStatus('Application records changed. Send again to use the latest state.');
        setTurns(items => items.map(item => item.role === 'assistant' && !item.result && !item.error ? { ...item, text: '', error: 'Cancelled because the workspace changed.' } : item));
      }
    };
    const timer = setInterval(inspect, 500);
    window.addEventListener('storage', inspect);
    return () => { clearInterval(timer); window.removeEventListener('storage', inspect); request.current?.abort(); request.current = null; };
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [turns.length]);

  async function submit(text: string) {
    if (!text.trim() || request.current || latest.current.disabled || availability !== 'ready') return;
    const snapshot = captureWorkspace(latest.current.caseId, latest.current.context, changes);
    const capturedVersion = workspaceVersion(snapshot);
    const controller = new AbortController(); request.current = controller;
    previous.current = snapshot; version.current = capturedVersion;
    const assistantId = crypto.randomUUID();
    const history = turns.filter(turn => !turn.error && turn.text && (turn.role === 'user' || turn.result)).slice(-10).map(turn => ({ role: turn.role, content: turn.text }));
    setTurns(items => [...items, { id: crypto.randomUUID(), role: 'user' as const, text: text.trim(), version: capturedVersion }, { id: assistantId, role: 'assistant' as const, text: '', version: capturedVersion, tools: [] }].slice(-24));
    setInput(''); setBusy(true); setStatus('Connecting to OpenAI…');
    try {
      await streamAi({ message: text.trim(), selectedCaseId: latest.current.caseId ?? null, workspace: snapshot, history }, controller.signal, event => {
        if (request.current !== controller || controller.signal.aborted) return;
        if (event.type === 'status') setStatus(event.message);
        if (event.type === 'tool') { setStatus(`Reading ${event.name}…`); setTurns(items => items.map(item => item.id === assistantId ? { ...item, tools: [...(item.tools ?? []), event.name] } : item)); }
        if (event.type === 'delta') setTurns(items => items.map(item => item.id === assistantId ? { ...item, text: item.text + event.text } : item));
        if (event.type === 'result') {
          if (event.caseId !== (latest.current.caseId ?? null) || workspaceVersion(captureWorkspace(latest.current.caseId, latest.current.context)) !== capturedVersion) throw new Error('Records changed while generating this answer. Please ask again.');
          setTurns(items => items.map(item => item.id === assistantId ? { ...item, text: event.answer, result: event } : item));
          setStatus('Answer based on the recorded snapshot.');
        }
      });
    } catch (error) {
      if (request.current === controller) setTurns(items => items.map(item => item.id === assistantId ? { ...item, text: '', result: undefined, error: controller.signal.aborted ? 'Request cancelled. Nothing was changed.' : error instanceof Error ? error.message : 'AI request failed.' } : item));
    } finally { if (request.current === controller) { request.current = null; setBusy(false); } }
  }
  function navigate(proposal: AiProposal, capturedVersion: string) {
    if (disabled || workspaceVersion(captureWorkspace(caseId, context)) !== capturedVersion) { setStatus('Records changed. Ask again before opening this suggestion.'); return; }
    const record = currentCase(proposal.caseId);
    if (!record || record.patientName !== proposal.patientName || (record.mrn ?? null) !== proposal.mrn) { setStatus('Patient identity changed. Search again.'); return; }
    // Only backend-generated known journey routes; never follow a model-provided URL.
    const id = encodeURIComponent(record.id);
    if (![`/reception/${id}`, `/accounting?case=${id}`, '/accounting', `/pre-op/${id}`, `/surgery/${id}`, `/post-op/${id}`].includes(proposal.destination.path)) { setStatus('Navigation target is not allowed.'); return; }
    onNavigate(proposal);
  }
  return <section aria-label="AI Surgery Copilot" className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50/40 p-4" data-record-revision={revision}>
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Sparkles size={16} className="text-violet-600" />Ask SurgiFlow AI</h3></div>
    <p className="text-xs leading-relaxed text-slate-500">Ask in English or Arabic about records, blockers, next steps, or a handoff. {dataSource === 'local-workspace' ? 'Current data comes from this browser’s demo-seeded workspace.' : 'Records are provided by the configured hospital adapter.'}</p>
    {connectionError && <div role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">{connectionError}<button type="button" onClick={() => { setAvailability('checking'); setStatusAttempt(value => value + 1); }} className="mt-2 block font-semibold underline"><RefreshCw size={12} className="mr-1 inline" />Check connection</button></div>}
    {!turns.length && <div className="flex flex-wrap gap-2">{(caseId ? ['What is blocking the next step, and why?', 'Summarize the latest recovery observations', 'Draft a handoff', 'شو ناقص قبل الخطوة الجاية؟'] : ['Find a patient by name or MRN', 'ابحث عن مريض برقم الملف']).map(example => <button type="button" key={example} disabled={disabled || availability !== 'ready'} onClick={() => setInput(example)} className={button} dir="auto">{example}</button>)}</div>}
    {!!turns.length && <div className="max-h-[45dvh] space-y-3 overflow-y-auto overscroll-contain" aria-label="AI conversation">{turns.map(turn => <article key={turn.id} className={`rounded-xl border p-3 ${turn.role === 'user' ? 'border-violet-100 bg-violet-100/50' : 'border-slate-200 bg-white'}`}>
      <p className="mb-1 text-[10px] font-bold text-slate-500">{turn.role === 'user' ? 'You' : 'SurgiFlow AI'}</p>
      <p dir="auto" className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{turn.error || turn.text || 'Working…'}</p>
      {!!turn.tools?.length && <details className="mt-2 text-[10px] text-slate-500"><summary className="cursor-pointer">Application tools used</summary>{[...new Set(turn.tools)].join(' · ')}</details>}
      {turn.result && <>
        <p className="mt-2 text-[10px] text-slate-400">Snapshot {new Date(turn.result.capturedAt).toLocaleTimeString()}{turn.version !== version.current ? ' · Records have changed since this answer.' : ''}</p>
        <div className="mt-2 flex flex-wrap gap-2">{turn.result.proposals.map((proposal, index) => <button type="button" key={index} disabled={disabled || busy || turn.version !== version.current} onClick={() => navigate(proposal, turn.version)} className={button}>{proposal.destination.label}<span className="block text-[10px] font-normal">{proposal.caseId} · {proposal.mrn ?? 'MRN not recorded'}</span></button>)}</div>
        {turn.result.draft && onDraft && <button type="button" disabled={disabled || busy || turn.version !== version.current} onClick={() => { if (workspaceVersion(captureWorkspace(caseId, context)) === turn.version) onDraft(turn.result!.draft!); else setStatus('Records changed. Generate a fresh draft.'); }} className={`${button} mt-2`}>Review unsaved {turn.result.draft.kind === 'handoff' ? 'handoff' : 'case brief'}</button>}
      </>}
    </article>)}<div ref={end} /></div>}
    {!!changes.length && <details className="text-[11px] text-slate-500"><summary className="cursor-pointer">Live workspace changes ({changes.length})</summary><p>Observed while this Copilot is open; not a clinical audit log.</p>{changes.slice(-5).map((change, index) => <p key={index}>{new Date(change.at).toLocaleTimeString()} · {change.fields.join(', ')} updated</p>)}</details>}
    <form onSubmit={event => { event.preventDefault(); void submit(input); }} className="space-y-2">
      <label className="sr-only" htmlFor="ai-copilot-message">Message to Surgery Copilot</label>
      <textarea id="ai-copilot-message" dir="auto" rows={2} maxLength={12000} value={input} onChange={event => setInput(event.target.value)} disabled={disabled || busy} placeholder="Ask about this workflow… / اسأل عن حالة المريض" className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-violet-400 disabled:opacity-50" />
      <div className="flex flex-wrap items-center gap-2"><button type="submit" className={button} disabled={!input.trim() || disabled || busy || availability !== 'ready'}><Send size={13} className="mr-1 inline" />Send</button>{busy && <button type="button" className={button} onClick={() => request.current?.abort()}><Square size={12} className="mr-1 inline" />Stop response</button>}<select aria-label="AI speech language" value={language} onChange={event => setLanguage(event.target.value)} className="min-w-0 rounded-lg border border-slate-200 bg-white p-2 text-xs"><option value="auto">Auto / تلقائي</option><option value="ar">العربية</option><option value="en">English</option></select></div>
    </form>
    <BackendVoiceControl language={language} disabled={disabled || busy || availability !== 'ready'} onTranscript={text => { setInput(text); void submit(text); }} />
    <p role="status" aria-live="polite" className="text-[11px] text-violet-700">{status}</p>
  </section>;
}
