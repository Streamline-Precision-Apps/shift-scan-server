
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="64191375-1e4c-53e1-9f86-ed6ad3219552")}catch(e){}}();
import { Router } from "express";
import { updateTimesheet, getUserTimesheetsByDateController, getTimesheetDetailsManagerController, getManagerCrewTimesheetsController, approveTimesheetsBatchController, createTimesheetAndSwitchJobsController, getRecentTimesheetController, getTimesheetActiveStatusController, getBannerDataController, getDashboardLogsController, getClockOutCommentController, getUserEquipmentLogsController, getUserRecentJobsiteDetailsController, createEmployeeEquipmentLogController, getEmployeeEquipmentLogDetailsController, deleteEmployeeEquipmentLogController, updateEmployeeEquipmentLogController, updateClockOutController, getRecentReturnTimesheetController, getPreviousWorkController, getContinueTimesheetController, deleteRefuelLogController, } from "../controllers/timesheetController.js";
const router = Router();
// Batch approve timesheets
router.post("/approve-batch", approveTimesheetsBatchController);
//create a timesheet
router.post("/create", createTimesheetAndSwitchJobsController);
router.get("/user/:userId/recent", getRecentTimesheetController);
router.get("/user/:userId/return", getRecentReturnTimesheetController);
// Get active timesheet status for a user
router.get("/user/:userId/active-status", getTimesheetActiveStatusController);
// Get dashboard logs for a user
router.get("/user/:userId/dashboard-logs", getDashboardLogsController);
router.get("/user/:userId/clockOutComment", getClockOutCommentController);
// Get today's timesheets and signature for a user
import { getClockOutDetailsController } from "../controllers/timesheetController.js";
router.get("/user/:userId/clock-out-details", getClockOutDetailsController);
// check if there is an ongoing timesheet to continue
router.get("/:id/user/:userId/continue-timesheet", getContinueTimesheetController);
// Update a timesheet
router.put("/:id/clock-out", updateClockOutController);
router.put("/:id", updateTimesheet);
// Get previous work details for a timesheet
router.get("/:id/previous-work", getPreviousWorkController);
// Update a timesheet
router.get("/:id/user/:userId", getBannerDataController);
// Get timesheet details for manager editing
router.get("/:id/details", getTimesheetDetailsManagerController);
// Get timesheets for a user by userId and optional date
router.get("/user/:userId", getUserTimesheetsByDateController);
router.get("/user/:userId/equipmentLogs", getUserEquipmentLogsController);
router.get("/user/:userId/recentJobDetails", getUserRecentJobsiteDetailsController);
// Create a new employee equipment log
router.post("/equipment-log", createEmployeeEquipmentLogController);
// Get details of a specific employee equipment log by logId
router.get("/equipment-log/:logId", getEmployeeEquipmentLogDetailsController);
router.delete("/equipment-log/:logId", deleteEmployeeEquipmentLogController);
// Update an employee equipment log
router.put("/equipment-log/:logId", updateEmployeeEquipmentLogController);
// Delete a refuel log
router.delete("/refuel-log/:refuelLogId", deleteRefuelLogController);
// Get all timesheets for all users in a manager's crew
router.get("/manager/:managerId/crew-timesheets", getManagerCrewTimesheetsController);
export default router;
//# sourceMappingURL=timesheetRoute.js.map
//# debugId=64191375-1e4c-53e1-9f86-ed6ad3219552
