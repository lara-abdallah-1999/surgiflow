# Patient context

The existing URL identifies a surgery and `useSurgeryStore` supplies its live record. There is no selected-patient store or new persistence format. General routes clear context; invalid IDs never fall back to a different patient. A patient-directory route resolves only an exact surgery ID or a single matching `patientId`.

Workflow lists accept `?case=<id>`. Cashier opens the selected case directly: unpaid cases display the payment form and paid cases display a printable receipt. Refresh and browser navigation retain the selected case. Legacy Cashier highlight navigation remains supported.

`PatientContextHeader` displays only recorded case values. `PatientContextTools` places page-owned actions and status details in the header using a React portal. The portal context holds a DOM host, not patient state. Original workflow handlers, timer state, and saving behavior remain in their pages.

The sidebar reads the existing Copilot analyzer for the current phase; checkmarks require recorded completion evidence. Recovery belongs to Surgery until transfer is recorded. Pre-Op opens the case details directly, including the existing admission and Start Pre-Op actions. Revisiting later phases cannot reapply an earlier Ready status. Confirming Pre-Op readiness stays on the page with a toast.

Copilot uses the same selected record. Text/voice commands, pending-action review, and document drafts remain in the Copilot feature; this module adds no AI service or clinical inference.

The shell owns available height. On narrow screens the sidebar becomes an icon rail and header cards wrap. Compact workspaces stack cards and label table cells. Long forms retain vertical scrolling so controls remain readable and accessible on narrow devices; no fixed minimum workspace width is imposed.

Validation: `node --test tests/patient-context.test.mjs tests/copilot.test.mjs tests/copilot-commands.test.mjs`.

Rendered shell smoke check: `node tests/patient-context-render.mjs` (valid case, invalid case, and no selection). This checks server-rendered markup; it does not replace browser layout verification.
