import type { Surgery } from "../../types/surgery";
import type { CopilotAnalysis, CopilotContext, CopilotDestination, CopilotItem } from "./types";
import { asRecord, hasTimestamp, preOpTests, recoveryChecks } from "./utils";
import type { SavedCopilotState } from "./utils";

/** Pure workflow guidance. No store actions, storage access, timers, or clinical inference. */
export function analyzeSurgery(
  surgery: Surgery,
  context: CopilotContext = {},
  saved: SavedCopilotState = { preOp: {}, equipmentInUse: null, notes: [] },
): CopilotAnalysis {
  const record = asRecord(surgery);
  const id = encodeURIComponent(surgery.id);
  const reception = { path: `/reception/${id}`, label: "Open Reception" };
  const cashier = { path: "/cashier", label: "Open Cashier", state: { highlightSurgeryId: surgery.id } };
  const admission = { path: `/pre-op/${id}`, label: "Open Pre-Op admission" };
  const preop = (section?: "pre-tests" | "anesthesia"): CopilotDestination => ({ path: `/pre-op/${id}`, label: "Open Pre-Op", section });
  const operating = (section: "surgery" | "recovery" = "surgery"): CopilotDestination => ({ path: `/surgery/${id}`, label: section === "recovery" ? "Open Surgery · Recovery" : "Open Surgery", section });
  const recovery = operating("recovery");
  const postop = { path: `/post-op/${id}`, label: "Open Post-Op" };
  const or = context.operatingRoom;
  const started = or?.started ?? hasTimestamp(record, ["surgeryStartedAt", "startAt", "startTime"]);
  const anesthesia = or?.anesthesiaRecorded ?? hasTimestamp(record, ["anesthesiaAdmissionAt", "anesthesiaAdmittedAt", "inductionAt"]);
  const cut = or?.cutRecorded ?? hasTimestamp(record, ["cutAt", "cutTime"]);
  const ended = or?.ended ?? hasTimestamp(record, ["endAt", "endTime", "surgeryCompletedAt"]);
  const finished = ["Completed", "Recovery", "Discharged"].includes(surgery.status);
  const preOpComplete = surgery.preOpCompleted === true || ["Ready", "In Progress", "Completed", "Recovery", "Discharged"].includes(surgery.status);
  const transferred = or?.transferred ?? Boolean(record.transferredAt);
  const recoveryComplete = transferred;
  const stageIndex = surgery.status === "Discharged" ? 6
    : recoveryComplete ? 5
    : finished || ended ? 4
    : surgery.status === "In Progress" || started || surgery.status === "Ready" ? 3
    : surgery.status === "Pre-Op" || surgery.status === "Admitted" ? 2
    : ["Payment Pending", "Financially Cleared"].includes(surgery.status) ? 1 : 0;
  const stages = ["Reception", "Payment", "Pre-Op", "Surgery", "Recovery", "Post-Op", "Discharged"];
  const items: CopilotItem[] = [];
  const notes = [...saved.notes];
  const add = (id: string, label: string, complete: boolean, blocking: boolean, reason: string, destination: CopilotDestination) => {
    items.push({ id, label, complete, blocking: !complete && blocking, reason, destination });
  };
  let nextAction: CopilotAnalysis["nextAction"] = null;
  const next = (title: string, reason: string, destination: CopilotDestination) => { nextAction = { title, reason, destination }; };

  add("arrival", "Arrival recorded", Boolean(surgery.arrivedAt), stageIndex === 0, "Reception records the patient's arrival before the cashier handoff.", reception);
  add("reception", "Reception handed off to Cashier", Boolean(surgery.receptionCompletedAt), stageIndex === 0, "Complete the Reception requirements and use its Send to Cashier control.", reception);
  add("payment", "Payment clearance recorded", surgery.paymentStatus === "Paid", stageIndex === 1, "The existing admission action requires payment status Paid.", cashier);
  add("admission", "OR admission recorded", Boolean(surgery.admittedAt), stageIndex === 1 && surgery.paymentStatus === "Paid" || surgery.status === "Admitted", "Admission is confirmed in the Pre-Op workspace before starting Pre-Op.", admission);
  add("preop", "Pre-Op completion recorded", preOpComplete, stageIndex === 2, "Confirm Pre-Op Ready after its tests and anesthesia plan requirements are complete.", preop());

  if (stageIndex === 0) {
    next(surgery.arrivedAt ? "Complete Reception and hand off to Cashier" : "Record patient arrival", "Reception owns the arrival, administrative checks, and cashier handoff.", reception);
    notes.push("Reception's unsaved administrative checks remain in its workspace; this view uses the recorded handoff.");
  } else if (stageIndex === 1) {
    if (surgery.paymentStatus !== "Paid") next("Complete payment clearance", "Payment clearance has not been completed. The OR admission action requires Paid status.", cashier);
    else next("Confirm OR admission", `Payment is recorded. Open ${surgery.patientName}'s Pre-Op workspace to confirm admission.`, admission);
  } else if (stageIndex === 2) {
    if (surgery.status === "Admitted") {
      next(surgery.admittedAt ? "Start Pre-Op" : "Review the admission record", surgery.admittedAt ? "Admission is recorded; Start Pre-Op opens the preparation workflow." : "The status is Admitted but its timestamp is missing. Start Pre-Op requires both.", admission);
    } else {
      const completedTests = context.preOp?.completedTests ?? (Array.isArray(saved.preOp.completedTests) ? saved.preOp.completedTests : []);
      const planConfirmed = context.preOp?.planConfirmed ?? Boolean(surgery.anesthesiaType && (surgery.anesthesiaTypeConfirmedAt || surgery.anesthesiaCompleted));
      for (const [key, label] of preOpTests) add(`test-${key}`, `${label} check recorded`, completedTests.includes(key), true, "This check is included in the existing Pre-Operative Tests requirement.", preop("pre-tests"));
      add("plan", "Anesthesia plan explicitly confirmed", planConfirmed, true, "The user's selected plan must be explicitly confirmed in Pre-Op. This is separate from administration.", preop("anesthesia"));
      const missing = preOpTests.filter(([key]) => !completedTests.includes(key));
      if (missing.length) next("Complete Pre-Operative Tests", `${missing.length} of 6 required test checks are not recorded.`, preop("pre-tests"));
      else if (!planConfirmed) next("Confirm the documented anesthesia plan", "All test checks are recorded; explicit plan confirmation is still required.", preop("anesthesia"));
      else next("Confirm Pre-Op Ready", "The test checks and explicit plan confirmation are complete. The workspace still owns the readiness confirmation.", preop());
      if (!context.preOp) notes.push("Pre-Op test details reflect the last saved workspace. Unsaved edits are visible when Copilot is opened inside Pre-Op.");
    }
  }

  add("start", "Surgery start recorded", started, false, "Start Surgery records the beginning of the procedure workflow.", operating());
  add("anesthesia", "Anesthesia administration recorded", anesthesia, stageIndex === 3 && started, "The surgery milestone uses administration or induction time, not plan confirmation alone.", operating());
  add("cut", "Site & Cut recorded", cut, stageIndex === 3 && anesthesia, "Site & Cut requires recorded anesthesia administration and a site for every procedure.", operating());
  add("end", "Surgery end recorded", ended, false, "End Surgery requires Site & Cut and no reusable equipment remaining In Use.", operating());
  const inUse = or?.equipmentInUse ?? saved.equipmentInUse;
  if (stageIndex >= 3 && stageIndex < 6) {
    add("equipment", inUse === null ? "Equipment reconciliation needs verification" : inUse > 0 ? `${inUse} reusable equipment item${inUse === 1 ? " is" : "s are"} still In Use` : "No reusable equipment remains In Use", inUse === 0, stageIndex === 3 && cut, "All used reusable equipment must be returned before End Surgery.", operating());
  }
  if (stageIndex === 3) {
    if (!started) {
      if (surgery.status === "Ready") next("Open Start Surgery", "Pre-Op has moved the case to Ready. The existing Start Surgery control is available in Surgery.", operating());
      else next("Review the missing surgery start record", "The case status is In Progress but no valid start timestamp is recorded. Review the record in Surgery; later milestones depend on it.", operating());
    } else if (!anesthesia) next("Record anesthesia administration", "Surgery has started but anesthesia administration has not been recorded.", operating());
    else if (!cut) {
      // Mirrors the page's procedure-site fallback without imposing new clinical rules.
      const procedures = Array.isArray(record.procedures) ? record.procedures.filter((item) => typeof item === "string" ? Boolean(item) : Boolean(asRecord(item).name ?? asRecord(item).procedure ?? asRecord(item).label)) : [];
      const sitesComplete = or?.everyProcedureHasSite ?? (procedures.length ? procedures.every((item) => {
        const p = asRecord(item);
        return Boolean(String(p.site ?? p.side ?? p.location ?? p.bodySite ?? "").trim());
      }) : Boolean(String(record.procedureSite ?? record.site ?? record.side ?? record.bodySite ?? "").trim()));
      if (!sitesComplete) {
        add("sites", "Procedure sites need documentation", false, true, "Site & Cut is unavailable until every procedure has a recorded site.", operating());
        next("Review missing procedure sites", "Anesthesia administration is recorded, but at least one procedure has no site. Review Procedures & Surgical Sites in Surgery and arrange for the case documentation to be updated.", operating());
        notes.push("The existing Surgery page displays procedure sites but does not provide a site editor. Copilot cannot fill in a site or bypass this gate.");
      } else next("Record Site & Cut", "Anesthesia administration and procedure sites are recorded. Site & Cut is the next unrecorded milestone.", operating());
    } else if (inUse === null) next("Verify equipment reconciliation", "Saved equipment data is unavailable. Open Surgery to check the current equipment list.", operating());
    else if (inUse > 0) next("Reconcile reusable equipment", `${inUse} item${inUse === 1 ? " remains" : "s remain"} In Use, blocking End Surgery.`, operating());
    else if (!surgery.surgeryStartedAt) next("Review the missing primary start timestamp", "The displayed start uses a legacy timestamp, but End Surgery requires surgeryStartedAt in the store.", operating());
    else next("Open End Surgery", "Site & Cut is recorded and equipment is reconciled. End Surgery is the next workflow control.", operating());
  }

  if (stageIndex === 4) {
    {
      const dest = operating("recovery");
      const awake = or?.awakeningConfirmed ?? Boolean(record.recoveryAwakeningConfirmed);
      const ready = or?.readyForTransfer ?? Boolean(record.readyForTransferAt);
      add("awakening", "Awakening confirmation recorded", awake, !ready, "Surgery's Recovery tab requires awakening confirmation before Ready for Transfer.", dest);
      let missingCount = 0;
      for (const [key, field, label] of recoveryChecks) {
        const checked = or ? Boolean(or.recoveryAssessment[key]) : Boolean(record[field]);
        if (!checked) missingCount++;
        add(`check-${key}`, `${label} check recorded`, checked, !ready, "All six recovery checks are required for the Ready for Transfer checkpoint.", dest);
      }
      add("transfer-ready", "Ready for Transfer confirmed", ready, !ready, "This is a separate checkpoint after awakening and the six recovery checks.", dest);
      add("transferred", "Transfer confirmed", transferred, false, "Confirm Transferred follows the Ready for Transfer checkpoint.", dest);
      if (ready) next("Confirm Transferred", "Ready for Transfer is recorded. Confirm Transferred is the next workflow control.", dest);
      else if (!awake) next("Record awakening confirmation", "Surgery is completed. Awakening confirmation and recovery checks precede Ready for Transfer.", dest);
      else if (missingCount) next("Complete recovery checks", `${missingCount} of 6 recovery checks are incomplete.`, dest);
      else next("Confirm Ready for Transfer", "Awakening and all six recovery checks are recorded. The explicit Ready for Transfer checkpoint is next.", dest);
      if (ready && (!awake || missingCount > 0)) notes.push("Ready for Transfer is recorded, but some supporting checks are missing. Verify the record in the Recovery tab.");
    }
  } else if (stageIndex === 5) {
    next("Continue Post-Op documentation", "Transfer is confirmed. Review follow-up and discharge requirements in the Post-Op workspace.", postop);
  }
  if (stageIndex >= 5) add("recovery-complete", "Recovery completion recorded", recoveryComplete, false, "Recovery owns its completion record.", recovery);
  if (stageIndex === 6) add("discharged", "Discharge recorded", true, false, "The case status is Discharged. No further surgery workflow action is suggested.", postop);
  if (stageIndex > 2 && items.some((item) => ["arrival", "reception", "admission"].includes(item.id) && !item.complete)) notes.push("Some earlier timestamps are not recorded. The current case status is used for navigation; missing history does not imply the patient should repeat earlier steps.");
  return {
    stage: stages[stageIndex],
    summary: stageIndex === 6 ? "Discharge is recorded. No pending surgery workflow action." : `Current recorded status: ${surgery.status}.`,
    progress: stages.map((label, index) => ({ label, state: index < stageIndex ? "passed" : index === stageIndex ? "current" : "upcoming" })),
    items, nextAction, notes: [...new Set(notes)],
  };
}
