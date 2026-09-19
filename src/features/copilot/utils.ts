export const preOpTests = [
  ["cbc", "CBC"],
  ["coagulation", "Coagulation Profile"],
  ["chemistry", "Blood Chemistry"],
  ["ecg", "ECG"],
  ["imaging", "Required Imaging"],
  ["clearance", "Medical Clearance"],
] as const;

export const recoveryChecks = [
  ["airway", "recoveryAirway", "Airway"],
  ["breathing", "recoveryBreathing", "Breathing"],
  ["circulation", "recoveryCirculation", "Circulation"],
  ["consciousness", "recoveryConsciousness", "Consciousness"],
  ["painControlled", "recoveryPainControlled", "Pain control"],
  ["nauseaControlled", "recoveryNauseaControlled", "Nausea control"],
] as const;

export const recoveryAssessments = [
  "Airway stable", "Breathing stable", "Circulation stable",
  "Patient responding appropriately", "Pain assessed", "Nausea / vomiting assessed",
] as const;

export function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

export function hasTimestamp(record: Record<string, unknown>, keys: string[]) {
  return keys.some((key) => Boolean(record[key]) && Number.isFinite(Date.parse(String(record[key]))));
}

export function hasReport(value: string) {
  return value.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").trim().length > 0;
}

export type SavedCopilotState = {
  preOp: Record<string, unknown>;
  equipmentInUse: number | null;
  notes: string[];
};

/** Never writes, repairs, or migrates the application's records. */
export function readSavedCopilotState(id: string): SavedCopilotState {
  const notes: string[] = [];
  const read = (key: string): unknown => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      notes.push("Some saved workspace data could not be read. Open its workspace to verify it.");
      return undefined;
    }
  };
  const preOp = asRecord(read(`pre-op-workspace-${id}`) ?? read(`pre-op-progress-${id}`));
  const equipment = read(`surgery-equipment-${id}`);
  const validEquipment = Array.isArray(equipment) && equipment.every((item) =>
    ["Available", "In Use", "Returned"].includes(String(asRecord(item).state)));
  return {
    preOp,
    equipmentInUse: equipment === null ? 0 : validEquipment
      ? equipment.filter((item) => asRecord(item).state === "In Use").length : null,
    notes: [...new Set(notes)],
  };
}
