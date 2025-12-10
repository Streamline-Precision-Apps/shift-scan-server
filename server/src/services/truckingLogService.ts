import type { Prisma } from "../../generated/prisma/index.js";
import prisma from "../lib/prisma.js";

export async function getTruckingLogService(userId: string) {
  return await prisma.timeSheet.findFirst({
    where: {
      userId,
      endTime: null, // Looking for active timesheets
    },
    orderBy: {
      startTime: "desc", // Get the most recent one
    },
    select: {
      id: true,
      startTime: true,
      TruckingLogs: {
        orderBy: {
          id: "desc", // Get the most recent trucking log
        },
        take: 1, // Only get the first (most recent) one
        select: {
          id: true,
        },
      },
    },
  });
}

//
export async function getTruckStartingMileage(timeSheetId: string) {
  return await prisma.truckingLog.findFirst({
    where: {
      id: timeSheetId,
    },
    select: {
      startingMileage: true,
    },
  });
}

export async function getTruckEndingMileage(timeSheetId: string) {
  return await prisma.truckingLog.findFirst({
    where: {
      id: timeSheetId,
    },
    select: {
      endingMileage: true,
    },
  });
}

export async function getTruckNotes(timeSheetId: string) {
  const notes = await prisma.truckingLog.findFirst({
    where: {
      id: timeSheetId,
    },
    select: {
      TimeSheet: {
        select: {
          comment: true,
        },
      },
    },
  });

  const comment = notes?.TimeSheet?.comment;
  return comment || "";
}

export async function getRefueledLogs(timeSheetId: string) {
  return await prisma.refuelLog.findMany({
    where: {
      truckingLogId: timeSheetId,
    },
  });
}

export async function getTruckMaterial(timeSheetId: string) {
  return await prisma.material.findMany({
    where: {
      truckingLogId: timeSheetId,
    },
  });
}

export async function getTruckEquipmentHauled(timeSheetId: string) {
  return await prisma.equipmentHauled.findMany({
    where: {
      truckingLogId: timeSheetId, // timeSheetId is actually truckingLogId
    },
    include: {
      Equipment: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
export async function getStateMileage(timeSheetId: string) {
  return await prisma.stateMileage.findMany({
    where: {
      truckingLogId: timeSheetId,
    },
  });
}

// Unified function to get all trucking log data at once
export async function getAllTruckingLogData(truckingLogId: string) {
  return await prisma.truckingLog.findUnique({
    where: {
      id: truckingLogId,
    },
    include: {
      TimeSheet: {
        select: {
          comment: true,
        },
      },
      RefuelLogs: true,
      Materials: true,
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
      StateMileages: true,
    },
  });
}

export async function createEquipmentHauledService(truckingLogId: string) {
  return await prisma.equipmentHauled.create({
    data: {
      TruckingLog: {
        connect: { id: truckingLogId },
      },
    },
  });
}

export async function createHaulingLogsService(
  truckingLogId: string,
  body: { name: string; quantity: number; createdAt: Date }
) {
  return await prisma.material.create({
    data: {
      truckingLogId,
      name: body.name,
      quantity: body.quantity,
      createdAt: body.createdAt,
    },
  });
}

export async function editEquipmentHauledService(
  id: string,
  body: {
    truckingLogId?: string;
    source?: string | null;
    destination?: string | null;
    startMileage?: number | null;
    endMileage?: number | null;
  }
) {
  const updateData: Prisma.EquipmentHauledUpdateInput = {};

  if (body.source !== undefined) updateData.source = body.source;
  if (body.destination !== undefined) updateData.destination = body.destination;
  if (body.startMileage !== undefined)
    updateData.startMileage = body.startMileage;
  if (body.endMileage !== undefined) updateData.endMileage = body.endMileage;

  return await prisma.equipmentHauled.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteEquipmentHauledService(id: string) {
  try {
    const result = await prisma.equipmentHauled.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    console.error("Error deleting EquipmentHauled:", error);
    throw error; // Re-throw so controller can handle it
  }
}

// Update Services
export async function updateTruckingLogEndingMileageService(
  id: string,
  endingMileage: number
) {
  return await prisma.truckingLog.update({
    where: { id },
    data: { endingMileage },
  });
}

export async function updateTruckingLogStartingMileageService(
  id: string,
  startingMileage: number
) {
  return await prisma.truckingLog.update({
    where: { id },
    data: { startingMileage },
  });
}

export async function updateTruckingLogNotesService(id: string, notes: string) {
  return await prisma.truckingLog.update({
    where: { id },
    data: {
      TimeSheet: {
        update: { comment: notes },
      },
    },
    include: { TimeSheet: { select: { comment: true } } },
  });
}

export async function updateStateMileageService(
  stateMileageId: string,
  data: {
    state?: string;
    stateLineMileage?: number;
  }
) {
  return await prisma.stateMileage.update({
    where: { id: stateMileageId },
    data: {
      ...(data.state !== undefined && { state: data.state }),
      ...(data.stateLineMileage !== undefined && {
        stateLineMileage: data.stateLineMileage,
      }),
    },
  });
}

export async function updateRefuelLogService(
  refuelLogId: string,
  data: {
    gallonsRefueled?: number;
    milesAtFueling?: number;
  }
) {
  return await prisma.refuelLog.update({
    where: { id: refuelLogId },
    data: {
      ...(data.gallonsRefueled !== undefined && {
        gallonsRefueled: data.gallonsRefueled,
      }),
      ...(data.milesAtFueling !== undefined && {
        milesAtFueling: data.milesAtFueling,
      }),
    },
  });
}

export async function updateMaterialService(
  materialId: string,
  data: {
    name?: string;
    quantity?: number;
    LocationOfMaterial?: string;
    unit?: string;
    loadType?: string | null;
  }
) {
  const updateData: any = {};

  // Only add fields that are actually provided (not undefined)
  if (data.name !== undefined && data.name !== "") updateData.name = data.name;
  if (data.quantity !== undefined) updateData.quantity = data.quantity;
  if (data.LocationOfMaterial !== undefined && data.LocationOfMaterial !== "")
    updateData.LocationOfMaterial = data.LocationOfMaterial;
  if (data.unit !== undefined && data.unit !== "") updateData.unit = data.unit;
  if (data.loadType !== undefined) updateData.loadType = data.loadType;

  // Only update if there are changes
  if (Object.keys(updateData).length === 0) {
    return await prisma.material.findUnique({
      where: { id: materialId },
    });
  }

  return await prisma.material.update({
    where: { id: materialId },
    data: updateData,
  });
}

// DELETE Services
export async function deleteStateMileageService(id: string) {
  return await prisma.stateMileage.delete({
    where: { id },
  });
}

export async function deleteRefuelLogService(id: string) {
  return await prisma.refuelLog.delete({
    where: { id },
  });
}

export async function deleteMaterialService(id: string) {
  return await prisma.material.delete({
    where: { id },
  });
}

// CREATE Services (additional - for direct resource creation)
export async function createStateMileageService(
  truckingLogId: string,
  data?: { state?: string; stateLineMileage?: number }
) {
  return await prisma.stateMileage.create({
    data: {
      truckingLogId,
      ...(data?.state && { state: data.state }),
      ...(data?.stateLineMileage && {
        stateLineMileage: data.stateLineMileage,
      }),
    },
  });
}

export async function createRefuelLogService(
  truckingLogId: string,
  data?: { gallonsRefueled?: number; milesAtFueling?: number }
) {
  return await prisma.refuelLog.create({
    data: {
      truckingLogId,
      ...(data?.gallonsRefueled && { gallonsRefueled: data.gallonsRefueled }),
      ...(data?.milesAtFueling && { milesAtFueling: data.milesAtFueling }),
    },
  });
}

export async function createMaterialService(
  truckingLogId: string,
  data: {
    name: string;
    quantity: number;
    LocationOfMaterial?: string;
    unit?: string;
    loadType?: string | null;
  }
) {
  // Build create data dynamically to handle optional enum fields
  const createData: any = {
    truckingLogId,
    name: data.name,
    quantity: data.quantity,
  };

  if (data.LocationOfMaterial !== undefined)
    createData.LocationOfMaterial = data.LocationOfMaterial;
  if (data.unit !== undefined) createData.unit = data.unit;
  if (data.loadType !== undefined) createData.loadType = data.loadType;

  return await prisma.material.create({
    data: createData,
  });
}

// UPDATE Services for nested resources
export async function updateEquipmentHauledService(
  equipmentHauledId: string,
  data: {
    equipmentId?: string;
    source?: string | null;
    destination?: string | null;
    startMileage?: number | null;
    endMileage?: number | null;
  }
) {
  // Validate equipment exists if equipmentId is provided
  if (data.equipmentId) {
    const equipment = await prisma.equipment.findUnique({
      where: { id: data.equipmentId },
    });
    if (!equipment) {
      throw new Error(`Equipment with ID ${data.equipmentId} not found`);
    }
  }

  const updateData: Prisma.EquipmentHauledUpdateInput = {};
  if (data.equipmentId !== undefined)
    updateData.Equipment = { connect: { id: data.equipmentId } };
  if (data.source !== undefined) updateData.source = data.source;
  if (data.destination !== undefined) updateData.destination = data.destination;
  if (data.startMileage !== undefined)
    updateData.startMileage = data.startMileage;
  if (data.endMileage !== undefined) updateData.endMileage = data.endMileage;

  return await prisma.equipmentHauled.update({
    where: { id: equipmentHauledId },
    data: updateData,
    include: {
      Equipment: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
