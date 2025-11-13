// server/src/services/equipmentService.ts

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6440712e-1865-5494-a587-b4e4e918807d")}catch(e){}}();
import prisma from "../lib/prisma.js";
import { EquipmentTags, OwnershipType } from "../../generated/prisma/client.js";
export async function getEquipment(query) {
    if (query.qrg) {
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
    }
    else {
        return prisma.equipment.findMany();
    }
}
export async function getEquipmentMileageService(equipmentId) {
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
export async function getEquipmentByQrId(qrId) {
    return await prisma.equipment.findFirst({ where: { qrId } });
}
// Create equipment (POST)
export async function createEquipment(data) {
    const { ownershipType, createdById, equipmentTag, name, creationReason, destination, qrId, description = "", } = data;
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
                equipmentTag: equipmentTag, // Cast to EquipmentTags
                createdById,
                ownershipType: ownershipType, // Cast to OwnershipType
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
//# sourceMappingURL=equipmentService.js.map
//# debugId=6440712e-1865-5494-a587-b4e4e918807d
