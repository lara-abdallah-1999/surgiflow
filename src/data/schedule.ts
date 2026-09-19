export type SurgeryStatus =
  | "Confirmed"
  | "In Progress"
  | "Pre-Op"
  | "Completed";

export type ScheduledSurgery = {
  id: string;
  patientId: string;
  patient: string;
  initials: string;
  procedure: string;
  surgeon: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SurgeryStatus;
};

export const scheduledSurgeries: ScheduledSurgery[] = [
  {
    id: "SUR-1001",
    patientId: "SRG-2048",
    patient: "Sarah Haddad",
    initials: "SH",
    procedure: "Rhinoplasty",
    surgeon: "Dr. Nadim Saleh",
    room: "OR 02",
    date: "Sep 03, 2026",
    startTime: "08:30",
    endTime: "10:30",
    status: "In Progress",
  },
  {
    id: "SUR-1002",
    patientId: "SRG-2051",
    patient: "Maya Khoury",
    initials: "MK",
    procedure: "Laparoscopic Cholecystectomy",
    surgeon: "Dr. Rami Nassar",
    room: "OR 01",
    date: "Sep 03, 2026",
    startTime: "10:00",
    endTime: "12:00",
    status: "Confirmed",
  },
  {
    id: "SUR-1003",
    patientId: "SRG-2044",
    patient: "Karim Saleh",
    initials: "KS",
    procedure: "Knee Arthroscopy",
    surgeon: "Dr. Jad Haddad",
    room: "OR 03",
    date: "Sep 04, 2026",
    startTime: "11:30",
    endTime: "13:00",
    status: "Pre-Op",
  },
  {
    id: "SUR-1004",
    patientId: "SRG-2057",
    patient: "Nour Farhat",
    initials: "NF",
    procedure: "Hernia Repair",
    surgeon: "Dr. Rami Nassar",
    room: "OR 01",
    date: "Sep 05, 2026",
    startTime: "14:00",
    endTime: "15:30",
    status: "Confirmed",
  },
];