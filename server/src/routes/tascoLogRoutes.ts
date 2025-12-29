import { Router } from "express";
import {
  getTascoLogController,
  getTascoLogsByTimesheetController,
  updateLoadQuantityController,
  updateTascoCommentController,
  createRefuelLogController,
  getRefuelLogsController,
  updateRefuelLogController,
  deleteRefuelLogController,
  createFLoadController,
  getFLoadsController,
  updateFLoadController,
  deleteFLoadController,
  getCompleteTascoLogController,
  deleteTascoLogController,
  getTascoLogFieldController,
  getActiveTascoLogController,
} from "../controllers/tascoLogController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  updateLoadQuantitySchema,
  updateTascoCommentSchema,
  createRefuelLogSchema,
  updateRefuelLogSchema,
  createFLoadSchema,
  updateFLoadSchema,
} from "../lib/validation/app/tascoLogs.js";

const router = Router();

/**
 * @swagger
 * /api/v1/tasco-logs/user/{userId}/active:
 *   get:
 *     summary: Get the active Tasco Log for a user
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
 *         description: Active Tasco Log retrieved
 *       404:
 *         description: User or log not found
 */
router.get("/user/:userId/active", verifyToken, getActiveTascoLogController);

/**
 * @swagger
 * /api/v1/tasco-logs/timesheet/{timesheetId}:
 *   get:
 *     summary: Get all Tasco Logs for a timesheet
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
 *         description: Tasco Logs retrieved
 *       404:
 *         description: Timesheet or logs not found
 */
router.get(
  "/timesheet/:timesheetId",
  verifyToken,
  getTascoLogsByTimesheetController
);

/**
 * @swagger
 * /api/v1/tasco-logs/{id}:
 *   get:
 *     summary: Get a single Tasco Log by ID
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
 *         description: Tasco Log retrieved
 *       404:
 *         description: Tasco Log not found
 *   delete:
 *     summary: Delete a Tasco Log (cascades to all related records)
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
 *         description: Tasco Log deleted
 *       404:
 *         description: Tasco Log not found
 */
router.get("/:id", verifyToken, getTascoLogController);
router.delete("/:id", verifyToken, deleteTascoLogController);

/**
 * @swagger
 * /api/v1/tasco-logs/{id}/field/{field}:
 *   get:
 *     summary: Get specific field data for a Tasco Log
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *           enum: [comment, loadCount, refuelLogs, fLoads]
 *     responses:
 *       200:
 *         description: Field data retrieved
 *       404:
 *         description: Tasco Log or field not found
 */
router.get("/:id/field/:field", verifyToken, getTascoLogFieldController);

/**
 * @swagger
 * /api/v1/tasco-logs/{id}/complete:
 *   get:
 *     summary: Get complete Tasco Log data with all relations
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
 *         description: Complete Tasco Log retrieved
 *       404:
 *         description: Tasco Log not found
 */
router.get("/:id/complete", verifyToken, getCompleteTascoLogController);

/**
 * @swagger
 * /api/v1/tasco-logs/{id}/load-quantity:
 *   put:
 *     summary: Update Tasco Log load quantity
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLoadQuantityRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Load quantity updated
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Tasco Log not found
 */
router.put(
  "/:id/load-quantity",
  verifyToken,
  validateRequest(updateLoadQuantitySchema),
  updateLoadQuantityController
);

/**
 * @swagger
 * /api/v1/tasco-logs/{id}/comment:
 *   put:
 *     summary: Update Tasco Log comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTascoCommentRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment updated
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Tasco Log not found
 */
router.put(
  "/:id/comment",
  verifyToken,
  validateRequest(updateTascoCommentSchema),
  updateTascoCommentController
);

/**
 * @swagger
 * /api/v1/tasco-logs/{id}/refuel-logs:
 *   get:
 *     summary: Get all Refuel Logs for a Tasco Log
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
 *         description: Refuel Logs retrieved
 *       404:
 *         description: Tasco Log or logs not found
 *   post:
 *     summary: Create a new Refuel Log
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRefuelLogRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Refuel Log created
 *       400:
 *         description: Invalid request
 */
router.get("/:id/refuel-logs", verifyToken, getRefuelLogsController);
router.post(
  "/:id/refuel-logs",
  verifyToken,
  validateRequest(createRefuelLogSchema),
  createRefuelLogController
);

/**
 * @swagger
 * /api/v1/tasco-logs/{id}/f-loads:
 *   get:
 *     summary: Get all F-Loads for a Tasco Log
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
 *         description: F-Loads retrieved
 *       404:
 *         description: Tasco Log or F-Loads not found
 *   post:
 *     summary: Create a new TascoFLoad
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFLoadRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: TascoFLoad created
 *       400:
 *         description: Invalid request
 */
router.get("/:id/f-loads", verifyToken, getFLoadsController);
router.post(
  "/:id/f-loads",
  verifyToken,
  validateRequest(createFLoadSchema),
  createFLoadController
);

/**
 * @swagger
 * /api/v1/tasco-logs/refuel-logs/{refuelLogId}:
 *   put:
 *     summary: Update a Refuel Log
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRefuelLogRequest'
 *     parameters:
 *       - in: path
 *         name: refuelLogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Refuel Log updated
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Refuel Log not found
 *   delete:
 *     summary: Delete a Refuel Log
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: refuelLogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Refuel Log deleted
 *       404:
 *         description: Refuel Log not found
 */

router.put(
  "/refuel-logs/:refuelLogId",
  verifyToken,
  validateRequest(updateRefuelLogSchema),
  updateRefuelLogController
);
router.delete(
  "/refuel-logs/:refuelLogId",
  verifyToken,
  deleteRefuelLogController
);

/**
 * @swagger
 * /api/v1/tasco-logs/f-loads/{fLoadId}:
 *   put:
 *     summary: Update a TascoFLoad
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFLoadRequest'
 *     parameters:
 *       - in: path
 *         name: fLoadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TascoFLoad updated
 *       400:
 *         description: Invalid request
 *       404:
 *         description: TascoFLoad not found
 *   delete:
 *     summary: Delete a TascoFLoad
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fLoadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TascoFLoad deleted
 *       404:
 *         description: TascoFLoad not found
 */
router.put(
  "/f-loads/:fLoadId",
  verifyToken,
  validateRequest(updateFLoadSchema),
  updateFLoadController
);
router.delete("/f-loads/:fLoadId", verifyToken, deleteFLoadController);

export default router;
