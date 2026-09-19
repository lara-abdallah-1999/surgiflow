import { createContext } from "react";
// UI placement only: no patient data or workflow state is copied here.
export const PatientHeaderHost = createContext<HTMLDivElement | null>(null);
