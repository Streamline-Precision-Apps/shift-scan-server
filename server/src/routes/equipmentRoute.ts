// server/src/routes/equipmentRoutes.ts
import { Router } from "express";
import {
  getEquipment,
  getEquipmentByQrId,
  createEquipment,
  getEquipmentMileageController,
} from "../controllers/equipmentController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createEquipmentSchema } from "../lib/validation/app/equipment.js";

const router = Router();

/**
 * @swagger
 * /api/v1/equipment/:
 *   get:
 *     tags:
 *       - App - Equipment
 *     summary: Get a list of all equipment
 *     responses:
 *       200:
 *         description: List of equipment
 *       400:
 *         description: Failed to retrieve equipment
 *   post:
 *     tags:
 *       - App - Equipment
 *     summary: Create a new equipment entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEquipmentRequest'
 *     responses:
 *       201:
 *         description: Equipment created
 *       400:
 *         description: Invalid request or failed to create equipment
 */
router.get("/", getEquipment);
router.post("/", validateRequest(createEquipmentSchema), createEquipment);

/**
 * @swagger
 * /api/v1/equipment/{id}/lastMileage:
 *   get:
 *     tags:
 *       - App - Equipment
 *     summary: Get the last mileage entry for a piece of equipment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Last mileage entry found
 *       404:
 *         description: Equipment or mileage entry not found
 */
router.get("/:id/lastMileage", getEquipmentMileageController);

/**
 * @swagger
 * /api/v1/equipment/qr/{qrId}:
 *   get:
 *     tags:
 *       - App - Equipment
 *     summary: Get equipment details by QR code ID
 *     parameters:
 *       - in: path
 *         name: qrId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Equipment found
 *       404:
 *         description: Equipment not found
 */
router.get("/qr/:qrId", getEquipmentByQrId);

export default router;
