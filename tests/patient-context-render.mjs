import assert from "node:assert/strict";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
try {
  const { AppLayout } = await server.ssrLoadModule("/src/components/layout/AppLayout.tsx");
  const { useSurgeryStore } = await server.ssrLoadModule("/src/store/surgeryStore.ts");
  const surgery = useSurgeryStore.getState().surgeries[0];
  const render = (path) => renderToString(createElement(MemoryRouter, { initialEntries: [path] }, createElement(AppLayout)));
  const general = render("/");
  assert.ok(!general.includes('aria-label="Selected patient context"'));
  assert.ok(!general.includes("Surgical Journey"));
  const selected = render(`/surgery/${encodeURIComponent(surgery.id)}`);
  assert.ok(selected.includes('aria-label="Selected patient context"'));
  assert.ok(selected.includes(surgery.patientName));
  assert.ok(selected.includes("Surgical Journey"));
  assert.ok(selected.includes('aria-label="Reception: current"'));
  const invalid = render("/surgery/unknown-case");
  assert.ok(!invalid.includes('aria-label="Selected patient context"'));
  console.log("Rendered shell smoke checks passed: general, selected, and invalid case.");
} finally {
  await server.close();
}
