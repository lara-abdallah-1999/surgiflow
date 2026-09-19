


export type PatientCondition =
  | "Improving"
  | "Stable"
  | "Needs Attention";


export type MedicationStatus =
  | "Active"
  | "Completed"
  | "Stopped";


export type OrderStatus =
  | "Requested"
  | "Scheduled"
  | "Completed";


export type VisitStatus =
  | "Upcoming"
  | "Completed"
  | "Missed";


export type Medication = {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  status: MedicationStatus;
  stopReason: string;
};


export type FollowUpOrder = {
  id: string;
  type:
    | "Lab Test"
    | "X-Ray"
    | "MRI"
    | "CT Scan"
    | "Ultrasound";
  name: string;
  dueDate: string;
  status: OrderStatus;
  result: string;
};


export type PostOpVisit = {
  id: string;
  date: string;
  time: string;
  status: VisitStatus;
  condition: PatientCondition;
  progress: string;
  notes: string;
  result: string;
};


export type DischargeChecklist = {
  medicationsReviewed: boolean;
  followUpsArranged: boolean;
  instructionsProvided: boolean;
};



export type LifestyleHabitType =
  | "Walking"
  | "Exercise"
  | "Nutrition"
  | "Foods to Avoid"
  | "Hydration"
  | "Sleep / Rest"
  | "Restriction"
  | "Other";


export type LifestyleHabit = {
  id: string;
  type: LifestyleHabitType;
  instruction: string;
};


export type LifestylePlan = LifestyleHabit[];


export type PostOpState = {
  condition: PatientCondition;
  painLevel: number;
  woundStatus: string;
  instructions: string;
  medications: Medication[];
  followUps: FollowUpOrder[];
  lifestyle: LifestylePlan;
  surgeonReport: string;
  visits: PostOpVisit[];
  dischargeChecklist: DischargeChecklist;
  discharged: boolean;
  dischargedAt: string | null;
};


export type ExpandedList =
  | "medications"
  | "followUps"
  | "lifestyle"
  | "visits"
  | null;


export type ToastState = {
  type: "success" | "error";
  title: string;
  message: string;
  items?: string[];
} | null;


export type Period = "Day" | "Week" | "Month";


export type SortKey =
  | "patient"
  | "patientId"
  | "procedures"
  | "surgeon"
  | "date"
  | "condition"
  | "followUp";


export type SortDirection = "asc" | "desc";




export type PostOpProcedureItem = {
  name: string;
  site?: string;
};
