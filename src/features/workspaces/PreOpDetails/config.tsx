import { type SupplyItem } from "./types";


export const ROW_HEIGHT = 48;

export const MIN_PAGE_SIZE = 1;


export const tests = [
  {
    id: "cbc",
    label: "CBC",
    description: "Complete blood count",
  },
  {
    id: "coagulation",
    label: "Coagulation Profile",
    description: "PT / INR / aPTT",
  },
  {
    id: "chemistry",
    label: "Blood Chemistry",
    description: "Required chemistry panel",
  },
  {
    id: "ecg",
    label: "ECG",
    description: "Cardiac assessment",
  },
  {
    id: "imaging",
    label: "Required Imaging",
    description: "Procedure-related imaging",
  },
  {
    id: "clearance",
    label: "Medical Clearance",
    description: "Pre-operative clearance",
  },
];


export const preOpHistoryItems = [
  {
    id: "ckd",
    label: "CKD / dialysis",
    placeholder: "Stage / dialysis",
  },
  {
    id: "tia-cva",
    label: "TIA / CVA",
    placeholder: "Residual deficit / date",
  },
  {
    id: "dvt-pe",
    label: "DVT / PE",
    placeholder: "Date / anticoagulation",
  },
  {
    id: "anemia",
    label: "Anemia",
    placeholder: "Hb / treatment",
  },
  {
    id: "infection",
    label: "Active infection / sepsis",
    placeholder: "Site / treatment",
  },
  {
    id: "asthma-copd",
    label: "Asthma / COPD",
    placeholder: "Severity / inhalers",
  },
  {
    id: "home-o2",
    label: "Chronic oxygen at home",
    placeholder: "Flow / frequency",
  },
  {
    id: "pulmonary-htn",
    label: "Pulmonary hypertension",
    placeholder: "Latest PAP",
  },
  {
    id: "chf",
    label: "Congestive heart failure",
    placeholder: "EF / symptoms",
  },
  {
    id: "mi",
    label: "Myocardial infarction",
    placeholder: "Date / <30 days?",
  },
  {
    id: "pci",
    label: "PCI / coronary stent",
    placeholder: "Bare / drug / date",
  },
  {
    id: "angina",
    label: "Angina",
    placeholder: "Stable / unstable / severe",
  },
  {
    id: "htn",
    label: "Hypertension",
    placeholder: "Controlled / uncontrolled",
  },
  {
    id: "cad",
    label: "Coronary artery disease",
    placeholder: "Stress test / ECG findings",
  },
];


export const anesthesiaHistoryItems = [
  {
    id: "cardiovascular",
    label: "Cardiovascular",
    placeholder: "HTN, pacemaker/ICD, CHF, MI, angina",
  },
  {
    id: "respiratory",
    label: "Respiratory",
    placeholder: "COPD, asthma, O₂, OSA, smoking",
  },
  {
    id: "gastrointestinal",
    label: "Gastrointestinal",
    placeholder: "Hiatal hernia, PUD, reflux, heartburn",
  },
  {
    id: "musculoskeletal",
    label: "Musculoskeletal",
    placeholder: "C-spine disorder, muscular dystrophy",
  },
  {
    id: "neurological",
    label: "Neurological",
    placeholder: "Seizures, CVA",
  },
  {
    id: "renal",
    label: "Renal",
    placeholder: "CRI / dialysis",
  },
  {
    id: "hepatic",
    label: "Hepatic",
    placeholder: "Liver disease, alcohol, Hep C",
  },
  {
    id: "endocrine",
    label: "Endocrine / metabolic",
    placeholder: "DM, thyroid disease, other",
  },
  {
    id: "hematologic",
    label: "Hematologic",
    placeholder: "Easy bruising / bleeding history",
  },
  {
    id: "infectious",
    label: "TB / MRSA history",
    placeholder: "History / date / treatment",
  },
  {
    id: "allergies",
    label: "Allergies / reactions",
    placeholder: "Agent + reaction",
  },
  {
    id: "other",
    label: "Other relevant history",
    placeholder: "Pregnancy, prematurity, eye/ear, other",
  },
];


export const anesthesiaTypes = [
  "General",
  "Regional",
  "Local",
  "Sedation",
];


export const initialRequiredSupplies: SupplyItem[] = [
  {
    id: "sterile-drape",
    name: "Sterile Surgical Drapes",
    category: "Sterile",
    quantity: 1,
    checked: false,
  },
  {
    id: "gloves",
    name: "Sterile Gloves",
    category: "Protection",
    quantity: 2,
    checked: false,
  },
  {
    id: "gauze",
    name: "Sterile Gauze",
    category: "Consumable",
    quantity: 10,
    checked: false,
  },
  {
    id: "suction",
    name: "Suction Set",
    category: "Equipment",
    quantity: 1,
    checked: false,
  },
  {
    id: "irrigation",
    name: "Irrigation Solution",
    category: "Consumable",
    quantity: 1,
    checked: false,
  },
  {
    id: "sutures",
    name: "Surgical Sutures",
    category: "Closure",
    quantity: 2,
    checked: false,
  },
];


export const initialAdditionalSupplies: SupplyItem[] = [
  {
    id: "extra-gauze",
    name: "Additional Gauze",
    category: "Consumable",
    quantity: 5,
    checked: false,
    additional: true,
  },
  {
    id: "extra-suction",
    name: "Additional Suction Set",
    category: "Equipment",
    quantity: 1,
    checked: false,
    additional: true,
  },
  {
    id: "extra-sutures",
    name: "Additional Sutures",
    category: "Closure",
    quantity: 2,
    checked: false,
    additional: true,
  },
];



export const preOpDemographics: Record<
  string,
  {
    age: number;
    gender: "Male" | "Female";
  }
> = {
  "SRG-2048": { age: 42, gender: "Female" },
  "SRG-2051": { age: 56, gender: "Female" },
  "SRG-2044": { age: 35, gender: "Male" },
  "SRG-2057": { age: 61, gender: "Female" },
  "SRG-2031": { age: 48, gender: "Female" },
};
