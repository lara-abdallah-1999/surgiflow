import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

// Use the already-installed compiler; no test framework or application dependency added.
const compile = async (name) => ts.transpileModule(await readFile(new URL(`../src/features/copilot/${name}.ts`, import.meta.url), "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const dataUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const utilsUrl = dataUrl(await compile("utils"));
const { analyzeSurgery } = await import(dataUrl((await compile("analyzeSurgery")).replace('"./utils"', JSON.stringify(utilsUrl))));
const { readSavedCopilotState } = await import(utilsUrl);
const stamp = "2026-09-03T09:00:00Z";
const base = { id: "case/1", patientId: "p1", patientName: "Test Patient", procedure: "Procedure", doctor: "Doctor", date: "2026-09-03", time: "09:00", room: "OR 1", priority: "Routine", status: "Today", cost: 100, paidAmount: 0, paymentStatus: "Pending", preOpStatus: "Pending" };
const run = (changes = {}, context = {}, saved) => analyzeSurgery({ ...base, ...changes }, context, saved);
const tests = ["cbc", "coagulation", "chemistry", "ecg", "imaging", "clearance"];
const active = { status: "In Progress", surgeryStartedAt: stamp, inductionAt: stamp, procedures: [{ name: "Procedure", site: "Recorded site" }] };
const saved = { preOp: {}, equipmentInUse: 0, notes: [] };

test("arrival guidance uses the real encoded Reception route", () => {
  assert.equal(run().nextAction.destination.path, "/reception/case%2F1");
  assert.equal(run().nextAction.title, "Record patient arrival");
});
test("partial payment blocks admission and targets Cashier's existing highlight state", () => {
  const result = run({ status: "Payment Pending", paidAmount: 50, paymentStatus: "Partially Paid" });
  assert.equal(result.nextAction.destination.path, "/cashier");
  assert.deepEqual(result.nextAction.destination.state, { highlightSurgeryId: "case/1" });
  assert.equal(result.items.find((item) => item.id === "payment").blocking, true);
});
test("Paid clearance leads to admission and admitted cases lead to Start Pre-Op", () => {
  assert.equal(run({ status: "Financially Cleared", paymentStatus: "Paid" }).nextAction.title, "Confirm OR admission");
  assert.equal(run({ status: "Admitted", admittedAt: stamp }).nextAction.title, "Start Pre-Op");
  assert.equal(run({ status: "Admitted" }).nextAction.title, "Review the admission record");
});
test("Pre-Op counts required IDs, ignoring duplicates and unrelated checks", () => {
  const result = run({ status: "Pre-Op" }, { preOp: { completedTests: ["cbc", "cbc", "other"], planConfirmed: false } });
  assert.equal(result.nextAction.reason, "5 of 6 required test checks are not recorded.");
});
test("live Pre-Op overrides stale saved checks and plan state", () => {
  const result = run({ status: "Pre-Op", anesthesiaType: "General", anesthesiaTypeConfirmedAt: stamp }, { preOp: { completedTests: tests, planConfirmed: false } }, { ...saved, preOp: { completedTests: [] } });
  assert.equal(result.nextAction.destination.section, "anesthesia");
});
test("Pre-Op confirmation requires tests and plan, not supplies or clinical assessments", () => {
  assert.equal(run({ status: "Pre-Op", equipmentReady: false }, { preOp: { completedTests: tests, planConfirmed: true } }).nextAction.title, "Confirm Pre-Op Ready");
});
test("Ready follows existing Start Surgery behavior without introducing gates", () => {
  assert.equal(run({ status: "Ready", equipmentReady: false, anesthesiaCompleted: false }).nextAction.title, "Open Start Surgery");
});
test("anesthesia plan and completion flag alone are not an administration milestone", () => {
  const result = run({ status: "In Progress", surgeryStartedAt: stamp, anesthesiaType: "General", anesthesiaTypeConfirmedAt: stamp, anesthesiaCompleted: true });
  assert.equal(result.nextAction.title, "Record anesthesia administration");
});
test("administration timestamp aliases are accepted and malformed timestamps ignored", () => {
  assert.equal(run({ ...active, inductionAt: undefined, anesthesiaAdmittedAt: stamp }).nextAction.title, "Record Site & Cut");
  assert.equal(run({ ...active, inductionAt: "invalid" }).nextAction.title, "Record anesthesia administration");
});
test("Site & Cut requires every site including legacy site aliases", () => {
  assert.equal(run({ ...active, procedures: [{ name: "A", site: "A" }, { name: "B" }] }).nextAction.title, "Review missing procedure sites");
  assert.equal(run({ ...active, procedures: [{ name: "A", side: "Left" }] }).nextAction.title, "Record Site & Cut");
});
test("live equipment controls reconciliation and End Surgery guidance", () => {
  const context = { operatingRoom: { started: true, anesthesiaRecorded: true, cutRecorded: true, ended: false, everyProcedureHasSite: true, equipmentInUse: 2, awakeningConfirmed: false, recoveryAssessment: {}, readyForTransfer: false, transferred: false } };
  assert.equal(run({ ...active, cutAt: stamp }, context, saved).nextAction.title, "Reconcile reusable equipment");
  context.operatingRoom.equipmentInUse = 0;
  assert.equal(run({ ...active, cutAt: stamp }, context, saved).nextAction.title, "Open End Surgery");
});
test("unknown equipment and missing primary start are not reported as actionable End Surgery", () => {
  assert.equal(run({ ...active, cutAt: stamp }).nextAction.title, "Verify equipment reconciliation");
  assert.equal(run({ ...active, surgeryStartedAt: undefined, startAt: stamp, cutAt: stamp }, {}, saved).nextAction.title, "Review the missing primary start timestamp");
});
test("in-progress demo with no start timestamp gets record-review guidance", () => {
  assert.equal(run({ status: "In Progress" }).nextAction.title, "Review the missing surgery start record");
});
test("surgery recovery counts missing checks and preserves separate transfer checkpoint", () => {
  const changes = { status: "Completed", surgeryCompletedAt: stamp, recoveryAwakeningConfirmed: true, recoveryAirway: true, recoveryBreathing: true, recoveryCirculation: true, recoveryConsciousness: true };
  assert.equal(run(changes).nextAction.reason, "2 of 6 recovery checks are incomplete.");
  const checks = { ...changes, recoveryPainControlled: true, recoveryNauseaControlled: true };
  assert.equal(run(checks).nextAction.title, "Confirm Ready for Transfer");
  assert.equal(run({ ...checks, readyForTransferAt: stamp }).nextAction.title, "Confirm Transferred");
});
test("transferred cases continue to Post-Op without a standalone Recovery destination", () => {
  const result = run({ status: "Recovery", transferredAt: stamp });
  assert.equal(result.nextAction.destination.path, "/post-op/case%2F1");
  assert.ok(result.items.every((item) => item.destination.path !== "/recovery"));
});
test("Recovery status uses only Surgery Details recovery checkpoints", () => {
  const result = run({ status: "Recovery" });
  assert.equal(result.nextAction.destination.path, "/surgery/case%2F1");
  assert.equal(result.nextAction.destination.section, "recovery");
  assert.equal(result.items.some((item) => ["report", "stability"].includes(item.id)), false);
});
test("legacy standalone Recovery completion does not bypass tab checkpoints", () => {
  const result = run({ status: "Recovery", recoveryCompleted: true }, { recovery: { started: true, awakeningStage: 0, assessments: [], stability: "stable", surgeonReport: "", status: "Monitoring" } });
  assert.equal(result.nextAction.title, "Record awakening confirmation");
});
test("completed Recovery targets Post-Op; discharged cases have no next action", () => {
  assert.equal(run({ status: "Recovery", transferredAt: stamp }).nextAction.destination.path, "/post-op/case%2F1");
  assert.equal(run({ status: "Discharged" }).nextAction, null);
});
test("missing historical timestamps do not send advanced cases back to arrival", () => {
  const result = run({ ...active, cutAt: stamp }, {}, saved);
  assert.equal(result.items.find((item) => item.id === "arrival").blocking, false);
  assert.equal(result.nextAction.title, "Open End Surgery");
});
test("analysis is deterministic and does not mutate frozen inputs", () => {
  const surgery = Object.freeze({ ...base, ...active });
  assert.deepEqual(analyzeSurgery(surgery), analyzeSurgery(surgery));
  assert.equal(surgery.status, "In Progress");
});
test("storage adapter handles absent, corrupt and inaccessible storage without writes", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  try {
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: () => null } });
    assert.equal(readSavedCopilotState("x").equipmentInUse, 0);
    globalThis.localStorage.getItem = () => "{";
    assert.equal(readSavedCopilotState("x").equipmentInUse, null);
    assert.ok(readSavedCopilotState("x").notes.length);
    globalThis.localStorage.getItem = () => { throw new Error("Denied"); };
    assert.equal(readSavedCopilotState("x").equipmentInUse, null);
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete globalThis.localStorage;
  }
});
