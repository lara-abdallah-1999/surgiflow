import { type PostOpState } from "./types";


export const ROW_HEIGHT = 48;

export const MIN_PAGE_SIZE = 1;


export const EMPTY_STATE: PostOpState = {
  condition: "Stable",
  painLevel: 2,
  woundStatus: "Healing normally",
  instructions: "",
  medications: [],
  followUps: [],
  visits: [],
  dischargeChecklist: {
    medicationsReviewed: false,
    followUpsArranged: false,
    instructionsProvided: false,
  },
  discharged: false,
  dischargedAt: null,
};


export const demoPostOpPatientAge: Record<string, number> = {
  "SRG-2048": 42,
  "SRG-2051": 56,
  "SRG-2044": 35,
  "SRG-2057": 61,
  "SRG-2031": 48,
};



export const POST_OP_VISIT_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];
