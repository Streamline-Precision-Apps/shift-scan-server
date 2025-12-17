
import { Router } from "express";
import {
  updateTimesheet,
  getUserTimesheetsByDateController,
  getTimesheetDetailsManagerController,
  getManagerCrewTimesheetsController,
  approveTimesheetsBatchController,
  createTimesheetAndSwitchJobsController,
  getRecentTimesheetController,
  getTimesheetActiveStatusController,
  getBannerDataController,
  getDashboardLogsController,
  getClockOutCommentController,
  getUserEquipmentLogsController,
  getUserRecentJobsiteDetailsController,
  createEmployeeEquipmentLogController,
  getEmployeeEquipmentLogDetailsController,
  deleteEmployeeEquipmentLogController,
  updateEmployeeEquipmentLogController,
  updateClockOutController,
  getRecentReturnTimesheetController,
  getPreviousWorkController,
  getContinueTimesheetController,
  deleteRefuelLogController,
  getAllEquipmentLogsController,
} from "../controllers/timesheetController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  generalTimesheetSchema,
  updateTimesheetSchema,
  approveBatchSchema,
  createEquipmentLogSchema,
  updateEquipmentLogSchema,
  updateClockOutSchema,
} from "../lib/validation/app/timesheet.js";

const router = Router();

// Batch approve timesheets
router.post(
  "/approve-batch",
  validateRequest(approveBatchSchema),
  approveTimesheetsBatchController
);
// Create a timesheet
router.post(
  "/create",
  validateRequest(generalTimesheetSchema),
  createTimesheetAndSwitchJobsController
);

// Specific user routes (must come AFTER generic /user/:userId route)
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
router.get("/user/:userId/equipmentLogs", getUserEquipmentLogsController);
router.get(
  "/user/:userId/recentJobDetails",
  getUserRecentJobsiteDetailsController
);

// check if there is an ongoing timesheet to continue
router.get(
  "/:id/user/:userId/continue-timesheet",
  getContinueTimesheetController
);

// Update a timesheet (clock-out)
router.put(
  "/:id/clock-out",
  validateRequest(updateClockOutSchema),
  updateClockOutController
);
// Update a timesheet (general update)
router.put(
  "/:id",
  validateRequest(updateTimesheetSchema),
  updateTimesheet
);

// Get previous work details for a timesheet
router.get("/:id/previous-work", getPreviousWorkController);
// Get banner data for a timesheet
router.get("/:id/user/:userId", getBannerDataController);

// Get timesheet details for manager editing
router.get("/:id/details", getTimesheetDetailsManagerController);

// Generic user route (must come AFTER all specific /user/:userId/* routes)
router.get("/user/:userId", getUserTimesheetsByDateController);

router.get("/equipment-log", getAllEquipmentLogsController);

// Create a new employee equipment log
router.post(
  "/equipment-log",
  validateRequest(createEquipmentLogSchema),
  createEmployeeEquipmentLogController
);

// Get details of a specific employee equipment log by logId
router.get("/equipment-log/:logId", getEmployeeEquipmentLogDetailsController);

// Delete an employee equipment log
router.delete("/equipment-log/:logId", deleteEmployeeEquipmentLogController);

// Update an employee equipment log
router.put(
  "/equipment-log/:logId",
  validateRequest(updateEquipmentLogSchema),
  updateEmployeeEquipmentLogController
);

// Delete a refuel log
router.delete("/refuel-log/:refuelLogId", deleteRefuelLogController);

// Get all timesheets for all users in a manager's crew
router.get(
  "/manager/:managerId/crew-timesheets",
  getManagerCrewTimesheetsController
);

export default router;
