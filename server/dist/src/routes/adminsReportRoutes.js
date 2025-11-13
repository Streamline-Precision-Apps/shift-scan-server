
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9488e555-30ba-5c29-b222-e11b0f899951")}catch(e){}}();
import { Router } from "express";
import { getMechanicReport, getTascoReport, getTruckingReport, } from "../controllers/adminReportController.js";
const router = Router();
router.get("/tasco", getTascoReport);
router.get("/trucking", getTruckingReport);
router.get("/mechanic", getMechanicReport);
export default router;
//# sourceMappingURL=adminsReportRoutes.js.map
//# debugId=9488e555-30ba-5c29-b222-e11b0f899951
