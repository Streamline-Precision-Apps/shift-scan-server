
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="193b4e89-fbbd-5417-a6a2-e809fcf2abad")}catch(e){}}();
import Express from "express";
import { getMechanicLogsService, createMechanicLogService, updateMechanicLogService, deleteMechanicLogService, getMechanicLogService, } from "../services/mechanicService.js";
export async function getMechanicLogsController(req, res) {
    // Implementation for getting mechanic logs
    try {
        const { timesheetId } = req.params;
        if (!timesheetId) {
            return res
                .status(400)
                .json({ error: " TimesheetId parameter is required." });
        }
        const parsedTimesheetId = parseInt(timesheetId, 10);
        const status = await getMechanicLogsService(parsedTimesheetId);
        // Return 204 No Content if no projects found
        if (!status || status.length === 0) {
            return res.status(204).send();
        }
        return res.json(status);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch mechanic logs." });
    }
}
export async function getMechanicLogController(req, res) {
    // Implementation for getting mechanic logs
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: " ID parameter is required." });
        }
        const parsedId = parseInt(id, 10);
        const status = await getMechanicLogService(parsedId);
        if (!status) {
            throw new Error("No mechanic logs found for the given ID.");
        }
        return res.json(status);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch mechanic logs." });
    }
}
export async function createMechanicProjectController(req, res) {
    try {
        const { timeSheetId, equipmentId, hours, description } = req.body;
        if (!timeSheetId || !equipmentId) {
            return res.status(400).json({
                error: "timeSheetId and equipmentId are required.",
            });
        }
        const project = await createMechanicLogService({
            timeSheetId: Number(timeSheetId),
            equipmentId,
            hours: hours ? Number(hours) : 0,
            description: description || "",
        });
        return res.status(201).json(project);
    }
    catch (error) {
        console.error("Error creating mechanic project:", error);
        return res
            .status(500)
            .json({ error: "Failed to create mechanic project." });
    }
}
export async function updateMechanicProjectController(req, res) {
    try {
        const { id } = req.params;
        const { equipmentId, hours, description } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Project ID is required." });
        }
        const updatePayload = {};
        if (equipmentId)
            updatePayload.equipmentId = equipmentId;
        if (hours !== undefined)
            updatePayload.hours = Number(hours);
        if (description !== undefined)
            updatePayload.description = description;
        const project = await updateMechanicLogService(Number(id), updatePayload);
        return res.json(project);
    }
    catch (error) {
        console.error("Error updating mechanic project:", error);
        return res
            .status(500)
            .json({ error: "Failed to update mechanic project." });
    }
}
export async function deleteMechanicProjectController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Project ID is required." });
        }
        await deleteMechanicLogService(Number(id));
        return res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting mechanic project:", error);
        return res
            .status(500)
            .json({ error: "Failed to delete mechanic project." });
    }
}
//# sourceMappingURL=mechanicLogsController.js.map
//# debugId=193b4e89-fbbd-5417-a6a2-e809fcf2abad
