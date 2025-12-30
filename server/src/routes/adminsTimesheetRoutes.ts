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
 * @swagger
 * /api/v1/admins/timesheet:
 *   get:
 *     summary: Get all timesheets
 *     description: Retrieve all timesheets with pagination, filtering, and search options.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by timesheet status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by keyword
 *     responses:
 *       200:
 *         description: List of timesheets
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getAllTimesheetsController);

/**
 * @swagger
 * /api/v1/admins/timesheet/tasco-material-types:
 *   get:
 *     summary: Get all Tasco material types
 *     description: Retrieve all Tasco material types for timesheets.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Tasco material types
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/tasco-material-types",
  verifyToken,
  getAllTascoMaterialTypesController
);

/**
 * @swagger
 * /api/v1/admins/timesheet/{id}:
 *   get:
 *     summary: Get a timesheet by ID
 *     description: Retrieve a single timesheet by its ID, including all related data.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timesheet ID
 *     responses:
 *       200:
 *         description: Timesheet details
 *       404:
 *         description: Timesheet not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", verifyToken, getTimesheetByIdController);

/**
 * @swagger
 * /api/v1/admins/timesheet/{id}/change-logs:
 *   get:
 *     summary: Get timesheet change logs
 *     description: Retrieve change logs for a specific timesheet by ID.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timesheet ID
 *     responses:
 *       200:
 *         description: Change logs for the timesheet
 *       404:
 *         description: Timesheet not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id/change-logs", verifyToken, getTimesheetChangeLogsController);

/**
 * @swagger
 * /api/v1/admins/timesheet:
 *   post:
 *     summary: Create a new timesheet
 *     description: Create a new timesheet as an admin.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTimesheetInput'
 *     responses:
 *       201:
 *         description: Timesheet created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyToken,
  validateRequest(createTimesheetSchema),
  createTimesheetController
);

/**
 * @swagger
 * /api/v1/admins/timesheet/export:
 *   post:
 *     summary: Export timesheets
 *     description: Export timesheets to Excel format.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Exported Excel file
 *       401:
 *         description: Unauthorized
 */
router.post("/export", verifyToken, exportTimesheetsController);

/**
 * @swagger
 * /api/v1/admins/timesheet/resolve-notification:
 *   post:
 *     summary: Resolve timesheet notification
 *     description: Check timesheet status and resolve notification if already approved or rejected.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResolveTimecardNotificationInput'
 *     responses:
 *       200:
 *         description: Notification resolved
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/resolve-notification",
  verifyToken,
  validateRequest(resolveTimecardNotificationSchema),
  resolveTimecardNotificationController
);

/**
 * @swagger
 * /api/v1/admins/timesheet/{id}:
 *   put:
 *     summary: Update a timesheet
 *     description: Update a timesheet by ID with change tracking.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timesheet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTimesheetInput'
 *     responses:
 *       200:
 *         description: Timesheet updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Timesheet not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateTimesheetSchema),
  updateTimesheetController
);

/**
 * @swagger
 * /api/v1/admins/timesheet/{id}/status:
 *   put:
 *     summary: Update timesheet status
 *     description: Approve or deny a timesheet by updating its status.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timesheet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTimesheetStatusInput'
 *     responses:
 *       200:
 *         description: Timesheet status updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Timesheet not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id/status",
  verifyToken,
  validateRequest(updateTimesheetStatusSchema),
  updateTimesheetStatusController
);

/**
 * @swagger
 * /api/v1/admins/timesheet/{id}:
 *   delete:
 *     summary: Delete a timesheet
 *     description: Delete a timesheet by its ID.
 *     tags:
 *       - Admins - Timesheets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Timesheet ID
 *     responses:
 *       200:
 *         description: Timesheet deleted successfully
 *       404:
 *         description: Timesheet not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", verifyToken, deleteTimesheetController);

export default router;
