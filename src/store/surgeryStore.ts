import { create } from "zustand";
import type {
  Surgery,
  SurgeryStatus,
  PaymentStatus,
  PreOpStatus,
} from "../types/surgery";

type SurgeryStore = {
  surgeries: Surgery[];
  updateSurgery: (id: string, updates: Partial<Surgery>) => void;
  changeStatus: (id: string, status: SurgeryStatus) => void;
  markArrived: (id: string) => void;
  sendToCashier: (id: string) => void;
  recordPayment: (id: string, amount: number) => void;
  admitPatient: (id: string, admittedBy?: string) => void;
  startPreOp: (id: string) => void;
  setPreOpStatus: (id: string, status: PreOpStatus) => void;
  setAnesthesiaType: (id: string, type: string) => void;
  confirmAnesthesiaType: (id: string, type: string) => boolean;
  startSurgery: (id: string) => void;
  completeSurgery: (id: string) => void;
};

type SurgeryChargeCategory =
  | "Procedure"
  | "Facility"
  | "Anesthesia"
  | "Clinical"
  | "Admission";

type SurgeryChargeItem = {
  id: string;
  category: SurgeryChargeCategory;
  label: string;
  detail?: string;
  amount: number;
};

type CashierEstimate = {
  lineItems: SurgeryChargeItem[];
  insuranceCoverage?: number;
  discountAmount?: number;
};

type SurgeryDemo = Surgery & {
  mrn: string;
  age: number;
  gender: "Female" | "Male";
  phone?: string;
  cashierEstimate?: CashierEstimate;
};

export const DEMO_PATIENT_ID = "SRG-2048";

export function pinDemoPatientFirst<T extends { id: string }>(
  items: T[],
): T[] {
  return [
    ...items.filter((item) => item.id === DEMO_PATIENT_ID),
    ...items.filter((item) => item.id !== DEMO_PATIENT_ID),
  ];
}

const initialSurgeries: SurgeryDemo[] = [
  {
    // MAIN DEMO PATIENT
    // Sarah intentionally starts from the very beginning of the surgery flow.
    // Use her to demonstrate:
    // Waiting List -> Reception -> Cashier -> Pre-Op -> Surgery -> Recovery -> Post-Op
    id: "SRG-2048",
    patientId: "SRG-2048",
    patientName: "Sarah Joseph Haddad",
    phone: "+96176884145",
    mrn: "MRN-102845",
    age: 42,
    gender: "Female",
    procedure: "Rhinoplasty",
    procedures: [
      { name: "Rhinoplasty", site: "Nose" },
      { name: "Septoplasty", site: "Nasal Septum" },
    ],
    doctor: "Dr. Nadim Saleh",
    date: "2026-09-03",
    time: "08:30",
    room: "OR 02",
    priority: "Moderate",

    // FLOW RESET: Sarah must appear first in Waiting List.
    status: "Today",
    arrivalStatus: undefined,
    arrivedAt: undefined,
    receptionCompletedAt: undefined,

    // No payment has happened yet.
    cost: 2500,
    paidAmount: 0,
    paymentStatus: "Pending",
    paymentCompletedAt: undefined,

    // Demo estimate shown in Reception before the case is sent to Cashier.
    // These are estimated pre-surgery charges; Cashier owns the final amounts.
    cashierEstimate: {
      lineItems: [
        {
          id: "rhinoplasty",
          category: "Procedure",
          label: "Rhinoplasty",
          detail: "Nose",
          amount: 900,
        },
        {
          id: "septoplasty",
          category: "Procedure",
          label: "Septoplasty",
          detail: "Nasal Septum",
          amount: 450,
        },
        {
          id: "turbinate-reduction",
          category: "Procedure",
          label: "Turbinate Reduction",
          detail: "Nasal Cavity",
          amount: 250,
        },
        {
          id: "or-facility",
          category: "Facility",
          label: "Operating room & facility",
          detail: "OR 02 estimated use",
          amount: 350,
        },
        {
          id: "anesthesia",
          category: "Anesthesia",
          label: "Anesthesia services",
          detail: "Estimated anesthesia service",
          amount: 250,
        },
        {
          id: "supplies",
          category: "Clinical",
          label: "Surgical supplies",
          detail: "Standard consumables",
          amount: 150,
        },
        {
          id: "preop-services",
          category: "Clinical",
          label: "Pre-op tests & imaging",
          detail: "Required pre-operative services",
          amount: 100,
        },
        {
          id: "admission",
          category: "Admission",
          label: "Admission / hospital service",
          detail: "Admission processing",
          amount: 50,
        },
      ],
    },

    // No Pre-Op / anesthesia work has happened yet.
    preOpStatus: "Pending",
    preOpCompleted: false,
    preOpCompletedAt: undefined,
    anesthesiaType: undefined,
    anesthesiaCompleted: false,
    anesthesiaCompletedAt: undefined,
    inductionAt: undefined,
    equipmentReady: false,

    // No surgery / recovery / discharge data yet.
    surgeryStartedAt: undefined,
    surgeryCompletedAt: undefined,
    durationSeconds: undefined,
    operativeReport: undefined,
    surgeonNotes: undefined,
    patientCondition: undefined,
    dischargeTime: undefined,
    dischargeInstructions: undefined,

    allergies: ["Penicillin", "Latex", "Ibuprofen"],
  },

  {
    id: "SRG-2051",
    patientId: "SRG-2051",
    patientName: "Maya Elias Khoury",

    // TEST PATIENT DATA FOR WAITING LIST / WHATSAPP BOOKING
    // Replace this number with your own WhatsApp number for a real test.
    // Keep it in international format without spaces, for example: +96171123456
    phone: "+96176552684",
    mrn: "MRN-102973",
    age: 34,
    gender: "Female",

    procedure: "Laparoscopic Cholecystectomy",
    procedures: [
      { name: "Laparoscopic Cholecystectomy", site: "Gallbladder" },
      { name: "Intraoperative Cholangiography", site: "Biliary Tract" },
    ],
    doctor: "Dr. Rami Nassar",
    date: "2026-09-03",
    time: "09:15",
    room: "OR 01",
    priority: "Urgent",
    status: "Today",
    cost: 3200,
    paidAmount: 0,
    paymentStatus: "Pending",
    preOpStatus: "Pending",
  },

  {
    id: "SRG-2052",
    patientId: "SRG-2052",
    patientName: "Omar Ahmad Daher",
    phone: "+96170124567",
    mrn: "MRN-103021",
    age: 47,
    gender: "Male",
    procedure: "Inguinal Hernia Repair",
    procedures: [
      { name: "Inguinal Hernia Repair", site: "Right" },
    ],
    doctor: "Dr. Rami Nassar",
    date: "2026-09-03",
    time: "10:15",
    room: "OR 01",
    priority: "Moderate",
    status: "Today",
    cost: 2300,
    paidAmount: 0,
    paymentStatus: "Pending",
    preOpStatus: "Pending",
  },

  {
    id: "SRG-2053",
    patientId: "SRG-2053",
    patientName: "Rita Michel Nader",
    mrn: "MRN-103064",
    age: 51,
    gender: "Female",
    procedure: "Thyroid Lobectomy",
    procedures: [
      { name: "Thyroid Lobectomy", site: "Left" },
    ],
    doctor: "Dr. Jad Haddad",
    date: "2026-09-03",
    time: "11:00",
    room: "OR 03",
    priority: "High",
    status: "Payment Pending",
    allergies: ["Adhesive Tape"],
    cost: 4100,
    paidAmount: 0,
    paymentStatus: "Pending",
    preOpStatus: "Pending",
    arrivedAt: "2026-09-03T09:50:00",
    arrivalStatus: "Arrived",
    receptionCompletedAt: "2026-09-03T10:02:00",
  },

  {
    id: "SRG-2054",
    patientId: "SRG-2054",
    patientName: "Karim Hassan Saleh",
    mrn: "MRN-103118",
    age: 39,
    gender: "Male",
    procedure: "Knee Arthroscopy",
    procedures: [
      { name: "Knee Arthroscopy", site: "Right Knee" },
      { name: "Meniscus Repair", site: "Right Knee" },
    ],
    doctor: "Dr. Jad Haddad",
    date: "2026-09-03",
    time: "12:00",
    room: "OR 03",
    priority: "Moderate",
    status: "Payment Pending",
    cost: 2800,
    paidAmount: 1200,
    paymentStatus: "Partially Paid",
    preOpStatus: "Pending",
    arrivedAt: "2026-09-03T10:35:00",
    arrivalStatus: "Arrived",
    receptionCompletedAt: "2026-09-03T10:50:00",
  },

  {
    id: "SRG-2055",
    patientId: "SRG-2055",
    patientName: "Nour Ali Farhat",
    mrn: "MRN-103176",
    age: 45,
    gender: "Female",
    procedure: "Hernia Repair",
    procedures: [
      { name: "Hernia Repair", site: "Umbilical" },
    ],
    doctor: "Dr. Rami Nassar",
    date: "2026-09-03",
    time: "13:30",
    room: "OR 01",
    priority: "High",
    status: "Pre-Op",
    allergies: ["Sulfa Drugs"],
    cost: 2200,
    paidAmount: 2200,
    paymentStatus: "Paid",
    preOpStatus: "In Progress",
    arrivedAt: "2026-09-03T11:40:00",
    arrivalStatus: "Arrived",
    receptionCompletedAt: "2026-09-03T11:52:00",
    paymentCompletedAt: "2026-09-03T12:03:00",
    admittedAt: "2026-09-03T12:12:00",
    preOpStartedAt: "2026-09-03T12:15:00",
  },

  {
    id: "SRG-2056",
    patientId: "SRG-2056",
    patientName: "Tala Rami Saad",
    mrn: "MRN-103224",
    age: 28,
    gender: "Female",
    procedure: "Tonsillectomy",
    procedures: [
      { name: "Tonsillectomy", site: "Bilateral Tonsils" },
    ],
    doctor: "Dr. Nadim Saleh",
    date: "2026-09-03",
    time: "16:00",
    room: "OR 02",
    priority: "Moderate",
    status: "In Progress",
    cost: 1800,
    paidAmount: 1800,
    paymentStatus: "Paid",
    preOpStatus: "Ready",
    arrivedAt: "2026-09-03T12:10:00",
    arrivalStatus: "Arrived",
    receptionCompletedAt: "2026-09-03T12:18:00",
    paymentCompletedAt: "2026-09-03T12:25:00",
    preOpCompleted: true,
    preOpCompletedAt: "2026-09-03T13:20:00",
    anesthesiaType: "General",
    anesthesiaCompleted: true,
    anesthesiaCompletedAt: "2026-09-03T13:18:00",
    inductionAt: "2026-09-03T13:18:00",
    equipmentReady: true,
  },

  {
    id: "SRG-2057",
    patientId: "SRG-2057",
    patientName: "Yara Samir Habib",
    mrn: "MRN-103281",
    age: 36,
    gender: "Female",
    procedure: "Appendectomy",
    procedures: [
      { name: "Laparoscopic Appendectomy", site: "Appendix" },
    ],
    doctor: "Dr. Rami Nassar",
    date: "2026-09-03",
    time: "15:00",
    room: "OR 01",
    priority: "Urgent",
    status: "In Progress",
    cost: 3000,
    paidAmount: 3000,
    paymentStatus: "Paid",
    preOpStatus: "Ready",
    paymentCompletedAt: "2026-09-03T13:20:00",
    preOpCompleted: true,
    preOpCompletedAt: "2026-09-03T14:15:00",
    anesthesiaType: "General",
    anesthesiaCompleted: true,
    anesthesiaCompletedAt: "2026-09-03T14:38:00",
    inductionAt: "2026-09-03T14:38:00",
    equipmentReady: true,
    surgeryStartedAt: "2026-09-03T15:04:00",
  },

  {
    id: "SRG-2058",
    patientId: "SRG-2058",
    patientName: "Georges Antoine Aoun",
    mrn: "MRN-103339",
    age: 58,
    gender: "Male",
    procedure: "Shoulder Arthroscopy",
    procedures: [
      { name: "Shoulder Arthroscopy", site: "Left Shoulder" },
    ],
    doctor: "Dr. Jad Haddad",
    date: "2026-09-03",
    time: "07:00",
    room: "OR 03",
    priority: "Moderate",
    status: "Completed",
    allergies: ["Codeine"],
    cost: 3400,
    paidAmount: 3400,
    paymentStatus: "Paid",
    preOpStatus: "Ready",
    paymentCompletedAt: "2026-09-03T05:50:00",
    preOpCompleted: true,
    preOpCompletedAt: "2026-09-03T06:30:00",
    anesthesiaType: "General",
    anesthesiaCompleted: true,
    anesthesiaCompletedAt: "2026-09-03T06:42:00",
    inductionAt: "2026-09-03T06:42:00",
    equipmentReady: true,
    surgeryStartedAt: "2026-09-03T07:03:00",
    surgeryCompletedAt: "2026-09-03T08:24:20",
    durationSeconds: 4880,
    operativeReport: "Arthroscopic repair completed successfully. No intra-operative complication.",
    surgeonNotes: "Stable throughout the procedure.",
    patientCondition: "Stable",
  },

  {
    id: "SRG-2059",
    patientId: "SRG-2059",
    patientName: "Lina Walid Mansour",
    mrn: "MRN-103402",
    age: 44,
    gender: "Female",
    procedure: "Breast Reduction",
    procedures: [
      { name: "Breast Reduction", site: "Bilateral" },
    ],
    doctor: "Dr. Jad Haddad",
    date: "2026-09-03",
    time: "08:30",
    room: "OR 03",
    priority: "Low",
    status: "Recovery",
    cost: 3500,
    paidAmount: 3500,
    paymentStatus: "Paid",
    preOpStatus: "Ready",
    paymentCompletedAt: "2026-09-03T06:40:00",
    preOpCompleted: true,
    preOpCompletedAt: "2026-09-03T07:35:00",
    anesthesiaType: "General",
    anesthesiaCompleted: true,
    anesthesiaCompletedAt: "2026-09-03T07:45:00",
    inductionAt: "2026-09-03T07:45:00",
    equipmentReady: true,
    surgeryStartedAt: "2026-09-03T08:34:00",
    surgeryCompletedAt: "2026-09-03T10:19:00",
    durationSeconds: 6300,
    operativeReport: "Bilateral reduction completed with good symmetry and hemostasis.",
    surgeonNotes: "Transfer to recovery for routine monitoring.",
    patientCondition: "Stable",
  },

  {
    id: "SRG-2060",
    patientId: "SRG-2060",
    patientName: "Fadi Nicolas Khoury",
    mrn: "MRN-103457",
    age: 31,
    gender: "Male",
    procedure: "ACL Reconstruction",
    procedures: [
      { name: "ACL Reconstruction", site: "Left Knee" },
    ],
    doctor: "Dr. Jad Haddad",
    date: "2026-09-02",
    time: "09:00",
    room: "OR 03",
    priority: "Moderate",
    status: "Discharged",
    allergies: ["Aspirin"],
    cost: 5200,
    paidAmount: 5200,
    paymentStatus: "Paid",
    preOpStatus: "Ready",
    paymentCompletedAt: "2026-09-02T07:15:00",
    preOpCompleted: true,
    preOpCompletedAt: "2026-09-02T08:10:00",
    anesthesiaType: "Regional",
    anesthesiaCompleted: true,
    anesthesiaCompletedAt: "2026-09-02T08:28:00",
    inductionAt: "2026-09-02T08:28:00",
    equipmentReady: true,
    surgeryStartedAt: "2026-09-02T09:04:00",
    surgeryCompletedAt: "2026-09-02T11:16:30",
    durationSeconds: 7950,
    operativeReport: "ACL reconstruction completed using graft fixation with stable final examination.",
    surgeonNotes: "Begin protected weight bearing and physiotherapy as instructed.",
    patientCondition: "Improving",
    dischargeTime: "2026-09-02T17:20:00",
    dischargeInstructions: "Keep dressing dry, use crutches, take prescribed medication and attend follow-up.",
  },

  {
    id: "SRG-2061",
    patientId: "SRG-2061",
    patientName: "Rana Joseph Elias",
    phone: "+96171139876",
    mrn: "MRN-103511",
    age: 67,
    gender: "Female",
    procedure: "Cataract Extraction",
    procedures: [
      { name: "Cataract Extraction", site: "Left Eye" },
    ],
    doctor: "Dr. Elias Haddad",
    date: "2026-09-03",
    time: "08:00",
    room: "OR EYE 01",
    priority: "Routine",
    status: "Today",
    cost: 1500,
    paidAmount: 0,
    paymentStatus: "Pending",
    preOpStatus: "Pending",
  },

  {
    id: "SRG-2062",
    patientId: "SRG-2062",
    patientName: "Joseph Michel Hanna",
    mrn: "MRN-103568",
    age: 72,
    gender: "Male",
    procedure: "Cataract Extraction",
    procedures: [
      { name: "Cataract Extraction", site: "Right Eye" },
    ],
    doctor: "Dr. Elias Haddad",
    date: "2026-09-03",
    time: "08:00",
    room: "OR EYE 02",
    priority: "Routine",
    status: "Pre-Op",
    cost: 1580,
    paidAmount: 1580,
    paymentStatus: "Paid",
    preOpStatus: "In Progress",
    paymentCompletedAt: "2026-09-03T07:11:00",
    admittedAt: "2026-09-03T07:18:00",
    preOpStartedAt: "2026-09-03T07:20:00",
  },

  {
    id: "SRG-2063",
    patientId: "SRG-2063",
    patientName: "Mariam Elias Nakhle",
    phone: "+96103124567",
    mrn: "MRN-103624",
    age: 63,
    gender: "Female",
    procedure: "Intravitreal Injection",
    procedures: [
      { name: "Intravitreal Injection", site: "Right Eye" },
    ],
    doctor: "Dr. Elias Haddad",
    date: "2026-09-03",
    time: "08:30",
    room: "OR EYE 01",
    priority: "Routine",
    status: "Today",
    cost: 1660,
    paidAmount: 0,
    paymentStatus: "Pending",
    preOpStatus: "Pending",
  },

  {
    id: "SRG-2064",
    patientId: "SRG-2064",
    patientName: "Walid Sami Tabet",
    phone: "+96170117654",
    mrn: "MRN-103679",
    age: 70,
    gender: "Male",
    procedure: "Cataract Extraction",
    procedures: [
      { name: "Cataract Extraction", site: "Right Eye" },
    ],
    doctor: "Dr. Elias Haddad",
    date: "2026-09-03",
    time: "09:00",
    room: "OR EYE 01",
    priority: "Routine",
    status: "Today",
    cost: 1740,
    paidAmount: 0,
    paymentStatus: "Pending",
    preOpStatus: "Pending",
  },

  {
    id: "SRG-2065",
    patientId: "SRG-2065",
    patientName: "Dima Robert Karam",
    phone: "+96103117654",
    mrn: "MRN-103731",
    age: 59,
    gender: "Female",
    procedure: "Lens Replacement",
    procedures: [
      { name: "Lens Replacement", site: "Right Eye" },
    ],
    doctor: "Dr. Elias Haddad",
    date: "2026-09-03",
    time: "09:00",
    room: "OR EYE 02",
    priority: "Routine",
    status: "Today",
    cost: 1820,
    paidAmount: 0,
    paymentStatus: "Pending",
    preOpStatus: "Pending",
  },

  {
    id: "SRG-2066",
    patientId: "SRG-2066",
    patientName: "Sami Georges Rizk",
    mrn: "MRN-103788",
    age: 66,
    gender: "Male",
    procedure: "Pterygium Excision",
    procedures: [
      { name: "Pterygium Excision", site: "Right Eye" },
    ],
    doctor: "Dr. Elias Haddad",
    date: "2026-09-03",
    time: "09:30",
    room: "OR EYE 03",
    priority: "Routine",
    status: "Pre-Op",
    cost: 1900,
    paidAmount: 1900,
    paymentStatus: "Paid",
    preOpStatus: "In Progress",
    paymentCompletedAt: "2026-09-03T07:15:00",
    admittedAt: "2026-09-03T07:22:00",
    preOpStartedAt: "2026-09-03T07:25:00",
  },


  {
    id: "SRG-2072",
    patientId: "SRG-2072",
    patientName: "Elias Antoine Bitar",
    phone: "+96181124567",
    mrn: "MRN-104123",
    age: 62,
    gender: "Male",
    procedure: "Retinal Laser Procedure",
    procedures: [
      { name: "Retinal Laser Procedure", site: "Right Eye" },
    ],
    doctor: "Dr. Elias Haddad",
    date: "2026-09-03",
    time: "12:30",
    room: "OR EYE 02",
    priority: "Routine",
    status: "Today",
    cost: 2380,
    paidAmount: 0,
    paymentStatus: "Pending",
    preOpStatus: "Pending",
  },
  {
  id: "SRG-2070",
  patientId: "SRG-2070",

  patientName: "Said Salam",

  phone: "+96176345699",
  mrn: "MRN-104070",

  age: 50,
  gender: "Male",

  procedure: "Knee Arthroscopy",

  procedures: [
    {
      name: "Knee Arthroscopy",
      site: "Left Knee",
    },
  ],

  doctor: "Dr. Jad Haddad",

  date: "2026-09-05",
  time: "12:30",

  room: "OR 03",

  priority: "Moderate",

  /*
   * Patient is already in Pre-Op.
   */
  status: "Pre-Op",

  allergies: [],

  /*
   * Demo billing values.
   * Change these if you want another price.
   */
  cost: 2800,
  paidAmount: 2800,
  paymentStatus: "Paid",

  paymentCompletedAt: "2026-09-05T11:10:00",

  /*
   * Arrival / reception have already happened.
   */
  arrivalStatus: "Arrived",
  arrivedAt: "2026-09-05T10:45:00",

  receptionCompletedAt: "2026-09-05T11:00:00",

  /*
   * OR admission completed.
   */
  admittedAt: "2026-09-05T11:20:00",

  /*
   * Pre-Op has started but is not finished.
   */
  preOpStatus: "In Progress",

  preOpStartedAt: "2026-09-05T11:25:00",

  preOpCompleted: false,
  preOpCompletedAt: undefined,

  anesthesiaType: undefined,
  anesthesiaCompleted: false,
  anesthesiaCompletedAt: undefined,
  inductionAt: undefined,

  equipmentReady: false,

  surgeryStartedAt: undefined,
  surgeryCompletedAt: undefined,

  durationSeconds: undefined,

  operativeReport: undefined,
  surgeonNotes: undefined,
  patientCondition: undefined,

  dischargeTime: undefined,
  dischargeInstructions: undefined,
},
];

function restoreAnesthesiaPlan(surgery: Surgery): Surgery {
  try {
    const plan = JSON.parse(localStorage.getItem(`anesthesia-plan-${surgery.id}`) ?? "null");
    if (!surgery.anesthesiaCompleted && plan &&
      ["General", "Regional", "Local", "Sedation"].includes(plan.type) &&
      typeof plan.confirmedAt === "string" && Number.isFinite(Date.parse(plan.confirmedAt))) {
      return { ...surgery, anesthesiaType: plan.type, anesthesiaTypeConfirmedAt: plan.confirmedAt };
    }
  } catch { /* Keep the original record if browser storage is unavailable. */ }
  return surgery;
}

export const useSurgeryStore = create<SurgeryStore>((set, get) => ({
  surgeries: pinDemoPatientFirst(initialSurgeries.map(restoreAnesthesiaPlan)),

  confirmAnesthesiaType: (id, type) => {
    const surgery = get().surgeries.find((item) => item.id === id);
    if (!surgery || surgery.status !== "Pre-Op" || surgery.anesthesiaCompleted || surgery.inductionAt ||
      !["General", "Regional", "Local", "Sedation"].includes(type)) return false;
    const confirmedAt = new Date().toISOString();
    try {
      localStorage.setItem(`anesthesia-plan-${id}`, JSON.stringify({ type, confirmedAt }));
    } catch { return false; }
    get().updateSurgery(id, { anesthesiaType: type, anesthesiaTypeConfirmedAt: confirmedAt });
    return true;
  },

  updateSurgery: (id, updates) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) =>
        surgery.id === id ? { ...surgery, ...updates } : surgery,
      ),
    })),

  changeStatus: (id, status) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) =>
        surgery.id === id ? { ...surgery, status } : surgery,
      ),
    })),

  markArrived: (id) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) =>
        surgery.id === id
          ? {
              ...surgery,
              arrivedAt: surgery.arrivedAt ?? new Date().toISOString(),
              arrivalStatus: "Arrived",
            }
          : surgery,
      ),
    })),

  sendToCashier: (id) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) =>
        surgery.id === id
          ? {
              ...surgery,
              arrivedAt: surgery.arrivedAt ?? new Date().toISOString(),
              arrivalStatus: "Arrived",
              receptionCompletedAt: new Date().toISOString(),
              status: "Payment Pending",
              paymentStatus:
                surgery.paymentStatus === "Paid"
                  ? "Paid"
                  : surgery.paymentStatus,
            }
          : surgery,
      ),
    })),

  recordPayment: (id, amount) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) => {
        if (surgery.id !== id) return surgery;

        const newPaidAmount = Math.min(
          surgery.cost,
          surgery.paidAmount + amount,
        );

        const fullyPaid = newPaidAmount >= surgery.cost;

        const paymentStatus: PaymentStatus = fullyPaid
          ? "Paid"
          : "Partially Paid";

        return {
          ...surgery,
          paidAmount: newPaidAmount,
          paymentStatus,
          ...(fullyPaid
            ? {
                paymentCompletedAt: new Date().toISOString(),
                status: "Financially Cleared" as SurgeryStatus,
                preOpStatus: "Pending" as PreOpStatus,
              }
            : {
                status: "Payment Pending" as SurgeryStatus,
              }),
        };
      }),
    })),

  admitPatient: (id, admittedBy) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) => {
        if (surgery.id !== id) return surgery;

        if (
          surgery.paymentStatus !== "Paid" ||
          !["Financially Cleared", "Admitted"].includes(
            surgery.status,
          )
        ) {
          return surgery;
        }

        return {
          ...surgery,
          status: "Admitted" as SurgeryStatus,
          admittedAt:
            surgery.admittedAt ?? new Date().toISOString(),
          ...(admittedBy ? { admittedBy } : {}),
          preOpStatus: "Pending" as PreOpStatus,
        };
      }),
    })),

  startPreOp: (id) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) => {
        if (surgery.id !== id) return surgery;

        if (
          surgery.status !== "Admitted" ||
          !surgery.admittedAt
        ) {
          return surgery;
        }

        return {
          ...surgery,
          status: "Pre-Op" as SurgeryStatus,
          preOpStatus: "In Progress" as PreOpStatus,
          preOpStartedAt:
            surgery.preOpStartedAt ?? new Date().toISOString(),
        };
      }),
    })),

  setPreOpStatus: (id, status) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) => {
        if (surgery.id !== id) return surgery;

        if (status === "Ready") {
          return {
            ...surgery,
            preOpStatus: "Ready",
            preOpCompleted: true,
            preOpCompletedAt:
              surgery.preOpCompletedAt ?? new Date().toISOString(),
            status: "Ready",
          };
        }

        return {
          ...surgery,
          preOpStatus: status,
        };
      }),
    })),

  setAnesthesiaType: (id, type) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) =>
        surgery.id === id
          ? {
              ...surgery,
              anesthesiaType: type,
              anesthesiaCompleted: true,
              anesthesiaCompletedAt:
                surgery.anesthesiaCompletedAt ?? new Date().toISOString(),
              inductionAt:
                surgery.inductionAt ?? new Date().toISOString(),
            }
          : surgery,
      ),
    })),

  startSurgery: (id) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) =>
        surgery.id === id
          ? {
              ...surgery,
              status: "In Progress",
              surgeryStartedAt:
                surgery.surgeryStartedAt ?? new Date().toISOString(),
            }
          : surgery,
      ),
    })),

  completeSurgery: (id) =>
    set((state) => ({
      surgeries: state.surgeries.map((surgery) => {
        if (surgery.id !== id || !surgery.surgeryStartedAt) {
          return surgery;
        }

        const completedAt = new Date();
        const startedAt = new Date(surgery.surgeryStartedAt);
        const durationSeconds = Math.max(
          0,
          Math.floor(
            (completedAt.getTime() - startedAt.getTime()) / 1000,
          ),
        );

        return {
          ...surgery,
          status: "Completed",
          surgeryCompletedAt: completedAt.toISOString(),
          durationSeconds,
        };
      }),
    })),
}));
