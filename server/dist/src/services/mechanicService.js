
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9a861f6f-85b5-5fef-817a-fefeddacedee")}catch(e){}}();
import prisma from "../lib/prisma.js";
export async function getMechanicLogsService(timesheetId) {
    const projects = await prisma.mechanicProjects.findMany({
        where: { timeSheetId: timesheetId },
        select: {
            id: true,
            equipmentId: true,
            description: true,
            hours: true,
            Equipment: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return projects;
}
export async function createMechanicLogService({ timeSheetId, equipmentId, hours, description, }) {
    return await prisma.mechanicProjects.create({
        data: {
            timeSheetId,
            equipmentId,
            hours: hours || 0,
            description: description || "",
        },
    });
}
export async function updateMechanicLogService(projectId, { equipmentId, hours, description, }) {
    const updateData = {};
    if (equipmentId)
        updateData.equipmentId = equipmentId;
    if (hours !== undefined)
        updateData.hours = hours;
    if (description !== undefined)
        updateData.description = description;
    return await prisma.mechanicProjects.update({
        where: { id: projectId },
        data: updateData,
    });
}
export async function deleteMechanicLogService(projectId) {
    return await prisma.mechanicProjects.delete({
        where: { id: projectId },
    });
}
export async function getMechanicLogService(id) {
    return await prisma.mechanicProjects.findUnique({
        where: { id },
        select: {
            id: true,
            equipmentId: true,
            description: true,
            hours: true,
            Equipment: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
}
//# sourceMappingURL=mechanicService.js.map
//# debugId=9a861f6f-85b5-5fef-817a-fefeddacedee
