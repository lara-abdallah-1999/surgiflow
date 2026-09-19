import { capabilities } from './contracts.mjs';

export class RequestError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
const object = value => value && typeof value === 'object' && !Array.isArray(value);
export function requireString(value, name, max = 12000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new RequestError(`Invalid ${name}.`);
  return value.trim();
}
function bounded(value, depth = 0) {
  if (depth > 8) throw new RequestError('Workspace nesting is too deep.');
  if (value === null || typeof value === 'boolean') return value;
  if (typeof value === 'number') { if (!Number.isFinite(value)) throw new RequestError('Invalid number.'); return value; }
  if (typeof value === 'string') { if (value.length > 30000) throw new RequestError('Workspace field is too long.'); return value; }
  if (Array.isArray(value)) { if (value.length > 500) throw new RequestError('Too many workspace items.'); return value.map(v => bounded(v, depth + 1)); }
  if (object(value)) {
    if (Object.keys(value).length > 150) throw new RequestError('Too many workspace fields.');
    return Object.fromEntries(Object.entries(value).filter(([key]) => !['__proto__', 'constructor', 'prototype'].includes(key)).map(([key, v]) => [key, bounded(v, depth + 1)]));
  }
  throw new RequestError('Invalid workspace value.');
}
export const developmentPermissions = {
  authenticate: async (_request, sessionId) => ({ id: sessionId, mode: 'local-development-no-authentication' }),
  authorize: async (principal, capability) => principal.mode === 'local-development-no-authentication' && capabilities.includes(capability),
};
export const localWorkspaceAdapter = {
  async snapshot({ selectedCaseId, localWorkspace }) {
    if (!object(localWorkspace)) throw new RequestError('Workspace snapshot is required.');
    const data = bounded(localWorkspace);
    if (!Array.isArray(data.directory) || data.directory.length > 500) throw new RequestError('Invalid case directory.');
    const directory = data.directory.map(item => {
      if (!object(item)) throw new RequestError('Invalid case identity.');
      return Object.fromEntries(['id', 'patientId', 'patientName', 'patientNameArabic', 'mrn', 'procedure', 'status', 'date', 'doctor'].filter(key => typeof item[key] === 'string').map(key => [key, item[key].slice(0, 250)]));
    });
    if (directory.some(item => !item.id || !item.patientName) || new Set(directory.map(i => i.id)).size !== directory.length) throw new RequestError('Invalid or duplicate case identity.');
    const selected = data.selected;
    if (selectedCaseId !== null && (!object(selected) || selected.id !== selectedCaseId || !directory.some(i => i.id === selectedCaseId && i.patientName === selected.patientName))) throw new RequestError('Selected case does not match the workspace.', 409);
    if (selectedCaseId === null && selected !== null) throw new RequestError('Unexpected selected case.');
    if (selected && (!['Waiting List', 'Today', 'Booked', 'Payment Pending', 'Financially Cleared', 'Admitted', 'Pre-Op', 'Ready', 'In Progress', 'Completed', 'Recovery', 'Discharged'].includes(selected.status) || !['Pending', 'Partially Paid', 'Paid'].includes(selected.paymentStatus))) throw new RequestError('Invalid workflow status.');
    const saved = { preOp: object(data.saved?.preOp) ? data.saved.preOp : {}, equipmentInUse: typeof data.saved?.equipmentInUse === 'number' && data.saved.equipmentInUse >= 0 ? data.saved.equipmentInUse : null, notes: Array.isArray(data.saved?.notes) ? data.saved.notes.filter(note => typeof note === 'string') : [] };
    if (data.equipment !== null && data.equipment !== undefined && (!Array.isArray(data.equipment) || data.equipment.some(item => !object(item) || !['Available', 'In Use', 'Returned'].includes(item.state)))) throw new RequestError('Invalid equipment snapshot.');
    return { selectedCaseId, selected, directory, context: object(data.context) ? data.context : {}, saved, equipment: Array.isArray(data.equipment) ? data.equipment : null, postOp: object(data.postOp) ? data.postOp : null, recentChanges: Array.isArray(data.recentChanges) ? data.recentChanges.slice(-20) : [], capturedAt: new Date().toISOString(), source: 'Current browser workspace; demo-seeded store and saved local data, not a hospital database.' };
  },
};
