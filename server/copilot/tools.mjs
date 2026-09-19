import { analyzeSurgery } from '../.generated/analyzeSurgery.mjs';
import { preOpTests, recoveryChecks } from '../.generated/utils.mjs';
import { findPatientCases } from '../.generated/patientLookup.mjs';
import { RequestError } from '../adapters/local.mjs';

const readTools = {
  getSelectedCase: 'Read selected case identity and deterministic workflow analysis.',
  getReceptionStatus: 'Read recorded arrival and Reception handoff. Unsaved Reception checks are unavailable.',
  getPaymentStatus: 'Read payment totals, balance and recorded charge estimate.',
  getFinancialClearance: 'Read the existing payment clearance checkpoint; no clinical inference.',
  getPreOpStatus: 'Read Pre-Op status and deterministic outstanding workflow items.',
  getPendingPreOpItems: 'Read required test checks and anesthesia plan confirmation still missing.',
  getTestsStatus: 'Read the six existing Pre-Op test checkboxes, not test interpretations.',
  getAllergies: 'Read recorded allergies. Missing data never means no allergies.',
  getAnesthesiaStatus: 'Read planned anesthesia and recorded administration separately.',
  getSuppliesStatus: 'Read last saved required and additional supply checklist.',
  getSurgeryStatus: 'Read recorded surgery status and deterministic next action.',
  getCurrentMilestone: 'Read surgery milestones from existing workflow rules.',
  getSurgeryDuration: 'Calculate elapsed time from recorded start and end, validating timestamps.',
  getSurgicalTeam: 'Read recorded surgeon only; do not invent additional team members.',
  getEquipmentStatus: 'Read saved equipment items and live in-use count where supplied.',
  getUnreconciledEquipment: 'Read reusable equipment still In Use.',
  getRecoveryStatus: 'Read existing recovery checks, awakening observations and transfer checkpoints.',
  getFollowUpStatus: 'Read recorded Post-Op follow-up orders and visits, without recommending treatment.',
  getDischargeStatus: 'Read recorded discharge status and checklist; never declare medical safety.',
  getCaseTimeline: 'Read timestamped recorded workflow milestones, not a complete audit trail.',
  getRecentCaseChanges: 'Read changes observed in the current Copilot session, not a clinical audit log.',
  generateCaseBrief: 'Retrieve source facts for an AI case brief draft. No saving.',
  generateHandoff: 'Retrieve source facts for an AI handoff draft. No saving.',
};
const schema = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const definition = (name, description, properties = {}) => ({ type: 'function', name, description, strict: true, parameters: schema(properties) });
export const toolDefinitions = [
  ...Object.entries(readTools).map(([name, description]) => definition(name, description)),
  ...['searchPatients', 'searchSurgeryCases'].map(name => definition(name, 'Search authorized directory by recorded name, Arabic name, MRN or case ID. Returns candidates, never selects one automatically.', { query: { type: 'string', maxLength: 250 } })),
  definition('openSurgeryCase', 'Propose an Open record button for an exact returned case ID. User verifies identity before opening; no automatic selection.', { caseId: { type: 'string', maxLength: 250 } }),
  definition('navigateToJourneyStep', 'Propose a navigation button for the selected case. Never executes workflow changes.', { step: { type: 'string', enum: ['Reception', 'Cashier', 'Pre-Op', 'Surgery', 'Recovery', 'Post-Op', 'next'] } }),
];
const allowed = new Map(toolDefinitions.map(tool => [tool.name, tool]));
export function validateTool(name, args) {
  const definition = allowed.get(name);
  if (!definition || !args || typeof args !== 'object' || Array.isArray(args)) throw new RequestError('Tool is not allowed.');
  const properties = definition.parameters.properties;
  if (Object.keys(args).length !== Object.keys(properties).length || Object.keys(args).some(key => !Object.hasOwn(properties, key))) throw new RequestError('Invalid tool arguments.');
  for (const [key, prop] of Object.entries(properties)) if (typeof args[key] !== 'string' || !args[key].trim() || args[key].length > (prop.maxLength ?? 250) || (prop.enum && !prop.enum.includes(args[key]))) throw new RequestError('Invalid tool argument.');
}
export function createToolRunner(snapshot) {
  const proposals = [];
  let draftKind = null;
  const selected = () => { if (!snapshot.selected) throw new RequestError('Select a surgery case before reading clinical workflow details.'); return snapshot.selected; };
  const analysis = () => analyzeSurgery(selected(), snapshot.context, snapshot.saved);
  const facts = () => ({ identity: identity(selected()), procedures: selected().procedures ?? null, workflow: analysis(), allergies: run('getAllergies', {}), tests: run('getTestsStatus', {}), equipment: run('getUnreconciledEquipment', {}), reception: run('getReceptionStatus', {}), payment: run('getPaymentStatus', {}), anesthesia: run('getAnesthesiaStatus', {}), recovery: run('getRecoveryStatus', {}), followUp: run('getFollowUpStatus', {}), discharge: run('getDischargeStatus', {}) });
  const propose = proposal => { if (!proposals.some(p => JSON.stringify(p) === JSON.stringify(proposal))) proposals.push(proposal); return { proposed: proposal, executed: false, requiresUserClick: true }; };
  function run(name, args) {
    validateTool(name, args);
    if (name === 'searchPatients' || name === 'searchSurgeryCases') return { candidates: findPatientCases(snapshot.directory, args.query).slice(0, 12).map(identity), note: 'Verify name and MRN. Arabic transliteration is not an exact identity match; search by MRN if uncertain.' };
    if (name === 'openSurgeryCase') {
      const match = snapshot.directory.find(item => item.id === args.caseId);
      if (!match) throw new RequestError('Case is not in the authorized directory.', 403);
      return propose({ caseId: match.id, patientName: match.patientName, mrn: match.mrn ?? null, destination: { path: `/surgery/${encodeURIComponent(match.id)}`, label: `Open ${match.patientName}` } });
    }
    const s = selected();
    const workflow = analysis();
    const or = snapshot.context.operatingRoom;
    switch (name) {
      case 'getSelectedCase': return { identity: identity(s), workflow, capturedAt: snapshot.capturedAt, source: snapshot.source };
      case 'getReceptionStatus': return { arrivedAt: s.arrivedAt ?? null, completedAt: s.receptionCompletedAt ?? null, arrivalStatus: s.arrivalStatus ?? null, note: 'Unsaved administrative and consent checks are not exposed; no completion inferred.' };
      case 'getPaymentStatus': return { status: s.paymentStatus, total: s.cost, paid: s.paidAmount, remaining: Number.isFinite(s.cost) && Number.isFinite(s.paidAmount) ? Math.max(0, s.cost - s.paidAmount) : null, completedAt: s.paymentCompletedAt ?? null, estimate: s.cashierEstimate ?? null, currency: 'USD', note: 'Estimate line items may differ from the final total.' };
      case 'getFinancialClearance': return { paymentClearanceRecorded: s.paymentStatus === 'Paid', status: s.status, admittedAt: s.admittedAt ?? null };
      case 'getPreOpStatus': case 'getPendingPreOpItems': return { status: s.preOpStatus, items: workflow.items.filter(item => ['preop', 'plan'].includes(item.id) || item.id.startsWith('test-')), tests: run('getTestsStatus', {}), anesthesia: run('getAnesthesiaStatus', {}) };
      case 'getTestsStatus': {
        const tests = snapshot.context.preOp?.completedTests ?? snapshot.saved.preOp?.completedTests;
        return { source: snapshot.context.preOp ? 'Live Pre-Op workspace' : 'Last saved Pre-Op workspace', tests: preOpTests.map(([id, label]) => ({ id, label, recorded: Array.isArray(tests) ? tests.includes(id) : null })), savedAt: snapshot.saved.preOp?.savedAt ?? null };
      }
      case 'getAllergies': return { recorded: s.allergies ?? null, note: 'Missing/empty documentation does not establish absence of allergies.' };
      case 'getAnesthesiaStatus': return { plannedType: s.anesthesiaType ?? null, planConfirmed: snapshot.context.preOp?.planConfirmed ?? Boolean(s.anesthesiaType && (s.anesthesiaTypeConfirmedAt || s.anesthesiaCompleted)), planConfirmedAt: s.anesthesiaTypeConfirmedAt ?? null, administrationRecorded: workflow.items.find(i => i.id === 'anesthesia')?.complete, inductionAt: s.inductionAt ?? s.anesthesiaAdmissionAt ?? null };
      case 'getSuppliesStatus': return { required: snapshot.saved.preOp?.requiredSupplies ?? null, additional: snapshot.saved.preOp?.additionalSupplies ?? null, source: 'Last saved Pre-Op workspace; not stock inventory.' };
      case 'getSurgeryStatus': return { status: s.status, next: workflow.nextAction, blockers: workflow.items.filter(i => i.blocking) };
      case 'getCurrentMilestone': return workflow.items.filter(i => ['start', 'anesthesia', 'cut', 'end'].includes(i.id));
      case 'getSurgeryDuration': {
        const start = Date.parse(s.surgeryStartedAt); const end = s.surgeryCompletedAt ? Date.parse(s.surgeryCompletedAt) : Date.now();
        return { start: s.surgeryStartedAt ?? null, end: s.surgeryCompletedAt ?? null, elapsedSeconds: Number.isFinite(start) && Number.isFinite(end) && start <= end && start <= Date.now() && (s.surgeryCompletedAt || s.status === 'In Progress') ? Math.floor((end - start) / 1000) : null, calculatedAt: new Date().toISOString() };
      }
      case 'getSurgicalTeam': return { surgeon: s.doctor ?? null, otherTeamMembers: null };
      case 'getEquipmentStatus': case 'getUnreconciledEquipment': return { items: snapshot.equipment === null ? null : name === 'getUnreconciledEquipment' ? snapshot.equipment.filter(i => i.state === 'In Use') : snapshot.equipment, liveInUseCount: or?.equipmentInUse ?? null, liveInUseNames: or?.equipmentNames ?? null, note: 'Items reflect saved equipment; live workspace count takes priority.' };
      case 'getRecoveryStatus': return { awakeningConfirmed: or?.awakeningConfirmed ?? s.recoveryAwakeningConfirmed ?? null, awakeningAt: s.recoveryAwakeningAt ?? null, observations: s.recoveryAwakeningObservations ?? [], checks: recoveryChecks.map(([key, field, label]) => ({ label, recorded: or?.recoveryAssessment?.[key] ?? s[field] ?? null })), readyForTransferAt: s.readyForTransferAt ?? null, transferredAt: s.transferredAt ?? null, separateRecoveryWorkspace: snapshot.context.recovery ?? null };
      case 'getFollowUpStatus': return { orders: snapshot.postOp?.followUps ?? s.postOpFollowUps ?? null, visits: snapshot.postOp?.visits ?? s.postOpVisits ?? null, source: 'Saved Post-Op data; unsaved edits unavailable.' };
      case 'getDischargeStatus': return { status: s.status, recordedDischarged: snapshot.postOp?.discharged ?? s.postOpDischarged ?? (s.status === 'Discharged'), dischargedAt: snapshot.postOp?.dischargedAt ?? s.dischargedAt ?? s.dischargeTime ?? null, checklist: snapshot.postOp?.dischargeChecklist ?? s.postOpDischargeChecklist ?? null, note: 'Only existing Post-Op controls can confirm discharge.' };
      case 'getCaseTimeline': return { events: ['arrivedAt', 'receptionCompletedAt', 'paymentCompletedAt', 'admittedAt', 'preOpStartedAt', 'preOpCompletedAt', 'surgeryStartedAt', 'inductionAt', 'anesthesiaAdmissionAt', 'cutAt', 'surgeryCompletedAt', 'recoveryAwakeningAt', 'readyForTransferAt', 'transferredAt', 'dischargedAt'].filter(key => s[key] && Number.isFinite(Date.parse(s[key]))).map(key => ({ field: key, at: s[key] })).sort((a, b) => Date.parse(a.at) - Date.parse(b.at)), note: 'Recorded timestamps only; not an audit log.' };
      case 'getRecentCaseChanges': return { events: snapshot.recentChanges, note: 'Observed in this browser Copilot session only; not a clinical audit log.' };
      case 'generateCaseBrief': draftKind = 'summary'; return facts();
      case 'generateHandoff': draftKind = 'handoff'; return facts();
      case 'navigateToJourneyStep': {
        const id = encodeURIComponent(s.id);
        const paths = { Reception: `/reception/${id}`, Cashier: `/accounting?case=${id}`, 'Pre-Op': `/pre-op/${id}`, Surgery: `/surgery/${id}`, Recovery: `/surgery/${id}`, 'Post-Op': `/post-op/${id}` };
        const destination = args.step === 'next' ? workflow.nextAction?.destination : { path: paths[args.step], label: `Open ${args.step}`, ...(args.step === 'Recovery' ? { section: 'recovery' } : {}) };
        return destination ? propose({ caseId: s.id, patientName: s.patientName, mrn: s.mrn ?? null, destination }) : { proposed: null, reason: 'No pending workflow destination.' };
      }
    }
  }
  return { run, proposals, get draftKind() { return draftKind; } };
}
function identity(s) { return { id: s.id, patientId: s.patientId, patientName: s.patientName, mrn: s.mrn ?? null, procedure: s.procedure, status: s.status, date: s.date, surgeon: s.doctor }; }
