import { useEffect, useRef, useState } from 'react';
import { getAiStatus, transcribeAudio } from '../ai/client';

/** Audio stays in memory, goes only through our backend, and is discarded after use. */
export function useBackendVoice(onFinal: (text: string) => void, language = 'auto') {
  const [state, setState] = useState<'idle' | 'starting' | 'recording' | 'transcribing'>('idle');
  const [error, setError] = useState('');
  const callback = useRef(onFinal);
  const active = useRef<{ cancel: () => void; stop: () => void } | null>(null);
  useEffect(() => { callback.current = onFinal; }, [onFinal]);
  useEffect(() => () => active.current?.cancel(), []);
  const supported = typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined';
  async function start() {
    if (active.current || !supported) return;
    setError(''); setState('starting');
    let cancelled = false; let recorder: MediaRecorder | undefined; let stream: MediaStream | undefined; let audioContext: AudioContext | undefined; let timer: ReturnType<typeof setInterval> | undefined;
    const controller = new AbortController(); const chunks: Blob[] = [];
    const cleanup = () => { if (timer) clearInterval(timer); stream?.getTracks().forEach(track => track.stop()); void audioContext?.close().catch(() => undefined); };
    const session = {
      cancel: () => { cancelled = true; controller.abort(); if (recorder?.state === 'recording') recorder.stop(); cleanup(); if (active.current === session) active.current = null; setState('idle'); },
      stop: () => { if (recorder?.state === 'recording') recorder.stop(); },
    };
    active.current = session;
    try {
      const status = await getAiStatus(controller.signal);
      if (cancelled) return;
      if (!status.configured) throw new Error('Configure OPENAI_API_KEY and OPENAI_MODEL in the backend before recording.');
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
      if (cancelled) { cleanup(); return; }
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported(type));
      if (!mimeType) throw new Error('This browser cannot record a supported audio format. Use text input.');
      recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => { session.cancel(); setError('Audio recording failed. Try again or type your request.'); };
      recorder.onstop = async () => {
        cleanup(); if (cancelled) return;
        setState('transcribing');
        try {
          const audio = new Blob(chunks, { type: mimeType });
          if (!audio.size || audio.size > 8_000_000) throw new Error('Recording was empty or too large. Please try a shorter request.');
          const text = await transcribeAudio(audio, language, controller.signal);
          if (!cancelled) callback.current(text);
        } catch (failure) { if (!cancelled) setError(failure instanceof Error ? failure.message : 'Transcription failed.'); }
        finally { if (!cancelled) setState('idle'); if (active.current === session) active.current = null; }
      };
      recorder.start(250); setState('recording');
      // Silence ends a spoken turn; Stop remains available in noisy rooms.
      audioContext = new AudioContext();
      await audioContext.resume();
      if (cancelled) return;
      const analyser = audioContext.createAnalyser(); analyser.fftSize = 2048;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      const samples = new Float32Array(analyser.fftSize); const started = Date.now(); let lastSpeech = started; let speechFrames = 0;
      timer = setInterval(() => {
        analyser.getFloatTimeDomainData(samples);
        const rms = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
        if (rms > 0.015) { lastSpeech = Date.now(); speechFrames++; }
        if (Date.now() - started >= 45000 || (speechFrames >= 3 && Date.now() - lastSpeech > 1800)) session.stop();
        else if (!speechFrames && Date.now() - started > 12000) { session.cancel(); setError('No speech detected. Try again or use text.'); }
      }, 100);
    } catch (failure) { session.cancel(); setError(failure instanceof Error ? failure.message : 'Microphone could not start.'); }
  }
  return { supported, state, busy: state !== 'idle', error, start, stop: () => active.current?.stop(), cancel: () => active.current?.cancel() };
}
