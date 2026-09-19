


export const ROW_HEIGHT = 48;

export const MIN_PAGE_SIZE = 1;


export const accountingDemographics: Record<
  string,
  {
    mrn: string;
    age: number;
    gender: "Male" | "Female";
  }
> = {
  "SRG-2048": {
    age: 42,
    mrn: "MRN-10245",
    gender: "Female",
  },
  "SRG-2051": {
    age: 56,
    mrn: "MRN-10251",
    gender: "Female",
  },
  "SRG-2044": {
    age: 35,
    mrn: "MRN-10258",
    gender: "Male",
  },
  "SRG-2057": {
    age: 61,
    mrn: "MRN-10263",
    gender: "Female",
  },
  "SRG-2031": {
    age: 48,
    mrn: "MRN-10271",
    gender: "Female",
  },
};
