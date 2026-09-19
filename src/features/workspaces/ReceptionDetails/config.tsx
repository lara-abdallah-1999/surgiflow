import { type ChecklistItem, type PatientStatus, type AdmissionFormItem } from "./types";


export const PAGE_SIZE = 5;


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


export const admissionFormItems: AdmissionFormItem[] = [
  {
    id: "hospital-treatment-consent",
    label: "Hospital Admission & Treatment Consent",
    shortLabel: "Admission & Treatment",
    fields: [
      {
        id: "emergencyContactName",
        label: "Emergency contact",
        kind: "text",
        placeholder: "Full name",
        required: true,
      },
      {
        id: "emergencyPhone",
        label: "Phone",
        kind: "phone",
        placeholder: "+961 ...",
        required: true,
      },
    ],
    questions: [],
  },
  {
    id: "privacy-consent",
    label: "Privacy & Patient Information Authorization",
    shortLabel: "Privacy & Information",
    fields: [
      {
        id: "authorizedContactName",
        label: "Authorized person",
        kind: "text",
        placeholder: "Optional",
      },
      {
        id: "authorizedPhone",
        label: "Authorized phone",
        kind: "phone",
        placeholder: "+961 ...",
      },
    ],
    questions: [],
  },
  {
    id: "financial-acknowledgement",
    label: "Financial Responsibility Acknowledgement",
    shortLabel: "Financial Responsibility",
    fields: [
      {
        id: "paymentResponsibility",
        label: "Payment responsibility",
        kind: "choice",
        options: ["Patient", "Insurance", "Guarantor"],
        required: true,
      },
      {
        id: "guarantorName",
        label: "Guarantor",
        kind: "text",
        placeholder: "Optional",
      },
    ],
    questions: [],
  },
];
