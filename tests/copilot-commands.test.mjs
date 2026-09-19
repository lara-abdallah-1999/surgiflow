import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const dataUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const compile = async (name) => ts.transpileModule(await readFile(new URL(`../src/features/copilot/${name}.ts`, import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const utilsUrl = dataUrl(await compile("utils"));
const load = async (name) => import(dataUrl((await compile(name)).replace('"./utils"', JSON.stringify(utilsUrl))));
const { parseCommand, commandDestination, answerQuestion, draftDocumentation } = await load("commands");
const { confirmPendingAction } = await load("safety");
const { createSurgeryActions, appendReviewedText, appendReviewedReport } = await load("surgeryBridge");
const { createVoiceSession } = await load("voiceInput");
const { analyzeSurgery } = await load("analyzeSurgery");
const base = { id: "case 1", patientName: "Test Patient", status: "Ready", procedure: "Recorded procedure", paymentStatus: "Paid", preOpStatus: "Ready" };
const analysis = analyzeSurgery(base);

test("every record-changing command prepares the intended action only", () => {
  for (const [command, action] of [["Start surgery.", "start"], ["Record anesthesia now.", "anesthesia"], ["Record cut time now.", "cut"], ["Confirm awakening.", "awakening"], ["Mark ready for transfer.", "ready"], ["End surgery.", "end"], ["Confirm transfer", "transfer"]]) assert.deepEqual(parseCommand(command), { kind: "act", action });
});
test("questions, negations, compound commands and patient-qualified commands never become actions", () => {
  for (const command of ["Can I end surgery?", "Why can't I end surgery?", "Don't start surgery", "Start surgery and record anesthesia", "Start surgery for another patient", "Confirm", "Yes", "Confirm the pending action", "Please don't end surgery", "Do not confirm awakening"]) assert.notEqual(parseCommand(command).kind, "act", command);
});
test("all requested question examples are recognized", () => {
  for (const command of ["What do I need to do next?", "What is missing?", "What is blocking this surgery?", "Has payment been completed?", "Is Pre-Op finished?", "What time did surgery start?", "How long has surgery been running?", "Has anesthesia been recorded?", "Has the surgical site been recorded?", "What equipment is still in use?", "Can I end surgery?", "Why can’t I end surgery?", "Which recovery checks remain?", "Has awakening been confirmed?", "Are we ready for transfer?", "Brief me"]) assert.equal(parseCommand(command).kind, "ask", command);
});
test("dictation preserves content literally and supports speech without a colon", () => {
  assert.deepEqual(parseCommand("Add recovery note: Patient says 'end surgery'."), { kind: "draft", document: "recovery-note", text: "Patient says 'end surgery'." });
  assert.deepEqual(parseCommand("Add intraoperative note procedure progressing normally."), { kind: "draft", document: "intraop-note", text: "procedure progressing normally." });
});
test("all Recovery navigation resolves to the current case's Recovery tab", () => {
  for (const command of ["Open Recovery", "Show Recovery Assessment", "Take me to Patient Awakening", "Show Ready for Transfer", "Open Recovery Notes"]) {
    const intent = parseCommand(command);
    assert.equal(intent.kind, "navigate");
    const target = commandDestination(intent.target, base, analysis);
    assert.equal(target.path, "/surgery/case%201");
    assert.equal(target.section, "recovery");
  }
});
test("equipment filtering only produces a navigation intent", () => {
  const intent = parseCommand("Show equipment in use");
  assert.equal(intent.kind, "navigate");
  assert.equal(commandDestination(intent.target, base, analysis, intent.filter).equipmentFilter, "In Use");
});
test("anesthesia/site/equipment navigation resolves section focus anchors", () => {
  for (const [text, focus] of [["Go to Anesthesia", "anesthesia"], ["Show Site and Cut", "cut"], ["Show Equipment", "equipment"]]) {
    const intent = parseCommand(text);
    assert.equal(commandDestination(intent.target, base, analysis).focus, focus);
  }
});
test("read-only readiness answers use authoritative action availability", () => {
  const blocked = { end: { available: false, reason: "Two equipment items remain In Use." } };
  assert.match(answerQuestion("end", base, analysis, {}, blocked), /Two equipment/);
  assert.match(answerQuestion("end", base, analysis, {}, { end: { available: true } }), /separate explicit confirmation/);
});
test("elapsed answers validate timestamps and stop at recorded completion", () => {
  const surgery = { ...base, surgeryStartedAt: "2026-09-03T09:00:00Z", surgeryCompletedAt: "2026-09-03T10:01:02Z" };
  assert.match(answerQuestion("duration", surgery, analysis, {}, {}, Date.parse("2026-09-03T11:00:00Z")), /1h 1m 2s/);
  assert.match(answerQuestion("duration", { ...base, surgeryStartedAt: "bad" }, analysis), /unavailable/);
});
test("equipment names and recovery checks come from current local state", () => {
  const context = { operatingRoom: { equipmentNames: ["Monitor", "Pump"], recoveryAssessment: { airway: true } } };
  assert.match(answerQuestion("equipment", base, analysis, context), /Monitor, Pump/);
  assert.doesNotMatch(answerQuestion("checks", base, analysis, context), /Airway/);
  assert.match(answerQuestion("checks", base, analysis, context), /Breathing/);
});
test("draft generation uses supplied facts, does not fill clinical findings, and does not mutate", () => {
  const surgery = Object.freeze({ ...base });
  const draft = draftDocumentation("operative-report", surgery, analysis);
  assert.match(draft, /Recorded procedure/);
  assert.match(draft, /findings, complications, and instructions: not supplied/);
  assert.equal(surgery.operativeReport, undefined);
  assert.equal(draftDocumentation("recovery-note", surgery, analysis, "Exact dictated text"), "Exact dictated text");
});
test("explicit confirmation rejects another case, stale state and disabled controls", () => {
  let called = 0;
  const action = { available: true, execute: () => { called++; return { ok: true, message: "Done" }; } };
  const pending = { caseId: "case 1", workflowVersion: "v1", action: "start" };
  assert.equal(confirmPendingAction(pending, "case 2", "v1", { start: action }).ok, false);
  assert.equal(confirmPendingAction(pending, "case 1", "v2", { start: action }).ok, false);
  assert.equal(confirmPendingAction(pending, "case 1", "v1", { start: { ...action, available: false } }).ok, false);
  assert.equal(called, 0);
  assert.equal(confirmPendingAction(pending, "case 1", "v1", { start: action }).ok, true);
  assert.equal(called, 1);
});
test("bridge delegates once to existing handlers and refuses a changed record", () => {
  let called = 0;
  let current = true;
  const controls = Object.fromEntries(["start", "anesthesia", "cut", "end", "awakening", "ready", "transfer"].map((key) => [key, { available: true, reason: "", run: () => called++ }]));
  const actions = createSurgeryActions(controls, () => current);
  assert.equal(called, 0);
  assert.equal(actions.start.execute().ok, true);
  current = false;
  assert.equal(actions.start.execute().ok, false);
  assert.equal(called, 1);
});
test("documentation appends without losing existing text", () => {
  assert.equal(appendReviewedText("Original note", "Reviewed draft"), "Original note\n\nReviewed draft");
  assert.equal(appendReviewedText("", "Reviewed draft"), "Reviewed draft");
});

test("report dictation stays literal text in the existing rich-text report format", () => {
  assert.equal(appendReviewedReport("<p>Original</p>", "<img src=x onerror=alert(1)>\nA & B"), "<p>Original</p>\n<p>&lt;img src=x onerror=alert(1)&gt;<br>A &amp; B</p>");
});

function microphone() {
  const instances = [];
  const finals = [];
  const errors = [];
  const states = [];
  class FakeRecognition {
    constructor() { instances.push(this); }
    start() { this.started = true; }
    stop() { this.stopped = true; }
    abort() { this.aborted = true; }
  }
  const session = createVoiceSession(() => FakeRecognition, { final: (text) => finals.push(text), interim: () => {}, listening: (state) => states.push(state), error: (message) => errors.push(message) });
  const result = (text, final = true) => ({ results: [{ isFinal: final, 0: { transcript: text } }] });
  return { session, instances, finals, errors, states, result };
}
test("microphone requires explicit start; interim speech never issues a command", () => {
  const m = microphone();
  assert.equal(m.instances.length, 0);
  m.session.start();
  m.instances[0].onresult(m.result("Start surgery", false));
  assert.deepEqual(m.finals, []);
  assert.equal(m.instances[0].continuous, false);
});
test("final recognition issues exactly one command, even if a duplicate event arrives", () => {
  const m = microphone();
  m.session.start();
  const emit = m.instances[0].onresult;
  emit(m.result("Start surgery"));
  emit(m.result("Start surgery"));
  assert.deepEqual(m.finals, ["Start surgery"]);
  assert.equal(m.instances[0].aborted, true);
});
test("cancel and case-unmount disposal reject late speech results", () => {
  const m = microphone();
  m.session.start();
  const oldResult = m.instances[0].onresult;
  m.session.cancel();
  oldResult(m.result("End surgery"));
  m.session.start();
  const lateResult = m.instances[1].onresult;
  m.session.dispose();
  lateResult(m.result("Confirm awakening"));
  m.session.start();
  assert.equal(m.instances.length, 2);
  assert.deepEqual(m.finals, []);
  assert.equal(m.instances[1].aborted, true);
});
test("permission/network failures stop listening and report a text fallback", () => {
  const m = microphone();
  for (const error of ["not-allowed", "network", "audio-capture", "no-speech"]) {
    m.session.start();
    m.instances.at(-1).onerror({ error });
    assert.equal(m.states.at(-1), false);
    assert.ok(m.errors.at(-1).length);
  }
  assert.deepEqual(m.finals, []);
});
test("Stop processes a final result; unsupported browsers create no recognizer", () => {
  const m = microphone();
  m.session.start();
  m.session.start();
  assert.equal(m.instances.length, 1);
  m.session.stop();
  assert.equal(m.instances[0].stopped, true);
  m.instances[0].onresult(m.result("Open Recovery"));
  assert.deepEqual(m.finals, ["Open Recovery"]);
  createVoiceSession(() => undefined, { final: () => assert.fail("Unsupported speech result"), interim: () => {}, listening: () => {}, error: () => {} }).start();
});
