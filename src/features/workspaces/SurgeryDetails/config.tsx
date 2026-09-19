import { type SurgeryEquipment } from "./types";


export const DEFAULT_EQUIPMENT: SurgeryEquipment[] = [
  {
    id: "eq-ecg",
    barcode: "EQ-10001",
    name: "Patient Monitor",
    category: "Monitoring",
    state: "Available",
  },
  {
    id: "eq-cautery",
    barcode: "EQ-10002",
    name: "Electrosurgical Unit",
    category: "Surgical",
    state: "Available",
  },
  {
    id: "eq-suction",
    barcode: "EQ-10003",
    name: "Suction Regulator",
    category: "Surgical",
    state: "Available",
  },
  {
    id: "eq-infusion",
    barcode: "EQ-10004",
    name: "Infusion Pump",
    category: "Anesthesia",
    state: "Available",
  },
  {
    id: "eq-airway",
    barcode: "EQ-10005",
    name: "Airway Cart",
    category: "Anesthesia",
    state: "Available",
  },
];
