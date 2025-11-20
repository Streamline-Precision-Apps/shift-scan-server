
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="963645c8-b7f6-5895-87ab-e36bff9f0ca3")}catch(e){}}();
import { Router } from "express";
import { baseController, getDashboardDataController, getUserTopicPreferencesController, } from "../controllers/adminBaseController.js";
import { get } from "http";
const router = Router();
router.get("/notification-center", baseController);
router.get("/dashboard-data", getDashboardDataController);
router.get("/notification-preferences", getUserTopicPreferencesController);
export default router;
//# sourceMappingURL=adminBaseRoute.js.map
//# debugId=963645c8-b7f6-5895-87ab-e36bff9f0ca3
