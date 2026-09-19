import type { Payment } from "../types/surgery";

export const payments: Payment[] = [
  {
    id: "PAY-001",
    surgeryId: "SUR-1001",
    patientId: "SRG-2048",
    patientName: "Sarah Haddad",
    procedure: "Rhinoplasty",
    totalAmount: 3500,
    paidAmount: 3500,
    outstandingAmount: 0,
    status: "Paid",
    paymentMethod: "Credit Card",
    transactionReference: "TXN-88291",
    paidAt: "Sep 02, 2026 16:32",
    receiptNumber: "REC-2026-001",
  },

  {
    id: "PAY-002",
    surgeryId: "SUR-1002",
    patientId: "SRG-2051",
    patientName: "Maya Khoury",
    procedure: "Laparoscopic Cholecystectomy",
    totalAmount: 4200,
    paidAmount: 0,
    outstandingAmount: 4200,
    status: "Pending",
  },

  {
    id: "PAY-003",
    surgeryId: "SUR-1003",
    patientId: "SRG-2044",
    patientName: "Karim Saleh",
    procedure: "Knee Arthroscopy",
    totalAmount: 5000,
    paidAmount: 5000,
    outstandingAmount: 0,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    transactionReference: "TRX-55128",
    paidAt: "Sep 03, 2026 09:12",
    receiptNumber: "REC-2026-002",
  },
];