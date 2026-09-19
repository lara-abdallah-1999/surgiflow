export type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
export type RecognitionConstructor = new () => Recognition;
type Callbacks = { final: (text: string) => void; interim: (text: string) => void; listening: (value: boolean) => void; error: (message: string) => void };

/** Single-utterance session. Cancelled, disposed and duplicate results cannot issue commands. */
export function createVoiceSession(getConstructor: () => RecognitionConstructor | undefined, callbacks: Callbacks) {
  let active: Recognition | null = null;
  let disposed = false;
  const release = () => {
    const old = active;
    active = null;
    if (old) {
      old.onresult = null;
      old.onerror = null;
      old.onend = null;
      try { old.abort(); } catch { /* Already stopped by the browser. */ }
    }
  };
  return {
    start(language = "en-US") {
      const Constructor = getConstructor();
      if (!Constructor || active || disposed) return;
      callbacks.error("");
      callbacks.interim("");
      let recognition: Recognition;
      try { recognition = new Constructor(); }
      catch { callbacks.error("Speech recognition could not start. Use text input."); return; }
      active = recognition;
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        if (disposed || active !== recognition) return;
        const results = Array.from(event.results);
        callbacks.interim(results.map((result) => result[0].transcript).join(" "));
        const final = results.filter((result) => result.isFinal).map((result) => result[0].transcript).join(" ").trim();
        if (!final) return;
        release();
        callbacks.listening(false);
        callbacks.interim("");
        callbacks.final(final);
      };
      recognition.onerror = ({ error }) => {
        if (disposed || active !== recognition) return;
        release();
        callbacks.listening(false);
        callbacks.interim("");
        callbacks.error(({ "not-allowed": "Microphone permission was denied. You can type a command instead.", "service-not-allowed": "Speech recognition is not permitted by this browser.", "audio-capture": "No microphone is available. Check your audio input or type instead.", "no-speech": "No speech was detected. Try again or type your command.", network: "Speech recognition could not connect. Type your command instead." } as Record<string, string>)[error] ?? "Speech recognition stopped. Try again or use text input.");
      };
      recognition.onend = () => {
        if (disposed || active !== recognition) return;
        release();
        callbacks.listening(false);
        callbacks.interim("");
        callbacks.error("No complete command was recognized. Try again or type your command.");
      };
      try { recognition.start(); if (active === recognition) callbacks.listening(true); }
      catch { release(); callbacks.listening(false); callbacks.error("Speech recognition could not start. Try typing instead."); }
    },
    stop() { try { active?.stop(); } catch { release(); callbacks.listening(false); callbacks.error("Speech recognition stopped. Try typing instead."); } },
    cancel() { release(); callbacks.listening(false); callbacks.interim(""); },
    dispose() { disposed = true; release(); },
  };
}
