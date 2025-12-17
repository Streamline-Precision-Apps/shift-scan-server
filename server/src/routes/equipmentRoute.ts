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
router.get("/:id/lastMileage", getEquipmentMileageController);
router.get("/qr/:qrId", getEquipmentByQrId);
router.get("/", getEquipment);
router.post("/", validateRequest(createEquipmentSchema), createEquipment);

export default router;
