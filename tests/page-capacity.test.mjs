import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/hooks/pageCapacity.ts", import.meta.url), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { getPageCapacity } = await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);

test("short queues reduce rows rather than forcing a desktop minimum", () => {
  assert.equal(getPageCapacity(150, 52), 2);
  assert.equal(getPageCapacity(600, 52), 11);
  assert.equal(getPageCapacity(30, 52), 1);
});
test("wrapped rows use their measured height", () => {
  assert.equal(getPageCapacity(400, 120), 3);
  assert.equal(getPageCapacity(400, 220), 1);
});
test("hidden queues retain their capacity and large queues are bounded", () => {
  for (const height of [0, -1, NaN, Infinity]) assert.equal(getPageCapacity(height, 52), null);
  assert.equal(getPageCapacity(300, 0), null);
  assert.equal(getPageCapacity(50000, 52), 50);
});
