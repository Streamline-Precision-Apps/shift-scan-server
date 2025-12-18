import { Router } from "express";
import {
  getAllTimesheetsController,
  getTimesheetByIdController,
  createTimesheetController,
  updateTimesheetController,
  updateTimesheetStatusController,
  deleteTimesheetController,
  exportTimesheetsController,
  getTimesheetChangeLogsController,
  getAllTascoMaterialTypesController,
  resolveTimecardNotificationController,
} from "../controllers/adminTimesheetController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

import { validateRequest } from "../middleware/validateRequest.js";
import {
  createTimesheetSchema,
  updateTimesheetSchema,
  updateTimesheetStatusSchema,
  resolveTimecardNotificationSchema,
} from "../lib/validation/dashboard/timesheets.js";

const router = Router();

/**
 * GET /api/v1/admins/timesheet
 * Get all timesheets with pagination, filtering, and search
 */
router.get("/", verifyToken, getAllTimesheetsController);

/**
 * GET /api/v1/admins/timesheet/tasco-material-types
 * Get all Tasco material types
 */
router.get(
  "/tasco-material-types",
  verifyToken,
  getAllTascoMaterialTypesController
);

/**
 * GET /api/v1/admins/timesheet/:id
 * Get a single timesheet by ID with all related data
 */
router.get("/:id", verifyToken, getTimesheetByIdController);

/**
 * GET /api/v1/admins/timesheet/:id/change-logs
 * Get change logs for a specific timesheet
 */
router.get("/:id/change-logs", verifyToken, getTimesheetChangeLogsController);

/**
 * POST /api/v1/admins/timesheet
 * Create a new timesheet (admin creation)
 */
router.post(
  "/",
  verifyToken,
  validateRequest(createTimesheetSchema),
  createTimesheetController
);

/**
 * POST /api/v1/admins/timesheet/export
 * Export timesheets to Excel
 */
router.post("/export", verifyToken, exportTimesheetsController);

/**
 * POST /api/v1/admins/timesheet/resolve-notification
 * Check timesheet status and resolve notification if already approved/rejected
 */
router.post(
  "/resolve-notification",
  verifyToken,
  validateRequest(resolveTimecardNotificationSchema),
  resolveTimecardNotificationController
);

/**
 * PUT /api/v1/admins/timesheet/:id
 * Update a timesheet (optimized update with change tracking)
 */
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateTimesheetSchema),
  updateTimesheetController
);

/**
 * PUT /api/v1/admins/timesheet/:id/status
 * Update timesheet status (approve/deny)
 */
router.put(
  "/:id/status",
  verifyToken,
  validateRequest(updateTimesheetStatusSchema),
  updateTimesheetStatusController
);

/**
 * DELETE /api/v1/admins/timesheet/:id
 * Delete a timesheet by ID
 */
router.delete("/:id", verifyToken, deleteTimesheetController);

export default router;
