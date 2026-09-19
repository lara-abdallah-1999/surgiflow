export type PatientStatus =
  | "In Surgery"
  | "Confirmed"
  | "Pre-Op"
  | "Today"
  | "Follow-up"
  | "Discharged";

export type PatientProcedure = {
  name: string;
  site?: string;
};

export type Patient = {
  id: string;
  name: string;
  initials: string;

  mrn: string;

  age: number;
  gender: "Male" | "Female";

  procedure: string;
  procedures: PatientProcedure[];

  surgeon: string;

  surgeryDate: string;
  surgeryTime: string;
  room: string;

  status: PatientStatus;

  /**
   * 1 Planning & Booking
   * 2 Arrival & Registration
   * 3 Pre-Operative
   * 4 Surgery & Post-Op
   * 5 Follow-up & Continuity
   */
  journeyStage: 1 | 2 | 3 | 4 | 5;

  lastCompletedStage?: number;

  phone: string;
  admissionDate: string;
};

export const patients: Patient[] = [
  /* ================================================================
     SARAH
     surgeryStore: SRG-2048
  ================================================================= */

  {
    id: "SRG-2048",

    name: "Sarah Joseph Haddad",
    initials: "SH",

    mrn: "MRN-102845",

    age: 42,
    gender: "Female",

    procedure: "Rhinoplasty",

    procedures: [
      {
        name: "Rhinoplasty",
        site: "Nose",
      },
      {
        name: "Septoplasty",
        site: "Nasal Septum",
      },
      {
        name: "Turbinate Reduction",
        site: "Nasal Cavity",
      },
    ],

    surgeon: "Dr. Nadim Saleh",

    surgeryDate: "Sep 03, 2026",
    surgeryTime: "08:30",

    room: "OR 02",

    status: "Today",

    journeyStage: 1,

    phone: "+961 76 884 145",

    admissionDate: "-",
  },

  /* ================================================================
     MAYA
     surgeryStore: SRG-2051
  ================================================================= */

  {
    id: "SRG-2051",

    name: "Maya Elias Khoury",
    initials: "MK",

    mrn: "MRN-102973",

    age: 34,
    gender: "Female",

    procedure: "Laparoscopic Cholecystectomy",

    procedures: [
      {
        name: "Laparoscopic Cholecystectomy",
        site: "Gallbladder",
      },
      {
        name: "Intraoperative Cholangiography",
        site: "Biliary Tract",
      },
    ],

    surgeon: "Dr. Rami Nassar",

    surgeryDate: "Sep 03, 2026",
    surgeryTime: "09:15",

    room: "OR 01",

    status: "Today",

    journeyStage: 1,

    phone: "+961 76 552 684",

    admissionDate: "-",
  },

  /* ================================================================
     KARIM
     IMPORTANT:
     Was SRG-2044 in patients.ts.
     Current surgeryStore case is SRG-2054.
  ================================================================= */

  {
    id: "SRG-2054",

    name: "Karim Hassan Saleh",
    initials: "KS",

    mrn: "MRN-103118",

    age: 39,
    gender: "Male",

    procedure: "Knee Arthroscopy",

    procedures: [
      {
        name: "Knee Arthroscopy",
        site: "Right Knee",
      },
      {
        name: "Meniscus Repair",
        site: "Right Knee",
      },
    ],

    surgeon: "Dr. Jad Haddad",

    surgeryDate: "Sep 03, 2026",
    surgeryTime: "12:00",

    room: "OR 03",

    /*
     * surgeryStore currently has Payment Pending.
     * Patient Directory keeps the closest existing directory status.
     */
    status: "Pre-Op",

    journeyStage: 2,

    phone: "—",

    admissionDate: "Sep 03, 2026",
  },

  /* ================================================================
     SAID
     SRG-2070 must also be added to surgeryStore.
     Store record is supplied below.
  ================================================================= */

  {
    id: "SRG-2070",

    name: "Said Salam",
    initials: "SS",

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

    surgeon: "Dr. Jad Haddad",

    surgeryDate: "Sep 05, 2026",
    surgeryTime: "12:30",

    room: "OR 03",

    status: "Pre-Op",

    journeyStage: 3,
    lastCompletedStage: 9,

    phone: "+961 76 345 699",

    admissionDate: "Sep 05, 2026",
  },

  /* ================================================================
     NOUR
     IMPORTANT:
     Was SRG-2057.
     SRG-2057 currently belongs to Yara Habib.
     Nour's real current case is SRG-2055.
  ================================================================= */

  {
    id: "SRG-2055",

    name: "Nour Ali Farhat",
    initials: "NF",

    mrn: "MRN-103176",

    age: 45,
    gender: "Female",

    procedure: "Hernia Repair",

    procedures: [
      {
        name: "Hernia Repair",
        site: "Umbilical",
      },
    ],

    surgeon: "Dr. Rami Nassar",

    surgeryDate: "Sep 03, 2026",
    surgeryTime: "13:30",

    room: "OR 01",

    status: "Pre-Op",

    journeyStage: 3,
    lastCompletedStage: 9,

    phone: "—",

    admissionDate: "Sep 03, 2026",
  },

  /* ================================================================
     OMAR
     IMPORTANT:
     Was SRG-2039.
     Current surgeryStore case is SRG-2052.
  ================================================================= */

  {
    id: "SRG-2052",

    name: "Omar Ahmad Daher",
    initials: "OD",

    mrn: "MRN-103021",

    age: 47,
    gender: "Male",

    procedure: "Inguinal Hernia Repair",

    procedures: [
      {
        name: "Inguinal Hernia Repair",
        site: "Right",
      },
    ],

    surgeon: "Dr. Rami Nassar",

    surgeryDate: "Sep 03, 2026",
    surgeryTime: "10:15",

    room: "OR 01",

    status: "Today",

    journeyStage: 1,

    phone: "+961 70 124 567",

    admissionDate: "-",
  },
];