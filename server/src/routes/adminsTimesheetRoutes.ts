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
} from "../controllers/adminTimesheetController.js";

const router = Router();

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
