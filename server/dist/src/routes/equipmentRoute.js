// server/src/routes/equipmentRoutes.ts

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ee160133-55c7-566c-a44c-9239fd01f1ae")}catch(e){}}();
import { Router } from "express";
import { getEquipment, getEquipmentByQrId, createEquipment, getEquipmentMileageController, } from "../controllers/equipmentController.js";
const router = Router();
router.get("/:id/lastMileage", getEquipmentMileageController);
router.get("/qr/:qrId", getEquipmentByQrId);
router.get("/", getEquipment);
router.post("/", createEquipment);
export default router;
//# sourceMappingURL=equipmentRoute.js.map
//# debugId=ee160133-55c7-566c-a44c-9239fd01f1ae
