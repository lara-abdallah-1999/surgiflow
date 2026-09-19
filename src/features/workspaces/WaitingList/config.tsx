


export const doctors = [
  "All Doctors",
  "Dr. Nadim Saleh",
  "Dr. Rami Nassar",
  "Dr. Jad Haddad",
];


export const availability: Record<
  string,
  Record<string, string[]>
> = {
  "Dr. Nadim Saleh": {
    "2026-09-03": [
      "08:30",
      "10:00",
      "13:30",
      "15:00",
    ],
    "2026-09-04": [
      "09:00",
      "11:00",
      "14:30",
    ],
  },

  "Dr. Rami Nassar": {
    "2026-09-03": [
      "09:00",
      "11:30",
      "14:00",
    ],
    "2026-09-05": [
      "08:30",
      "10:30",
      "13:00",
    ],
  },

  "Dr. Jad Haddad": {
    "2026-09-04": [
      "09:00",
      "11:30",
      "15:00",
    ],
  },
};


export const priorities = [
  "All",
  "Urgent",
  "High",
  "Moderate",
  "Low"
];


export const ROW_HEIGHT = 48;

export const MIN_PAGE_SIZE = 1;


export const waitingPatientMrn: Record<
  string,
  string
> = {
  "SRG-2048": "MRN-102845",
  "SRG-2051": "MRN-102973",
  "SRG-2044": "MRN-102761",
  "SRG-2057": "MRN-103104",
  "SRG-2031": "MRN-102588",
};


export const waitingPatientAge: Record<
  string,
  number
> = {
  "SRG-2048": 42,
  "SRG-2051": 56,
  "SRG-2044": 35,
  "SRG-2057": 61,
  "SRG-2031": 48,
};


export const waitingPatientGender: Record<
  string,
  string
> = {
  "SRG-2048": "Female",
  "SRG-2051": "Male",
  "SRG-2044": "Female",
  "SRG-2057": "Male",
  "SRG-2031": "Female",
};
