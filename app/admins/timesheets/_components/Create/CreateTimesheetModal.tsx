"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/app/v1/components/ui/button";
import { TruckingSection } from "./TruckingSection";
import { TascoSection } from "./TascoSection";
import { LaborSection } from "./LaborSection";
import GeneralSection from "./GeneralSection";
import { createTimesheetAdmin } from "@/app/lib/actions/adminActions";
import { toast } from "sonner";
import Spinner from "@/app/v1/components/(animations)/spinner";
import { X } from "lucide-react";
import { MechanicProject } from "./MechanicProject";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { useTimesheetAutoSelection } from "../hooks/useTimesheetAutoSelection";

// Type for mechanic project summary (expand as needed)
// type MechanicProjectSummary = { id: string };

export function CreateTimesheetModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: new Date(),
    user: { id: "", firstName: "", lastName: "" },
    jobsite: { id: "", name: "" },
    costcode: { id: "", name: "" },
    startTime: null as Date | null,
    endTime: null as Date | null,
    workType: "",
    comments: "",
  });
  const [users, setUsers] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [jobsites, setJobsites] = useState<{ id: string; name: string }[]>([]);
  const [costCode, setCostCode] = useState<{ value: string; label: string }[]>(
    []
  );
  const [equipment, setEquipment] = useState<
    { id: string; name: string; equipmentTag?: string }[]
  >([]);
  const [trucks, setTrucks] = useState<
    { id: string; name: string; equipmentTag?: string }[]
  >([]);

  const [materialTypes, setMaterialTypes] = useState<
    { id: string; name: string }[]
  >([]);

  const [submitting, setSubmitting] = useState(false);

  // Mechanic project logs state
  type Maintenance = {
    id: number;
    hours: number | null;
    equipmentId: string;
    description: string | null;
    Equipment?: { id: string; name: string } | null;
  };
  const [mechanicProjects, setMechanicProjects] = useState<Maintenance[]>([
    {
      id: Date.now(),
      hours: null,
      equipmentId: "",
      description: "",
      Equipment: null,
    },
  ]);

  // Trucking log type
  type TruckingMaterialDraft = {
    location: string;
    name: string;
    quantity: string;
    unit: "TONS" | "YARDS" | "";
    loadType: "SCREENED" | "UNSCREENED" | "";
  };
  type TruckingLogDraft = {
    equipmentId: string;
    truckNumber: string; // Stores truck equipment ID
    startingMileage: string;
    endingMileage: string;
    equipmentHauled: {
      equipment: { id: string; name: string };
      source: string | null;
      destination: string | null;
      startMileage: string;
      endMileage: string;
    }[];
    materials: TruckingMaterialDraft[];
    refuelLogs: { gallonsRefueled: string; milesAtFueling: string }[];
    stateMileages: { state: string; stateLineMileage: string }[];
  };
  const [truckingLogs, setTruckingLogs] = useState<TruckingLogDraft[]>([
    {
      equipmentId: "",
      truckNumber: "",
      startingMileage: "",
      endingMileage: "",
      equipmentHauled: [
        {
          equipment: { id: "", name: "" },
          source: "",
          destination: "",
          startMileage: "",
          endMileage: "",
        },
      ],
      materials: [
        {
          location: "",
          name: "",
          quantity: "",
          unit: "",
          loadType: "",
        },
      ],
      refuelLogs: [{ gallonsRefueled: "", milesAtFueling: "" }],
      stateMileages: [{ state: "", stateLineMileage: "" }],
    },
  ]);
  // Tasco log type
  type TascoFLoadDraft = {
    id?: string;
    weight: string;
    screenType: "SCREENED" | "UNSCREENED" | "";
  };
  type TascoLogDraft = {
    shiftType: "ABCD Shift" | "E Shift" | "F Shift" | "";
    laborType: "Equipment Operator" | "Labor" | "";
    materialType: string; // id from materialTypes
    loadQuantity: string;
    screenType: "SCREENED" | "UNSCREENED" | "";
    refuelLogs: { gallonsRefueled: string }[];
    equipment: { id: string; name: string }[];
    TascoFLoads?: TascoFLoadDraft[];
  };
  const [tascoLogs, setTascoLogs] = useState<TascoLogDraft[]>([
    {
      shiftType: "",
      laborType: "",
      materialType: "",
      loadQuantity: "",
      screenType: "",
      refuelLogs: [{ gallonsRefueled: "" }],
      equipment: [{ id: "", name: "" }],
      TascoFLoads: [],
    },
  ]);
  // Labor log type
  type LaborLogDraft = {
    equipment: { id: string; name: string };
    startTime: string;
    endTime: string;
  };
  const [laborLogs, setLaborLogs] = useState<LaborLogDraft[]>([
    { equipment: { id: "", name: "" }, startTime: "", endTime: "" },
  ]);

  // Memoized options for dropdowns to prevent unnecessary re-rendering
  const userOptions = useMemo(
    () =>
      users.map((u) => ({
        value: u.id,
        label: `${u.firstName} ${u.lastName}`,
      })),
    [users]
  );

  const jobsiteOptions = useMemo(
    () =>
      jobsites.map((j) => ({
        value: j.id,
        label: j.name,
      })),
    [jobsites]
  );

  const costCodeOptions = useMemo(
    () =>
      costCode.map((c) => ({
        value: c.value,
        label: c.label,
      })),
    [costCode]
  );

  const equipmentOptions = useMemo(() => {
    if (!equipment || !Array.isArray(equipment)) {
      return [];
    }
    return equipment.map((e) => ({
      value: e.id,
      label: e.name,
    }));
  }, [equipment]);

  const truckOptions = useMemo(() => {
    if (!trucks || !Array.isArray(trucks)) {
      return [];
    }
    return trucks.map((e) => ({
      value: e.id,
      label: e.name,
    }));
  }, [trucks]);

  const materialOptions = useMemo(() => {
    if (!materialTypes || !Array.isArray(materialTypes)) {
      return [];
    }
    return materialTypes.map((m) => ({
      value: m.name,
      label: m.name,
    }));
  }, [materialTypes]);

  // Remove costCodeOptions dynamic logic (no costCodes on jobsites)
  const workTypeOptions = [
    { value: "MECHANIC", label: "Mechanic" },
    { value: "TRUCK_DRIVER", label: "Trucking" },
    { value: "LABOR", label: "General" },
    { value: "TASCO", label: "Tasco" },
  ];

  // Memoized fetch functions for users, jobsites, and equipment
  const fetchUsers = useCallback(async () => {
    try {
      const users = await apiRequest(
        "/api/v1/admins/personnel/getAllEmployees",
        "GET"
      );
      // Filter out terminated users (users with terminationDate)
      const activeUsers = users.filter(
        (u: { terminationDate: string | null }) => !u.terminationDate
      );
      return activeUsers || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }, []);

  const fetchJobsites = useCallback(async () => {
    try {
      const data = await apiRequest("/api/v1/admins/jobsite", "GET");

      const filteredJobsite = data.jobsiteSummary.filter(
        (j: { approvalStatus: string }) => j.approvalStatus === "APPROVED"
      );

      const filteredJobsites = filteredJobsite.map(
        (j: { id: string; name: string }) => ({
          id: j.id,
          name: j.name,
        })
      );

      return filteredJobsites;
    } catch (error) {
      console.error("Error fetching jobsites:", error);
      return [];
    }
  }, []);

  const fetchEquipment = useCallback(async () => {
    try {
      // Fetch ALL equipment by requesting a very large page size
      const data = await apiRequest(
        "/api/v1/admins/equipment?pageSize=1000",
        "GET"
      );

      // Handle different response structures - the API returns "equipment" not "equipmentSummary"
      let equipmentData = [];
      if (data?.equipment && Array.isArray(data.equipment)) {
        equipmentData = data.equipment;
      } else if (
        data?.equipmentSummary &&
        Array.isArray(data.equipmentSummary)
      ) {
        equipmentData = data.equipmentSummary;
      } else if (Array.isArray(data)) {
        equipmentData = data;
      }

      return equipmentData;
    } catch (error) {
      console.error("Error fetching equipment:", error);
      return [];
    }
  }, []);

  // Main fetch function that calls all the memoized fetchers
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);

      // Use Promise.all to fetch data concurrently
      const [usersData, jobsitesData, equipmentData] = await Promise.all([
        fetchUsers(),
        fetchJobsites(),
        fetchEquipment(),
      ]);

      // Process equipment to get trucks (vehicles)
      if (
        equipmentData &&
        Array.isArray(equipmentData) &&
        equipmentData.length > 0
      ) {
        const filteredTrucks = equipmentData.filter(
          (e: { equipmentTag?: string }) => e.equipmentTag === "VEHICLE"
        );
        setTrucks(filteredTrucks);
      } else {
        console.warn("⚠️ No equipment data available for truck filtering");
        setTrucks([]);
      }

      setEquipment(equipmentData || []);
      setUsers(usersData || []);
      setJobsites(jobsitesData || []);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, fetchJobsites, fetchEquipment]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Re-filter trucks whenever equipment changes (trucks are tagged as TRUCK or VEHICLE)
  useEffect(() => {
    if (equipment && Array.isArray(equipment) && equipment.length > 0) {
      const filteredTrucks = equipment.filter(
        (e) => e.equipmentTag === "TRUCK" || e.equipmentTag === "VEHICLE"
      );
      setTrucks(filteredTrucks);
    } else {
      setTrucks([]);
    }
  }, [equipment]);

  // Memoized function to fetch cost codes by jobsite
  const fetchCostCodes = useCallback(async (jobsiteId: string) => {
    if (!jobsiteId) {
      return [];
    }

    try {
      // Use the old cost codes endpoint which includes jobsite relationships
      const codes = await apiRequest("/api/v1/cost-codes", "GET");

      // Filter cost codes that are linked to the selected jobsite
      const filteredCodes = codes.filter(
        (c: {
          id: string;
          name: string;
          CCTags?: { Jobsites?: { id: string }[] }[];
        }) => {
          // Check if any of the CCTags have the selected jobsite
          return c.CCTags?.some((tag: { Jobsites?: { id: string }[] }) =>
            tag.Jobsites?.some((js: { id: string }) => js.id === jobsiteId)
          );
        }
      );

      return filteredCodes.map((c: { id: string; name: string }) => ({
        value: c.id,
        label: c.name,
      }));
    } catch (e) {
      console.error("Error fetching cost codes:", e);
      return [];
    }
  }, []);

  // Cache to store cost codes by jobsite ID
  const [costCodeCache, setCostCodeCache] = useState<
    Record<
      string,
      {
        data: { value: string; label: string }[];
        timestamp: number;
      }
    >
  >({});

  // Fetch cost codes when jobsite changes with caching
  useEffect(() => {
    const jobsiteId = form.jobsite.id;

    // Reset costcode when jobsite is empty
    if (!jobsiteId) {
      setCostCode([]);
      setForm((prev) => ({ ...prev, costcode: { id: "", name: "" } }));
      return;
    }

    // Check if we have a recent cache (less than 5 minutes old)
    const cachedData = costCodeCache[jobsiteId];
    const cacheIsValid =
      cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000; // 5 minutes

    if (cacheIsValid) {
      // Use cached data
      setCostCode(cachedData.data);

      // Reset costcode if not in the list
      if (!cachedData.data.find((c) => c.value === form.costcode.id)) {
        setForm((prev) => ({
          ...prev,
          costcode: { id: "", name: "" },
        }));
      }
      return;
    }

    // Fetch fresh data
    async function loadCostCodes() {
      const options = await fetchCostCodes(jobsiteId);

      // Update the cache
      setCostCodeCache((prev) => ({
        ...prev,
        [jobsiteId]: {
          data: options,
          timestamp: Date.now(),
        },
      }));

      setCostCode(options);

      // Reset costcode if not in the list
      if (
        !options.find(
          (c: { value: string; label: string }) => c.value === form.costcode.id
        )
      ) {
        setForm((prev) => ({
          ...prev,
          costcode: { id: "", name: "" },
        }));
      }
    }

    loadCostCodes();
  }, [form.jobsite.id, fetchCostCodes, form.costcode.id, costCodeCache]);

  // Memoized material types fetch
  const [materialTypesCache, setMaterialTypesCache] = useState<{
    data: { id: string; name: string }[];
    timestamp: number;
  } | null>(null);

  const fetchMaterialTypes = useCallback(async () => {
    try {
      // Check if we have a recent cache (less than 5 minutes old)
      if (
        materialTypesCache &&
        Date.now() - materialTypesCache.timestamp < 5 * 60 * 1000 &&
        materialTypesCache.data.length > 0
      ) {
        setMaterialTypes(materialTypesCache.data);
        return;
      }

      const data = await apiRequest(
        "/api/v1/admins/timesheet/tasco-material-types",
        "GET"
      );

      // Handle different response structures - API returns {materialTypes: [...], total: X}
      let materialTypesData = [];
      if (data?.materialTypes && Array.isArray(data.materialTypes)) {
        materialTypesData = data.materialTypes;
      } else if (Array.isArray(data)) {
        materialTypesData = data;
      }

      // Update cache
      setMaterialTypesCache({
        data: materialTypesData,
        timestamp: Date.now(),
      });

      setMaterialTypes(materialTypesData);
    } catch (error) {
      console.error("❌ Error fetching material types:", error);
      setMaterialTypes([]);
    }
  }, [materialTypesCache]);

  // Memoized callbacks for useTimesheetAutoSelection to prevent infinite loops
  const handleSetJobsite = useCallback(
    (jobsite: { id: string; name: string }) => {
      setForm((prev) => ({ ...prev, jobsite }));
    },
    []
  );

  const handleSetCostCode = useCallback(
    (
      costcode: { id: string; name: string } | { value: string; label: string }
    ) => {
      if ("value" in costcode && "label" in costcode) {
        setForm((prev) => ({
          ...prev,
          costcode: { id: costcode.value, name: costcode.label },
        }));
      } else {
        setForm((prev) => ({ ...prev, costcode }));
      }
    },
    []
  );

  const handleSetMaterial = useCallback((material: string, logIndex = 0) => {
    setTascoLogs((prev) =>
      prev.map((log, index) =>
        index === logIndex ? { ...log, materialType: material } : log
      )
    );
  }, []);

  // Auto-selection logic for TASCO shifts
  useTimesheetAutoSelection({
    workType: form.workType.toLowerCase(),
    tascoLogs: tascoLogs.map((log) => ({
      shiftType: log.shiftType,
      materialType: log.materialType,
      laborType: log.laborType || undefined,
      Equipment: log.equipment.length > 0 ? log.equipment[0] : null,
    })),
    costCodes: costCode,
    materialTypes,
    jobsites,
    setJobsite: handleSetJobsite,
    setCostCode: handleSetCostCode,
    setMaterial: handleSetMaterial,
  });

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // If the field is costcode and not using the Combobox, update as string fallback
    if (e.target.name === "costcode") {
      setForm({ ...form, costcode: { id: "", name: e.target.value } });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!form.user.id) {
      toast.error("Please select a user", { duration: 3000 });
      return;
    }
    if (!form.jobsite.id) {
      toast.error("Please select a jobsite", { duration: 3000 });
      return;
    }
    if (!form.costcode.id && !form.costcode.name) {
      toast.error("Please select a cost code", { duration: 3000 });
      return;
    }
    if (!form.workType) {
      toast.error("Please select a work type", { duration: 3000 });
      return;
    }

    setSubmitting(true);
    try {
      // Map tascoLogs to match server expectations (convert types accordingly)
      const mappedTascoLogs = tascoLogs
        .filter(
          (log) =>
            log.equipment.length > 0 &&
            log.equipment[0].id &&
            log.shiftType &&
            log.laborType
        )
        .map((log) => {
          // For F-shift, calculate LoadQuantity from TascoFLoads array
          const loadQuantity =
            log.shiftType === "F Shift"
              ? (log.TascoFLoads?.length || 0).toString()
              : log.loadQuantity;

          return {
            shiftType: log.shiftType,
            laborType: log.laborType,
            materialType: log.materialType,
            LoadQuantity: loadQuantity, // Service expects LoadQuantity (capital L)
            equipmentId: log.equipment[0].id, // Service expects equipmentId, not equipment array
            refuelLogs: log.refuelLogs.map((refuel) => ({
              gallonsRefueled: refuel.gallonsRefueled,
              milesAtFueling: 0, // Default value if not tracked
            })),
            // Include TascoFLoads for F-shift
            TascoFLoads:
              log.shiftType === "F Shift" && log.TascoFLoads
                ? log.TascoFLoads.map((fLoad) => ({
                    weight: parseFloat(fLoad.weight) || null,
                    screenType: fLoad.screenType || null,
                  }))
                : undefined,
          };
        });

      // Map trucking logs to convert loadType to lowercase for API compatibility
      const mappedTruckingLogs = truckingLogs
        .filter((log) => log.truckNumber && log.equipmentId) // Both should have the same value (truck equipment ID)
        .map((log) => ({
          equipmentId: log.equipmentId,
          truckNumber: log.truckNumber,
          startingMileage: log.startingMileage,
          endingMileage: log.endingMileage,
          equipmentHauled: log.equipmentHauled.map((eq) => ({
            equipmentId: eq.equipment.id, // Service expects equipmentId, not equipment object
            source: eq.source || "",
            destination: eq.destination || "",
            startMileage: eq.startMileage,
            endMileage: eq.endMileage,
          })),
          materials: log.materials.map((mat) => {
            // Define the converted loadType
            let convertedLoadType: "" | "screened" | "unscreened" = "";
            if (mat.loadType === "SCREENED") convertedLoadType = "screened";
            else if (mat.loadType === "UNSCREENED")
              convertedLoadType = "unscreened";

            return {
              location: mat.location,
              name: mat.name,
              quantity: mat.quantity,
              unit: mat.unit as string, // Cast to string
              loadType: convertedLoadType,
            };
          }),
          refuelLogs: log.refuelLogs.map((refuel) => ({
            gallonsRefueled: refuel.gallonsRefueled,
            milesAtFueling: refuel.milesAtFueling,
          })),
          stateMileages: log.stateMileages.map((state) => ({
            state: state.state,
            stateLineMileage: state.stateLineMileage,
          })),
        }));

      // Format mechanic projects for API
      const mappedMechanicProjects = mechanicProjects
        .filter(
          (project) =>
            project.equipmentId &&
            project.hours !== null &&
            project.hours !== undefined
        )
        .map((project) => ({
          id: project.id,
          equipmentId: project.equipmentId,
          hours: project.hours as number, // Safe cast because of filter
          description: project.description || "",
        }));

      // Set date to the beginning of the day based on startTime
      let timesheetDate = form.date;
      if (form.startTime) {
        timesheetDate = new Date(form.startTime);
        timesheetDate.setHours(0, 0, 0, 0);
      }

      const data = {
        date: timesheetDate.toISOString(),
        userId: form.user.id,
        jobsiteId: form.jobsite.id,
        costcode: form.costcode.name, // Use name (the actual cost code) not id (UUID)
        startTime: form.startTime ? form.startTime.toISOString() : null,
        endTime: form.endTime ? form.endTime.toISOString() : null,
        workType: form.workType,
        comments: form.comments,
        mechanicProjects: mappedMechanicProjects,
        truckingLogs: mappedTruckingLogs,
        tascoLogs: mappedTascoLogs,
        employeeEquipmentLogs: laborLogs
          .filter((log) => log.equipment.id && log.startTime && log.endTime)
          .map((log) => {
            // Convert time strings (HH:MM) to full datetime ISO strings using the timesheet date
            const timesheetDate = form.date;

            // Parse startTime (HH:MM format)
            const [startHours, startMinutes] = log.startTime
              .split(":")
              .map(Number);
            const startDateTime = new Date(timesheetDate);
            startDateTime.setHours(startHours, startMinutes, 0, 0);

            // Parse endTime (HH:MM format)
            const [endHours, endMinutes] = log.endTime.split(":").map(Number);
            const endDateTime = new Date(timesheetDate);
            endDateTime.setHours(endHours, endMinutes, 0, 0);

            return {
              equipmentId: log.equipment.id,
              startTime: startDateTime.toISOString(),
              endTime: endDateTime.toISOString(),
            };
          }),
      };

      const result = await createTimesheetAdmin(data);
      if (result.success) {
        toast.success("Timesheet created successfully!", {
          duration: 3000,
        });
        onCreated(); // Notify parent to refetch
        onClose();
      } else {
        throw new Error(result.error || "Failed to create timesheet");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create timesheet.", { duration: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  // Mechanic projects are now managed directly in the MechanicProject component

  // Fetch material types and equipment based on work type
  useEffect(() => {
    if (form.workType === "TASCO") {
      fetchMaterialTypes(); // Optionally re-fetch equipment if needed
      if (!equipment || equipment.length === 0) {
        apiRequest("/api/v1/admins/equipment", "GET")
          .then((data) => {
            let equipmentData = [];
            if (data?.equipment && Array.isArray(data.equipment)) {
              equipmentData = data.equipment;
            } else if (
              data?.equipmentSummary &&
              Array.isArray(data.equipmentSummary)
            ) {
              equipmentData = data.equipmentSummary;
            } else if (Array.isArray(data)) {
              equipmentData = data;
            }
            setEquipment(equipmentData);
          })
          .catch((error) => {
            console.error("❌ Error re-fetching equipment:", error);
          });
      }
    }

    // Make sure equipment data is loaded for Mechanic work type
    if (form.workType === "MECHANIC") {
      // Always ensure we have equipment data for mechanic projects
      if (!equipment || equipment.length === 0) {
        apiRequest("/api/v1/admins/equipment", "GET")
          .then((data) => {
            let equipmentData = [];
            if (data?.equipment && Array.isArray(data.equipment)) {
              equipmentData = data.equipment;
            } else if (
              data?.equipmentSummary &&
              Array.isArray(data.equipmentSummary)
            ) {
              equipmentData = data.equipmentSummary;
            } else if (Array.isArray(data)) {
              equipmentData = data;
            }
            setEquipment(equipmentData);
          })
          .catch((error) => {
            console.error("❌ Error fetching equipment:", error);
          });
      }
    }

    // Make sure trucks are available for TRUCK_DRIVER work type (trucks are tagged as VEHICLE)
    if (form.workType === "TRUCK_DRIVER") {
      // If we have equipment but no trucks, re-filter
      if (
        equipment &&
        equipment.length > 0 &&
        (!trucks || trucks.length === 0)
      ) {
        const filteredTrucks = equipment.filter(
          (e) => e.equipmentTag === "VEHICLE"
        );
        setTrucks(filteredTrucks);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.workType]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-40">
        <div className="bg-white rounded-lg shadow-lg w-[600px] h-[80vh]  px-6 py-4 flex flex-col items-center">
          <div className="w-full flex flex-col border-b border-gray-100 pb-3 relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-0 right-0 cursor-pointer"
            >
              <X width={20} height={20} />
            </Button>
            <div className="gap-2 flex flex-col">
              <h2 className="text-xl font-bold">Create New Timesheet</h2>
              <p className="text-xs text-gray-600">
                Use the form below to enter and submit a new timesheet on behalf
                of an employee.
                <br /> Ensure all required fields are accurate.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 flex-1 w-full p-2 pb-10 overflow-y-auto no-scrollbar">
            <div className=" w-full h-full flex flex-col justify-center animate-pulse">
              <Spinner size={30} />
            </div>
          </div>
          <div className="w-full flex flex-col justify-end gap-3 pt-4 border-t border-gray-100">
            <div className="flex flex-row justify-end gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="timesheet-form" /* Connect this button to the form */
                className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded"
                disabled={submitting}
              >
                Create & Approve
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-40">
      <div className="bg-white rounded-lg shadow-lg w-[600px] h-[80vh]  px-6 py-4 flex flex-col items-center">
        <div className="w-full flex flex-col border-b border-gray-100 pb-3 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-0 right-0 cursor-pointer"
          >
            <X width={20} height={20} />
          </Button>
          <div className="gap-2 flex flex-col">
            <h2 className="text-xl font-bold">Create New Timesheet</h2>
            <p className="text-xs text-gray-600">
              Use the form below to enter and submit a new timesheet on behalf
              of an employee.
              <br /> Ensure all required fields are accurates.
            </p>
          </div>
        </div>
        <div className="flex-1 w-full overflow-y-auto no-scrollbar">
          <form
            id="timesheet-form"
            onSubmit={handleSubmit}
            className="h-full flex flex-col gap-4 px-2 pt-2 pb-10 overflow-y-auto no-scrollbar"
          >
            <GeneralSection
              form={form}
              setForm={setForm}
              handleChange={handleChange}
              userOptions={userOptions}
              jobsiteOptions={jobsiteOptions}
              costCodeOptions={costCodeOptions}
              workTypeOptions={workTypeOptions}
              users={users}
              jobsites={jobsites}
            />

            {/* Conditional log sections */}
            {form.workType === "MECHANIC" && (
              <MechanicProject
                mechanicProjects={mechanicProjects}
                setMechanicProjects={setMechanicProjects}
                equipmentOptions={equipmentOptions}
              />
            )}
            {form.workType === "TRUCK_DRIVER" && (
              <div className="flex flex-col">
                <div className="flex flex-col border-b border-gray-200 pb-2">
                  <h3 className="block font-semibold text-base">
                    Trucking Logs
                  </h3>
                  <p className="text-xs text-gray-500 pt-1">
                    Enter in accurate trucking logs for precise tracking.
                  </p>
                </div>

                <TruckingSection
                  truckingLogs={truckingLogs}
                  setTruckingLogs={setTruckingLogs}
                  equipmentOptions={equipmentOptions}
                  jobsiteOptions={jobsiteOptions}
                  truckOptions={truckOptions}
                />
              </div>
            )}
            {form.workType === "TASCO" && (
              <TascoSection
                tascoLogs={tascoLogs}
                setTascoLogs={setTascoLogs}
                materialTypes={materialTypes}
                equipmentOptions={equipmentOptions}
              />
            )}
            {form.workType === "LABOR" && (
              <LaborSection
                laborLogs={laborLogs}
                setLaborLogs={setLaborLogs}
                equipmentOptions={equipmentOptions}
              />
            )}
          </form>
        </div>

        <div className="w-full flex flex-col justify-end gap-3 pt-4 border-t border-gray-100">
          <div className="flex flex-row justify-end gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              className="bg-gray-200 hover:bg-gray-300 hover:text-gray-800 text-gray-800 px-4 py-2 rounded"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="timesheet-form" /* Connect this button to the form */
              className="bg-sky-500 hover:bg-sky-400 text-white hover:text-white px-4 py-2 rounded"
              disabled={
                submitting ||
                !form.user.id ||
                !form.jobsite.id ||
                (!form.costcode.id && !form.costcode.name) ||
                !form.workType
              }
            >
              Create & Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
