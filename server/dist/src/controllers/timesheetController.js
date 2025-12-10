
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="48855e2e-2781-5bb3-b5b8-4537ccb850a5")}catch(e){}}();
import { createGeneralTimesheetService, approveTimesheetsBatchService, updateTimesheetService, getUserTimesheetsByDate, getTimesheetDetailsManager, getManagerCrewTimesheets, createMechanicTimesheetService, createTascoTimesheetService, createTruckDriverTimesheetService, getRecentTimeSheetForUser, getTimesheetActiveStatus, getBannerDataForTimesheet, getLogsForDashboard, getClockOutComment, getEquipmentLogs, getRecentJobDetails, createEmployeeEquipmentLogService, getEmployeeEquipmentLogDetails, deleteEmployeeEquipmentLog, updateEmployeeEquipmentLogService, getClockOutDetailsService, updateClockOutService, getPreviousTimesheet, returnToPreviousTimesheetService, getContinueTimesheetService, deleteRefuelLogService, getAllEquipmentLogs, } from "../services/timesheetService.js";
import Express from "express";
// GET /v1/timesheet/user/:userId/active-status
export async function getTimesheetActiveStatusController(req, res) {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId parameter is required." });
        }
        const status = await getTimesheetActiveStatus({ userId });
        return res.json({ success: true, data: status });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Failed to fetch active timesheet status." });
    }
}
// GET /v1/timesheet/user/:userId/recent
export async function getRecentTimesheetController(req, res) {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId parameter is required." });
        }
        const timesheet = await getRecentTimeSheetForUser(userId);
        if (!timesheet) {
            return res.status(204).json();
        }
        return res.json({ success: true, data: timesheet });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch recent timesheet." });
    }
}
export async function getRecentReturnTimesheetController(req, res) {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId parameter is required." });
        }
        const timesheet = await getPreviousTimesheet(userId);
        if (!timesheet) {
            return res.status(204).json();
        }
        return res.json({ success: true, data: timesheet });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch recent timesheet." });
    }
}
// PUT /v1/timesheet/:id
export async function updateTimesheet(req, res) {
    try {
        const id = Number(req.params.id);
        const { editorId, changes, changeReason, numberOfChanges, startTime, endTime, Jobsite, CostCode, comment, } = req.body;
        console.log("[UpdateTimesheet] PUT /v1/timesheet/:id", {
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
        });
        if (!id) {
            console.error("[UpdateTimesheet] Missing timesheet id", req.params.id);
            return res
                .status(400)
                .json({ error: "Timesheet ID is required for update." });
        }
        if (!editorId) {
            console.error("[UpdateTimesheet] Missing editorId");
            return res
                .status(400)
                .json({ error: "Editor ID is required for tracking changes." });
        }
        const result = await updateTimesheetService({
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
        });
        if (result.error) {
            console.error("[UpdateTimesheet] Service error:", result.error);
            return res.status(400).json({ error: result.error });
        }
        return res.json(result);
    }
    catch (error) {
        console.error("[UpdateTimesheet] Unexpected error:", error);
        return res.status(500).json({
            error: "Failed to update timesheet.",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
// GET /v1/timesheet/user/:userId?date=YYYY-MM-DD
export async function getUserTimesheetsByDateController(req, res) {
    try {
        const userId = req.params.userId;
        const date = req.query.date;
        console.log("Fetching timesheets for userId:", userId, "date:", date);
        if (!userId) {
            return res.status(400).json({ error: "userId parameter is required." });
        }
        const timesheets = await getUserTimesheetsByDate({
            employeeId: userId,
            dateParam: date,
        });
        if (!timesheets || timesheets.length === 0) {
            return res.status(204).send();
        }
        return res.json({ success: true, data: timesheets });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch user timesheets." });
    }
}
// GET /v1/timesheet/:id/details
export async function getTimesheetDetailsManagerController(req, res) {
    try {
        const timesheetId = Number(req.params.id);
        if (!timesheetId) {
            return res.status(400).json({ error: "Timesheet ID is required." });
        }
        const details = await getTimesheetDetailsManager({ timesheetId });
        if (!details) {
            return res.status(404).json({ error: "Timesheet not found." });
        }
        return res.json({ success: true, data: details });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Failed to fetch timesheet details." });
    }
}
// GET /v1/timesheet/manager/:managerId/crew-timesheets
export async function getManagerCrewTimesheetsController(req, res) {
    try {
        const managerId = req.params.managerId;
        if (!managerId) {
            return res
                .status(400)
                .json({ error: "managerId parameter is required." });
        }
        // Call the service to get all timesheets for all users in the manager's crew
        const crewTimesheets = await getManagerCrewTimesheets({ managerId });
        return res.json({ success: true, data: crewTimesheets });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch crew timesheets." });
    }
}
// POST /v1/timesheet/approve-batch
export async function approveTimesheetsBatchController(req, res) {
    try {
        let { id: userId, timesheetIds, statusComment, editorId } = req.body;
        // Log incoming body for debugging
        console.log("[approveTimesheetsBatchController] Incoming body:", req.body);
        // If timesheetIds is a string (from FormData), try to parse it
        if (typeof timesheetIds === "string") {
            try {
                timesheetIds = JSON.parse(timesheetIds);
            }
            catch (e) {
                return res.status(400).json({ error: "Invalid timesheetIds format." });
            }
        }
        // Coerce all timesheetIds to numbers
        if (Array.isArray(timesheetIds)) {
            timesheetIds = timesheetIds.map((id) => Number(id));
        }
        if (!userId ||
            !Array.isArray(timesheetIds) ||
            timesheetIds.length === 0 ||
            !editorId) {
            return res.status(400).json({
                error: "userId, timesheetIds (array), and editorId are required.",
            });
        }
        const result = await approveTimesheetsBatchService({
            userId,
            timesheetIds,
            statusComment: statusComment || "",
            editorId,
        });
        if (!result.success) {
            return res
                .status(400)
                .json({ error: result.error || "Failed to approve timesheets." });
        }
        return res.json({ success: true });
    }
    catch (error) {
        console.error("[approveTimesheetsBatchController] Unexpected error:", error);
        return res.status(500).json({ error: "Failed to approve timesheets." });
    }
}
// POST /v1/timesheet/create
export async function createTimesheetAndSwitchJobsController(req, res) {
    try {
        const body = req.body;
        console.log("[createTimesheetController] Request body:", JSON.stringify(body, null, 2));
        const { workType, type, ...rest } = body;
        console.log("[createTimesheetController] workType:", workType, "type:", type);
        let result;
        switch (workType) {
            case "general":
                result = await createGeneralTimesheetService({
                    data: { ...rest, workType },
                    type,
                });
                break;
            case "mechanic":
                result = await createMechanicTimesheetService({
                    data: { ...rest, workType },
                    type,
                });
                break;
            case "tasco":
                result = await createTascoTimesheetService({
                    data: { ...rest, workType },
                    type,
                });
                break;
            case "truck":
                result = await createTruckDriverTimesheetService({
                    data: { ...rest, workType },
                    type,
                });
                break;
            default:
                return res.status(400).json({ error: "Invalid workType" });
        }
        console.log("[createTimesheetController] Successfully created timesheet");
        return res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        console.error("[createTimesheetController] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(500).json({
            error: "Failed to create timesheet.",
            details: errorMessage,
        });
    }
}
// GET /v1/timesheet/:id/user/:userId
export async function getBannerDataController(req, res) {
    try {
        const timesheetId = Number(req.params.id);
        const userId = req.params.userId;
        if (!timesheetId || !userId) {
            return res
                .status(400)
                .json({ error: "Both timesheet id and userId are required." });
        }
        const bannerData = await getBannerDataForTimesheet(timesheetId, userId);
        return res.json({ success: true, data: bannerData });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch banner data." });
    }
}
// GET /v1/timesheet/user/:userId/dashboard-logs
export async function getDashboardLogsController(req, res) {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId parameter is required." });
        }
        const logs = await getLogsForDashboard(userId);
        return res.json({ success: true, data: logs });
    }
    catch (error) {
        console.error("[getDashboardLogsController] Error:", error);
        return res.status(500).json({ error: "Failed to fetch dashboard logs." });
    }
}
// GET /v1/timesheet/user/:userId/clockOutComment
export async function getClockOutCommentController(req, res) {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId parameter is required." });
        }
        const comment = await getClockOutComment(userId);
        return res.json({ success: true, data: comment });
    }
    catch (error) {
        console.error("[getClockOutCommentController] Error:", error);
        return res
            .status(500)
            .json({ error: "Failed to fetch clock out comment." });
    }
}
// GET /v1/timesheet/user/:userId/equipmentLogs
export async function getUserEquipmentLogsController(req, res) {
    try {
        const userId = req.params.userId;
        const timesheetIdString = req.query.timesheetId;
        if (!userId || !timesheetIdString) {
            return res
                .status(400)
                .json({ error: "Invalid Request - parameters are required." });
        }
        const timesheetId = Number(timesheetIdString);
        const logs = await getEquipmentLogs(userId, timesheetId);
        return res.json({ success: true, data: logs });
    }
    catch (error) {
        console.error("[getUserEquipmentLogsController] Error:", error);
        return res.status(500).json({ error: "Failed to fetch equipment logs." });
    }
}
// GET /v1/timesheet/user/:userId/equipmentLogs
export async function getUserRecentJobsiteDetailsController(req, res) {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId parameter is required." });
        }
        const logs = await getRecentJobDetails(userId);
        return res.json({ success: true, data: logs });
    }
    catch (error) {
        console.error("[getUserRecentJobsiteDetailsController] Error:", error);
        return res
            .status(500)
            .json({ error: "Failed to fetch recent jobsite details." });
    }
}
// GET /v1/timesheet/equipment-log
export async function getAllEquipmentLogsController(req, res) {
    try {
        const logs = await getAllEquipmentLogs();
        return res.json({ success: true, data: logs });
    }
    catch (error) {
        console.error("[getAllEquipmentLogsController] Error:", error);
        return res.status(500).json({ error: "Failed to fetch equipment logs." });
    }
}
// POST /v1/timesheet/equipment-log
export async function createEmployeeEquipmentLogController(req, res) {
    try {
        const { equipmentId, timeSheetId, endTime, comment } = req.body;
        console.log("server", equipmentId);
        if (!equipmentId) {
            return res.status(400).json({
                error: "Equipment ID  are required.",
            });
        }
        if (!timeSheetId) {
            return res.status(400).json({ error: "TimeSheet ID is required." });
        }
        const newLog = await createEmployeeEquipmentLogService({
            equipmentId,
            timeSheetId,
            endTime,
            comment,
        });
        return res.status(201).json({ success: true, data: newLog });
    }
    catch (error) {
        console.error("[createEmployeeEquipmentLogController] Error:", error);
        return res.status(500).json({
            error: "Failed to create employee equipment log.",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
// GET /v1/timesheet/equipment-log/:logId
export async function getEmployeeEquipmentLogDetailsController(req, res) {
    try {
        const logId = req.params.logId;
        if (!logId) {
            return res.status(400).json({ error: "logId parameter is required." });
        }
        const logDetails = await getEmployeeEquipmentLogDetails(logId);
        if (!logDetails) {
            return res.status(404).json({ error: "Log not found." });
        }
        return res.json({ success: true, data: logDetails });
    }
    catch (error) {
        console.error("[getEmployeeEquipmentLogDetailsController] Error:", error);
        return res.status(500).json({
            error: "Failed to fetch employee equipment log details.",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
// Delete/v1/timesheet/equipment-log/:logId
export async function deleteEmployeeEquipmentLogController(req, res) {
    try {
        const logId = req.params.logId;
        if (!logId) {
            return res.status(400).json({ error: "logId parameter is required." });
        }
        // Call the service to delete the log
        await deleteEmployeeEquipmentLog(logId);
        // Return a success response
        return res.status(200).json({
            success: true,
            message: `Log with ID ${logId} has been successfully deleted.`,
        });
    }
    catch (error) {
        console.error("[deleteEmployeeEquipmentLogController] Error:", error);
        return res.status(500).json({
            error: "Failed to delete employee equipment log.",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
// PUT /v1/timesheet/equipment-log/:logId
export async function updateEmployeeEquipmentLogController(req, res) {
    try {
        const id = req.params.logId;
        const { equipmentId, startTime, endTime, comment, status, disconnectRefuelLog, refuelLogId, gallonsRefueled, } = req.body;
        if (!id || !equipmentId || !startTime) {
            return res.status(400).json({
                error: "Missing required fields: id, equipmentId, or startTime",
            });
        }
        const result = await updateEmployeeEquipmentLogService({
            id,
            equipmentId,
            startTime,
            endTime,
            comment,
            status,
            disconnectRefuelLog,
            refuelLogId,
            gallonsRefueled,
        });
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("[updateEmployeeEquipmentLogController] Error:", error);
        return res.status(500).json({
            error: "Failed to update employee equipment log.",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
// GET /v1/timesheet/user/:userId/clock-out-details
export async function getClockOutDetailsController(req, res) {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: "userId parameter is required." });
        }
        const details = await getClockOutDetailsService(userId);
        return res.json({ success: true, data: details });
    }
    catch (error) {
        console.error("[getClockOutDetailsController] Error:", error);
        return res.status(500).json({
            error: "Failed to fetch clock out details.",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
export async function updateClockOutController(req, res) {
    try {
        const timeSheetId = req.params.id;
        const { userId, endTime, timeSheetComments, wasInjured, clockOutLat, clockOutLong, } = req.body;
        if (!timeSheetId) {
            return res
                .status(400)
                .json({ error: "timeSheetId parameter is required." });
        }
        const details = await updateClockOutService(timeSheetId, userId, endTime, timeSheetComments, wasInjured, clockOutLat, clockOutLong);
        return res.json({ success: true, data: details });
    }
    catch (error) {
        console.error("[updateClockOutController] Error:", error);
        return res.status(500).json({
            error: "Failed to update clock out details.",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
// GET /v1/timesheet/:timesheetId/previous-work
export async function getPreviousWorkController(req, res) {
    try {
        const timesheetId = Number(req.params.id);
        if (!timesheetId) {
            return res
                .status(400)
                .json({ error: "timesheetId parameter is required." });
        }
        const previousWork = await returnToPreviousTimesheetService(timesheetId);
        if (!previousWork) {
            return res.status(404).json({ error: "Previous work not found." });
        }
        return res.json({ success: true, data: previousWork });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to fetch previous work." });
    }
}
// GET /v1/timesheet/:id/user/:userId/continue-timesheet
export async function getContinueTimesheetController(req, res) {
    try {
        const id = Number(req.params.id);
        const userId = req.params.userId;
        if (!id) {
            return res
                .status(400)
                .json({ error: "Timesheet ID parameter is required." });
        }
        if (!userId) {
            return res.status(400).json({ error: "User ID parameter is required." });
        }
        const timesheet = await getContinueTimesheetService(id, userId);
        if (!timesheet) {
            return res.status(404).json({
                error: "Incomplete timesheet not found or already completed.",
            });
        }
        return res.json({ success: true, data: timesheet });
    }
    catch (error) {
        console.error("[getContinueTimesheetController] Error:", error);
        return res.status(500).json({
            error: "Failed to fetch continue timesheet.",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
export async function deleteRefuelLogController(req, res) {
    try {
        const { refuelLogId } = req.params;
        if (!refuelLogId) {
            return res.status(400).json({ error: "Refuel log ID is required." });
        }
        const result = await deleteRefuelLogService(refuelLogId);
        return res.json(result);
    }
    catch (error) {
        console.error("[deleteRefuelLogController] Error:", error);
        return res.status(500).json({
            error: "Failed to delete refuel log.",
            details: error instanceof Error ? error.message : String(error),
        });
    }
}
//# sourceMappingURL=timesheetController.js.map
//# debugId=48855e2e-2781-5bb3-b5b8-4537ccb850a5
