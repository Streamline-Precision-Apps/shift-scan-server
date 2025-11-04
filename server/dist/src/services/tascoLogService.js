
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0d384df8-d225-51d5-a8e6-d6bbc4e0caa7")}catch(e){}}();
import prisma from "../lib/prisma.js";
/**
 * TascoLog Service Layer
 * Handles all Prisma database operations for Tasco-related entities
 */
// ============================================================================
// TASCO LOG CRUD OPERATIONS
// ============================================================================
/**
 * Get a single Tasco Log by ID with all relations
 */
export async function getTascoLogById(tascoLogId) {
    return await prisma.tascoLog.findUnique({
        where: { id: tascoLogId },
        include: {
            Equipment: true,
            TascoMaterialTypes: true,
            TimeSheet: true,
            RefuelLogs: true,
            TascoFLoads: true,
        },
    });
}
/**
 * Get all Tasco Logs for a timesheet
 */
export async function getTascoLogsByTimesheet(timeSheetId) {
    return await prisma.tascoLog.findMany({
        where: { timeSheetId },
        include: {
            Equipment: true,
            TascoMaterialTypes: true,
            RefuelLogs: true,
            TascoFLoads: true,
        },
    });
}
/**
 * Update Tasco Log (load quantity)
 */
export async function updateTascoLogLoadQuantity(tascoLogId, loadCount) {
    return await prisma.tascoLog.update({
        where: { id: tascoLogId },
        data: {
            LoadQuantity: loadCount,
        },
        include: {
            Equipment: true,
            TascoMaterialTypes: true,
            RefuelLogs: true,
            TascoFLoads: true,
        },
    });
}
/**
 * Update Tasco Log comment (through TimeSheet relation)
 */
export async function updateTascoLogComment(tascoLogId, comment) {
    return await prisma.tascoLog.update({
        where: { id: tascoLogId },
        data: {
            TimeSheet: {
                update: {
                    comment,
                },
            },
        },
        include: {
            TimeSheet: true,
            Equipment: true,
            TascoMaterialTypes: true,
            RefuelLogs: true,
            TascoFLoads: true,
        },
    });
}
// ============================================================================
// REFUEL LOG CRUD OPERATIONS
// ============================================================================
/**
 * Create a new Refuel Log for Tasco
 */
export async function createTascoRefuelLog(tascoLogId) {
    return await prisma.refuelLog.create({
        data: {
            tascoLogId,
            gallonsRefueled: 0,
        },
    });
}
/**
 * Get all Refuel Logs for a Tasco Log
 */
export async function getTascoRefuelLogs(tascoLogId) {
    return await prisma.refuelLog.findMany({
        where: { tascoLogId },
    });
}
/**
 * Update Refuel Log
 */
export async function updateTascoRefuelLog(refuelLogId, gallonsRefueled, milesAtFueling) {
    const updateData = {};
    if (gallonsRefueled !== undefined) {
        updateData.gallonsRefueled = gallonsRefueled;
    }
    if (milesAtFueling !== undefined) {
        updateData.milesAtFueling = milesAtFueling;
    }
    return await prisma.refuelLog.update({
        where: { id: refuelLogId },
        data: updateData,
    });
}
/**
 * Delete Refuel Log
 */
export async function deleteTascoRefuelLog(refuelLogId) {
    return await prisma.refuelLog.delete({
        where: { id: refuelLogId },
    });
}
// ============================================================================
// TASCO F-LOADS CRUD OPERATIONS
// ============================================================================
/**
 * Create a new TascoFLoad
 */
export async function createTascoFLoad(tascoLogId) {
    return await prisma.tascoFLoads.create({
        data: {
            tascoLogId,
            weight: null,
            screenType: null,
        },
    });
}
/**
 * Get all TascoFLoads for a Tasco Log
 */
export async function getTascoFLoads(tascoLogId) {
    return await prisma.tascoFLoads.findMany({
        where: { tascoLogId },
    });
}
/**
 * Update TascoFLoad
 */
export async function updateTascoFLoad(fLoadId, weight, screenType) {
    const updateData = {};
    if (weight !== undefined) {
        updateData.weight = weight;
    }
    if (screenType !== undefined) {
        updateData.screenType = screenType;
    }
    return await prisma.tascoFLoads.update({
        where: { id: fLoadId },
        data: updateData,
    });
}
/**
 * Delete TascoFLoad
 */
export async function deleteTascoFLoad(fLoadId) {
    return await prisma.tascoFLoads.delete({
        where: { id: fLoadId },
    });
}
// ============================================================================
// BULK/TRANSACTION OPERATIONS
// ============================================================================
/**
 * Get complete Tasco Log data including all nested relations
 */
export async function getCompleteTascoLogData(tascoLogId) {
    return await prisma.tascoLog.findUnique({
        where: { id: tascoLogId },
        include: {
            TimeSheet: true,
            Equipment: true,
            TascoMaterialTypes: true,
            RefuelLogs: true,
            TascoFLoads: true,
        },
    });
}
/**
 * Delete entire Tasco Log with all relations (cascades handled by Prisma)
 */
export async function deleteTascoLog(tascoLogId) {
    return await prisma.tascoLog.delete({
        where: { id: tascoLogId },
    });
}
export async function getTascoLogId(userId) {
    return await prisma.timeSheet.findFirst({
        where: {
            userId,
            endTime: null,
        },
        select: {
            TascoLogs: {
                select: {
                    id: true,
                },
            },
        },
    });
}
export async function getTascoLogComment(tascoLogId) {
    return await prisma.tascoLog.findFirst({
        where: {
            id: tascoLogId,
        },
        select: {
            TimeSheet: {
                select: {
                    comment: true,
                },
            },
        },
    });
}
export async function getTascoLogFLoad(tascoLogId) {
    return await prisma.tascoFLoads.findMany({
        where: {
            tascoLogId: tascoLogId,
        },
    });
}
export async function getTascoLogLoadCount(tascoLogId) {
    return await prisma.tascoLog.findFirst({
        where: {
            id: tascoLogId,
        },
        select: {
            LoadQuantity: true,
        },
    });
}
export async function getTascoLogRefuelLogs(tascoLogId) {
    return await prisma.refuelLog.findMany({
        where: {
            tascoLogId,
        },
    });
}
/**
 * Get the active Tasco Log for a user (from their active timesheet)
 */
export async function getActiveTascoLogForUser(userId) {
    const activeTimesheet = await prisma.timeSheet.findFirst({
        where: {
            userId,
            endTime: null, // Active timesheet has no end time
        },
        select: {
            TascoLogs: {
                take: 1, // Get the first (or most recent) Tasco Log
            },
        },
    });
    if (!activeTimesheet || activeTimesheet.TascoLogs.length === 0) {
        return null;
    }
    return activeTimesheet.TascoLogs[0];
}
//# sourceMappingURL=tascoLogService.js.map
//# debugId=0d384df8-d225-51d5-a8e6-d6bbc4e0caa7
