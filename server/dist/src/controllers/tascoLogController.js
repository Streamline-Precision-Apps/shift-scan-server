
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="930913c2-f068-5c3b-956b-50c53de6fead")}catch(e){}}();
import { getTascoLogById, getTascoLogsByTimesheet, updateTascoLogLoadQuantity, updateTascoLogComment, createTascoRefuelLog, getTascoRefuelLogs, updateTascoRefuelLog, deleteTascoRefuelLog, createTascoFLoad, getTascoFLoads, updateTascoFLoad, deleteTascoFLoad, getCompleteTascoLogData, deleteTascoLog, getActiveTascoLogForUser, } from "../services/tascoLogService.js";
/**
 * TascoLog Controller
 * Handles HTTP requests and responses for Tasco-related operations
 */
// ============================================================================
// TASCO LOG ENDPOINTS
// ============================================================================
/**
 * GET /api/v1/tasco-logs/:id
 * Get a single Tasco Log by ID
 */
export async function getTascoLogController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        const tascoLog = await getTascoLogById(id);
        if (!tascoLog) {
            res.status(404).json({ error: "Tasco Log not found." });
            return;
        }
        res.status(200).json({ success: true, data: tascoLog });
    }
    catch (error) {
        console.error("[getTascoLogController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to fetch Tasco Log.",
            details: errorMessage,
        });
    }
}
/**
 * GET /api/v1/tasco-logs/timesheet/:timesheetId
 * Get all Tasco Logs for a timesheet
 */
export async function getTascoLogsByTimesheetController(req, res) {
    try {
        const { timesheetId } = req.params;
        if (!timesheetId) {
            res.status(400).json({ error: "Timesheet ID is required." });
            return;
        }
        const tascoLogs = await getTascoLogsByTimesheet(Number(timesheetId));
        res.status(200).json({ success: true, data: tascoLogs });
    }
    catch (error) {
        console.error("[getTascoLogsByTimesheetController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to fetch Tasco Logs.",
            details: errorMessage,
        });
    }
}
/**
 * PUT /api/v1/tasco-logs/:id/load-quantity
 * Update Tasco Log load quantity
 */
export async function updateLoadQuantityController(req, res) {
    try {
        const { id } = req.params;
        const { loadCount } = req.body;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        if (typeof loadCount !== "number") {
            res.status(400).json({ error: "Load count must be a number." });
            return;
        }
        const updatedLog = await updateTascoLogLoadQuantity(id, loadCount);
        res.status(200).json({ success: true, data: updatedLog });
    }
    catch (error) {
        console.error("[updateLoadQuantityController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to update load quantity.",
            details: errorMessage,
        });
    }
}
/**
 * PUT /api/v1/tasco-logs/:id/comment
 * Update Tasco Log comment
 */
export async function updateTascoCommentController(req, res) {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        if (typeof comment !== "string") {
            res.status(400).json({ error: "Comment must be a string." });
            return;
        }
        const updatedLog = await updateTascoLogComment(id, comment);
        res.status(200).json({ success: true, data: updatedLog });
    }
    catch (error) {
        console.error("[updateTascoCommentController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to update comment.",
            details: errorMessage,
        });
    }
}
// ============================================================================
// REFUEL LOG ENDPOINTS
// ============================================================================
/**
 * POST /api/v1/tasco-logs/:id/refuel-logs
 * Create a new Refuel Log
 */
export async function createRefuelLogController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        const refuelLog = await createTascoRefuelLog(id);
        res.status(201).json({ success: true, data: refuelLog });
    }
    catch (error) {
        console.error("[createRefuelLogController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to create Refuel Log.",
            details: errorMessage,
        });
    }
}
/**
 * GET /api/v1/tasco-logs/:id/refuel-logs
 * Get all Refuel Logs for a Tasco Log
 */
export async function getRefuelLogsController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        const refuelLogs = await getTascoRefuelLogs(id);
        res.status(200).json({ success: true, data: refuelLogs });
    }
    catch (error) {
        console.error("[getRefuelLogsController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to fetch Refuel Logs.",
            details: errorMessage,
        });
    }
}
/**
 * PUT /api/v1/tasco-logs/refuel-logs/:refuelLogId
 * Update a Refuel Log
 */
export async function updateRefuelLogController(req, res) {
    try {
        const { refuelLogId } = req.params;
        const { gallonsRefueled, milesAtFueling } = req.body;
        if (!refuelLogId) {
            res.status(400).json({ error: "Refuel Log ID is required." });
            return;
        }
        const updatedRefuel = await updateTascoRefuelLog(refuelLogId, gallonsRefueled, milesAtFueling);
        res.status(200).json({ success: true, data: updatedRefuel });
    }
    catch (error) {
        console.error("[updateRefuelLogController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to update Refuel Log.",
            details: errorMessage,
        });
    }
}
/**
 * DELETE /api/v1/tasco-logs/refuel-logs/:refuelLogId
 * Delete a Refuel Log
 */
export async function deleteRefuelLogController(req, res) {
    try {
        const { refuelLogId } = req.params;
        if (!refuelLogId) {
            res.status(400).json({ error: "Refuel Log ID is required." });
            return;
        }
        await deleteTascoRefuelLog(refuelLogId);
        res.status(200).json({ success: true, message: "Refuel Log deleted." });
    }
    catch (error) {
        console.error("[deleteRefuelLogController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to delete Refuel Log.",
            details: errorMessage,
        });
    }
}
// ============================================================================
// TASCO F-LOADS ENDPOINTS
// ============================================================================
/**
 * POST /api/v1/tasco-logs/:id/f-loads
 * Create a new TascoFLoad
 */
export async function createFLoadController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        const fLoad = await createTascoFLoad(id);
        res.status(201).json({ success: true, data: fLoad });
    }
    catch (error) {
        console.error("[createFLoadController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to create F-Load.",
            details: errorMessage,
        });
    }
}
/**
 * GET /api/v1/tasco-logs/:id/f-loads
 * Get all F-Loads for a Tasco Log
 */
export async function getFLoadsController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        const fLoads = await getTascoFLoads(id);
        res.status(200).json({ success: true, data: fLoads });
    }
    catch (error) {
        console.error("[getFLoadsController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to fetch F-Loads.",
            details: errorMessage,
        });
    }
}
/**
 * PUT /api/v1/tasco-logs/f-loads/:fLoadId
 * Update a TascoFLoad
 */
export async function updateFLoadController(req, res) {
    try {
        const { fLoadId } = req.params;
        const { weight, screenType } = req.body;
        if (!fLoadId) {
            res.status(400).json({ error: "F-Load ID is required." });
            return;
        }
        const updatedFLoad = await updateTascoFLoad(Number(fLoadId), weight, screenType);
        res.status(200).json({ success: true, data: updatedFLoad });
    }
    catch (error) {
        console.error("[updateFLoadController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to update F-Load.",
            details: errorMessage,
        });
    }
}
/**
 * DELETE /api/v1/tasco-logs/f-loads/:fLoadId
 * Delete a TascoFLoad
 */
export async function deleteFLoadController(req, res) {
    try {
        const { fLoadId } = req.params;
        if (!fLoadId) {
            res.status(400).json({ error: "F-Load ID is required." });
            return;
        }
        await deleteTascoFLoad(Number(fLoadId));
        res.status(200).json({ success: true, message: "F-Load deleted." });
    }
    catch (error) {
        console.error("[deleteFLoadController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to delete F-Load.",
            details: errorMessage,
        });
    }
}
// ============================================================================
// BULK OPERATIONS
// ============================================================================
/**
 * GET /api/v1/tasco-logs/:id/complete
 * Get complete Tasco Log data with all relations
 */
export async function getCompleteTascoLogController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        const tascoLog = await getCompleteTascoLogData(id);
        if (!tascoLog) {
            res.status(404).json({ error: "Tasco Log not found." });
            return;
        }
        res.status(200).json({ success: true, data: tascoLog });
    }
    catch (error) {
        console.error("[getCompleteTascoLogController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to fetch complete Tasco Log data.",
            details: errorMessage,
        });
    }
}
/**
 * DELETE /api/v1/tasco-logs/:id
 * Delete a Tasco Log (cascades to all related records)
 */
export async function deleteTascoLogController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        await deleteTascoLog(id);
        res.status(200).json({ success: true, message: "Tasco Log deleted." });
    }
    catch (error) {
        console.error("[deleteTascoLogController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to delete Tasco Log.",
            details: errorMessage,
        });
    }
}
// ============================================================================
// TASCO LOG FIELD GETTER - UNIFIED ENDPOINT
// ============================================================================
/**
 * GET /api/v1/tasco-logs/:id/field/:field
 * Get specific field data for a Tasco Log
 * Supported fields: comment, loadCount, refuelLogs, fLoads
 */
export async function getTascoLogFieldController(req, res) {
    try {
        const { id, field } = req.params;
        if (!id) {
            res.status(400).json({ error: "Tasco Log ID is required." });
            return;
        }
        if (!field) {
            res.status(400).json({ error: "Field parameter is required." });
            return;
        }
        let data;
        switch (field.toLowerCase()) {
            case "comment":
                const { getTascoLogComment } = await import("../services/tascoLogService.js");
                data = await getTascoLogComment(id);
                break;
            case "loadcount":
                const { getTascoLogLoadCount } = await import("../services/tascoLogService.js");
                data = await getTascoLogLoadCount(id);
                break;
            case "refuellogs":
                const { getTascoLogRefuelLogs } = await import("../services/tascoLogService.js");
                data = await getTascoLogRefuelLogs(id);
                break;
            case "floads":
                const { getTascoLogFLoad } = await import("../services/tascoLogService.js");
                data = await getTascoLogFLoad(id);
                break;
            default:
                res.status(400).json({
                    error: `Invalid field: ${field}. Supported fields: comment, loadCount, refuelLogs, fLoads`,
                });
                return;
        }
        // Empty responses are okay for comment, loadCount, refuelLogs, and fLoads
        res.status(200).json({ success: true, data: data || null });
    }
    catch (error) {
        console.error("[getTascoLogFieldController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to fetch Tasco Log field data.",
            details: errorMessage,
        });
    }
}
// ============================================================================
// ACTIVE TASCO LOG FOR USER
// ============================================================================
/**
 * GET /api/v1/tasco-logs/user/:userId/active
 * Get the active Tasco Log for a user
 */
export async function getActiveTascoLogController(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ error: "User ID is required." });
            return;
        }
        const activeTascoLog = await getActiveTascoLogForUser(userId);
        if (!activeTascoLog) {
            res.status(404).json({
                error: "No active Tasco Log found for this user.",
            });
            return;
        }
        res.status(200).json({ success: true, data: activeTascoLog });
    }
    catch (error) {
        console.error("[getActiveTascoLogController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            error: "Failed to fetch active Tasco Log.",
            details: errorMessage,
        });
    }
}
//# sourceMappingURL=tascoLogController.js.map
//# debugId=930913c2-f068-5c3b-956b-50c53de6fead
