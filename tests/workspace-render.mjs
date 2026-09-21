import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createServer } from "vite";

// Isolated storage for render checks: never reads or modifies a user's records.
const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: key => storage.delete(key),
  clear: () => storage.clear(),
};

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
try {
  const { useSurgeryStore } = await server.ssrLoadModule("/src/store/surgeryStore.ts");
  const { AppLayout } = await server.ssrLoadModule("/src/components/layout/AppLayout.tsx");
  const surgery = useSurgeryStore.getState().surgeries[0];
  const pages = [
    ["Dashboard", "/"], ["Patients", "/patients"], ["PatientDetails", "/patients/:id"],
    ["Planning", "/planning"], ["Planning2", "/planning2"], ["WaitingList", "/waiting-list"],
    ["Cashier", "/cashier"], ["PreOp", "/pre-op"], ["PreOpDetails", "/pre-op/:id"],
    ["Surgery", "/surgery"], ["SurgeryDetails", "/surgery/:id"], ["Recovery", "/recovery"],
    ["PostOp", "/post-op"], ["PostOpDetails", "/post-op/:id"],
    ["SurgeryReception", "/reception"], ["ReceptionDetails", "/reception/:id"], ["schedule", "/schedule"],
  ];
  for (const [name, path] of pages) {
    const { default: Page } = await server.ssrLoadModule(`/src/pages/${name}.tsx`);
    for (const id of path.includes(":id") ? [surgery.id, "unknown-case"] : [null]) {
      const route = id ? path.replace(":id", encodeURIComponent(id)) : path;
      const html = renderToString(createElement(MemoryRouter, { initialEntries: [route] },
        createElement(Routes, null, createElement(Route, { element: createElement(AppLayout) },
          createElement(Route, { path, element: createElement(Page) })))));
      assert.ok(html.includes('id="main-content"'), `${route}: shell rendered`);
      assert.ok(!html.includes('data-msg='), `${route}: no Suspense render error`);
      assert.ok(html.includes('data-workspace-page=') || /not found|unavailable/i.test(html), `${route}: page rendered`);
      console.log(`PASS ${route}`);
    }
  }
} finally {
  await server.close();
  delete globalThis.localStorage;
}
