import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { developmentPermissions, localWorkspaceAdapter, RequestError, requireString } from './adapters/local.mjs';
import { OpenAIProvider } from './copilot/provider.mjs';
import { orchestrate } from './copilot/orchestrator.mjs';
import { createToolRunner } from './copilot/tools.mjs';

export function createCopilotServer({ provider = new OpenAIProvider(), permissions = developmentPermissions, data = localWorkspaceAdapter, origins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173'] } = {}) {
  const sessions = new Map();
  const server = http.createServer(async (req, res) => {
    const abort = new AbortController(); res.on('close', () => abort.abort());
    res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff');
    const json = (status, body) => { if (!res.destroyed) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(body)); } };
    let session; let ownsBusy = false;
    try {
      const host = String(req.headers.host ?? '').split(':')[0];
      if (!['localhost', '127.0.0.1'].includes(host) || (req.headers.origin && !origins.includes(req.headers.origin)) || req.headers['x-surgiflow-copilot'] !== '1') throw new RequestError('Request origin is not allowed.', 403);
      const now = Date.now();
      for (const [key, value] of sessions) if (now - value.lastSeen > 30 * 60_000) { for (const client of value.clients) client.end(); sessions.delete(key); }
      const cookie = /(?:^|;\s*)surgiflow_copilot=([a-f0-9-]{36})(?:;|$)/.exec(req.headers.cookie ?? '')?.[1];
      if (cookie && sessions.has(cookie)) session = sessions.get(cookie);
      else {
        if (sessions.size >= 100) throw new RequestError('Too many local sessions.', 429);
        const id = randomUUID(); session = { id, lastSeen: now, requests: [], clients: new Set(), busy: false }; sessions.set(id, session);
        // Local session isolation only. This cookie is NOT an authentication credential.
        res.setHeader('Set-Cookie', `surgiflow_copilot=${id}; HttpOnly; SameSite=Strict; Path=/api/copilot; Max-Age=1800`);
      }
      session.lastSeen = now;
      const principal = await permissions.authenticate(req, session.id);
      const path = new URL(req.url, 'http://localhost').pathname;
      const capability = path.endsWith('/transcribe') ? 'transcribe' : path.endsWith('/events') ? 'events' : path.endsWith('/tools') ? 'read' : 'chat';
      if (!await permissions.authorize(principal, capability)) throw new RequestError('Permission denied.', 403);
      if (req.method === 'GET' && path === '/api/copilot/status') return json(200, { configured: provider.configured, mode: principal.mode, source: data === localWorkspaceAdapter ? 'local-workspace' : 'hospital-adapter' });
      if (req.method === 'GET' && path === '/api/copilot/events') {
        if (session.clients.size >= 2) throw new RequestError('Too many event connections.', 429);
        res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', Connection: 'keep-alive' });
        res.write(`event: ready\ndata: ${JSON.stringify({ mode: principal.mode })}\n\n`); session.clients.add(res);
        const timer = setInterval(() => { session.lastSeen = Date.now(); res.write(': heartbeat\n\n'); }, 15000);
        res.on('close', () => { clearInterval(timer); session.clients.delete(res); }); return;
      }
      if (req.method !== 'POST' || !['/api/copilot/chat', '/api/copilot/tools', '/api/copilot/arabic', '/api/copilot/transcribe'].includes(path)) throw new RequestError('Endpoint not found.', 404);
      session.requests = session.requests.filter(t => now - t < 60000);
      if (session.requests.length >= 15 || session.busy) throw new RequestError('Please wait for the current request or retry shortly.', 429);
      session.requests.push(now); session.busy = true; ownsBusy = true;
      if (path.endsWith('/transcribe')) {
        const mime = String(req.headers['content-type'] ?? '').split(';')[0];
        const bytes = await readBody(req, 8_000_000);
        if (!bytes.length) throw new RequestError('Audio is empty.');
        return json(200, await provider.transcribe(bytes, mime, new URL(req.url, 'http://localhost').searchParams.get('language') ?? 'auto', abort.signal));
      }
      if (!String(req.headers['content-type']).startsWith('application/json')) throw new RequestError('JSON content type required.', 415);
      let body; try { body = JSON.parse((await readBody(req, 750_000)).toString('utf8')); } catch (error) { if (error instanceof RequestError) throw error; throw new RequestError('Invalid JSON.'); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RequestError('Invalid request.');
      if (!await permissions.authorize(principal, 'read')) throw new RequestError('Permission to read case records is required.', 403);
      const selectedCaseId = body.selectedCaseId === null ? null : requireString(body.selectedCaseId, 'selected case ID', 250);
      const snapshot = await data.snapshot({ principal, selectedCaseId, localWorkspace: body.workspace, signal: abort.signal });
      if (path.endsWith('/tools')) {
        const name = requireString(body.name, 'tool name', 100);
        return json(200, { result: createToolRunner(snapshot).run(name, body.arguments), capturedAt: snapshot.capturedAt });
      }
      requireString(body.message, 'message');
      if (!provider.configured) throw new RequestError('AI is not configured. Set OPENAI_API_KEY and OPENAI_MODEL in the backend environment.', 503);
      res.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8' });
      const emit = event => {
        if (!res.destroyed) res.write(JSON.stringify(event) + '\n');
        // Session-scoped operational events contain no patient text or tool results.
        const operational = { type: event.type, ...(event.type === 'tool' ? { name: event.name } : {}), at: new Date().toISOString() };
        for (const client of session.clients) client.write(`event: copilot\ndata: ${JSON.stringify(operational)}\n\n`);
      };
      await orchestrate({ provider, snapshot, message: body.message, history: body.history, signal: AbortSignal.any([abort.signal, AbortSignal.timeout(120000)]), emit });
      res.end();
    } catch (error) {
      const message = error instanceof RequestError ? error.message : error?.name === 'AbortError' || error?.name === 'TimeoutError' ? 'Request cancelled or timed out.' : 'Copilot could not complete the request. Please retry.';
      if (res.headersSent) { if (!res.destroyed) res.end(JSON.stringify({ type: 'error', message }) + '\n'); }
      else json(error instanceof RequestError ? error.status : 500, { error: message });
    } finally { if (ownsBusy) session.busy = false; }
  });
  server.requestTimeout = 90000;
  server.on('close', () => { for (const session of sessions.values()) for (const client of session.clients) client.end(); sessions.clear(); });
  return server;
}
async function readBody(req, limit) {
  const chunks = []; let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > limit) throw new RequestError('Request is too large.', 413); chunks.push(chunk); }
  return Buffer.concat(chunks);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.env.NODE_ENV === 'production') throw new Error('The development adapters cannot run in production. Supply hospital permission/data adapters to createCopilotServer.');
  const port = Number(process.env.COPILOT_PORT || 8787);
  createCopilotServer().listen(port, '127.0.0.1', () => console.log(`SurgiFlow Copilot backend: http://127.0.0.1:${port} (local development adapter; no authentication)`));
}
