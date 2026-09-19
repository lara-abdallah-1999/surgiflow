# Surgery Copilot

## OpenAI upgrade

The drawer now leads with `AiConversation`: a streamed, multi-turn OpenAI conversation through the local backend. See [setup, source audit, endpoints and replacement adapters](../../../server/README.md). No key is exposed to Vite. Missing configuration displays an explicit unavailable state; no simulated AI answer is substituted.

Free-form Arabic uses backend transcription and model interpretation. The exact-phrase commands described below remain only as explicit legacy workflow shortcuts, under **Existing workflow controls & reviewed documentation**. Their browser voice engine and deterministic templates are separate from the new AI path. AI brief/handoff drafts enter the same review/save controls and cannot directly mutate records.

`ai/workspace.ts` projects actual application state. `AiConversation` invalidates stale responses/proposals on state changes and scopes history to the selected case. The backend compiles and reuses the existing pure workflow analyzer. Tests: `npm run test:copilot`.

Open the sparkle button at the lower-right of the module. List pages offer a searchable case selector; case workspaces use their current patient. The existing workflow guidance is extended with text/voice commands, reviewed documentation drafts, explicit pending actions, and recent activity.

## Boundaries

- `analyzeSurgery.ts` is a pure deterministic function. It never calls a store action, reads browser storage, makes a clinical inference, or changes a case.
- `types.ts` defines a read-only input/output contract separate from the application persistence types.
- `utils.ts` reads the existing Pre-Op workspace and equipment keys without changing them. Invalid or inaccessible storage produces a verification notice.
- `SurgeryCopilotDrawer` owns transient UI state. Headless UI's existing Dialog dependency supplies focus trapping and focus restoration. Closing with a draft or pending action offers Keep reviewing / Discard and close. Case selection, refresh, and navigation cannot silently discard pending work.
- `ModuleCopilot` supplies the entry point on general pages. Surgery Details and Pre-Op Details supply live local state through props. There is no new global store or dependency.
- All Recovery guidance and commands target the **Recovery tab in Surgery Details**. No Copilot destination uses a standalone Recovery route. The old route/file still present in this checkout is not recreated, rewritten, or used by command navigation.
- Cashier uses its existing `highlightSurgeryId` state. Surgery commands focus and briefly highlight milestones, equipment, awakening, assessment, transfer, or notes. Equipment filtering changes only the visible list.

## Existing workflow distinctions

Pre-Op confirmation checks the six test IDs and explicit anesthesia-plan confirmation. Assessment and supply completion are not additional gates. Planned anesthesia is separate from the administration/induction milestone. The Ready status follows the existing Start Surgery behavior. Site & Cut and equipment reconciliation precede End Surgery.

Surgery's Recovery tab checks awakening plus six booleans, followed by separate Ready for Transfer and Confirm Transferred actions. Confirmed transfer leads to Post-Op. Legacy standalone Recovery flags, report requirements, and awakening-stage rules are not used by the analyzer.

Missing historical timestamps do not redirect an advanced case back through earlier stages. Unknown equipment is not declared reconciled. The existing Surgery page has no procedure-site editor: Copilot identifies that documentation gap without inventing an editor or bypassing the gate.

## Commands and confirmation

`commands.ts` recognizes explicit English phrases, not arbitrary AI conversations. Examples: “What is missing?”, “Can I end surgery?”, “Open Recovery”, “Show Recovery Assessment”, “Show equipment in use”, “Add recovery note: …”, “Draft a handoff”, “Summarize this surgery”, and “Start surgery”. Unknown, negated, or compound action commands do not execute or queue changes.

`CopilotCommandCenter` is embedded in the existing drawer. Read-only answers and navigation are immediate. ACT commands only prepare a pending action with patient, case, original command, proposed value, prepared timestamp, confirmation-time semantics, and effect. Spoken “confirm” never executes an action. The user must use the Confirm button.

`safety.ts` revalidates case identity, the workflow version, and current availability. `surgeryBridge.ts` calls existing page handlers; it contains no alternate workflow mutations. Surgery Details supplies the same enabled/visible conditions as its controls. Changed state, already-completed controls, unhydrated cases, duplicate clicks, and stale records cannot silently apply a prepared action.

## Voice input

`voiceInput.ts` and `hooks/useVoiceInput.ts` wrap browser SpeechRecognition (including its prefixed implementation). Listening starts only on an explicit click. Interim speech never issues commands. A single final result is processed once. Stop processes the final utterance; Cancel, drawer closure, or case unmount aborts recognition and rejects late events. Unsupported browsers, denied permissions, missing microphones, and network errors retain full text-command support.

The microphone control discloses that a browser may send audio to its recognition service. There is no application transcription backend, API key, stored audio, or external AI connection. Browser availability/privacy behavior follows the [SpeechRecognition documentation](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition). Use only a browser/service approved for the deployment's patient data.

## Reviewed documentation

Dictation is kept verbatim in an editable draft. Handoffs, summaries, and operative-report drafts use deterministic templates built from recorded workflow facts. They do not invent findings, complications, medications, or clinical assessments. Nothing is saved until **Save reviewed draft**. Discard makes no record change.

In Surgery Details, recovery drafts append through the existing Recovery Notes save handler. Intraoperative notes, handoffs, and summaries append to the existing `surgeonNotes` field through `updateSurgery`; report drafts append to `operativeReport`, escaping literal text for the existing rich-text report editor. Save names its destination and preserves existing content. In Pre-Op, intraoperative drafts reuse `addClinicalNote` and its existing auto-save. Other pages allow draft creation/copying and direct the user to Surgery for saving. Destination changes block stale drafts from overwriting newer work.

The existing Zustand/persistence behavior is unchanged; Copilot adds no durable storage. Activity is capped at 12 entries in the current drawer session and is explicitly not a clinical audit log. No authentication backend/current-user identity was found, so the feature does not invent clinician signatures or roles.

A future generation service should have a separate contract and entry point; it should not replace the deterministic workflow engine or acquire store mutation capabilities.

## Verification

Run `node --test tests/copilot.test.mjs tests/copilot-commands.test.mjs` from the project root. The suites use the installed TypeScript compiler and Node test runner, with no additional dependencies. They cover workflow regression, command safety, stale/cross-case confirmations, documentation, microphone lifecycle, duplicates, late events, and permission failures.

Manual checks: open/close with keyboard and backdrop; inspect pending-work discard prompts; switch cases; navigate to Payment; focus each Surgery/Recovery target; test microphone permission denial, Stop and Cancel; prepare/cancel/confirm each action; change a gate after preparing an action; save/discard/edit notes; confirm old notes remain; check narrow-screen drawer scrolling. Browser/microphone checks require a connected supported browser.

The repository already has TypeScript errors unrelated to Copilot, so `npm run build` is not currently a clean baseline. The Copilot dependency tree can be checked independently:

```sh
node node_modules/typescript/bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target es2023 --module esnext --moduleResolution bundler --jsx react-jsx --lib es2023,dom src/features/copilot/components/ModuleCopilot.tsx
node node_modules/eslint/bin/eslint.js src/features/copilot
npx vite build
```

## Arabic workflow input and patient lookup

The voice language selector supports English and Arabic recognition locales. `language.ts` translates an explicit vocabulary of Arabic and Lebanese workflow phrases into existing English command intents. It is not general-purpose translation or a clinical AI model. Dictated clinical narratives remain in their original language for review. A final speech result is processed automatically; mutations still require the existing explicit confirmation.

`VoicePatientPicker` searches actual case names, MRNs and case IDs before a case is selected, including Arabic digits and spoken digit sequences. Users verify a candidate before opening its current journey step. No fuzzy match automatically opens a patient. Real microphone quality and language recognition require testing on the intended browser/device.

Read-only answers include recorded allergies, procedures, surgeon, payment totals and awakening observations. Observation concerns and recorded clinician contact/review are displayed without inferring clinical risk or sending notifications.

Run all regression suites with `node --test tests/*.test.mjs`.
