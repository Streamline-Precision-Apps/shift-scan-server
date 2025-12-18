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

// Equipment Management REST API routes (handlers to be implemented)

// GET /api/v1/admins/equipment - List all equipment
router.get("/", verifyToken, listEquipment);

// GET /api/v1/admins/equipment/summary - List all equipment but only important fields
router.get("/summary", verifyToken, getEquipmentSummary);

// GET /api/v1/admins/equipment/:id - Get equipment by ID
router.get("/:id", verifyToken, getEquipmentById);

// POST /api/v1/admins/equipment - Create new equipment
router.post(
  "/",
  verifyToken,
  validateRequest(createEquipmentSchema),
  createEquipment
);

// PUT /api/v1/admins/equipment/:id - Update equipment by ID
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateEquipmentSchema),
  updateEquipment
);

// DELETE /api/v1/admins/equipment/:id - Delete equipment by ID
router.delete("/:id", verifyToken, deleteEquipment);

// PUT /api/v1/admins/equipment/:id/archive - Archive equipment by ID
router.put(
  "/:id/archive",
  verifyToken,
  validateRequest(archiveEquipmentSchema),
  archiveEquipment
);
// PUT /api/v1/admins/equipment/:id/restore - Restore archived equipment by ID
router.put(
  "/:id/restore",
  verifyToken,
  validateRequest(restoreEquipmentSchema),
  restoreEquipment
);

// GET /api/v1/admins/equipment/archived - List all archived equipment
router.get("/archived", verifyToken, listArchivedEquipment);

export default router;
