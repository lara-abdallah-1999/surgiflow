import { Mic, MicOff } from 'lucide-react';
import { useBackendVoice } from '../hooks/useBackendVoice';

export function BackendVoiceControl({ onTranscript, language, disabled = false }: { onTranscript: (text: string) => void; language: string; disabled?: boolean }) {
  const voice = useBackendVoice(onTranscript, language);
  return <div className="space-y-1">
    <div className="flex flex-wrap items-center gap-2">
      {!voice.busy ? <button type="button" disabled={disabled || !voice.supported} onClick={() => void voice.start()} className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 disabled:opacity-50"><Mic size={14} />Speak / تحدث</button> : <>
        {voice.state === 'recording' && <button type="button" onClick={voice.stop} className="rounded-lg border border-violet-200 px-3 py-2 text-xs text-violet-700"><MicOff size={14} className="mr-1 inline" />Finish speaking</button>}
        <button type="button" onClick={voice.cancel} className="text-xs font-semibold text-slate-500">Cancel audio</button>
        <span role="status" className="text-xs text-violet-700">{voice.state === 'recording' ? 'Listening — pauses send automatically' : voice.state === 'transcribing' ? 'Transcribing with OpenAI…' : 'Opening microphone…'}</span>
      </>}
    </div>
    <p className="text-[10px] leading-relaxed text-slate-500">{voice.supported ? 'Silence ends the turn. Review patient matches before opening.' : 'Audio recording is unavailable. Use text or a browser with microphone access on localhost/HTTPS.'}</p>
    {voice.error && <p role="alert" className="text-xs text-amber-800">{voice.error}</p>}
  </div>;
}
