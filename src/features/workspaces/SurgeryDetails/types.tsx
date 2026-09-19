


export type WorkspaceTab = "surgery" | "recovery";


export type EquipmentState = "Available" | "In Use" | "Returned";

export type EquipmentStatusFilter = "All" | EquipmentState;


export type SurgeryEquipment = {
  id: string;
  barcode: string;
  name: string;
  category: string;
  state: EquipmentState;
  usedAt?: string;
  returnedAt?: string;
};


export type RecoveryAssessment = {
  airway: boolean;
  breathing: boolean;
  circulation: boolean;
  consciousness: boolean;
  painControlled: boolean;
  nauseaControlled: boolean;
};


export type SurgeryProcedure = {
  name: string;
  site?: string;
};
