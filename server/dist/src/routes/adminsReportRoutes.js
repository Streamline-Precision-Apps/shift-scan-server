
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e790c13c-3bbb-517a-abe0-f5b46ea06c5c")}catch(e){}}();
import { Router } from "express";
import { getMechanicReport, getTascoReport, getTruckingReport, getTascoFilterOptions, } from "../controllers/adminReportController.js";
const router = Router();
router.get("/tasco", getTascoReport);
router.get("/tasco/filters", getTascoFilterOptions);
router.get("/trucking", getTruckingReport);
router.get("/mechanic", getMechanicReport);
export default router;
//# sourceMappingURL=adminsReportRoutes.js.map
//# debugId=e790c13c-3bbb-517a-abe0-f5b46ea06c5c
