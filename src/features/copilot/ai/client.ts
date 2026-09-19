import type { CopilotDestination } from '../types';

export type AiProposal = { caseId: string; patientName: string; mrn: string | null; destination: CopilotDestination };
export type AiDraft = { kind: 'summary' | 'handoff'; text: string };
export type AiResult = { type: 'result'; answer: string; proposals: AiProposal[]; draft: AiDraft | null; caseId: string | null; capturedAt: string; source: string };
export type AiEvent = { type: 'status'; message: string } | { type: 'delta'; text: string } | { type: 'tool'; name: string } | { type: 'error'; message: string } | AiResult;
export const apiHeaders = { 'X-Surgiflow-Copilot': '1' };

async function checked(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'The Copilot backend is unavailable. Start npm run copilot:dev.');
  }
  return response;
}
export async function getAiStatus(signal: AbortSignal): Promise<{ configured: boolean; mode: string; source: string }> {
  return (await checked(await fetch('/api/copilot/status', { headers: apiHeaders, signal }))).json();
}
export async function streamAi(body: unknown, signal: AbortSignal, onEvent: (event: AiEvent) => void) {
  const response = await checked(await fetch('/api/copilot/chat', { method: 'POST', headers: { ...apiHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal }));
  if (!response.body) throw new Error('The browser cannot read the response stream.');
  const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let completed = false;
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 1);
        if (!line.trim()) continue;
        const event = JSON.parse(line) as AiEvent;
        if (event.type === 'error') throw new Error(event.message);
        if (event.type === 'result') completed = true;
        if (!signal.aborted) onEvent(event);
      }
      if (done) break;
    }
    if (!completed) throw new Error('The response was interrupted. Please retry.');
  } finally { await reader.cancel().catch(() => undefined); reader.releaseLock(); }
}
export async function transcribeAudio(audio: Blob, language: string, signal: AbortSignal): Promise<string> {
  const response = await checked(await fetch(`/api/copilot/transcribe?language=${encodeURIComponent(language)}`, { method: 'POST', headers: { ...apiHeaders, 'Content-Type': audio.type }, body: audio, signal }));
  const result = await response.json();
  if (typeof result.text !== 'string') throw new Error('The transcription response was invalid.');
  return result.text;
}
