import type { Surgery } from '../../../types/surgery';
import type { CopilotContext } from '../types';
import { asRecord, readSavedCopilotState } from '../utils';
import { useSurgeryStore } from '../../../store/surgeryStore';

// Explicit selection prevents unrelated patient records and arbitrary browser storage
// from being shipped to the backend. This is a read-only local adapter boundary.
const fields = ['id', 'patientId', 'patientName', 'mrn', 'procedure', 'procedures', 'doctor', 'date', 'time', 'room', 'status', 'allergies', 'cost', 'paidAmount', 'paymentStatus', 'preOpStatus', 'arrivedAt', 'arrivalStatus', 'receptionCompletedAt', 'paymentCompletedAt', 'cashierEstimate', 'admittedAt', 'preOpStartedAt', 'preOpCompleted', 'preOpCompletedAt', 'anesthesiaType', 'anesthesiaTypeConfirmedAt', 'anesthesiaCompleted', 'anesthesiaCompletedAt', 'inductionAt', 'anesthesiaAdmissionAt', 'anesthesiaAdmittedAt', 'equipmentReady', 'surgeryStartedAt', 'surgeryCompletedAt', 'startAt', 'startTime', 'endAt', 'endTime', 'cutAt', 'cutTime', 'procedureSite', 'site', 'side', 'bodySite', 'recoveryAwakeningConfirmed', 'recoveryAwakeningAt', 'recoveryAwakeningObservations', 'recoveryAirway', 'recoveryBreathing', 'recoveryCirculation', 'recoveryConsciousness', 'recoveryPainControlled', 'recoveryNauseaControlled', 'readyForTransferAt', 'transferredAt', 'postOpFollowUps', 'postOpVisits', 'postOpDischargeChecklist', 'postOpDischarged', 'dischargedAt', 'dischargeTime'] as const;
export type ObservedChange = { at: string; fields: string[] };
function pick(record: Record<string, unknown>, keys: readonly string[]) { return Object.fromEntries(keys.filter(key => record[key] !== undefined).map(key => [key, record[key]])); }
function read(key: string): unknown { try { return JSON.parse(localStorage.getItem(key) ?? 'null'); } catch { return null; } }
export function captureWorkspace(caseId: string | undefined, context?: CopilotContext, recentChanges: ObservedChange[] = []) {
  const surgeries = useSurgeryStore.getState().surgeries;
  const surgery = surgeries.find(item => item.id === caseId);
  const saved = surgery ? readSavedCopilotState(surgery.id) : { preOp: {}, equipmentInUse: null, notes: [] };
  const preOp = pick(saved.preOp, ['completedTests', 'anesthesiaPlanConfirmed', 'requiredSupplies', 'additionalSupplies', 'savedAt']);
  const equipment = surgery ? read(`surgery-equipment-${surgery.id}`) : null;
  const postOp = surgery ? read(`post-op-${surgery.id}`) : null;
  return {
    selected: surgery ? pick(asRecord(surgery), fields) : null,
    directory: surgeries.map(item => pick(asRecord(item), ['id', 'patientId', 'patientName', 'patientNameArabic', 'mrn', 'procedure', 'status', 'date', 'doctor'])),
    context: context ?? {}, saved: { ...saved, preOp },
    equipment: Array.isArray(equipment) ? equipment.map(item => pick(asRecord(item), ['id', 'name', 'barcode', 'state', 'usedAt', 'returnedAt'])) : null,
    postOp: postOp ? pick(asRecord(postOp), ['followUps', 'visits', 'dischargeChecklist', 'discharged', 'dischargedAt']) : null,
    recentChanges,
  };
}
export function workspaceVersion(workspace: ReturnType<typeof captureWorkspace>) {
  return JSON.stringify({ ...workspace, recentChanges: [] });
}
export function currentCase(id: string): Surgery | undefined { return useSurgeryStore.getState().surgeries.find(item => item.id === id); }
