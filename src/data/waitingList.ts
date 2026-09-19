export type WaitingListItem = {
  id: string;
  patientId: string;
  patientName: string;
  procedure: string;
  surgeon: string;

  priority: "Urgent" | "High" | "Moderate" | "Low";

  requestedDate: string;

  estimatedDuration: number;

  paymentStatus: "Pending" | "Partially Paid" | "Paid";
};

export const waitingList: WaitingListItem[] = [
  {
    id: "WL-001",
    patientId: "SRG-2039",
    patientName: "Omar Daher",
    procedure: "Cataract Surgery",
    surgeon: "Dr. Nadim Saleh",
    priority: "Moderate",
    requestedDate: "Sep 07, 2026",
    estimatedDuration: 60,
    paymentStatus: "Pending",
  },

  {
    id: "WL-002",
    patientId: "SRG-2061",
    patientName: "Rita Khoury",
    procedure: "Thyroidectomy",
    surgeon: "Dr. Nadim Saleh",
    priority: "High",
    requestedDate: "Sep 08, 2026",
    estimatedDuration: 120,
    paymentStatus: "Partially Paid",
  },

  {
    id: "WL-003",
    patientId: "SRG-2068",
    patientName: "Fadi Nassar",
    procedure: "ACL Reconstruction",
    surgeon: "Dr. Jad Haddad",
    priority: "Urgent",
    requestedDate: "Sep 09, 2026",
    estimatedDuration: 150,
    paymentStatus: "Paid",
  },
];