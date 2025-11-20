
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7d209003-d642-5c2a-a2c9-99bc3a31e9ae")}catch(e){}}();
import { Router } from "express";
import { createTruckingLogsController, deleteTruckingLogController, getTruckingLogsById, getTruckingLogsController, updateTruckingLogsController, } from "../controllers/truckingLogsController.js";
const router = Router();
router.get("/user/:userId", getTruckingLogsController);
router.get("/:id", getTruckingLogsById);
router.post("/:id", createTruckingLogsController);
router.put("/:id", updateTruckingLogsController);
router.delete("/:id", deleteTruckingLogController);
export default router;
//# sourceMappingURL=truckingLogsRoutes.js.map
//# debugId=7d209003-d642-5c2a-a2c9-99bc3a31e9ae
