
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ebdd1bfb-ea23-54d9-8e9a-aa1d3a4703ab")}catch(e){}}();
import { Router } from "express";
import { listEquipment, getEquipmentById, createEquipment, updateEquipment, archiveEquipment, restoreEquipment, listArchivedEquipment, deleteEquipment, getEquipmentSummary, } from "../controllers/adminEquipmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = Router();
// Apply authentication middleware to all routes
router.use(verifyToken);
// Equipment Management REST API routes (handlers to be implemented)
// GET /api/v1/admins/equipment - List all equipment
router.get("/", listEquipment);
// GET /api/v1/admins/equipment/summary - List all equipment but only important fields
router.get("/summary", getEquipmentSummary);
// GET /api/v1/admins/equipment/:id - Get equipment by ID
router.get("/:id", getEquipmentById);
// POST /api/v1/admins/equipment - Create new equipment
router.post("/", createEquipment);
// PUT /api/v1/admins/equipment/:id - Update equipment by ID
router.put("/:id", updateEquipment);
// DELETE /api/v1/admins/equipment/:id - Delete equipment by ID
router.delete("/:id", deleteEquipment);
// PUT /api/v1/admins/equipment/:id/archive - Archive equipment by ID
router.put("/:id/archive", archiveEquipment);
// PUT /api/v1/admins/equipment/:id/restore - Restore archived equipment by ID
router.put("/:id/restore", restoreEquipment);
// GET /api/v1/admins/equipment/archived - List all archived equipment
router.get("/archived", listArchivedEquipment);
export default router;
//# sourceMappingURL=adminsEquipmentRoutes.js.map
//# debugId=ebdd1bfb-ea23-54d9-8e9a-aa1d3a4703ab
