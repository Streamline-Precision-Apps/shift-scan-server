/**
 * Custom hook for fetching and managing timesheet-related data (users, jobsites, equipment, cost codes, material types).
 * Keeps all data-fetching logic out of the main modal/component for maintainability.
 * Optimized with useMemo and useCallback for better performance.
 *
 * @module hooks/useTimesheetData
 */
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { apiRequest } from "@/app/lib/utils/api-Utils";

// Local type definition
type ApprovalStatus = "APPROVED" | "DRAFT" | "PENDING" | "REJECTED";

export interface EditTimesheetModalProps {
  timesheetId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void; // Optional callback for parent to refetch
  notificationIds: string | null;
  setNotificationIds: Dispatch<SetStateAction<string | null>>;
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
  // materialWeight: number;
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
  screenType: "SCREENED" | "UNSCREENED" | null;
}

export interface StateMileage {
  id: string;
  state: string;
  stateLineMileage: number;
}
export interface TruckingLog {
  id: string;
  truckNumber: string; // Truck equipment ID
  trailerNumber?: string; // Trailer equipment ID
  startingMileage: number;
  endingMileage: number;
  Truck?: { id: string; name: string } | null; // Truck equipment relation
  Trailer?: { id: string; name: string } | null; // Trailer equipment relation
  Equipment?: { id: string; name: string } | null; // Hauled equipment relation
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
export type TascoNestedType = "RefuelLogs";
export type TascoNestedItem = RefuelLog;

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

interface UserOption {
  id: string;
  firstName: string;
  lastName: string;
}
interface JobsiteOption {
  id: string;
  name: string;
}
interface CostCodeOption {
  value: string;
  label: string;
}
interface EquipmentOption {
  id: string;
  name: string;
}
interface TruckOption {
  id: string;
  name: string;
}
interface TrailerOption {
  id: string;
  name: string;
}
interface MaterialType {
  id: string;
  name: string;
}

export function useTimesheetData(form: TimesheetData | null) {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [jobsites, setJobsites] = useState<JobsiteOption[]>([]);
  const [costCodes, setCostCodes] = useState<CostCodeOption[]>([]);
  const [equipment, setEquipment] = useState<EquipmentOption[]>([]);
  const [trucks, setTrucks] = useState<TruckOption[]>([]);
  const [trailers, setTrailers] = useState<TrailerOption[]>([]);
  const [tascoMaterialTypes, setTascoMaterialTypes] = useState<MaterialType[]>([]);
  // Cache to store cost codes by jobsite ID
  const [costCodeCache, setCostCodeCache] = useState<
    Record<string, { data: CostCodeOption[]; timestamp: number }>
  >({});

  // Memoized fetch functions for better performance
  const fetchUsers = useCallback(async () => {
    try {
      const users = await apiRequest("/api/v1/admins/personnel/getAllEmployees", "GET");
      // getAllEmployees returns users directly as an array, not wrapped in an object
      return users || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }, []);

  const fetchJobsites = useCallback(async () => {
    try {
      const data = await apiRequest("/api/v1/admins/jobsite?pageSize=1000", "GET");
      const filteredJobsites = data.jobsiteSummary
        .filter(
          (j: { approvalStatus: string }) => j.approvalStatus === "APPROVED",
        )
        .map((j: { id: string; name: string }) => ({ id: j.id, name: j.name }));
      return filteredJobsites;
    } catch (error) {
      console.error("Error fetching jobsites:", error);
      return [];
    }
  }, []);

  const fetchEquipment = useCallback(async () => {
    try {
      const data = await apiRequest("/api/v1/admins/equipment?pageSize=1000", "GET");
      return data.equipment || [];
    } catch (error) {
      console.error("Error fetching equipment:", error);
      return [];
    }
  }, []);

  const fetchTascoMaterialTypes = useCallback(async () => {
    try {
      const data = await apiRequest("/api/v1/admins/timesheet/tasco-material-types", "GET");
      return data.materialTypes || [];
    } catch (error) {
      console.error("Error fetching Tasco material types:", error);
      return [];
    }
  }, []);

  // Main fetch function that calls all the memoized fetchers
  const fetchAllData = useCallback(async () => {
    try {
      // Use Promise.all to fetch data concurrently for better performance
      const [usersData, jobsitesData, equipmentData, materialTypesData] = await Promise.all([
        fetchUsers(),
        fetchJobsites(),
        fetchEquipment(),
        fetchTascoMaterialTypes(),
      ]);

      setUsers(usersData);
      setJobsites(jobsitesData);
      setEquipment(equipmentData);
      setTascoMaterialTypes(materialTypesData);

      // Process equipment to get trucks and trailers
      const filteredTrucks = equipmentData.filter(
        (e: { equipmentTag: string }) => 
          e.equipmentTag === "TRUCK" || e.equipmentTag === "VEHICLE",
      );
      const filteredTrailers = equipmentData.filter(
        (e: { equipmentTag: string }) => e.equipmentTag === "TRAILER",
      );

      setTrucks(filteredTrucks as TruckOption[]);
      setTrailers(filteredTrailers as TrailerOption[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [fetchUsers, fetchJobsites, fetchEquipment, fetchTascoMaterialTypes]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Memoized function to fetch cost codes by jobsite
  const fetchCostCodes = useCallback(async (jobsiteId: string) => {
    if (!jobsiteId) {
      return [];
    }
    try {
      // Fetch ALL cost codes without pagination
      const response = await apiRequest(
        `/api/v1/admins/cost-codes?pageSize=1000`,
        "GET",
      );
      
      // Extract cost codes from the response - API returns { costCodes: [...] }
      const codes = response.costCodes || [];
      
      const options = codes
        .filter((c: { isActive: boolean }) => c.isActive === true)
        .map((c: { id: string; code: string; name: string }) => ({
          value: c.id,
          label: `${c.code} - ${c.name}`,
        }));
      
      return options;
    } catch (error) {
      console.error("Error fetching cost codes:", error);
      return [];
    }
  }, []);

  // Fetch cost codes when jobsite changes with caching
  useEffect(() => {
    const jobsiteId = form?.Jobsite?.id || "";

    if (!jobsiteId) {
      setCostCodes([]);
      return;
    }

    // Check if we have a recent cache (less than 5 minutes old)
    const cachedData = costCodeCache[jobsiteId];
    const cacheIsValid =
      cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000; // 5 minutes

    if (cacheIsValid) {
      // Use cached data
      setCostCodes(cachedData.data);
      return;
    }

    // Fetch fresh data
    async function loadCostCodes() {
      try {
        const codes = await fetchCostCodes(jobsiteId);
        setCostCodes(codes);

        // Update the cache
        setCostCodeCache((prev) => ({
          ...prev,
          [jobsiteId]: {
            data: codes,
            timestamp: Date.now(),
          },
        }));
      } catch {
        setCostCodes([]);
      }
    }

    loadCostCodes();
  }, [form?.Jobsite?.id, fetchCostCodes, costCodeCache]);

  // Memoized function to fetch material types - DISABLED: endpoint not yet implemented
  // const fetchMaterialTypes = useCallback(async () => {
  //   try {
  //     // Check if we have a recent cache (less than 10 minutes old)
  //     if (
  //       materialTypesCache &&
  //       Date.now() - materialTypesCache.timestamp < 10 * 60 * 1000
  //     ) {
  //       return materialTypesCache.data;
  //     }

  //     const data = await apiRequest("/api/v1/admins/material-types", "GET");

  //     // Update the cache
  //     setMaterialTypesCache({
  //       data,
  //       timestamp: Date.now(),
  //     });

  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching material types:", error);
  //     return [];
  //   }
  // }, [materialTypesCache]);

  // Fetch material types - DISABLED: endpoint not yet implemented
  // useEffect(() => {
  //   async function loadMaterialTypes() {
  //     const types = await fetchMaterialTypes();
  //     setMaterialTypes(types);
  //   }
  //   loadMaterialTypes();
  // }, [fetchMaterialTypes]);

  // Memoize dropdown options to prevent unnecessary re-rendering
  const userOptions = useMemo(
    () =>
      users.map((u) => ({
        value: u.id,
        label: `${u.firstName} ${u.lastName}`,
      })),
    [users],
  );

  const jobsiteOptions = useMemo(
    () => jobsites.map((j) => ({ value: j.id, label: j.name })),
    [jobsites],
  );

  const costCodeOptions = useMemo(
    () => costCodes.map((c) => ({ value: c.value, label: c.label })),
    [costCodes],
  );

  const equipmentOptions = useMemo(
    () => equipment.map((e) => ({ value: e.id, label: e.name })),
    [equipment],
  );

  const truckOptions = useMemo(
    () => trucks.map((t) => ({ value: t.id, label: t.name })),
    [trucks],
  );

  const trailerOptions = useMemo(
    () => trailers.map((t) => ({ value: t.id, label: t.name })),
    [trailers],
  );

  const tascoMaterialTypeOptions = useMemo(
    () => tascoMaterialTypes.map((m) => ({ value: m.name, label: m.name })),
    [tascoMaterialTypes],
  );

  return {
    // Raw data arrays
    users,
    jobsites,
    costCodes,
    equipment,
    tascoMaterialTypes,
    trucks,
    trailers,
    // Memoized formatted options for dropdowns
    userOptions,
    jobsiteOptions,
    costCodeOptions,
    equipmentOptions,
    truckOptions,
    trailerOptions,
    tascoMaterialTypeOptions,
  };
}
