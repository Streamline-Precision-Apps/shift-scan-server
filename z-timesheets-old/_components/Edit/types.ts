import { ApprovalStatus } from "../../../../../../../prisma/generated/prisma/client";

// Local type definitions to avoid Prisma client issues
type LoadType = "UNSCREENED" | "SCREENED";

export interface EditTimesheetModalProps {
  timesheetId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void; // Optional callback for parent to refetch
}

export interface EquipmentHauled {
  id: string;
  equipmentId: string;
  source: string;
  destination: string;
  startMileage: string;
  endMileage: string;
}
export interface Material {
  id: string;
  LocationOfMaterial: string;
  name: string;
  quantity: string;
  unit: string;
  loadType: string;
}

export interface RefuelLog {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number;
}

export interface TascoFLoad {
  id: string;
  weight: number | null;
  screenType: LoadType | null;
}

export interface StateMileage {
  id: string;
  state: string;
  stateLineMileage: number;
}
export interface TruckingLog {
  id: string;
  truckNumber: string; // Added truckId for clarity
  trailerNumber?: string; // Optional trailerId
  startingMileage: number;
  endingMileage: number;
  EquipmentHauled: EquipmentHauled[];
  Materials: Material[];
  RefuelLogs: RefuelLog[];
  StateMileages: StateMileage[];
}
export interface TascoLog {
  id: string;
  shiftType: string;
  laborType: string;
  materialType: string;
  LoadQuantity: number;
  RefuelLogs: RefuelLog[];
  TascoFLoads: TascoFLoad[];
  Equipment: { id: string; name: string } | null;
}
export interface EmployeeEquipmentLog {
  id: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  Equipment: { id: string; name: string } | null;
}

// Union types for nested log arrays
// For TruckingLogs
export type TruckingNestedType =
  | "EquipmentHauled"
  | "Materials"
  | "RefuelLogs"
  | "StateMileages";
export type TruckingNestedItem =
  | EquipmentHauled
  | Material
  | RefuelLog
  | StateMileage;
// For TascoLogs
export type TascoNestedType = "RefuelLogs" | "TascoFLoads";
export type TascoNestedItem = RefuelLog | TascoFLoad;

// Mapping type for nested log types
export type TruckingNestedTypeMap = {
  EquipmentHauled: EquipmentHauled;
  Materials: Material;
  RefuelLogs: RefuelLog;
  StateMileages: StateMileage;
};
// Mapping type for Tasco nested log types
export type TascoNestedTypeMap = {
  RefuelLogs: RefuelLog;
  TascoFLoads: TascoFLoad;
};

export interface TimesheetData {
  id: number;
  date: Date | string;
  User: { id: string; firstName: string; lastName: string };
  Jobsite: { id: string; name: string };
  CostCode: { id: string; name: string };
  startTime: string;
  endTime: string;
  workType: string;
  comment: string;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
  Maintenance: mechanicProjects[];
  TruckingLogs: TruckingLog[];
  TascoLogs: TascoLog[];
  EmployeeEquipmentLogs: EmployeeEquipmentLog[];
}

type mechanicProjects = {
  id: number;
  timeSheetId: number;
  hours: number | null;
  equipmentId: string;
  description: string | null;
};
