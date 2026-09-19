# Surgery Copilot backend

This small Node backend is solely for Copilot. It does not replace routing, Zustand, localStorage, payment actions, surgical milestones, or documentation saving. No additional runtime dependencies are required (Node 22.16+).

## Local setup

1. Copy `.env.example` to `.env` at the project root.
2. Set `OPENAI_API_KEY` and a Responses API `OPENAI_MODEL` available to your OpenAI project. The sample model is configurable; model access/billing belong to your account.
3. Run `npm run copilot:dev` in one terminal and `npm run dev` in another.
4. Open the usual Vite URL and the existing Surgery Copilot drawer. Use **Check connection** after restarting the backend.

The backend reads `.env`; Vite never receives the key. `.env` is ignored. Never use a `VITE_` variable for credentials. Ports default to Vite 5173 and backend 8787. If you change the backend port, update the Vite proxy target too. The backend binds only to `127.0.0.1`. This entry point refuses `NODE_ENV=production` with the development adapters.

Without configuration, the UI explicitly says AI is unavailable. There are no canned AI responses or automatic simulated successes. Existing deterministic workflow shortcuts remain accessible separately.

## Implementation and data boundaries

- `adapters/contracts.mjs`: permission and data adapter contracts.
- `adapters/local.mjs`: explicitly unauthenticated, local development permissions and request-scoped workspace data adapter. The cookie isolates browser event sessions; it does **not** authenticate a clinician.
- `copilot/tools.mjs`: 27 allowlisted, schema-validated tools. Search reads only the authorized identity directory; detailed tools can read only the selected case. Navigation returns proposals, never changes a case. No tool can mutate the store/database, pay, start/end surgery, send messages, or discharge.
- `copilot/orchestrator.mjs`: bounded tool loop, source-grounded instructions, limited conversation history, streamed replies and unsaved draft results.
- `copilot/provider.mjs`: server-only OpenAI Responses and transcription transport with aborts/timeouts and sanitized errors. `store:false` is sent for Responses requests; this is not a claim of zero provider retention.
- `scripts/build-copilot-server.mjs`: compiles the frontend's pure analyzer and lookup helpers to ignored `.generated` modules. There is one deterministic workflow rule implementation. Restart the backend after editing shared rules.
- `src/features/copilot/ai/workspace.ts`: reads an explicit field projection of the actual selected Zustand record, current workspace props, saved Pre-Op/equipment/Post-Op data, and a minimal search directory. No new persistent patient store is created. Snapshots are ephemeral per request.

The existing app initializes sample records in `surgeryStore.ts`. Reception also has demo demographic fallbacks and ephemeral administrative checklists; those fallback demographics and unsaved Reception checks are not presented by AI as verified clinical data. Post-Op reads saved data, not unsaved form edits. Live Pre-Op tests and operating-room checkpoint props take priority where provided. Missing values are returned as unknown. Equipment details are saved records; live counts are identified separately. No tool invents team members, prices, dates, test results, or medical readiness.

Before any external AI request, the user sends a message or starts recording. A request includes the current selected-case projection and minimal local directory to the local backend; the external provider receives the selected workflow context and only the outputs of tools it calls, not the full directory. Audio is held in memory and is not written to disk. Neither conversation content nor clinical tool outputs are logged by this server. Session metadata expires after 30 minutes; no conversation is persisted by the app.

## Endpoints

All requests require `X-Surgiflow-Copilot: 1`; POST JSON endpoints also require `Content-Type: application/json`. Only configured local origins are allowed. There is no wildcard CORS. Responses disable caching. Request size, request frequency, concurrent turns, tool rounds and audio size are limited.

- `GET /api/copilot/status`: configuration and adapter mode; never credentials.
- `POST /api/copilot/chat`: `{ message, selectedCaseId, workspace, history }`; newline-delimited JSON `status`, `tool`, `delta`, `result`, `error` events. History allows only bounded user/assistant messages. Result contains text, snapshot time, validated navigation proposals and an optional unsaved summary/handoff draft.
- `POST /api/copilot/arabic`: same multilingual orchestrator contract. Arabic is interpreted directly by the model, not matched against the legacy phrase dictionary. This alias is available to other clients; the drawer sends all languages to `/chat`.
- `POST /api/copilot/tools`: `{ selectedCaseId, workspace, name, arguments }`; the same permission, data scope and tool validation as chat. Read-only; no arbitrary function dispatch.
- `POST /api/copilot/transcribe?language=ar|en|auto`: binary WebM/MP4/MP3/WAV audio, maximum 8 MB. Returns original-language transcript through OpenAI. The transcript is passed to multilingual chat; no lossy English translation is required to recognize Arabic intent. Patient names/MRNs remain reviewable.
- `GET /api/copilot/events`: session-scoped SSE operational events and heartbeats. No clinical text or tool results are broadcast. Use authenticated same-origin fetch streaming with the required header. The drawer uses the chat stream for response/tool progress and observes local data changes separately.

The UI observes store/saved-workspace changes while open, cancels an in-flight answer if its snapshot changes, disables stale navigation/drafts, and requests a fresh snapshot on each question. This is live local workflow awareness, not a cross-device hospital event bus or a clinical audit log. Answers include their snapshot time; elapsed-time answers do not keep counting after generation.

## Arabic and voice

The new conversation uses free-form model interpretation, proper Arabic labels, RTL text, MediaRecorder and backend OpenAI transcription. It supports mixed Arabic/English input. Silence detection ends a spoken turn after a pause; **Finish speaking** remains available in noisy rooms, and recordings stop after 45 seconds. Cancel/close aborts audio and prevents late transcription from being submitted. No microphone starts automatically. Exact name spelling or MRN is still required to verify search results; transliteration is never proof of patient identity.

Browser microphone permission, HTTPS/localhost, model access and actual recognition quality must be verified on the deployment device. The old browser-speech shortcuts are clearly separated under existing workflow controls and are not the new AI path.

## Replacing development adapters

Import `createCopilotServer` from `index.mjs` and supply:

```js
createCopilotServer({
  permissions: {
    authenticate: async (request) => hospitalSessionIdentity(request),
    authorize: async (principal, capability) => hospitalPermissions(principal, capability),
  },
  data: {
    snapshot: async ({ principal, selectedCaseId, signal }) =>
      hospitalWorkflowSnapshot(principal, selectedCaseId, signal),
  },
  origins: ['https://your-hospital-app.example'],
});
```

The hospital snapshot implementation must authorize both search-directory entries and the selected case server-side, ignore `localWorkspace`, and return the shape in `contracts.mjs` from hospital APIs. Mount behind the hospital's same-origin authenticated gateway forwarding to loopback. Tools, orchestrator, provider and UI need no rewrite. A rejected identity/permission must never fall back to development access. Database credentials stay inside the hospital adapter; the model receives none.

## Verification

`npm run test:copilot` builds shared rules and runs workflow, safety, language, patient-context and backend tests. Backend tests use explicit synthetic records and a mock transport only in tests; they validate real HTTP routes, tool scope, streaming Unicode, provider request shape, missing credentials, permission denial and Arabic transcription plumbing. They do not assert real model quality or microphone accuracy.

`npx vite build` checks bundling. The existing repository-wide TypeScript errors outside Copilot still affect `npm run build`. Check the changed frontend independently with the strict command in the feature README.

`scripts/copilot-ui-check.mjs` verifies the actual drawer at 320px using an explicit test-only transport, including missing configuration, streamed replies, patient navigation, review-before-save, and cancellation after a record changes. It requires Vite on 5173 and an **isolated** Chrome debugging profile on 9223. It temporarily binds the test backend to 8787; stop any regular backend first. It changes only synthetic browser-session records. Never run it against a browser containing real patient work.

Official API references: [Function calling](https://developers.openai.com/api/docs/guides/function-calling), [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text).
