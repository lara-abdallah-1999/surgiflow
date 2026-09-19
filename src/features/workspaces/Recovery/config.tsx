import { type RecoveryState } from "./types";


export const recoveryAssessments = [
  "Airway stable",
  "Breathing stable",
  "Circulation stable",
  "Patient responding appropriately",
  "Pain assessed",
  "Nausea / vomiting assessed",
];


export const awakeningStages = [
  "Anesthesia ongoing",
  "Beginning to awaken",
  "Responds to voice",
  "Awake and responsive",
  "Ready for transfer",
];


export const emptyRecovery: RecoveryState = {
  started: true,
  awakeningStage: 0,
  assessments: [],
  notes: "",
  status: "Monitoring",
  stability: "stable",
  surgeonReport: "",
};


export const ROW_HEIGHT = 48;

export const MIN_PAGE_SIZE = 1;


/* ========================================================================== */
/* UTILITIES                                                                  */
/* ========================================================================== */

export const demoPatientGender: Record<string, "Male" | "Female"> = {
  "SRG-2048": "Female",
  "SRG-2051": "Female",
  "SRG-2044": "Male",
  "SRG-2057": "Female",
  "SRG-2031": "Female",
};


export const demoPatientAge: Record<string, number> = {
  "SRG-2048": 42,
  "SRG-2051": 56,
  "SRG-2044": 35,
  "SRG-2057": 61,
  "SRG-2031": 48,
};
