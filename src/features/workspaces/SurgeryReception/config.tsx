import { type ChecklistItem, type AdmissionFormItem, type PatientStatus } from "./types";


export const PAGE_SIZE = 6;


export const checklistItems: ChecklistItem[] = [
  {
    id: "identity",
    label: "Patient identity verified",
    description: "Confirm patient name, MRN and date of birth.",
  },
  {
    id: "procedure",
    label: "Scheduled procedure confirmed",
    description: "Verify procedure and surgeon against the schedule.",
  },
  {
    id: "fasting",
    label: "Fasting status confirmed",
    description: "Confirm patient followed the required fasting instructions.",
  },
  {
    id: "belongings",
    label: "Patient belongings handled",
    description: "Belongings and valuables procedure completed.",
  },
  {
    id: "contact",
    label: "Emergency contact confirmed",
    description: "Confirm patient contact / accompanying person details.",
  },
  {
    id: "wristband",
    label: "Patient identification band applied",
    description: "Confirm identification band is present and correct.",
  },
 ];


export const admissionFormItems: AdmissionFormItem[] = [
  {
    id: "admission-registration",
    label: "Patient Admission & Registration Form",
    shortLabel: "Admission form",
  },
  {
    id: "general-treatment-consent",
    label: "General Consent for Hospital Treatment",
    shortLabel: "Treatment consent",
  },
  {
    id: "surgical-consent",
    label: "Surgical Procedure Consent",
    shortLabel: "Surgical consent",
  },
  {
    id: "anesthesia-consent",
    label: "Anesthesia Consent",
    shortLabel: "Anesthesia consent",
  },
  {
    id: "privacy-consent",
    label: "Privacy & Patient Data Consent",
    shortLabel: "Privacy consent",
  },
  {
    id: "financial-acknowledgement",
    label: "Financial Responsibility Acknowledgement",
    shortLabel: "Financial acknowledgement",
  },
];


// NOTE: these ids/names/procedures now match the records in
// `useSurgeryStore` exactly (SRG-2048, SRG-2051, ...). Reception used to
// keep its own made-up patient list, completely disconnected from the
// rest of the app, so "Sarah Haddad" in Reception was not the same
// record as "Sarah Haddad" in Accounting/Pre-Op/Surgery. The demographic
// fields below (mrn/age/gender) don't exist on the shared Surgery record,
// so they stay here as reception-only info, keyed by the real surgery id.
export const receptionDemographics: Record<
  string,
  { mrn: string; age: number; gender: "Male" | "Female" }
> = {
  "SRG-2048": { mrn: "MRN-10245", age: 42, gender: "Female" },
  "SRG-2051": { mrn: "MRN-10251", age: 56, gender: "Female" },
  "SRG-2044": { mrn: "MRN-10258", age: 35, gender: "Male" },
  "SRG-2057": { mrn: "MRN-10263", age: 61, gender: "Female" },
  "SRG-2031": { mrn: "MRN-10271", age: 48, gender: "Female" },
};


export const initialReceptionStatus: Record<string, PatientStatus> = {
  "SRG-2048": "Expected",
  "SRG-2051": "Arrived",
  "SRG-2044": "Reception In Progress",
  "SRG-2057": "Ready for Admission",
  "SRG-2031": "On Hold",
};



export const RECEPTION_STATUS_STORAGE_KEY = "surgery-reception-status";
