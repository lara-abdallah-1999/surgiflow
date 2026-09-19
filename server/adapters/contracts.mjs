/**
 * @typedef {{id:string, mode:string}} Principal
 * @typedef {{ selectedCaseId:string|null, selected:object|null, directory:object[],
 *   context:object, saved:object, equipment:object[]|null, postOp:object|null,
 *   recentChanges:object[], capturedAt:string, source:string }} WorkspaceSnapshot
 *
 * Permission adapter: authenticate(request, sessionId) -> Principal;
 * authorize(principal, capability) -> boolean. Never trust a browser role claim.
 *
 * Data adapter: snapshot({principal, selectedCaseId, localWorkspace, signal})
 * -> Promise<WorkspaceSnapshot>. Hospital implementations MUST authorize every
 * record and ignore localWorkspace. Return only that principal's search directory
 * and selected-case data. All tools are read-only; no database handle reaches AI.
 *
 * The development implementation below is explicitly NOT authentication.
 */
export const capabilities = Object.freeze(['chat', 'read', 'transcribe', 'events']);
