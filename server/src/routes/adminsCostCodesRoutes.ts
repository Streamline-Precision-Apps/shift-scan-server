import { Router } from "express";
import {
  getCostCodesController,
  archiveCostCodeController,
  createCostCodeController,
  deleteCostCodeController,
  getCostCodeByIdController,
  restoreCostCodeController,
  updateCostCodeController,
  getCostCodeSummaryController,
} from "../controllers/adminCostCodeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createCostCodeSchema,
  updateCostCodeSchema,
  archiveCostCodeSchema,
  restoreCostCodeSchema,
} from "../lib/validation/dashboard/costCode.js";

const router = Router();

/**
 * @swagger
 * /api/v1/admins/cost-codes:
 *   get:
 *     tags:
 *       - Admins - CostCodes
 *     summary: Get all cost codes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cost codes
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getCostCodesController);

/**
 * @swagger
 * /api/v1/admins/cost-codes:
 *   post:
 *     tags:
 *       - Admins - CostCodes
 *     summary: Create a new cost code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCostCodeRequest'
 *     responses:
 *       201:
 *         description: Cost code created
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyToken,
  validateRequest(createCostCodeSchema),
  createCostCodeController
);

/**
 * @swagger
 * /api/v1/admins/cost-codes/{id}:
 *   get:
 *     tags:
 *       - Admins - CostCodes
 *     summary: Get cost code by ID
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
 *         description: Cost code retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cost code not found
 */
router.get("/:id", verifyToken, getCostCodeByIdController);

/**
 * @swagger
 * /api/v1/admins/cost-codes/{id}:
 *   put:
 *     tags:
 *       - Admins - CostCodes
 *     summary: Update cost code by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCostCodeRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cost code updated
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cost code not found
 */
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateCostCodeSchema),
  updateCostCodeController
);

/**
 * @swagger
 * /api/v1/admins/cost-codes/{id}:
 *   delete:
 *     tags:
 *       - Admins - CostCodes
 *     summary: Delete cost code by ID
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
 *         description: Cost code deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cost code not found
 */
router.delete("/:id", verifyToken, deleteCostCodeController);

/**
 * @swagger
 * /api/v1/admins/cost-codes/{id}/archive:
 *   put:
 *     tags:
 *       - Admins - CostCodes
 *     summary: Archive cost code by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArchiveCostCodeRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cost code archived
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cost code not found
 */
router.put(
  "/:id/archive",
  verifyToken,
  validateRequest(archiveCostCodeSchema),
  archiveCostCodeController
);

/**
 * @swagger
 * /api/v1/admins/cost-codes/{id}/restore:
 *   put:
 *     tags:
 *       - Admins - CostCodes
 *     summary: Restore cost code by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestoreCostCodeRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cost code restored
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cost code not found
 */
router.put(
  "/:id/restore",
  verifyToken,
  validateRequest(restoreCostCodeSchema),
  restoreCostCodeController
);

/**
 * @swagger
 * /api/v1/admins/cost-codes/summary:
 *   get:
 *     tags:
 *       - Admins - CostCodes
 *     summary: Get cost code summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cost code summary retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/summary", verifyToken, getCostCodeSummaryController);

export default router;
