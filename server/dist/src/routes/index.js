
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="79cc0b3e-bfaa-5228-9f72-1932ffaaa448")}catch(e){}}();
import { Router } from "express";
import notificationRoutes from "./notificationsRoute.js";
import blobRoutes from "./blobRoute.js";
import tokenRoutes from "./tokenRoutes.js";
import locationRoutes from "./locationRoutes.js";
import initRoutes from "./initRoutes.js";
import cookiesRoutes from "./cookiesRoutes.js";
import equipmentRoutes from "./equipmentRoute.js";
import jobsiteRoutes from "./jobsiteRoute.js";
import formsRoutes from "./formsRoute.js";
import userRoutes from "./userRoute.js";
import timesheetRoutes from "./timesheetRoute.js";
import mechanicLogsRoutes from "./mechanicLogsRoutes.js";
import truckingLogsRoutes from "./truckingLogsRoutes.js";
import tascoLogsRoutes from "./tascoLogRoutes.js";
const router = Router();
// all app routes
router.use("/v1/forms", formsRoutes);
router.use("/v1/equipment", equipmentRoutes);
router.use("/v1/jobsite", jobsiteRoutes);
router.use("/v1/user", userRoutes);
router.use("/v1/timesheet", timesheetRoutes);
router.use("/v1/mechanic-logs", mechanicLogsRoutes);
router.use("/v1/trucking-logs", truckingLogsRoutes);
router.use("/v1/tasco-logs", tascoLogsRoutes);
router.use("/v1", initRoutes);
router.use("/notifications", notificationRoutes);
router.use("/storage", blobRoutes);
router.use("/tokens", tokenRoutes);
router.use("/location", locationRoutes);
router.use("/cookies", cookiesRoutes);
export default router;
//# sourceMappingURL=index.js.map
//# debugId=79cc0b3e-bfaa-5228-9f72-1932ffaaa448
