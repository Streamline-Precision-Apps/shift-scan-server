import prisma from "../lib/prisma.js";
import type { ApprovalStatus, Prisma } from "../../generated/prisma/index.js";

interface FilterOptions {
  jobsiteId: string[];
  costCode: string[];
  equipmentId: string[];
  equipmentLogTypes: string[];
  status: string[];
  changes: string[];
  id: string[];
  notificationId: string[];
  dateRange: { from?: Date | undefined; to?: Date | undefined };
}

interface GetAllTimesheetsParams {
  status: string;
  page: number;
  pageSize: number;
  skip: number;
  search: string;
  filters: FilterOptions;
}

export async function getAllTimesheets(params: GetAllTimesheetsParams) {
  try {
    const { status, page, pageSize, skip, search, filters } = params;

    // Build where clause based on filters
    const where: Prisma.TimeSheetWhereInput = {};

    // Status filter - combine both the showPendingOnly status param and the filters.status array
    // Priority: filters.status (from filter dropdown) takes precedence over status param (showPendingOnly)
    if (filters.status && filters.status.length > 0) {
      // Use filter dropdown selections
      const validStatuses = filters.status
        .filter((s) => s.toLowerCase() !== "all")
        .map((s) => s.toUpperCase());
      if (validStatuses.length > 0) {
        where.status = {
          in: validStatuses as ApprovalStatus[],
        };
      }
    } else if (status && status !== "all") {
      // Fall back to showPendingOnly status param only if no filter status is selected
      if (status.toLowerCase() === "pending") {
        where.status = "PENDING" as ApprovalStatus;
      } else {
        // For specific status values, convert to uppercase and cast to enum
        where.status = status.toUpperCase() as ApprovalStatus;
      }
    }

    // Search across user names, jobsite names, cost codes
    if (search) {
      where.OR = [
        {
          User: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          Jobsite: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { code: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          CostCode: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { code: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Jobsite filter
    if (filters.jobsiteId && filters.jobsiteId.length > 0) {
      where.jobsiteId = { in: filters.jobsiteId };
    }

    // Cost code filter
    if (filters.costCode && filters.costCode.length > 0) {
      where.costcode = { in: filters.costCode };
    }

    // ID filter
    if (filters.id && filters.id.length > 0) {
      where.id = { in: filters.id.map((id) => parseInt(id, 10)) };
    }

    // Date range filter
    if (filters.dateRange?.from || filters.dateRange?.to) {
      where.date = {};
      if (filters.dateRange.from) {
        where.date.gte = filters.dateRange.from;
      }
      if (filters.dateRange.to) {
        where.date.lte = filters.dateRange.to;
      }
    }

    // Equipment filter (across all log types)
    if (filters.equipmentId && filters.equipmentId.length > 0) {
      const equipmentConditions: Prisma.TimeSheetWhereInput[] = [];

      if (
        !filters.equipmentLogTypes ||
        filters.equipmentLogTypes.length === 0 ||
        filters.equipmentLogTypes.includes("employeeEquipmentLogs")
      ) {
        equipmentConditions.push({
          EmployeeEquipmentLogs: {
            some: { equipmentId: { in: filters.equipmentId } },
          },
        });
      }

      if (
        !filters.equipmentLogTypes ||
        filters.equipmentLogTypes.length === 0 ||
        filters.equipmentLogTypes.includes("truckingLogs")
      ) {
        equipmentConditions.push({
          TruckingLogs: {
            some: {
              OR: [
                // Check hauled equipment
                { Equipment: { id: { in: filters.equipmentId } } },
                // Check truck
                { Truck: { id: { in: filters.equipmentId } } },
                // Check trailer
                { Trailer: { id: { in: filters.equipmentId } } },
                // Check equipment hauled records
                {
                  EquipmentHauled: {
                    some: { equipmentId: { in: filters.equipmentId } },
                  },
                },
              ],
            },
          },
        });
      }

      if (
        !filters.equipmentLogTypes ||
        filters.equipmentLogTypes.length === 0 ||
        filters.equipmentLogTypes.includes("tascoLogs")
      ) {
        equipmentConditions.push({
          TascoLogs: {
            some: {
              equipmentId: { in: filters.equipmentId },
            },
          },
        });
      }

      if (
        !filters.equipmentLogTypes ||
        filters.equipmentLogTypes.length === 0 ||
        filters.equipmentLogTypes.includes("mechanicProjects")
      ) {
        equipmentConditions.push({
          Maintenance: {
            some: {
              equipmentId: { in: filters.equipmentId },
            },
          },
        });
      }

      if (equipmentConditions.length > 0) {
        where.OR = [...(where.OR || []), ...equipmentConditions];
      }
    }

    // Changes filter (has change logs)
    if (filters.changes && filters.changes.includes("hasChanges")) {
      where.ChangeLogs = {
        some: {},
      };
    }

    // Count total matching records
    const total = await prisma.timeSheet.count({ where });

    // Calculate total pages
    const totalPages = Math.ceil(total / pageSize);

    // Get pending count for approval inbox
    const pendingTimesheets = await prisma.timeSheet.count({
      where: { status: "PENDING" },
    });

    // Fetch timesheets with pagination
    const timesheets = await prisma.timeSheet.findMany({
      where,
      ...(status !== "pending" && { skip, take: pageSize }),
      select: {
        id: true,
        date: true,
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
            code: true,
            name: true,
          },
        },
        CostCode: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        nu: true,
        Fp: true,
        startTime: true,
        endTime: true,
        comment: true,
        status: true,
        workType: true,
        createdAt: true,
        updatedAt: true,
        EmployeeEquipmentLogs: {
          select: {
            id: true,
            equipmentId: true,
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
            startTime: true,
            endTime: true,
          },
        },
        TruckingLogs: {
          select: {
            truckNumber: true,
            startingMileage: true,
            endingMileage: true,
            RefuelLogs: {
              select: {
                milesAtFueling: true,
              },
            },
          },
        },
        TascoLogs: {
          select: {
            shiftType: true,
            LoadQuantity: true,
          },
        },
        _count: {
          select: {
            ChangeLogs: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return {
      timesheets,
      total,
      totalPages,
      page: status === "pending" ? undefined : page,
      pageSize: status === "pending" ? undefined : pageSize,
      pendingTimesheets,
    };
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    throw error;
  }
}

export async function getTimesheetById(id: string | undefined) {
  try {
    return await prisma.timeSheet.findUnique({
      where: { id: parseInt(id as string, 10) },
      include: {
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
            code: true,
            name: true,
          },
        },
        CostCode: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        EmployeeEquipmentLogs: {
          include: {
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        TruckingLogs: {
          include: {
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
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
            EquipmentHauled: {
              include: {
                Equipment: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            Materials: true,
            RefuelLogs: true,
            StateMileages: true,
          },
        },
        TascoLogs: {
          include: {
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
            RefuelLogs: true,
            TascoFLoads: true,
          },
        },
        Maintenance: {
          include: {
            Equipment: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        ChangeLogs: {
          include: {
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            changedAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching timesheet by ID:", error);
    throw error;
  }
}

export async function getTimesheetChangeLogs(timesheetId: string | undefined) {
  try {
    return await prisma.timeSheetChangeLog.findMany({
      where: { timeSheetId: parseInt(timesheetId as string, 10) },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        changedAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching change logs:", error);
    throw error;
  }
}

export async function createTimesheet(payload: any) {
  try {
    console.log("🔵 [CREATE TIMESHEET] Received payload:", JSON.stringify(payload, null, 2));
    
    // Extract main timesheet data
    const {
      date,
      userId,
      jobsiteId,
      costcode,
      startTime,
      endTime,
      workType,
      comments,
      employeeEquipmentLogs = [],
      truckingLogs = [],
      tascoLogs = [],
      mechanicProjects = [],
    } = payload;

    console.log("🔵 [CREATE TIMESHEET] Extracted data:", {
      date,
      userId,
      jobsiteId,
      costcode,
      startTime,
      endTime,
      workType,
      employeeEquipmentLogsCount: employeeEquipmentLogs.length,
      truckingLogsCount: truckingLogs.length,
      tascoLogsCount: tascoLogs.length,
      mechanicProjectsCount: mechanicProjects.length,
    });

    // Create timesheet with nested logs
    const timesheet = await prisma.timeSheet.create({
      data: {
        date: new Date(date),
        userId,
        jobsiteId,
        costcode,
        startTime: startTime ? new Date(startTime) : new Date(date), // Use date as default if startTime not provided
        endTime: endTime ? new Date(endTime) : null,
        workType,
        comment: comments || "",
        status: "PENDING",
        // Create employee equipment logs
        EmployeeEquipmentLogs: {
          create: employeeEquipmentLogs.map((log: any) => ({
            equipmentId: log.equipmentId,
            startTime: new Date(log.startTime),
            endTime: new Date(log.endTime),
          })),
        },
        // Create trucking logs with nested data
        TruckingLogs: {
          create: truckingLogs.map((log: any) => ({
            equipmentId: log.equipmentId,
            truckNumber: log.truckNumber,
            trailerNumber: log.trailerNumber || null,
            laborType: log.laborType || "Truck Driver", // Required field, default to "Truck Driver"
            startingMileage: parseFloat(log.startingMileage) || 0,
            endingMileage: parseFloat(log.endingMileage) || 0,
            EquipmentHauled: {
              create: (log.equipmentHauled || []).map((eq: any) => ({
                equipmentId: eq.equipmentId, // Fixed: was eq.equipment.id
                source: eq.source || "",
                destination: eq.destination || "",
                startMileage: parseFloat(eq.startMileage) || 0,
                endMileage: parseFloat(eq.endMileage) || 0,
              })),
            },
            Materials: {
              create: (log.materials || []).map((mat: any) => ({
                LocationOfMaterial: mat.location || "",
                name: mat.name || "",
                quantity: parseFloat(mat.quantity) || 0,
                unit: mat.unit || "TONS",
                loadType: mat.loadType ? mat.loadType.toUpperCase() : "SCREENED", // Convert to uppercase for Prisma enum
              })),
            },
            RefuelLogs: {
              create: (log.refuelLogs || []).map((refuel: any) => ({
                gallonsRefueled: parseFloat(refuel.gallonsRefueled) || 0,
                milesAtFueling: parseFloat(refuel.milesAtFueling) || 0,
              })),
            },
            StateMileages: {
              create: (log.stateMileages || []).map((state: any) => ({
                state: state.state,
                stateLineMileage: parseFloat(state.stateLineMileage) || 0,
              })),
            },
          })),
        },
        // Create Tasco logs
        TascoLogs: {
          create: tascoLogs.map((log: any) => ({
            shiftType: log.shiftType,
            laborType: log.laborType || "",
            materialType: log.materialType || "",
            LoadQuantity: parseFloat(log.LoadQuantity) || 0,
            equipmentId: log.equipmentId || null,
            RefuelLogs: {
              create: (log.refuelLogs || []).map((refuel: any) => ({
                gallonsRefueled: parseFloat(refuel.gallonsRefueled) || 0,
                milesAtFueling: parseFloat(refuel.milesAtFueling) || null,
              })),
            },
            TascoFLoads: {
              create: (log.TascoFLoads || []).map((fLoad: any) => ({
                weight: parseFloat(fLoad.weight) || null,
                screenType: fLoad.screenType || null,
              })),
            },
          })),
        },
        // Create mechanic projects
        Maintenance: {
          create: mechanicProjects.map((project: any) => ({
            equipmentId: project.equipmentId,
            hours: parseFloat(project.hours) || null,
            description: project.description || "",
          })),
        },
      },
      include: {
        User: true,
        Jobsite: true,
        CostCode: true,
      },
    });

    console.log("✅ [CREATE TIMESHEET] Successfully created timesheet:", timesheet.id);
    return timesheet;
  } catch (error) {
    console.error("❌ [CREATE TIMESHEET] Error creating timesheet:", error);
    if (error instanceof Error) {
      console.error("❌ [CREATE TIMESHEET] Error message:", error.message);
      console.error("❌ [CREATE TIMESHEET] Error stack:", error.stack);
    }
    throw error;
  }
}

export async function updateTimesheet(
  id: string | undefined,
  updateData: {
    data: any;
    originalData: any;
    changes: Record<string, { old: unknown; new: unknown }>;
    editorId: string;
    changeReason: string;
    wasStatusChanged: boolean;
    numberOfChanges: number;
  }
) {
  try {
    const { data, changes, editorId, changeReason, wasStatusChanged } =
      updateData;

    // Extract IDs from nested objects if they exist
    const jobsiteId = data.Jobsite?.id || data.jobsiteId;
    const userId = data.User?.id || data.userId;
    
    // For costcode, we need to query the CostCode table by ID to get the actual name
    // because the foreign key references CostCode.name, not CostCode.id
    let costCodeName = data.costcode; // fallback to existing value
    if (data.CostCode?.id) {
      const costCode = await prisma.costCode.findUnique({
        where: { id: data.CostCode.id },
        select: { name: true }
      });
      if (costCode) {
        costCodeName = costCode.name;
      }
    }

    // Build update data object, only including defined values
    const updateFields: any = {};
    if (data.date) updateFields.date = new Date(data.date);
    if (userId) updateFields.userId = userId;
    if (jobsiteId) updateFields.jobsiteId = jobsiteId;
    if (costCodeName) updateFields.costcode = costCodeName;
    if (data.startTime) updateFields.startTime = new Date(data.startTime);
    if (data.endTime !== undefined) updateFields.endTime = data.endTime ? new Date(data.endTime) : null;
    if (data.workType) updateFields.workType = data.workType;
    if (data.comment !== undefined) updateFields.comment = data.comment;
    if (data.status) updateFields.status = data.status;

    // Handle nested logs update
    // For nested relations, we need to delete existing and recreate
    // This is the simplest approach for handling changes in nested data
    
    // Handle EmployeeEquipmentLogs
    if (data.EmployeeEquipmentLogs) {
      // Delete existing logs
      await prisma.employeeEquipmentLog.deleteMany({
        where: { timeSheetId: parseInt(id as string, 10) },
      });
      // Create new logs
      if (data.EmployeeEquipmentLogs.length > 0) {
        await prisma.employeeEquipmentLog.createMany({
          data: data.EmployeeEquipmentLogs.map((log: any) => ({
            timeSheetId: parseInt(id as string, 10),
            equipmentId: log.equipmentId,
            startTime: new Date(log.startTime),
            endTime: new Date(log.endTime),
          })),
        });
      }
    }

    // Handle MechanicProjects (the relation is called Maintenance in the schema)
    if (data.Maintenance) {
      // Delete existing mechanic projects
      await prisma.mechanicProjects.deleteMany({
        where: { timeSheetId: parseInt(id as string, 10) },
      });
      // Create new mechanic projects
      if (data.Maintenance.length > 0) {
        await prisma.mechanicProjects.createMany({
          data: data.Maintenance.map((project: any) => ({
            timeSheetId: parseInt(id as string, 10),
            equipmentId: project.equipmentId,
            hours: parseFloat(project.hours) || 0,
            description: project.description || "",
          })),
        });
      }
    }

    // Handle TruckingLogs (more complex with nested relations)
    if (data.TruckingLogs) {
      // Delete existing trucking logs (cascade will handle nested data)
      await prisma.truckingLog.deleteMany({
        where: { timeSheetId: parseInt(id as string, 10) },
      });
      // Create new trucking logs with nested data
      if (data.TruckingLogs.length > 0) {
        for (const log of data.TruckingLogs) {
          await prisma.truckingLog.create({
            data: {
              timeSheetId: parseInt(id as string, 10),
              laborType: log.laborType || "",
              equipmentId: log.equipmentId || null,
              truckNumber: log.truckNumber || null,
              trailerNumber: log.trailerNumber || null,
              startingMileage: parseInt(log.startingMileage) || 0,
              endingMileage: parseInt(log.endingMileage) || 0,
              taskName: log.taskName || null,
              EquipmentHauled: {
                create: (log.EquipmentHauled || []).map((eq: any) => ({
                  equipmentId: eq.equipmentId,
                  source: eq.source || "",
                  destination: eq.destination || "",
                  startMileage: parseFloat(eq.startMileage) || 0,
                  endMileage: parseFloat(eq.endMileage) || 0,
                })),
              },
              Materials: {
                create: (log.Materials || []).map((mat: any) => ({
                  LocationOfMaterial: mat.LocationOfMaterial || "",
                  name: mat.name || "",
                  quantity: parseFloat(mat.quantity) || 0,
                  unit: mat.unit || "TONS",
                  loadType: mat.loadType || "SCREENED",
                })),
              },
              RefuelLogs: {
                create: (log.RefuelLogs || []).map((refuel: any) => ({
                  gallonsRefueled: parseFloat(refuel.gallonsRefueled) || 0,
                  milesAtFueling: parseFloat(refuel.milesAtFueling) || 0,
                })),
              },
              StateMileages: {
                create: (log.StateMileages || []).map((state: any) => ({
                  state: state.state,
                  stateLineMileage: parseInt(state.stateLineMileage) || 0,
                })),
              },
            },
          });
        }
      }
    }

    // Handle TascoLogs
    if (data.TascoLogs) {
      // Delete existing tasco logs (cascade will handle refuel logs and TascoFLoads)
      await prisma.tascoLog.deleteMany({
        where: { timeSheetId: parseInt(id as string, 10) },
      });
      // Create new tasco logs
      if (data.TascoLogs.length > 0) {
        for (const log of data.TascoLogs) {
          await prisma.tascoLog.create({
            data: {
              timeSheetId: parseInt(id as string, 10),
              shiftType: log.shiftType,
              laborType: log.laborType || "",
              materialType: log.materialType || null,
              LoadQuantity: parseInt(log.LoadQuantity) || 0,
              equipmentId: log.Equipment?.id || log.equipmentId || null,
              RefuelLogs: {
                create: (log.RefuelLogs || []).map((refuel: any) => ({
                  gallonsRefueled: parseFloat(refuel.gallonsRefueled) || 0,
                  milesAtFueling: parseFloat(refuel.milesAtFueling) || 0,
                })),
              },
              TascoFLoads: {
                create: (log.TascoFLoads || []).map((fLoad: any) => ({
                  weight: parseFloat(fLoad.weight) || null,
                  screenType: fLoad.screenType || null,
                })),
              },
            },
          });
        }
      }
    }

    // Update main timesheet fields
    const timesheet = await prisma.timeSheet.update({
      where: { id: parseInt(id as string, 10) },
      data: updateFields,
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log the changes
    if (Object.keys(changes).length > 0) {
      await prisma.timeSheetChangeLog.create({
        data: {
          timeSheetId: parseInt(id as string, 10),
          changedBy: editorId,
          changes: changes as any,
          changeReason,
        },
      });
    }

    // Get editor name for response
    const editor = await prisma.user.findUnique({
      where: { id: editorId },
      select: { firstName: true, lastName: true },
    });

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { firstName: true, lastName: true },
    });

    return {
      success: true,
      onlyStatusUpdated: wasStatusChanged && Object.keys(changes).length === 1,
      editorFullName: editor
        ? `${editor.firstName} ${editor.lastName}`
        : "Unknown",
      userFullname: user
        ? `${user.firstName} ${user.lastName}`
        : "Unknown",
    };
  } catch (error) {
    console.error("Error updating timesheet:", error);
    throw error;
  }
}

export async function updateTimesheetStatus(
  id: string | undefined,
  status: string,
  changes: Record<string, { old: unknown; new: unknown }>,
  userId: string
) {
  try {
    const timesheetId = parseInt(id as string, 10);
    
    await prisma.timeSheet.update({
      where: { id: timesheetId },
      data: {
        status: status as ApprovalStatus,
      },
    });

    // Optionally log this status change
    if (Object.keys(changes).length > 0) {
      await prisma.timeSheetChangeLog.create({
        data: {
          timeSheetId: timesheetId,
          changedBy: userId,
          changes: changes as any,
          changeReason: `Status changed to ${status}`,
        },
      });
    }

    // Handle notifications for timecard approval/denial
    if (status === "APPROVED" || status === "REJECTED") {
      const notifications = await prisma.notification.findMany({
        where: {
          topic: "timecard-submission",
          referenceId: timesheetId.toString(),
          Response: { is: null },
        },
      });

      if (notifications.length > 0) {
        // Filter out notifications that already have a notificationRead for this user
        const existingReads = await prisma.notificationRead.findMany({
          where: {
            notificationId: { in: notifications.map((n) => n.id) },
            userId: userId,
          },
          select: { notificationId: true },
        });
        const alreadyReadIds = new Set(
          existingReads.map((r) => r.notificationId)
        );
        const unreadNotifications = notifications.filter(
          (n) => !alreadyReadIds.has(n.id)
        );

        // Create notification responses and mark as read in a transaction
        await prisma.$transaction(async (tx) => {
          if (unreadNotifications.length > 0) {
            await tx.notificationRead.createMany({
              data: unreadNotifications.map((n) => ({
                notificationId: n.id,
                userId: userId,
                readAt: new Date(),
              })),
            });
          }
          await tx.notificationResponse.createMany({
            data: notifications.map((n) => ({
              notificationId: n.id,
              userId: userId,
              response: status === "APPROVED" ? "Approved" : "Rejected",
              respondedAt: new Date(),
            })),
          });
        });
      }
    }
  } catch (error) {
    console.error("Error updating timesheet status:", error);
    throw error;
  }
}

export async function deleteTimesheet(id: string | undefined) {
  try {
    // Cascade delete will handle related records
    await prisma.timeSheet.delete({
      where: { id: parseInt(id as string, 10) },
    });
  } catch (error) {
    console.error("Error deleting timesheet:", error);
    throw error;
  }
}

export async function exportTimesheets(
  timesheetIds: number[],
  fields: string[],
  dateRange?: { from?: Date; to?: Date },
  filters?: {
    users?: string[];
    crews?: string[];
    profitCenters?: string[];
  }
) {
  try {
    // Build the where clause based on provided parameters
    const whereClause: any = {};

    // If specific IDs are provided, use them
    if (timesheetIds && timesheetIds.length > 0) {
      whereClause.id = { in: timesheetIds };
    } else {
      // Otherwise, use date range and filters
      if (dateRange?.from || dateRange?.to) {
        const dateFilter: any = {};
        
        if (dateRange.from) {
          // Ensure we start at beginning of the day
          const startDate = new Date(dateRange.from);
          startDate.setHours(0, 0, 0, 0);
          dateFilter.gte = startDate;
        }
        
        if (dateRange.to) {
          // Ensure we end at end of the day
          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          dateFilter.lte = endDate;
        }
        
        whereClause.date = dateFilter;
      }

      if (filters?.users && filters.users.length > 0) {
        whereClause.userId = { in: filters.users };
      }

      if (filters?.profitCenters && filters.profitCenters.length > 0) {
        whereClause.jobsiteId = { in: filters.profitCenters };
      }

      // For crew filtering, we need to join through the User table
      if (filters?.crews && filters.crews.length > 0) {
        whereClause.User = {
          crewId: { in: filters.crews },
        };
      }
    }

    const timesheets = await prisma.timeSheet.findMany({
      where: whereClause,
      include: {
        User: true,
        Jobsite: true,
        CostCode: true,
        EmployeeEquipmentLogs: {
          include: {
            Equipment: true,
          },
        },
        TruckingLogs: {
          include: {
            Equipment: true,
            Trailer: true,
            EquipmentHauled: {
              include: {
                Equipment: true,
              },
            },
            Materials: true,
            RefuelLogs: true,
            StateMileages: true,
          },
        },
        TascoLogs: {
          include: {
            Equipment: true,
            RefuelLogs: true,
          },
        },
        Maintenance: {
          include: {
            Equipment: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return {
      timesheets,
      fields,
    };
  } catch (error) {
    console.error("Error exporting timesheets:", error);
    throw error;
  }
}

export async function getAllTascoMaterialTypes() {
  try {
    const materialTypes = await prisma.tascoMaterialTypes.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      materialTypes,
      total: materialTypes.length,
    };
  } catch (error) {
    console.error("Error fetching Tasco material types:", error);
    throw error;
  }
}

/**
 * Check timesheet status and resolve associated notification
 * If timesheet is already approved/rejected, create notification response
 */
export async function resolveTimecardNotification(
  timesheetId: string,
  notificationId: number,
  userId: string
) {
  try {
    // Parse timesheetId to int for Prisma query
    const tsId = parseInt(timesheetId, 10);
    if (isNaN(tsId)) {
      throw new Error("Invalid timesheet ID");
    }

    // Get the timesheet to check its current status
    const timesheet = await prisma.timeSheet.findUnique({
      where: { id: tsId },
      select: { status: true },
    });

    if (!timesheet) {
      throw new Error("Timesheet not found");
    }

    // Check if timesheet has been approved or rejected
    if (timesheet.status === "APPROVED" || timesheet.status === "REJECTED") {
      // Check if notification already has a response
      const existingResponse = await prisma.notificationResponse.findUnique({
        where: { notificationId },
      });

      if (existingResponse) {
        return {
          success: true,
          alreadyResolved: true,
          status: timesheet.status,
        };
      }

      // Check if user has already read this notification
      const existingRead = await prisma.notificationRead.findUnique({
        where: {
          notificationId_userId: {
            notificationId,
            userId,
          },
        },
      });

      // Create notification response and read in transaction
      await prisma.$transaction(async (tx) => {
        // Create response with the actual status
        await tx.notificationResponse.create({
          data: {
            notificationId,
            userId,
            response: timesheet.status === "APPROVED" ? "Approved" : "Rejected",
            respondedAt: new Date(),
          },
        });

        // Create read record if it doesn't exist
        if (!existingRead) {
          await tx.notificationRead.create({
            data: {
              notificationId,
              userId,
              readAt: new Date(),
            },
          });
        }
      });

      return {
        success: true,
        resolved: true,
        status: timesheet.status,
      };
    }

    // Timesheet is still pending
    return {
      success: true,
      resolved: false,
      status: timesheet.status,
    };
  } catch (error) {
    console.error("Error resolving timecard notification:", error);
    throw error;
  }
}
