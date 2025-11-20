
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="512d12f9-93d6-5986-92f9-95aee1c4bf6e")}catch(e){}}();
import { Router } from "express";
import { getMechanicReport, getTascoReport, getTruckingReport, getTascoFilterOptions, } from "../controllers/adminReportController.js";
const router = Router();
router.get("/tasco", getTascoReport);
router.get("/tasco/filters", getTascoFilterOptions);
router.get("/trucking", getTruckingReport);
router.get("/mechanic", getMechanicReport);
export default router;
//# sourceMappingURL=adminsReportRoutes.js.map
//# debugId=512d12f9-93d6-5986-92f9-95aee1c4bf6e
