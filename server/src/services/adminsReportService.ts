import prisma from "../lib/prisma.js";

export async function getTruckingReport() {
  const overWeightReport = await prisma.truckingLog.findMany({
    where: {
      endingMileage: { not: null },
    },
    select: {
      id: true,
      startingMileage: true,
      endingMileage: true,
      Truck: {
        select: {
          id: true,
          name: true,
        },
      },
      Trailer: {
        select: {
          id: true,
          name: true,
        },
      },
      TimeSheet: {
        select: {
          User: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          date: true,
          comment: true,
          Jobsite: {
            select: { name: true },
          },
        },
      },
      EquipmentHauled: {
        select: {
          truckingLogId: true,
          Equipment: { select: { name: true, id: true } },
          source: true,
          destination: true,
          startMileage: true,
          endMileage: true,
        },
      },
      Materials: {
        select: {
          truckingLogId: true,
          name: true,
          LocationOfMaterial: true,
          quantity: true,
          unit: true,
        },
      },
      RefuelLogs: {
        select: {
          truckingLogId: true,
          milesAtFueling: true,
          gallonsRefueled: true,
        },
      },
      StateMileages: {
        select: {
          truckingLogId: true,
          state: true,
          stateLineMileage: true,
        },
      },
    },
  });

  const formattedReport = overWeightReport.map((log) => ({
    id: log.id,
    driver: `${log.TimeSheet?.User?.firstName} ${log.TimeSheet?.User?.lastName}`,
    truckId: log.Truck?.id ?? null,
    truckName: log.Truck?.name ?? null,
    trailerId: log.Trailer?.id ?? null,
    trailerName: log.Trailer?.name ?? null,
    date: log.TimeSheet?.date ?? null,
    jobId: log.TimeSheet?.Jobsite?.name ?? null,
    Equipment: log.EquipmentHauled.map((equipment) => ({
      name: equipment.Equipment?.name || "",
      id: equipment.Equipment?.id || null,
      source: equipment.source,
      destination: equipment.destination,
      startMileage: equipment.startMileage,
      endMileage: equipment.endMileage,
    })),
    Materials: log.Materials.map((material) => ({
      id: material.truckingLogId,
      name: material.name,
      location: material.LocationOfMaterial,
      quantity: material.quantity,
      unit: material.unit,
    })),
    StartingMileage: log.startingMileage,
    Fuel: log.RefuelLogs.map((fuel) => ({
      id: fuel.truckingLogId,
      milesAtFueling: fuel.milesAtFueling,
      gallonsRefueled: fuel.gallonsRefueled,
    })),
    StateMileages: log.StateMileages.map((state) => ({
      id: state.truckingLogId,
      state: state.state,
      stateLineMileage: state.stateLineMileage,
    })),
    EndingMileage: log.endingMileage,
    notes: log.TimeSheet?.comment ?? null,
  }));

  return formattedReport;
}
// Define a type for the Tasco report row
type TascoReportRow = {
  id: string;
  shiftType: string;
  submittedDate: Date;
  employee: string;
  employeeId: string;
  dateWorked: Date;
  laborType: string | null;
  equipment: string;
  equipmentId: string;
  profitId: string; // Jobsite name
  jobsiteId: string;
  loadsABCDE: number | null;
  loadsF: number | null;
  materials: string;
  startTime: Date;
  endTime: Date | null;
  LoadType: "SCREENED" | "UNSCREENED";
};

export async function getTascoReport(filters?: {
  jobsiteIds?: string[];
  shiftTypes?: string[];
  employeeIds?: string[];
  laborTypes?: string[];
  equipmentIds?: string[];
  materialTypes?: string[];
}): Promise<TascoReportRow[]> {
  // Build where clause based on filters
  const whereClause: any = {};

  if (filters?.employeeIds && filters.employeeIds.length > 0) {
    whereClause.userId = { in: filters.employeeIds };
  }

  if (filters?.jobsiteIds && filters.jobsiteIds.length > 0) {
    whereClause.jobsiteId = { in: filters.jobsiteIds };
  }

  const tascoLogsWhere: any = {};

  if (filters?.shiftTypes && filters.shiftTypes.length > 0) {
    tascoLogsWhere.shiftType = { in: filters.shiftTypes };
  }

  if (filters?.laborTypes && filters.laborTypes.length > 0) {
    tascoLogsWhere.laborType = { in: filters.laborTypes };
  }

  if (filters?.equipmentIds && filters.equipmentIds.length > 0) {
    tascoLogsWhere.equipmentId = { in: filters.equipmentIds };
  }

  if (filters?.materialTypes && filters.materialTypes.length > 0) {
    tascoLogsWhere.materialType = { in: filters.materialTypes };
  }

  const report = await prisma.timeSheet.findMany({
    where: {
      ...whereClause,
      TascoLogs: {
        some: tascoLogsWhere,
      },
    },
    select: {
      date: true,
      startTime: true,
      endTime: true,
      userId: true,
      jobsiteId: true,
      User: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      Jobsite: {
        select: {
          id: true,
          name: true,
        },
      },
      TascoLogs: {
        where: Object.keys(tascoLogsWhere).length > 0 ? tascoLogsWhere : undefined,
        select: {
          id: true,
          shiftType: true,
          laborType: true,
          equipmentId: true,
          Equipment: {
            select: {
              id: true,
              name: true,
            },
          },
          screenType: true,
          LoadQuantity: true,
          materialType: true,
        },
      },
    },
  });

  // Filter out timesheets with empty TascoLogs arrays
  const filteredReport = report.filter(
    (item) => Array.isArray(item.TascoLogs) && item.TascoLogs.length > 0
  );

  const tascoReport: TascoReportRow[] = filteredReport
    .filter((log) => Array.isArray(log.TascoLogs) && log.TascoLogs.length > 0)
    .map((log) => {
      const firstLog = log.TascoLogs[0];
      if (!firstLog) {
        // Should not happen due to filter, but for type safety
        throw new Error("TascoLog entry missing for timesheet");
      }
      const shiftType = firstLog.shiftType;
      const laborType = firstLog.laborType ?? null;
      const loadQuantity = firstLog.LoadQuantity ?? 0;
      const loadsABCDE =
        shiftType === "ABCD Shift" || shiftType === "E Shift"
          ? loadQuantity
          : null;
      const loadsF = shiftType === "F Shift" ? loadQuantity : null;
      let loadType: "SCREENED" | "UNSCREENED" = "UNSCREENED";
      if (firstLog.screenType === "SCREENED") loadType = "SCREENED";

      return {
        id: firstLog.id,
        shiftType: shiftType,
        submittedDate: log.date,
        employee: `${log.User.firstName} ${log.User.lastName}`,
        employeeId: log.User.id,
        dateWorked: log.date,
        laborType: laborType,
        equipment: firstLog.Equipment?.name ?? "",
        equipmentId: firstLog.equipmentId ?? "",
        profitId: log.Jobsite?.name ?? "",
        jobsiteId: log.jobsiteId ?? "",
        loadsABCDE: loadsABCDE,
        loadsF: loadsF,
        materials: firstLog.materialType ?? "",
        startTime: log.startTime,
        endTime: log.endTime ?? null,
        LoadType: loadType,
      };
    });

  return tascoReport;
}

export async function getMechanicReport() {
  const report = await prisma.timeSheet.findMany({
    select: {
      date: true,
      User: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      Maintenance: {
        select: {
          id: true,
          hours: true,
          description: true,
          Equipment: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Filter out timesheets with empty Maintenance arrays
  const filteredReport = report.filter(
    (item) => Array.isArray(item.Maintenance) && item.Maintenance.length > 0
  );

  // Flatten the data to have one row per mechanic project
  const mechanicReport = filteredReport.flatMap((timesheet) =>
    timesheet.Maintenance.map((project) => ({
      id: project.id,
      employeeName: `${timesheet.User.firstName} ${timesheet.User.lastName}`,
      equipmentWorkedOn: project.Equipment?.name ?? "Unknown Equipment",
      hours: project.hours ?? 0,
      comments: project.description ?? "",
      dateWorked: timesheet.date,
    }))
  );

  return mechanicReport;
}

export async function getTascoFilterOptions() {
  // Fetch employees who have TascoLogs
  const employees = await prisma.user.findMany({
    where: {
      TimeSheets: {
        some: {
          TascoLogs: {
            some: {},
          },
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  // Fetch distinct material types from TascoLogs
  const materialTypesRaw = await prisma.tascoLog.findMany({
    where: {
      materialType: { not: null },
    },
    select: {
      materialType: true,
    },
    distinct: ["materialType"],
  });

  const materialTypes = materialTypesRaw
    .filter((item) => item.materialType !== null)
    .map((item) => ({ name: item.materialType as string }));

  return {
    employees: employees.map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
    })),
    materialTypes,
  };
}
