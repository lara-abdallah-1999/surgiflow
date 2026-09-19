# Workspace components

Each directory contains the existing page-specific UI components, formatting helpers, types and configuration extracted from its page. Large component collections are split into named files with a barrel export. Page controllers retain their existing workflow actions and local state. Shared cross-page UI remains in src/components; patient state remains in the existing surgery store.

Responsive annotations on grids and table cells are consumed by src/index.css. Desktop markup and visual tokens are preserved; compact tables retain labeled data and sorting controls.

Browser verification scripts in scripts/ use an isolated Chrome debugging session on port 9223 and Vite on port 5173. workflow-ui-check.mjs changes synthetic case data in that browser session only. Do not point it at a browser session containing real patient work.
