import { Router } from "express";
import {
  getMechanicLogsController,
  createMechanicProjectController,
  updateMechanicProjectController,
  deleteMechanicProjectController,
  getMechanicLogController,
} from "../controllers/mechanicLogsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createMechanicLogSchema,
  updateMechanicLogSchema,
} from "../lib/validation/app/mechanicLogs.js";

const router = Router();
/**
 * @swagger
 * /api/v1/mechanic-logs/:
 *   post:
 *     tags:
 *       - App - Logs
 *     summary: Create a new mechanic log
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMechanicLogRequest'
 *     responses:
 *       201:
 *         description: Mechanic log created successfully
 *       400:
 *         description: Invalid request
 */
router.post(
  "/",
  verifyToken,
  validateRequest(createMechanicLogSchema),
  createMechanicProjectController
);

/**
 * @swagger
 * /api/v1/mechanic-logs/{id}:
 *   get:
 *     tags:
 *       - App - Logs
 *     summary: Get a specific mechanic log by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mechanic log retrieved successfully
 *       404:
 *         description: Mechanic log not found
 *   put:
 *     tags:
 *       - App - Logs
 *     summary: Update a mechanic log by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMechanicLogRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mechanic log updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Mechanic log not found
 *   delete:
 *     tags:
 *       - App - Logs
 *     summary: Delete a mechanic log by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mechanic log deleted successfully
 *       404:
 *         description: Mechanic log not found
 */

router.get("/:id", verifyToken, getMechanicLogController);
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateMechanicLogSchema),
  updateMechanicProjectController
);
router.delete("/:id", verifyToken, deleteMechanicProjectController);

/**
 * @swagger
 * /api/v1/mechanic-logs/timesheet/{timesheetId}:
 *   get:
 *     tags:
 *       - App - Logs
 *     summary: Get all mechanic logs for a timesheet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timesheetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mechanic logs retrieved successfully
 *       404:
 *         description: Timesheet or logs not found
 */
router.get("/timesheet/:timesheetId", verifyToken, getMechanicLogsController);

export default router;
