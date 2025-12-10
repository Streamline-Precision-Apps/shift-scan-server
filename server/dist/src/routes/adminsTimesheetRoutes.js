
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8ea466d5-08d7-53df-b3fb-a39e33ba5a6b")}catch(e){}}();
import { Router } from "express";
import { getAllTimesheetsController, getTimesheetByIdController, createTimesheetController, updateTimesheetController, updateTimesheetStatusController, deleteTimesheetController, exportTimesheetsController, getTimesheetChangeLogsController, getAllTascoMaterialTypesController, resolveTimecardNotificationController, } from "../controllers/adminTimesheetController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = Router();
// Apply authentication to all routes
router.use(verifyToken);
/**
 * GET /api/v1/admins/timesheet
 * Get all timesheets with pagination, filtering, and search
 */
router.get("/", getAllTimesheetsController);
/**
 * GET /api/v1/admins/timesheet/tasco-material-types
 * Get all Tasco material types
 */
router.get("/tasco-material-types", getAllTascoMaterialTypesController);
/**
 * GET /api/v1/admins/timesheet/:id
 * Get a single timesheet by ID with all related data
 */
router.get("/:id", getTimesheetByIdController);
/**
 * GET /api/v1/admins/timesheet/:id/change-logs
 * Get change logs for a specific timesheet
 */
router.get("/:id/change-logs", getTimesheetChangeLogsController);
/**
 * POST /api/v1/admins/timesheet
 * Create a new timesheet (admin creation)
 */
router.post("/", createTimesheetController);
/**
 * POST /api/v1/admins/timesheet/export
 * Export timesheets to Excel
 */
router.post("/export", exportTimesheetsController);
/**
 * POST /api/v1/admins/timesheet/resolve-notification
 * Check timesheet status and resolve notification if already approved/rejected
 */
router.post("/resolve-notification", resolveTimecardNotificationController);
/**
 * PUT /api/v1/admins/timesheet/:id
 * Update a timesheet (optimized update with change tracking)
 */
router.put("/:id", updateTimesheetController);
/**
 * PUT /api/v1/admins/timesheet/:id/status
 * Update timesheet status (approve/deny)
 */
router.put("/:id/status", updateTimesheetStatusController);
/**
 * DELETE /api/v1/admins/timesheet/:id
 * Delete a timesheet by ID
 */
router.delete("/:id", deleteTimesheetController);
export default router;
//# sourceMappingURL=adminsTimesheetRoutes.js.map
//# debugId=8ea466d5-08d7-53df-b3fb-a39e33ba5a6b
