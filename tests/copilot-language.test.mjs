import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const compile = async (name) => ts.transpileModule(await readFile(new URL(`../src/features/copilot/${name}.ts`, import.meta.url), "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const url = (code) => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const languageUrl = url(await compile("language"));
const { translateWorkflowCommand, normalizeArabic } = await import(languageUrl);
const { findPatientCases } = await import(url((await compile("patientLookup")).replace('"./language"', JSON.stringify(languageUrl))));
const utilsUrl = url(await compile("utils"));
const { parseCommand, answerQuestion, caseBrief } = await import(url((await compile("commands")).replace('"./utils"', JSON.stringify(utilsUrl))));

test("Arabic factual questions resolve to recorded case details", () => {
  const record = { allergies: ["Latex"], procedures: [{ name: "Recorded procedure", site: "Recorded site" }], doctor: "Recorded surgeon" };
  for (const [raw, question, expected] of [["اعرض الحساسية", "allergies", "Latex"], ["شو العملية", "procedures", "Recorded site"], ["مين الجراح", "surgeon", "Recorded surgeon"]]) {
    assert.deepEqual(parseCommand(translateWorkflowCommand(raw).command), { kind: "ask", question });
    assert.ok(answerQuestion(question, record, {}).includes(expected));
  }
  assert.ok(answerQuestion("allergies", {}, {}).includes("does not establish the absence"));
});

test("Arabic and Lebanese workflow questions become read-only English intents", () => {
  for (const raw of ["شو ناقص؟", "هل تم الدفع؟", "لخص الحالة", "كم مضى على العملية؟", "ما هي الخطوة التالية؟", "من فضلك اعطني ملخص"]) {
    const translated = translateWorkflowCommand(raw);
    assert.equal(translated.translated, true, raw);
    assert.equal(parseCommand(translated.command).kind, "ask", raw);
  }
});
test("Arabic navigation and preparation retain the existing intent boundary", () => {
  assert.deepEqual(parseCommand(translateWorkflowCommand("افتح الافاقة").command), { kind: "navigate", target: "recovery" });
  assert.deepEqual(parseCommand(translateWorkflowCommand("ابدأ العملية").command), { kind: "act", action: "start" });
  for (const raw of ["لا تبدأ العملية", "ابدأ العملية وسجل التخدير", "هل ابدأ العملية", "ابدأ العملية لمريض آخر", "نعم", "اكد"]) assert.notEqual(parseCommand(translateWorkflowCommand(raw).command).kind, "act", raw);
});
test("clinical narratives are preserved instead of being falsely translated", () => {
  const result = translateWorkflowCommand("أضف ملاحظة الإفاقة: تم الاتصال بالطبيب");
  assert.equal(result.narrativePreserved, true);
  assert.equal(parseCommand(result.command).text, "تم الاتصال بالطبيب");
  assert.equal(translateWorkflowCommand("تشخيص طبي جديد").translated, false);
});
test("Arabic diacritics and digits normalize consistently", () => {
  assert.equal(normalizeArabic("إفَاقة ١٢٣"), "افاقه 123");
});
const cases = [{ id: "case1", patientId: "patient1", patientName: "Test Person", mrn: "MRN-12345" }, { id: "case2", patientId: "patient2", patientName: "Another Person", mrn: "MRN-54321" }];
test("voice patient lookup accepts name, MRN and individually spoken digits", () => {
  assert.equal(findPatientCases(cases, "Test Person")[0].id, "case1");
  assert.equal(findPatientCases(cases, "Open Test Person MRN one two three four five")[0].id, "case1");
  assert.equal(findPatientCases(cases, "افتح ملف المريض رقم ١٢٣٤٥")[0].id, "case1");
  assert.equal(findPatientCases(cases, "unknown person").length, 0);
  assert.equal(findPatientCases([...cases, { ...cases[0], id: "case3" }], "12345").length, 2);
});
test("Copilot summaries expose outstanding awakening reviews and actual observations", () => {
  const surgery = { ...cases[0], recoveryAwakeningObservations: [{ id: "o1", observedAt: "2026-09-17T09:00:00Z", response: "Not yet awake", note: "Review requested by attending staff", reviewRequested: true }] };
  const analysis = { items: [], nextAction: null };
  assert.match(caseBrief(surgery, analysis), /Clinician reviews outstanding: 1/);
  assert.match(answerQuestion("awakening", surgery, analysis), /Not yet awake/);
  assert.match(answerQuestion("awakening", surgery, analysis), /notification is not recorded/);
});
