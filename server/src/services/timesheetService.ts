import { formatISO } from "date-fns";
import type { EquipmentState, Prisma } from "../../generated/prisma/index.js";
import type {
  GeneralTimesheetInput,
  MechanicTimesheetInput,
  TascoTimesheetInput,
  TruckTimesheetInput,
} from "../controllers/timesheetController.js";
import prisma from "../lib/prisma.js";

export async function updateTimesheetService({
  id,
  editorId,
  changes,
  changeReason,
  numberOfChanges,
  startTime,
  endTime,
  Jobsite,
  CostCode,
  comment,
}: {
  id: number;
  editorId: string;
  changes: string;
  changeReason?: string;
  numberOfChanges?: number;
  startTime: string;
  endTime?: string;
  Jobsite?: string;
  CostCode?: string;
  comment?: string;
}) {
  try {
    const parsedChanges =
      changes && typeof changes === "string"
        ? JSON.parse(changes)
        : changes || {};
    const transactionResult = await prisma.$transaction(async (tx) => {
      let editorLog = null;
      let userFullname = null;
      let editorFullName = null;

      if (parsedChanges && Object.keys(parsedChanges).length > 0) {
        editorLog = await tx.timeSheetChangeLog.create({
          data: {
            timeSheetId: id,
            changedBy: editorId,
            changes: parsedChanges,
            changeReason: changeReason || "No reason provided",
            numberOfChanges: numberOfChanges || 0,
          },
          include: {
            User: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        });
      }
      editorFullName = editorLog
        ? `${editorLog.User.firstName} ${editorLog.User.lastName}`
        : "Unknown Editor";

      // Build update data object dynamically to only update provided fields
      const updateData: Prisma.TimeSheetUpdateInput = {};
      if (typeof startTime !== "undefined") {
        updateData.startTime = startTime;
      }
      if (typeof endTime !== "undefined") {
        updateData.endTime = endTime ? new Date(endTime) : null;
      }
      if (typeof Jobsite !== "undefined" && Jobsite) {
        updateData.Jobsite = { connect: { id: Jobsite } }; // or { id: Jobsite } if you use IDs
      }
      if (typeof CostCode !== "undefined" && CostCode) {
        updateData.CostCode = { connect: { name: CostCode } }; // or { id: CostCode } if you use IDs
      }
      if (typeof comment !== "undefined") {
        updateData.comment = comment;
      }
      const updated = await tx.timeSheet.update({
        where: { id },
        data: updateData,
        include: {
          Jobsite: true,
          CostCode: true,
          ChangeLogs: true,
          User: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      userFullname = updated
        ? `${updated.User.firstName} ${updated.User.lastName}`
        : "Unknown User";

      return { updated, editorLog, userFullname, editorFullName };
    });

    return {
      success: true,
      timesheet: transactionResult.updated,
      editorLog: transactionResult.editorLog,
      userFullname: transactionResult.userFullname,
      editorFullName: transactionResult.editorFullName,
    };
  } catch (error) {
    let message = "Failed to update timesheet.";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}

/**
 * Helper function to get start and end of day in local timezone
 * Converts a date string (YYYY-MM-DD) to the start and end times of that day
 * @param dateString - Date string in format YYYY-MM-DD
 * @returns Object with startOfDay and endOfDay as Date objects
 */
function getDayRangeFromString(dateString: string): {
  startOfDay: Date;
  endOfDay: Date;
} {
  // Parse the date string in local timezone
  const parts = dateString.split("-");
  const year = parseInt(parts[0]!, 10);
  const month = parseInt(parts[1]!, 10) - 1; // JavaScript months are 0-indexed
  const day = parseInt(parts[2]!, 10);

  const startOfDay = new Date(year, month, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

  return { startOfDay, endOfDay };
}

export async function getUserTimesheetsByDate({
  employeeId,
  dateParam,
}: {
  employeeId: string;
  dateParam?: string | undefined;
}) {
  let start: Date | undefined = undefined;
  let end: Date | undefined = undefined;
  if (dateParam) {
    const { startOfDay, endOfDay } = getDayRangeFromString(dateParam);
    start = startOfDay;
    end = endOfDay;
  }

  // Only include date filter if both start and end are defined
  const where: Prisma.TimeSheetWhereInput = {
    userId: employeeId,
    status: {
      not: "DRAFT",
    },
    ...(start && end ? { date: { gte: start, lte: end } } : {}),
  };

  const timesheetData = await prisma.timeSheet.findMany({
    where,
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      workType: true,
      Jobsite: {
        select: {
          name: true,
        },
      },
      CostCode: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });
  return timesheetData;
}

export async function getTimesheetDetailsManager({
  timesheetId,
}: {
  timesheetId: number;
}) {
  const timesheet = await prisma.timeSheet.findUnique({
    where: { id: timesheetId },
    select: {
      id: true,
      comment: true,
      startTime: true,
      endTime: true,
      Jobsite: {
        select: {
          id: true,
          name: true,
        },
      },
      CostCode: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return timesheet;
}

// Get all timesheets for all users in a manager's crew
export async function getManagerCrewTimesheets({
  managerId,
}: {
  managerId: string;
}) {
  // Find all users in crews led by this manager
  const crew = await prisma.user.findMany({
    where: {
      Crews: {
        some: {
          leadId: managerId,
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      clockedIn: true,
      Crews: {
        select: {
          id: true,
          leadId: true,
        },
      },

      TimeSheets: {
        where: {
          status: "PENDING",
          endTime: { not: null },
        },
        select: {
          id: true,
          date: true,
          startTime: true,
          endTime: true,
          jobsiteId: true,
          workType: true,
          Jobsite: {
            select: {
              name: true,
            },
          },
          CostCode: {
            select: {
              name: true,
            },
          },
          TascoLogs: {
            select: {
              id: true,
              shiftType: true,
              laborType: true,
              materialType: true,
              LoadQuantity: true,
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              RefuelLogs: {
                select: {
                  id: true,
                  gallonsRefueled: true,
                  TascoLog: {
                    select: {
                      Equipment: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          TruckingLogs: {
            select: {
              id: true,
              laborType: true,
              Truck: {
                select: { id: true, name: true },
              },
              Trailer: {
                select: { id: true, name: true },
              },
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              startingMileage: true,
              endingMileage: true,
              Materials: {
                select: {
                  id: true,
                  name: true,
                  quantity: true,
                  loadType: true,
                  unit: true,
                  LocationOfMaterial: true,
                  materialWeight: true,
                },
              },
              EquipmentHauled: {
                select: {
                  id: true,
                  source: true,
                  destination: true,
                  Equipment: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              RefuelLogs: {
                select: {
                  id: true,
                  gallonsRefueled: true,
                  milesAtFueling: true,
                  TruckingLog: {
                    select: {
                      Equipment: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
              StateMileages: {
                select: {
                  id: true,
                  state: true,
                  stateLineMileage: true,
                  TruckingLog: {
                    select: {
                      Equipment: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          EmployeeEquipmentLogs: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              Equipment: {
                select: {
                  id: true,
                  name: true,
                },
              },
              RefuelLog: {
                select: {
                  id: true,
                  gallonsRefueled: true,
                },
              },
            },
          },
          status: true,
        },
      },
    },
  });
  return crew;
}
// Batch approve timesheets and handle notifications
export async function approveTimesheetsBatchService({
  userId,
  timesheetIds,
  statusComment,
  editorId,
}: {
  userId: string;
  timesheetIds: number[];
  statusComment: string;
  editorId: string;
}) {
  try {
    // Update all matching timesheets with the same values
    await prisma.timeSheet.updateMany({
      where: {
        id: { in: timesheetIds },
        userId,
      },
      data: {
        status: "APPROVED",
        statusComment,
      },
    });

    // check for notifications
    const notifications = await prisma.notification.findMany({
      where: {
        topic: "timecard-submission",
        referenceId: { in: timesheetIds.map(String) },
        Response: { is: null },
      },
    });

    if (notifications.length > 0) {
      // Filter out notifications that already have a notificationRead for this user
      const existingReads = await prisma.notificationRead.findMany({
        where: {
          notificationId: { in: notifications.map((n) => n.id) },
          userId: editorId,
        },
        select: { notificationId: true },
      });
      const alreadyReadIds = new Set(
        existingReads.map((r) => r.notificationId)
      );
      const unreadNotifications = notifications.filter(
        (n) => !alreadyReadIds.has(n.id)
      );
      await prisma.$transaction(async (tx) => {
        if (unreadNotifications.length > 0) {
          await tx.notificationRead.createMany({
            data: unreadNotifications.map((n) => ({
              notificationId: n.id,
              userId: editorId,
              readAt: new Date(),
            })),
            skipDuplicates: true,
          });
        }
        await tx.notificationResponse.createMany({
          data: notifications.map((n) => ({
            notificationId: n.id,
            userId: editorId,
            response: "Approved",
            respondedAt: new Date(),
          })),
          skipDuplicates: true,
        });
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating timesheets:", error);
    return { success: false, error: "Failed to update timesheets" };
  }
}

export async function createGeneralTimesheetService({
  data,
  type,
}: {
  data: GeneralTimesheetInput;
  type?: string;
}) {
  const createdTimeSheet = await prisma.$transaction(async (prisma) => {
    // Build create data
    const createData: any = {
      date: data.date,
      Jobsite: { connect: { id: data.jobsiteId } },
      User: { connect: { id: data.userId } },
      CostCode: { connect: { name: data.costCode } },
      startTime: data.startTime,
      workType: "LABOR",
      status: "DRAFT",
      clockInLat: data.clockInLat || null,
      clockInLng: data.clockInLong || null,
    };

    if (data.sessionId !== null && data.sessionId !== undefined) {
      createData.Session = {
        connect: {
          id: data.sessionId,
        },
      };
    }

    // Step 1: Create a new TimeSheet
    const createdTimeSheet = await prisma.timeSheet.create({
      data: createData,
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update user status if timesheet created successfully
    if (createdTimeSheet) {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          clockedIn: true,
        },
      });
    }
    if (type === "switchJobs" && data.previousTimeSheetId && data.endTime) {
      await prisma.timeSheet.update({
        where: { id: data.previousTimeSheetId },
        data: {
          endTime: formatISO(data.endTime),
          comment: data.previoustimeSheetComments || null,
          status: "PENDING",
          clockOutLat: data.clockOutLat || null,
          clockOutLng: data.clockOutLong || null,
        },
      });
    }
    return createdTimeSheet;
  });
  return createdTimeSheet;
}

export async function createMechanicTimesheetService({
  data,
  type,
}: {
  data: MechanicTimesheetInput;
  type?: string;
}) {
  // Implementation for creating a mechanic timesheet
  const createdTimeCard = await prisma.$transaction(async (prisma) => {
    // Build create data
    const createData: any = {
      date: formatISO(data.date),
      Jobsite: { connect: { id: data.jobsiteId } },
      User: { connect: { id: data.userId } },
      CostCode: { connect: { name: data.costCode } },
      startTime: formatISO(data.startTime),
      workType: "MECHANIC",
      status: "DRAFT",
      clockInLat: data.clockInLat || null,
      clockInLng: data.clockInLong || null,
    };

    if (data.sessionId !== null && data.sessionId !== undefined) {
      createData.Session = {
        connect: {
          id: data.sessionId,
        },
      };
    }

    // Step 1: Create a new TimeSheet
    const createdTimeSheet = await prisma.timeSheet.create({
      data: createData,
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (createdTimeSheet) {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          clockedIn: true,
        },
      });
    }
    if (type === "switchJobs" && data.previousTimeSheetId && data.endTime) {
      await prisma.timeSheet.update({
        where: { id: data.previousTimeSheetId },
        data: {
          endTime: formatISO(data.endTime),
          comment: data.previoustimeSheetComments || null,
          status: "PENDING",
          clockOutLat: data.clockOutLat || null,
          clockOutLng: data.clockOutLong || null,
        },
      });
    }
    return createdTimeSheet;
  });

  return createdTimeCard;
}

export async function createTruckDriverTimesheetService({
  data,
  type,
}: {
  data: TruckTimesheetInput;
  type?: string;
}) {
  // Implementation for creating a truck driver timesheet
  return await prisma.$transaction(async (prisma) => {
    // Build create data
    const createData: any = {
      date: formatISO(data.date),
      Jobsite: { connect: { id: data.jobsiteId } },
      User: { connect: { id: data.userId } },
      CostCode: { connect: { name: data.costCode } },
      startTime: formatISO(data.startTime),
      workType: "TRUCK_DRIVER",
      status: "DRAFT",
      clockInLat: data.clockInLat || null,
      clockInLng: data.clockInLong || null,
      TruckingLogs: {
        create: {
          laborType: data.laborType,
          truckNumber: data.truck,
          equipmentId: data.equipmentId || null,
          startingMileage: data.startingMileage,
          trailerNumber: null,
        },
      },
    };

    if (data.sessionId !== null && data.sessionId !== undefined) {
      createData.Session = {
        connect: {
          id: data.sessionId,
        },
      };
    }

    // Step 1: Create a new TimeSheet
    const createdTimeSheet = await prisma.timeSheet.create({
      data: createData,
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (createdTimeSheet) {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          clockedIn: true,
        },
      });
    }
    if (type === "switchJobs" && data.previousTimeSheetId && data.endTime) {
      await prisma.timeSheet.update({
        where: { id: data.previousTimeSheetId },
        data: {
          endTime: formatISO(data.endTime),
          comment: data.previoustimeSheetComments || null,
          status: "PENDING",
          clockOutLat: data.clockOutLat || null,
          clockOutLng: data.clockOutLong || null,
        },
      });
    }
    return createdTimeSheet;
  });
}

export async function createTascoTimesheetService({
  data,
  type,
}: {
  data: TascoTimesheetInput;
  type?: string;
}) {
  // Implementation for creating a tasco timesheet
  // Only DB operations in transaction
  return await prisma.$transaction(async (prisma) => {
    // Build create data
    const createData: any = {
      date: formatISO(data.date),
      Jobsite: { connect: { id: data.jobsiteId } },
      User: { connect: { id: data.userId } },
      CostCode: { connect: { name: data.costCode } },
      startTime: formatISO(data.startTime),
      workType: "TASCO",
      status: "DRAFT",
      clockInLat: data.clockInLat || null,
      clockInLng: data.clockInLong || null,
      TascoLogs: {
        create: {
          shiftType: data.shiftType ?? "",
          laborType: data.laborType ?? "",
          ...(data.equipmentId && {
            Equipment: { connect: { id: data.equipmentId } },
          }),
          ...(data.materialType && {
            TascoMaterialTypes: { connect: { name: data.materialType } },
          }),
        },
      },
    };

    if (data.sessionId !== null && data.sessionId !== undefined) {
      createData.Session = {
        connect: {
          id: data.sessionId,
        },
      };
    }

    // Step 1: Create a new TimeSheet
    const createdTimeSheet = await prisma.timeSheet.create({
      data: createData,
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (createdTimeSheet) {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          clockedIn: true,
        },
      });
    }
    if (type === "switchJobs" && data.previousTimeSheetId && data.endTime) {
      await prisma.timeSheet.update({
        where: { id: data.previousTimeSheetId },
        data: {
          endTime: formatISO(data.endTime),
          comment: data.previoustimeSheetComments || null,
          status: "PENDING",
          clockOutLat: data.clockOutLat || null,
          clockOutLng: data.clockOutLong || null,
        },
      });
    }
    return createdTimeSheet;
  });
}

export async function getRecentTimeSheetForUser(userId: string) {
  // Implementation for fetching recent timesheet for a user
  // Fetch the most recent active (unfinished) timesheet for the user
  const timesheet = await prisma.timeSheet.findFirst({
    where: {
      userId,
      endTime: null, // Ensure timesheet is still active
    },
    orderBy: {
      createdAt: "desc", // Sort by most recent submission date
    },
    select: {
      id: true,
      endTime: true,
    },
  });

  return timesheet;
}

export async function getTimesheetActiveStatus({ userId }: { userId: string }) {
  // Implementation for checking active timesheet status
  const activeTimesheet = await prisma.timeSheet.findFirst({
    where: {
      userId: userId,
      endTime: null, // No end time means still active
    },
    select: {
      id: true,
      startTime: true,
    },
  });

  const hasActiveTimesheet = activeTimesheet ? true : false;
  return {
    hasActiveTimesheet: hasActiveTimesheet,
    timesheetId: activeTimesheet?.id || null,
  };
}

export async function getBannerDataForTimesheet(
  timesheetId: number,
  userId: string
) {
  // Implementation for fetching banner data
  const jobCode = await prisma.timeSheet.findFirst({
    where: { userId, id: timesheetId },
    select: {
      id: true,
      startTime: true,
      Jobsite: {
        select: { id: true, qrId: true, name: true },
      },
      CostCode: {
        select: { id: true, name: true, code: true },
      },
    },
  });
  if (!jobCode) {
    throw new Error("No active timesheet found.");
  }
  // Parallelize queries for performance
  const [tascoLogs, truckingLogs, eqLogs] = await Promise.all([
    prisma.tascoLog.findMany({
      where: { timeSheetId: timesheetId },
      select: {
        shiftType: true,
        laborType: true,
        Equipment: { select: { qrId: true, name: true } },
      },
    }),
    prisma.truckingLog.findMany({
      where: { timeSheetId: timesheetId },
      select: {
        laborType: true,
        Truck: { select: { qrId: true, name: true } },
        Equipment: { select: { qrId: true, name: true } },
      },
    }),
    prisma.employeeEquipmentLog.findMany({
      where: { timeSheetId: timesheetId, endTime: null },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        Equipment: { select: { id: true, name: true } },
      },
    }),
  ]);

  // Format Logs
  const formattedTascoLogs = tascoLogs.map((log) => ({
    laborType: log.laborType,
    shiftType: log.shiftType,
    equipment: log.Equipment || { qrId: null, name: "Unknown" },
  }));

  const formattedTruckingLogs = truckingLogs.map((log) => ({
    laborType: log.laborType,
    equipment: log.Truck || { qrId: null, name: "Unknown" },
  }));

  const formattedEmployeeEquipmentLogs = eqLogs.map((log) => ({
    id: log.id,
    startTime: log.startTime,
    endTime: log.endTime,
    equipment: log.Equipment || { id: null, name: "Unknown" },
  }));

  return {
    id: jobCode.id,
    startTime: jobCode.startTime,
    jobsite: jobCode.Jobsite
      ? {
          id: jobCode.Jobsite.id,
          qrId: jobCode.Jobsite.qrId,
          name: jobCode.Jobsite.name,
        }
      : null,
    costCode: jobCode.CostCode
      ? {
          id: jobCode.CostCode.id,
          name: jobCode.CostCode.name,
        }
      : null,
    tascoLogs: formattedTascoLogs,
    truckingLogs: formattedTruckingLogs,
    employeeEquipmentLogs: formattedEmployeeEquipmentLogs,
  };
}

// TypeScript Types for Safety and Consistency
type EquipmentLog = {
  id: string;
  type: "equipment";
  userId: string;
  equipment: {
    id: string;
    qrId: string;
    name: string;
  } | null;
};

type MaintenanceLog = {
  id: string;
  type: "mechanic";
  maintenanceId: string;
  userId: string;
  submitted: boolean;
};

type TruckingLog = {
  id: string;
  laborType: string;
  endingMileage: number | null;
  stateMileage: boolean;
  refueled: boolean;
  material: boolean;
  equipmentHauled: boolean;
};

type TascoLog = {
  id: string;
  shiftType: string | null;
  laborType: string | null;
  loadQuantity: number | null;
  refueled: boolean;
  fLoads: boolean;
};

export async function getLogsForDashboard(userId: string) {
  const [employeeLogs, maintenanceLogs, truckingLogs, tascoLogs] =
    await Promise.all([
      prisma.employeeEquipmentLog.findMany({
        where: {
          TimeSheet: {
            userId: userId,
          },
          endTime: null,
        },
        include: {
          Equipment: {
            select: {
              id: true,
              qrId: true,
              name: true,
            },
          },
        },
      }),

      prisma.maintenanceLog.findMany({
        where: {
          userId: userId,
          endTime: null,
        },
        select: {
          id: true,
          maintenanceId: true,
        },
      }),

      prisma.truckingLog.findMany({
        where: {
          TimeSheet: {
            userId: userId,
            endTime: null,
          },
        },
        select: {
          id: true,
          endingMileage: true,
          laborType: true,
          startingMileage: true,
          StateMileages: {
            select: {
              id: true,
              state: true,
              stateLineMileage: true,
            },
          },
          RefuelLogs: {
            select: {
              id: true,
              gallonsRefueled: true,
              milesAtFueling: true,
            },
          },
          Materials: {
            select: {
              id: true,
              LocationOfMaterial: true,
              name: true,
              quantity: true,
              unit: true,
            },
          },
          EquipmentHauled: {
            select: {
              id: true,
              equipmentId: true,
            },
          },
        },
      }),

      prisma.tascoLog.findMany({
        where: {
          TimeSheet: {
            userId: userId,
            endTime: null,
          },
        },
        select: {
          id: true,
          shiftType: true,
          laborType: true,
          LoadQuantity: true,
          RefuelLogs: {
            select: {
              id: true,
              gallonsRefueled: true,
            },
          },
          TascoFLoads: {
            select: {
              id: true,
              weight: true,
              screenType: true,
            },
          },
        },
      }),
    ]);

  // Enhanced validation functions for different field types
  const validateField = {
    // Basic validation - field must not be empty/null/undefined
    required: (value: unknown): boolean => {
      return value !== null && value !== undefined && value !== "";
    },

    // Mileage validation - must exist and be >= starting mileage
    mileage: (value: unknown, startingMileage: number | null): boolean => {
      if (!validateField.required(value)) return false;
      if (startingMileage === null) return true; // Can't validate without starting mileage
      return typeof value === "number" && value >= startingMileage;
    },

    // Numeric validation - must be a positive number
    positiveNumber: (value: unknown): boolean => {
      if (!validateField.required(value)) return false;
      return typeof value === "number" && value > 0;
    },
  };

  // Validation rules for each log type
  const validateTruckingLog = (log: {
    laborType: string;
    startingMileage: number | null;
    endingMileage: number | null;
    StateMileages: Array<{
      state: string | null;
      stateLineMileage: number | null;
    }>;
    RefuelLogs: Array<{
      gallonsRefueled: number | null;
      milesAtFueling: number | null;
    }>;
    Materials: Array<{
      LocationOfMaterial: string | null;
      name: string | null;
      quantity: number | null;
      unit: string | null;
    }>;
    EquipmentHauled: Array<{
      equipmentId: string | null;
    }>;
  }) => {
    const startingMileage = log.startingMileage;

    // Calculate minimum end mileage (highest mileage from all logs)
    let maxMileage = startingMileage || 0;

    // Check state mileage logs
    log.StateMileages.forEach((stateLog) => {
      if (stateLog.stateLineMileage && stateLog.stateLineMileage > maxMileage) {
        maxMileage = stateLog.stateLineMileage;
      }
    });

    // Check refuel logs
    log.RefuelLogs.forEach((refuelLog) => {
      if (refuelLog.milesAtFueling && refuelLog.milesAtFueling > maxMileage) {
        maxMileage = refuelLog.milesAtFueling;
      }
    });

    return {
      // State mileage validation
      stateMileage: log.StateMileages.some(
        (item) =>
          !validateField.required(item.state) ||
          !validateField.mileage(item.stateLineMileage, startingMileage)
      ),

      // Refuel logs validation
      refueled: log.RefuelLogs.some(
        (item) =>
          !validateField.positiveNumber(item.gallonsRefueled) ||
          !validateField.mileage(item.milesAtFueling, startingMileage)
      ),

      // Material validation
      material: log.Materials.some(
        (item) =>
          !validateField.required(item.LocationOfMaterial) ||
          !validateField.required(item.name) ||
          !validateField.positiveNumber(item.quantity) ||
          !validateField.required(item.unit)
      ),

      // Equipment hauled validation
      equipmentHauled: log.EquipmentHauled.some(
        (item) => !validateField.required(item.equipmentId)
      ),

      // Enhanced ending mileage validation for truck drivers
      endingMileage:
        log.laborType === "truckDriver" &&
        (!validateField.required(log.endingMileage) ||
          (log.endingMileage !== null && log.endingMileage < maxMileage)),
    };
  };

  const mappedEmployeeLogs: EquipmentLog[] = employeeLogs.map((log) => ({
    id: log.id.toString(),
    type: "equipment",
    userId: userId,
    equipment: log.Equipment
      ? {
          id: log.Equipment.id.toString(),
          qrId: log.Equipment.qrId,
          name: log.Equipment.name,
        }
      : null,
  }));

  // Mapping Maintenance Logs
  const mappedMaintenanceLogs: MaintenanceLog[] = maintenanceLogs.map(
    (log) => ({
      id: log.id.toString(),
      type: "mechanic",
      maintenanceId: log.maintenanceId,
      userId: userId,
      submitted: false,
    })
  );

  // Mapping Trucking Logs and Checking for Incomplete Fields
  const mappedTruckingLogs: TruckingLog[] = truckingLogs
    .map((log) => {
      const validation = validateTruckingLog(log);

      return {
        id: log.id,
        type: "Trucking Assistant",
        laborType: log.laborType,
        endingMileage: log.endingMileage,
        stateMileage: validation.stateMileage,
        refueled: validation.refueled,
        material: validation.material,
        equipmentHauled: validation.equipmentHauled,
        incomplete: validation.endingMileage,
      };
    })
    .filter((log) => {
      // Filter logs with incomplete fields
      return (
        log.incomplete ||
        log.stateMileage ||
        log.refueled ||
        log.material ||
        log.equipmentHauled
      );
    });

  const mappedTascoLog: TascoLog[] = tascoLogs
    .map((log) => {
      return {
        id: log.id,
        type: "tasco",
        shiftType: log.shiftType,
        laborType: log.laborType,
        loadQuantity: log.LoadQuantity,
        refueled: log.RefuelLogs.some(
          (item) => !validateField.positiveNumber(item.gallonsRefueled)
        ),
        fLoads: log.TascoFLoads.some(
          (item) =>
            !validateField.positiveNumber(item.weight) ||
            !validateField.required(item.screenType)
        ),
      };
    })
    .filter((log) => {
      // Filter logs with incomplete fields
      return log.refueled || log.fLoads;
    });

  // Combine All Logs
  const combinedLogs = [
    ...mappedEmployeeLogs,
    ...mappedMaintenanceLogs,
    ...mappedTruckingLogs,
    ...mappedTascoLog,
  ];

  return combinedLogs;
}

export async function getClockOutComment(userId: string) {
  const timesheet = await prisma.timeSheet.findFirst({
    where: {
      userId,
      endTime: null, // Ensure timesheet is still active
    },
    orderBy: {
      createdAt: "desc", // Sort by most recent submission date
    },
    select: {
      comment: true,
    },
  });
  return timesheet?.comment || "";
}

export async function getEquipmentLogs(userId: string, timesheetId: number) {
  const logs = await prisma.employeeEquipmentLog.findMany({
    where: {
      timeSheetId: timesheetId,
      TimeSheet: {
        userId: userId,
      },
    },
    include: {
      Equipment: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  return logs;
}

export async function getRecentJobDetails(userId: string) {
  const timesheet = await prisma.timeSheet.findFirst({
    where: {
      userId,
      endTime: null, // Ensure timesheet is still active
    },
    orderBy: {
      createdAt: "desc", // Sort by most recent submission date
    },
    select: {
      Jobsite: {
        select: {
          id: true,
          name: true,
          qrId: true,
        },
      },
    },
  });
  const job = timesheet?.Jobsite;
  if (!job) {
    throw new Error("No active job found.");
  }
  return job;
}

export async function getAllEquipmentLogs() {
  const logs = await prisma.employeeEquipmentLog.findMany({
    select: {
      id: true,
    },
  });
  return logs;
}

export async function createEmployeeEquipmentLogService({
  equipmentId,
  timeSheetId,
  endTime,
  comment,
}: {
  equipmentId: string;
  timeSheetId: string;
  endTime?: string | null;
  comment?: string | null;
}) {
  try {
    // Validate equipment existence and status
    let equipmentExists = await prisma.equipment.findFirst({
      where: { id: equipmentId, status: "ACTIVE" },
    });

    if (!equipmentExists) {
      equipmentExists = await prisma.equipment.findFirst({
        where: { qrId: equipmentId, status: "ACTIVE" },
      });
    }

    if (!equipmentExists) {
      const equipmentAnyStatus = await prisma.equipment.findFirst({
        where: { OR: [{ id: equipmentId }, { qrId: equipmentId }] },
        select: { status: true },
      });

      if (equipmentAnyStatus) {
        throw new Error(
          `Equipment with ID ${equipmentId} is ${equipmentAnyStatus.status.toLowerCase()}. Please scan an active equipment QR code.`
        );
      } else {
        throw new Error(
          `Equipment with ID ${equipmentId} not found. Please scan a valid equipment QR code.`
        );
      }
    }

    // Validate timesheet existence and status
    const timeSheet = await prisma.timeSheet.findUnique({
      where: { id: parseInt(timeSheetId, 10) },
      select: { id: true, endTime: true },
    });

    if (!timeSheet) {
      throw new Error("Invalid timesheet ID. Please clock in again.");
    }

    if (timeSheet.endTime) {
      throw new Error(
        "This timesheet has been closed. Please clock in again before logging equipment."
      );
    }

    // Create the employee equipment log
    const newLog = await prisma.employeeEquipmentLog.create({
      data: {
        equipmentId: equipmentExists.id,
        timeSheetId: timeSheet.id,
        startTime: new Date().toISOString(),
        endTime: endTime ? new Date(endTime) : null,
        comment: comment ?? null,
      },
    });

    return newLog;
  } catch (error) {
    console.error("Error in createEmployeeEquipmentLogService:", error);
    throw error;
  }
}

export async function getEmployeeEquipmentLogDetails(logId: string) {
  const usersLog = await prisma.employeeEquipmentLog.findFirst({
    where: {
      id: logId,
    },
    select: {
      id: true,
      equipmentId: true,
      startTime: true,
      endTime: true,
      comment: true,
      Equipment: {
        select: {
          id: true,
          name: true,
          state: true,
          equipmentTag: true,
          make: true,
          model: true,
          year: true,
          licensePlate: true,
        },
      },
      RefuelLog: {
        select: {
          id: true,
          gallonsRefueled: true,
        },
      },
      Maintenance: {
        select: {
          id: true,
          equipmentIssue: true,
          additionalInfo: true,
        },
      },
    },
  });
  return usersLog;
}

export async function deleteEmployeeEquipmentLog(logId: string) {
  try {
    await prisma.employeeEquipmentLog.delete({
      where: {
        id: logId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting equipment log:", error);
    return { success: false, error: "Failed to delete equipment log." };
  }
}

export async function updateEmployeeEquipmentLogService({
  id,
  equipmentId,
  startTime,
  endTime,
  comment,
  status,
  disconnectRefuelLog,
  refuelLogId,
  gallonsRefueled,
}: {
  id: string;
  equipmentId: string;
  startTime: string;
  endTime?: string;
  comment?: string;
  status?: EquipmentState;
  disconnectRefuelLog?: boolean;
  refuelLogId?: string | null;
  gallonsRefueled?: number | null;
}) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const actualRefuelLogId = refuelLogId === "__NULL__" ? null : refuelLogId;
      const actualGallonsRefueled =
        gallonsRefueled === null ? null : gallonsRefueled;

      let refuelLogUpdate = {};
      if (disconnectRefuelLog) {
        refuelLogUpdate = { disconnect: true };
      } else if (actualGallonsRefueled && actualRefuelLogId) {
        // Check if RefuelLog exists for this EmployeeEquipmentLog
        const existingRefuelLog = await prisma.refuelLog.findFirst({
          where: { id: actualRefuelLogId, employeeEquipmentLogId: id },
        });
        if (existingRefuelLog) {
          refuelLogUpdate = {
            update: {
              where: { id: actualRefuelLogId },
              data: { gallonsRefueled: actualGallonsRefueled },
            },
          };
        } else {
          // Fallback to create if not found
          refuelLogUpdate = {
            create: {
              gallonsRefueled: actualGallonsRefueled,
            },
          };
        }
      } else if (actualGallonsRefueled) {
        refuelLogUpdate = {
          create: {
            gallonsRefueled: actualGallonsRefueled,
          },
        };
      }

      // Build update data object conditionally
      const updateData: Prisma.EmployeeEquipmentLogUpdateInput = {};
      if (typeof startTime !== "undefined") updateData.startTime = startTime;
      if (typeof endTime !== "undefined")
        updateData.endTime = endTime || new Date().toISOString();
      if (typeof comment !== "undefined") updateData.comment = comment ?? null;
      if (Object.keys(refuelLogUpdate).length > 0)
        updateData.RefuelLog = refuelLogUpdate;

      const log = await prisma.employeeEquipmentLog.update({
        where: { id },
        data: updateData,
        include: {
          Equipment: true,
          TimeSheet: {
            include: {
              User: { select: { firstName: true, lastName: true } },
            },
          },
        },
      });

      if (!log) {
        throw new Error("Equipment log not found");
      }

      if (status) {
        await prisma.equipment.update({
          where: { id: equipmentId },
          data: { state: status },
        });
      }

      return {
        name: log.Equipment ? log.Equipment.name : null,
        id: log.Equipment ? log.Equipment.id : null,
        createdBy:
          log.TimeSheet && log.TimeSheet.User
            ? `${log.TimeSheet.User.firstName} ${log.TimeSheet.User.lastName}`
            : null,
      };
    });

    return {
      success: true,
      message: "Equipment log updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error updating employee equipment log:", error);
    throw new Error(`Failed to update employee equipment log: ${error}`);
  }
}

export async function getClockOutDetailsService(userId: string) {
  // Get today's date range
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch all required data in parallel
  const [timesheets, user, previousComment] = await Promise.all([
    prisma.timeSheet.findMany({
      where: {
        userId,
        startTime: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        Jobsite: true,
        TascoLogs: true,
        TruckingLogs: true,
      },
      orderBy: { startTime: "desc" },
    }),

    prisma.user.findUnique({
      where: { id: userId },
      select: { signature: true },
    }),

    prisma.timeSheet.findFirst({
      where: {
        userId,
        endTime: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        comment: true,
      },
    }),
  ]);

  const signature = user?.signature || "";
  const comment = previousComment?.comment || "";

  return { timesheets, signature, comment };
}
export async function updateClockOutService(
  timeSheetId: string,
  userId: string,
  endTime: string,
  timeSheetComments?: string,
  wasInjured?: boolean,
  clockOutLat?: number,
  clockOutLong?: number
) {
  try {
    const transactionResult = await prisma.$transaction(async (prisma) => {
      // Update the timesheet with clock-out details
      const updatedTimeSheet = await prisma.timeSheet.update({
        where: { id: parseInt(timeSheetId, 10), userId },
        data: {
          endTime: new Date(endTime),
          comment: timeSheetComments || null,
          wasInjured: wasInjured || false,
          clockOutLat: clockOutLat || null,
          clockOutLng: clockOutLong || null,
          status: "PENDING",
        },
        include: {
          User: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Update user status to clocked out
      await prisma.user.update({
        where: { id: userId },
        data: {
          clockedIn: false,
        },
      });

      return { updatedTimeSheet };
    });

    return {
      success: true,
      data: transactionResult.updatedTimeSheet,
    };
  } catch (error) {
    console.error("Error updating clock-out details:", error);
    return {
      success: false,
      error: "Failed to update clock-out details.",
    };
  }
}

export async function getPreviousTimesheet(userId: string) {
  const timesheet = await prisma.timeSheet.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc", // Sort by most recent submission date
    },
    select: {
      id: true,
      endTime: true,
    },
  });

  return timesheet;
}
export async function getContinueTimesheetService(id: number, userId: string) {
  const incompleteTimesheet = await prisma.timeSheet.findFirst({
    where: {
      id,
      userId,
      endTime: null, // Ensure it's still incomplete
    },
    include: {
      Jobsite: {
        select: {
          id: true,
          qrId: true,
          name: true,
        },
      },
      CostCode: {
        select: {
          id: true,
          name: true,
        },
      },
      TascoLogs: {
        select: {
          shiftType: true,
          laborType: true,
          materialType: true,
          Equipment: {
            select: {
              qrId: true,
              name: true,
            },
          },
        },
      },
      TruckingLogs: {
        select: {
          laborType: true,
          truckNumber: true,
          startingMileage: true,
          Equipment: {
            select: {
              qrId: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return incompleteTimesheet;
}

export async function returnToPreviousTimesheetService(id: number) {
  const PrevTimeSheet = await prisma.timeSheet.findUnique({
    where: { id },
    select: {
      id: true,
      Jobsite: {
        select: {
          id: true,
          qrId: true,
          name: true,
        },
      },
      CostCode: {
        select: {
          id: true,
          name: true,
        },
      },
      workType: true,
      TascoLogs: {
        select: {
          shiftType: true,
          Equipment: {
            select: {
              id: true,
              qrId: true,
              name: true,
            },
          },
          laborType: true,
          materialType: true,
        },
      },
      TruckingLogs: {
        select: {
          laborType: true,
          Equipment: {
            select: {
              qrId: true,
              name: true,
            },
          },
          startingMileage: true,
        },
      },
    },
  });

  return PrevTimeSheet;
}

/**
 * Delete a refuel log for equipment logs
 */
export async function deleteRefuelLogService(refuelLogId: string) {
  try {
    const deletedRefuelLog = await prisma.refuelLog.delete({
      where: {
        id: refuelLogId,
      },
    });

    return {
      success: true,
      message: "Refuel log deleted successfully",
      data: deletedRefuelLog,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete refuel log: ${error.message}`);
    }
    throw new Error("Failed to delete refuel log");
  }
}
