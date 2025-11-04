// server/src/routes/equipmentRoutes.ts

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8268ae2b-9466-5908-a0ff-c8ac0b425098")}catch(e){}}();
import { Router } from "express";
import { getEquipment, getEquipmentByQrId, createEquipment, getEquipmentMileageController, } from "../controllers/equipmentController.js";
const router = Router();
router.get("/:id/lastMileage", getEquipmentMileageController);
router.get("/qr/:qrId", getEquipmentByQrId);
router.get("/", getEquipment);
router.post("/", createEquipment);
export default router;
//# sourceMappingURL=equipmentRoute.js.map
//# debugId=8268ae2b-9466-5908-a0ff-c8ac0b425098
