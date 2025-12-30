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
  getClockOutDetailsController,
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

/**
 * @swagger
 * /api/v1/timesheets/{id}:
 *   put:
 *     tags:
 *       - App - Timesheets
 *     summary: Update a timesheet (general update)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTimesheetRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timesheet updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Timesheet not found
 */
router.put("/:id", validateRequest(updateTimesheetSchema), updateTimesheet);

/**
 * @swagger
 * /api/v1/timesheets/approve-batch:
 *   post:
 *     tags:
 *       - App - Timesheets
 *     summary: Batch approve timesheets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveBatchRequest'
 *     responses:
 *       200:
 *         description: Timesheets approved successfully
 *       400:
 *         description: Invalid request
 */
router.post(
  "/approve-batch",
  validateRequest(approveBatchSchema),
  approveTimesheetsBatchController
);

/**
 * @swagger
 * /api/v1/timesheets/create:
 *   post:
 *     tags:
 *       - App - Timesheets
 *     summary: Create a new timesheet and switch jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTimesheetRequest'
 *     responses:
 *       201:
 *         description: Timesheet created successfully
 *       400:
 *         description: Invalid request
 */
router.post(
  "/create",
  validateRequest(generalTimesheetSchema),
  createTimesheetAndSwitchJobsController
);

/**
 * @swagger
 * /api/v1/timesheets/user/{userId}/recent:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get recent timesheet for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recent timesheet retrieved
 *       404:
 *         description: Timesheet not found
 */
router.get("/user/:userId/recent", getRecentTimesheetController);

/**
 * @swagger
 * /api/v1/timesheets/user/{userId}/return:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get recent return timesheet for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recent return timesheet retrieved
 *       404:
 *         description: Timesheet not found
 */
router.get("/user/:userId/return", getRecentReturnTimesheetController);

/**
 * @swagger
 * /api/v1/timesheets/user/{userId}/active-status:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get active timesheet status for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Active status retrieved
 *       404:
 *         description: User or timesheet not found
 */
router.get("/user/:userId/active-status", getTimesheetActiveStatusController);

/**
 * @swagger
 * /api/v1/timesheets/user/{userId}/dashboard-logs:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get dashboard logs for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard logs retrieved
 *       404:
 *         description: User or logs not found
 */
router.get("/user/:userId/dashboard-logs", getDashboardLogsController);

/**
 * @swagger
 * /api/v1/timesheets/user/{userId}/clockOutComment:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get clock out comment for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clock out comment retrieved
 *       404:
 *         description: User or comment not found
 */
router.get("/user/:userId/clockOutComment", getClockOutCommentController);

/**
 * @swagger
 * /api/v1/timesheets/user/{userId}/clock-out-details:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get today's timesheets and signature for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Clock out details retrieved
 *       404:
 *         description: User or details not found
 */
router.get("/user/:userId/clock-out-details", getClockOutDetailsController);

/**
 * @swagger
 * /api/v1/timesheets/user/{userId}/equipmentLogs:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get equipment logs for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment logs retrieved
 *       404:
 *         description: User or logs not found
 */
router.get("/user/:userId/equipmentLogs", getUserEquipmentLogsController);

/**
 * @swagger
 * /api/v1/timesheets/user/{userId}/recentJobDetails:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get recent jobsite details for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recent jobsite details retrieved
 *       404:
 *         description: User or jobsite not found
 */
router.get(
  "/user/:userId/recentJobDetails",
  getUserRecentJobsiteDetailsController
);

/**
 * @swagger
 * /api/v1/timesheets/{id}/user/{userId}/continue-timesheet:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Check for ongoing timesheet to continue
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Continue timesheet info retrieved
 *       404:
 *         description: Timesheet not found
 */
router.get(
  "/:id/user/:userId/continue-timesheet",
  getContinueTimesheetController
);

/**
 * @swagger
 * /api/v1/timesheets/{id}/clock-out:
 *   put:
 *     tags:
 *       - App - Timesheets
 *     summary: Update a timesheet (clock-out)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClockOutRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timesheet clocked out successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Timesheet not found
 */
router.put(
  "/:id/clock-out",
  validateRequest(updateClockOutSchema),
  updateClockOutController
);

/**
 * @swagger
 * /api/v1/timesheets/{id}/previous-work:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get previous work details for a timesheet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Previous work details retrieved
 *       404:
 *         description: Timesheet not found
 */
router.get("/:id/previous-work", getPreviousWorkController);

/**
 * @swagger
 * /api/v1/timesheets/{id}/user/{userId}:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get banner data for a timesheet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner data retrieved
 *       404:
 *         description: Timesheet or user not found
 */
router.get("/:id/user/:userId", getBannerDataController);

/**
 * @swagger
 * /api/v1/timesheets/{id}/details:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get timesheet details for manager editing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timesheet details retrieved
 *       404:
 *         description: Timesheet not found
 */
router.get("/:id/details", getTimesheetDetailsManagerController);

/**
 * @swagger
 * /api/v1/timesheets/user/{userId}:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get all timesheets for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timesheets retrieved
 *       404:
 *         description: User or timesheets not found
 */
router.get("/user/:userId", getUserTimesheetsByDateController);

/**
 * @swagger
 * /api/v1/timesheets/equipment-log:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get all equipment logs
 *     responses:
 *       200:
 *         description: Equipment logs retrieved
 *       404:
 *         description: No equipment logs found
 *   post:
 *     tags:
 *       - App - Timesheets
 *     summary: Create a new employee equipment log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEquipmentLogRequest'
 *     responses:
 *       201:
 *         description: Equipment log created
 *       400:
 *         description: Invalid request
 */
router.get("/equipment-log", getAllEquipmentLogsController);

/**
 * @swagger
 * /api/v1/timesheets/equipment-log/{logId}:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get details of a specific employee equipment log
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment log details retrieved
 *       404:
 *         description: Equipment log not found
 *   put:
 *     tags:
 *       - App - Timesheets
 *     summary: Update an employee equipment log
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEquipmentLogRequest'
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment log updated
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Equipment log not found
 *   delete:
 *     tags:
 *       - App - Timesheets
 *     summary: Delete an employee equipment log
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment log deleted
 *       404:
 *         description: Equipment log not found
 */
router.get("/equipment-log/:logId", getEmployeeEquipmentLogDetailsController);
router.post(
  "/equipment-log",
  validateRequest(createEquipmentLogSchema),
  createEmployeeEquipmentLogController
);
router.put(
  "/equipment-log/:logId",
  validateRequest(updateEquipmentLogSchema),
  updateEmployeeEquipmentLogController
);
router.delete("/equipment-log/:logId", deleteEmployeeEquipmentLogController);

/**
 * @swagger
 * /api/v1/timesheets/refuel-log/{refuelLogId}:
 *   delete:
 *     tags:
 *       - App - Timesheets
 *     summary: Delete a refuel log
 *     parameters:
 *       - in: path
 *         name: refuelLogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Refuel log deleted
 *       404:
 *         description: Refuel log not found
 */
router.delete("/refuel-log/:refuelLogId", deleteRefuelLogController);

/**
 * @swagger
 * /api/v1/timesheets/manager/{managerId}/crew-timesheets:
 *   get:
 *     tags:
 *       - App - Timesheets
 *     summary: Get all timesheets for all users in a manager's crew
 *     parameters:
 *       - in: path
 *         name: managerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crew timesheets retrieved
 *       404:
 *         description: Manager or timesheets not found
 */
router.get(
  "/manager/:managerId/crew-timesheets",
  getManagerCrewTimesheetsController
);

export default router;
