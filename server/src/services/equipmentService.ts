// server/src/services/equipmentService.ts
import prisma from "../lib/prisma.js";
import { EquipmentTags, OwnershipType } from "../../generated/prisma/client.js";

export async function getEquipment(query: { qrg?: boolean; clock?: boolean }) {
  if (query.qrg) {
    return prisma.equipment.findMany({
      select: {
        id: true,
        qrId: true,
        name: true,
        code: true,
        status: true,
      },
    });
  } else if (query.clock) {
    return prisma.equipment.findMany({
      where: {
        status: { not: "ARCHIVED" },
      },
      select: {
        id: true,
        qrId: true,
        name: true,
        code: true,
        status: true,
      },
    });
  } else {
    return prisma.equipment.findMany();
  }
}

export async function getEquipmentMileageService(equipmentId: string) {
  return await prisma.truckingLog.findFirst({
    where: {
      OR: [
        { truckNumber: equipmentId }, // Equipment used as truck (most common for mileage)
        { trailerNumber: equipmentId }, // Equipment used as trailer
        { equipmentId: equipmentId }, // Equipment being hauled
      ],
      endingMileage: {
        not: null, // Only get entries that have an ending mileage recorded
      },
    },
    orderBy: [
      {
        TimeSheet: {
          // Order by creation time if endTime is null, otherwise by endTime
          createdAt: "desc",
        },
      },
    ],
    include: {
      Equipment: true,
      TimeSheet: {
        include: {
          User: true,
        },
      },
    },
  });
}

// Find an equipment by QR code (for QR code uniqueness check)
export async function getEquipmentByQrId(qrId: string) {
  return await prisma.equipment.findFirst({ where: { qrId } });
}

// Create equipment (POST)
export async function createEquipment(data: {
  ownershipType: string;
  createdById: string;
  equipmentTag: string;
  name: string;
  creationReason: string;
  destination?: string;
  qrId: string;
  description?: string;
}) {
  const {
    ownershipType,
    createdById,
    equipmentTag,
    name,
    creationReason,
    destination,
    qrId,
    description = "",
  } = data;

  if (!equipmentTag) {
    throw new Error("Please select an equipment tag.");
  }

  // Transaction for equipment and hauled
  const result = await prisma.$transaction(async (prisma) => {
    const newEquipment = await prisma.equipment.create({
      data: {
        qrId,
        name,
        status: "ACTIVE",
        description,
        creationReason,
        equipmentTag: equipmentTag as EquipmentTags, // Cast to EquipmentTags
        createdById,
        ownershipType: ownershipType as OwnershipType, // Cast to OwnershipType
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (destination) {
      await prisma.equipmentHauled.create({
        data: {
          equipmentId: newEquipment.id,
          destination,
        },
      });
    }

    return newEquipment;
  });

  return result;
}
