import type { Surgery } from "../types/surgery";

// Historical fixtures retain the field names used by the original sample data.
type SurgeryFixture = Pick<Surgery,
  "id" | "patientId" | "patientName" | "procedure" | "room" | "status" |
  "paymentStatus" | "preOpCompleted" | "anesthesiaCompleted" | "equipmentReady"
> & {
  surgeon: string;
  surgeryDate: string;
  surgeryTime: string;
  postOpCompleted: boolean;
};

export const surgeries: SurgeryFixture[] = [
  {
    id: "SUR-1001",
    patientId: "SRG-2048",
    patientName: "Sarah Haddad",
    procedure: "Rhinoplasty",
    surgeon: "Dr. Nadim Saleh",
    surgeryDate: "Sep 03, 2026",
    surgeryTime: "08:30",
    room: "OR 02",
    status: "Pre-Op",
    paymentStatus: "Paid",
    preOpCompleted: true,
    anesthesiaCompleted: false,
    equipmentReady: true,
    postOpCompleted: false,
  },

  {
    id: "SUR-1002",
    patientId: "SRG-2051",
    patientName: "Maya Khoury",
    procedure: "Laparoscopic Cholecystectomy",
    surgeon: "Dr. Rami Nassar",
    surgeryDate: "Sep 03, 2026",
    surgeryTime: "10:00",
    room: "OR 01",
    status: "Pre-Op",
    paymentStatus: "Paid",
    preOpCompleted: false,
    anesthesiaCompleted: false,
    equipmentReady: false,
    postOpCompleted: false,
  },

  {
    id: "SUR-1003",
    patientId: "SRG-2044",
    patientName: "Karim Saleh",
    procedure: "Knee Arthroscopy",
    surgeon: "Dr. Jad Haddad",
    surgeryDate: "Sep 04, 2026",
    surgeryTime: "11:30",
    room: "OR 03",
    status: "Pre-Op",
    paymentStatus: "Paid",
    preOpCompleted: true,
    anesthesiaCompleted: true,
    equipmentReady: true,
    postOpCompleted: false,
  },

  {
    id: "SUR-1004",
    patientId: "SRG-2057",
    patientName: "Nour Farhat",
    procedure: "Hernia Repair",
    surgeon: "Dr. Rami Nassar",
    surgeryDate: "Sep 05, 2026",
    surgeryTime: "14:00",
    room: "OR 01",
    status: "Pre-Op",
    paymentStatus: "Paid",
    preOpCompleted: false,
    anesthesiaCompleted: false,
    equipmentReady: false,
    postOpCompleted: false,
  },
];
