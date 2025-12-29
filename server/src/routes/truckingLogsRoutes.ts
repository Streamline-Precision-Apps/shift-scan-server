import { Router } from "express";
import {
  createTruckingLogsController,
  deleteTruckingLogController,
  getTruckingLogsById,
  getTruckingLogsController,
  updateTruckingLogsController,
} from "../controllers/truckingLogsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createTruckingLogFieldSchema,
  updateTruckingLogFieldSchema,
} from "../lib/validation/app/truckingLogs.js";
const router = Router();

/**
 * @swagger
 * /api/v1/trucking-logs/{id}:
 *   get:
 *     summary: Get a specific trucking log by ID
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
 *         description: Trucking log retrieved successfully
 *       404:
 *         description: Trucking log not found
 *   post:
 *     summary: Create a new trucking log for a specific ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTruckingLogRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Trucking log created successfully
 *       400:
 *         description: Invalid request
 *   put:
 *     summary: Update a trucking log by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTruckingLogRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trucking log updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Trucking log not found
 *   delete:
 *     summary: Delete a trucking log by ID
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
 *         description: Trucking log deleted successfully
 *       404:
 *         description: Trucking log not found
 */
router.get("/:id", verifyToken, getTruckingLogsById);
router.post(
  "/:id",
  verifyToken,
  validateRequest(createTruckingLogFieldSchema),
  createTruckingLogsController
);
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateTruckingLogFieldSchema),
  updateTruckingLogsController
);
router.delete("/:id", verifyToken, deleteTruckingLogController);

/**
 * @swagger
 * /api/v1/trucking-logs/user/{userId}:
 *   get:
 *     summary: Get all trucking logs for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trucking logs retrieved successfully
 *       404:
 *         description: User or logs not found
 */
router.get("/user/:userId", verifyToken, getTruckingLogsController);

export default router;
