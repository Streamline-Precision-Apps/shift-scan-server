
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e35938d6-7d9a-55fc-8863-e3b41f9a4168")}catch(e){}}();
import { Router } from "express";
import { baseController, getDashboardDataController, getUserTopicPreferencesController, } from "../controllers/adminBaseController.js";
import { get } from "http";
const router = Router();
router.get("/notification-center", baseController);
router.get("/dashboard-data", getDashboardDataController);
router.get("/notification-preferences", getUserTopicPreferencesController);
export default router;
//# sourceMappingURL=adminBaseRoute.js.map
//# debugId=e35938d6-7d9a-55fc-8863-e3b41f9a4168
