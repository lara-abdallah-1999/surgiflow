import { RequestError } from '../adapters/local.mjs';

export class OpenAIProvider {
  constructor({ apiKey = process.env.OPENAI_API_KEY, model = process.env.OPENAI_MODEL, transcriptionModel = process.env.OPENAI_TRANSCRIPTION_MODEL || 'gpt-4o-transcribe', fetchImpl = fetch } = {}) {
    Object.assign(this, { apiKey, model, transcriptionModel, fetchImpl });
  }
  get configured() { return Boolean(this.apiKey && this.model); }
  async request(path, body, signal) {
    if (!this.configured) throw new RequestError('AI is not configured. Set OPENAI_API_KEY and OPENAI_MODEL in the backend environment.', 503);
    const response = await this.fetchImpl(`https://api.openai.com/v1/${path}`, { method: 'POST', headers: { Authorization: `Bearer ${this.apiKey}`, ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }) }, body: body instanceof FormData ? body : JSON.stringify(body), signal: AbortSignal.any([signal, AbortSignal.timeout(60000)]) });
    if (!response.ok) {
      // Never relay raw provider errors, credentials, or request bodies to the browser/logs.
      throw new RequestError(response.status === 429 ? 'OpenAI rate or usage limit reached. Try later or check backend billing.' : response.status === 401 ? 'OpenAI rejected the backend credential.' : 'OpenAI could not complete this request. Check backend model access and retry.', response.status === 429 ? 429 : 502);
    }
    return response;
  }
  async respond({ input, instructions, tools, signal, onDelta }) {
    const response = await this.request('responses', { model: this.model, instructions, input, tools, parallel_tool_calls: false, store: false, max_output_tokens: 2500, stream: true }, signal);
    let complete;
    for await (const event of parseSSE(response.body)) {
      if (event.type === 'response.output_text.delta') onDelta(event.delta);
      if (event.type === 'response.completed') complete = event.response;
      if (['error', 'response.failed', 'response.incomplete'].includes(event.type)) throw new RequestError('The AI response was interrupted or incomplete. Please retry.', 502);
    }
    if (!complete) throw new RequestError('The AI stream ended before completion.', 502);
    return complete;
  }
  async transcribe(bytes, mime, language, signal) {
    const extensions = { 'audio/webm': 'webm', 'audio/mp4': 'mp4', 'audio/mpeg': 'mp3', 'audio/wav': 'wav' };
    if (!extensions[mime]) throw new RequestError('Unsupported audio format.');
    const form = new FormData();
    form.set('file', new Blob([bytes], { type: mime }), `speech.${extensions[mime]}`);
    form.set('model', this.transcriptionModel);
    form.set('response_format', 'json');
    if (['ar', 'en'].includes(language)) form.set('language', language);
    const result = await (await this.request('audio/transcriptions', form, signal)).json();
    if (typeof result.text !== 'string' || !result.text.trim()) throw new RequestError('No speech was recognized. Try again or type your request.', 422);
    return { text: result.text.trim(), language, provider: 'OpenAI', translated: false };
  }
}

export async function* parseSSE(stream) {
  const decoder = new TextDecoder(); let buffer = '';
  for await (const chunk of stream) {
    buffer += decoder.decode(chunk, { stream: true }).replace(/\r/g, '');
    if (buffer.length > 2_000_000) throw new RequestError('Provider event exceeded the size limit.', 502);
    let boundary;
    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2);
      const data = frame.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
      if (data && data !== '[DONE]') yield JSON.parse(data);
    }
  }
}
