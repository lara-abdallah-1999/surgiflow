import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const compile = async (path) => ts.transpileModule(await readFile(new URL(`../src/${path}`, import.meta.url), "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const dataUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const utils = dataUrl(await compile("features/copilot/utils.ts"));
const analyzer = dataUrl((await compile("features/copilot/analyzeSurgery.ts")).replace('"./utils"', JSON.stringify(utils)));
const { resolveSelectedCase, getCaseJourney, withCaseContext } = await import(dataUrl((await compile("features/patient-context/caseContext.ts")).replace('"../copilot/analyzeSurgery"', JSON.stringify(analyzer))));
const stamp = "2026-09-16T10:00:00Z";
const base = { id: "case/1", patientId: "patient-1", patientName: "Test Patient", procedure: "Recorded procedure", status: "Today", paymentStatus: "Pending", preOpStatus: "Pending" };
const surgeries = [base, { ...base, id: "case-2", patientId: "patient-2" }];

test("general navigation has no patient context, even with stale route state", () => {
  for (const path of ["/", "/planning", "/schedule", "/waiting-list", "/patients"]) {
    assert.equal(resolveSelectedCase(surgeries, path, "?case=case-2", "case-2"), undefined);
  }
});

test("detail routes resolve the exact store record, including encoded IDs and reports", () => {
  for (const path of ["/reception/case%2F1", "/pre-op/case%2F1", "/surgery/case%2F1", "/surgery/case%2F1/report", "/post-op/case%2F1"]) {
    assert.equal(resolveSelectedCase(surgeries, path), base);
  }
});

test("invalid details never fall back to another patient", () => {
  assert.equal(resolveSelectedCase(surgeries, "/surgery/missing", "?case=case-2"), undefined);
  assert.equal(resolveSelectedCase(surgeries, "/surgery/%bad"), undefined);
  assert.equal(resolveSelectedCase([], "/cashier", "?case=case-2"), undefined);
});

test("patient directory resolves only an unambiguous exact link", () => {
  assert.equal(resolveSelectedCase(surgeries, "/patients/patient-1"), base);
  assert.equal(resolveSelectedCase([...surgeries, { ...base, id: "another" }], "/patients/patient-1"), undefined);
  assert.equal(resolveSelectedCase(surgeries, "/patients/Test%20Patient"), undefined);
});

test("Cashier URL context overrides legacy highlight state and survives direct links", () => {
  assert.equal(resolveSelectedCase(surgeries, "/cashier", "?case=case-2&panel=receipt", base.id), surgeries[1]);
  assert.equal(resolveSelectedCase(surgeries, "/cashier", "", base.id), base);
  assert.equal(resolveSelectedCase(surgeries, "/pre-op", "?case=case%2F1"), base);
});

test("selection reads refreshed store data without storing a duplicate record", () => {
  const updated = { ...base, patientName: "Updated Name" };
  assert.equal(resolveSelectedCase([updated], "/surgery/case%2F1"), updated);
});

test("journey has a current step and does not fabricate prior completion", () => {
  const steps = getCaseJourney({ ...base, status: "In Progress", surgeryStartedAt: stamp });
  assert.equal(steps.find((step) => step.label === "Surgery").state, "current");
  assert.equal(steps.find((step) => step.label === "Reception").state, "pending");
  assert.equal(steps.find((step) => step.label === "Cashier").state, "pending");
});

test("recorded milestones supply completed indicators", () => {
  const steps = getCaseJourney({ ...base, status: "In Progress", receptionCompletedAt: stamp, paymentStatus: "Paid", preOpCompleted: true });
  assert.deepEqual(steps.slice(0, 3).map((step) => step.state), ["complete", "complete", "complete"]);
  assert.equal(steps[3].state, "current");
});

test("recovery stays in Surgery until the existing transfer record is present", () => {
  const recovery = { ...base, status: "Recovery", surgeryCompletedAt: stamp };
  assert.equal(getCaseJourney(recovery)[3].state, "current");
  const transferred = getCaseJourney({ ...recovery, transferredAt: stamp });
  assert.equal(transferred[3].state, "complete");
  assert.equal(transferred[4].state, "current");
  assert.equal(getCaseJourney({ ...recovery, status: "Discharged" })[4].state, "complete");
});

test("journey navigation preserves admission gates and never mutates records", () => {
  const record = Object.freeze({ ...base, status: "In Progress" });
  assert.equal(getCaseJourney(record)[2].path, "/pre-op/case%2F1");
  assert.equal(getCaseJourney({ ...base, status: "Pre-Op" })[2].path, "/pre-op/case%2F1");
  assert.equal(getCaseJourney(record)[1].path, "/cashier?case=case%2F1");
});

test("Copilot list navigation carries case context without changing detail destinations", () => {
  assert.equal(withCaseContext("/pre-op", base.id), "/pre-op?case=case%2F1");
  assert.equal(withCaseContext("/cashier", base.id), "/cashier?case=case%2F1");
  assert.equal(withCaseContext("/surgery/case%2F1", base.id), "/surgery/case%2F1");
});


test("a saved Post-Op plan is checked while the patient remains in Post-Op care", () => {
  const record = { ...base, status: "Recovery", surgeryCompletedAt: stamp, transferredAt: stamp };
  assert.notEqual(getCaseJourney(record).find((step) => step.label === "Post-Op").state, "complete");
  const saved = { ...record, postOpCompleted: true };
  assert.equal(getCaseJourney(saved).find((step) => step.label === "Post-Op").state, "complete");
  assert.equal(saved.status, "Recovery");
});
