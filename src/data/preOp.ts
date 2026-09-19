import type {
  AnesthesiaAssessment,
  Equipment,
  PreOpTest,
} from "../types/surgery";

export const preOpTests: PreOpTest[] = [
  {
    id: "T1",
    name: "Complete Blood Count",
    description: "CBC blood test",
    required: true,
    status: "Completed",
    result: "Normal",
  },
  {
    id: "T2",
    name: "Coagulation Profile",
    description: "PT / INR / aPTT",
    required: true,
    status: "Completed",
    result: "Normal",
  },
  {
    id: "T3",
    name: "ECG",
    description: "Electrocardiogram",
    required: true,
    status: "Completed",
    result: "Normal",
  },
  {
    id: "T4",
    name: "Chest X-Ray",
    description: "Pre-operative chest imaging",
    required: false,
    status: "Not Required",
  },
];

export const equipment: Equipment[] = [
  {
    id: "EQ1",
    name: "Operating Table",
    quantity: 1,
    status: "Ready",
  },
  {
    id: "EQ2",
    name: "Anesthesia Machine",
    quantity: 1,
    status: "Ready",
  },
  {
    id: "EQ3",
    name: "Surgical Instrument Set",
    quantity: 2,
    status: "Ready",
  },
  {
    id: "EQ4",
    name: "Patient Monitoring System",
    quantity: 1,
    status: "Ready",
  },
];

export const anesthesiaAssessment: AnesthesiaAssessment = {
  type: "General",
  airwayAssessment: true,
  medicalHistoryReviewed: true,
  allergiesReviewed: true,
  consentObtained: true,
  anesthesiaReady: true,
  notes:
    "Patient suitable for general anesthesia. No significant contraindications identified.",
};