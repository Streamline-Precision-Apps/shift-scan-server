import { Router } from "express";
import {
  listEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  archiveEquipment,
  restoreEquipment,
  listArchivedEquipment,
  deleteEquipment,
  getEquipmentSummary,
} from "../controllers/adminEquipmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  archiveEquipmentSchema,
  restoreEquipmentSchema,
} from "../lib/validation/dashboard/equipment.js";
const router = Router();

/**
 * @swagger
 * /api/v1/admins/equipment/summary:
 *   get:
 *     tags:
 *       - Admins - Equipment
 *     summary: List all equipment (summary fields only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Equipment summary retrieved successfully
 *       401:
 *         description: Unauthorized
 */

router.get("/summary", verifyToken, getEquipmentSummary);

/**
 * @swagger
 * /api/v1/admins/equipment/{id}:
 *   get:
 *     tags:
 *       - Admins - Equipment
 *     summary: Get equipment by ID
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
 *         description: Equipment retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment not found
 *   put:
 *     tags:
 *       - Admins - Equipment
 *     summary: Update equipment by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEquipmentRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment not found
 *   delete:
 *     tags:
 *       - Admins - Equipment
 *     summary: Delete equipment by ID
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
 *         description: Equipment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment not found
 */

router.get("/:id", verifyToken, getEquipmentById);
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateEquipmentSchema),
  updateEquipment
);
router.delete("/:id", verifyToken, deleteEquipment);

/**
 * @swagger
 * /api/v1/admins/equipment/{id}/archive:
 *   put:
 *     tags:
 *       - Admins - Equipment
 *     summary: Archive equipment by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArchiveEquipmentRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment archived successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment not found
 */
router.put(
  "/:id/archive",
  verifyToken,
  validateRequest(archiveEquipmentSchema),
  archiveEquipment
);

/**
 * @swagger
 * /api/v1/admins/equipment/{id}/restore:
 *   put:
 *     tags:
 *       - Admins - Equipment
 *     summary: Restore archived equipment by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestoreEquipmentRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment restored successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment not found
 */
router.put(
  "/:id/restore",
  verifyToken,
  validateRequest(restoreEquipmentSchema),
  restoreEquipment
);

/**
 * @swagger
 * /api/v1/admins/equipment/archived:
 *   get:
 *     tags:
 *       - Admins - Equipment
 *     summary: List all archived equipment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archived equipment list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/archived", verifyToken, listArchivedEquipment);

/**
 * @swagger
 * /api/v1/admins/equipment:
 *   get:
 *     tags:
 *       - Admins - Equipment
 *     summary: List all equipment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Equipment list retrieved successfully
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *       - Admins - Equipment
 *     summary: Create new equipment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEquipmentRequest'
 *     responses:
 *       201:
 *         description: Equipment created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, listEquipment);
router.post(
  "/",
  verifyToken,
  validateRequest(createEquipmentSchema),
  createEquipment
);

export default router;
