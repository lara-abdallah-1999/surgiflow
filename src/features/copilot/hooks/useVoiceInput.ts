import { useEffect, useRef, useState } from "react";
import { createVoiceSession, type RecognitionConstructor } from "../voiceInput";

function constructor() {
  if (typeof window === "undefined") return undefined;
  const browser = window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
}

export function useVoiceInput(onFinal: (text: string) => void, language = "en-US") {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const callback = useRef(onFinal);
  const session = useRef<ReturnType<typeof createVoiceSession> | null>(null);
  useEffect(() => { callback.current = onFinal; }, [onFinal]);
  useEffect(() => {
    session.current = createVoiceSession(constructor, { final: (text) => callback.current(text), interim: setInterim, listening: setListening, error: setError });
    return () => { session.current?.dispose(); session.current = null; };
  }, []);
  return { supported: Boolean(constructor()), listening, interim, error, start: () => session.current?.start(language), cancel: () => session.current?.cancel(), stop: () => session.current?.stop() };
}
