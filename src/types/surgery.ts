export type SurgeryStatus =
  | "Waiting List"
  | "Today"
  | "Booked"
  | "Payment Pending"
  | "Financially Cleared"
  | "Admitted"
  | "Pre-Op"
  | "Ready"
  | "In Progress"
  | "Completed"
  | "Recovery"
  | "Discharged";

export type PaymentStatus =
  | "Pending"
  | "Partially Paid"
  | "Paid";

export type PreOpStatus =
  | "Pending"
  | "In Progress"
  | "Ready";

export type FollowUpStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "Rescheduled";

export type AwakeningObservation = {
  id: string;
  observedAt: string;
  response: "Not yet awake" | "Responds to voice" | "Awake and responsive" | "Other observation";
  note: string;
  reviewRequested: boolean;
  notifiedClinician?: string;
  notifiedAt?: string;
  reviewedAt?: string;
};

export type Surgery = {
  id: string;
  patientId: string;
  patientName: string;
  mrn?: string;
  age?: number;
  gender?: string;
  phone?: string;
  procedure: string;
  procedures?: { name: string; site?: string; code?: string; price?: number }[];
  doctor: string;
  date: string;
  time: string;
  room: string;
  priority: string;
  status: SurgeryStatus;
  allergies?: string[];
  cost: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  preOpStatus: PreOpStatus;

  // Reception
  arrivedAt?: string;
  arrivalStatus?: string;
  receptionCompletedAt?: string;

  // Payment
  paymentCompletedAt?: string;

  // OR admission gate
  admittedAt?: string;
  admittedBy?: string;

  // Pre-Op
  preOpStartedAt?: string;
  preOpCompleted?: boolean;
  preOpCompletedAt?: string;

  // Anesthesia
  anesthesiaType?: string;
  anesthesiaTypeConfirmedAt?: string;
  anesthesiaCompleted?: boolean;
  anesthesiaCompletedAt?: string;
  inductionAt?: string;

  // Equipment
  equipmentReady?: boolean;

  // Surgery
  surgeryStartedAt?: string;
  surgeryCompletedAt?: string;
  transferredAt?: string;
  postOpCompleted?: boolean;
  durationSeconds?: number;
  durationMinutes?: number;
  notes?: string;

  // Report
  operativeReport?: string;
  surgeonNotes?: string;
  patientCondition?: string;
  dischargeTime?: string;
  dischargeInstructions?: string;
  recoveryAwakeningObservations?: AwakeningObservation[];
  receptionPrintout?: { documentType: string; representative: string; consentText: string; notes: string };
};

export type DoctorAvailability = {
  doctor: string;
  date: string;
  times: string[];
};

export type Payment = {
  id: string;
  surgeryId: string;
  patientId: string;
  patientName: string;
  procedure: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: PaymentStatus;
  paymentMethod?: string;
  transactionReference?: string;
  paidAt?: string;
  receiptNumber?: string;
};

export type PreOpTest = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: "Pending" | "Completed" | "Not Required";
  result?: string;
};

export type Equipment = {
  id: string;
  name: string;
  quantity: number;
  status: "Pending" | "Ready";
};

export type AnesthesiaAssessment = {
  type: string;
  airwayAssessment: boolean;
  medicalHistoryReviewed: boolean;
  allergiesReviewed: boolean;
  consentObtained: boolean;
  anesthesiaReady: boolean;
  notes: string;
};
