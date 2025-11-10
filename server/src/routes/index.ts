import { Router } from "express";
import notificationRoutes from "./notificationsRoute.js";
import pushNotificationsRoute from "./pushNotificationsRoute.js";
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
import costCodesRoute from "./costCodesRoute.js";
import adminsBaseRoutes from "./adminBaseRoute.js";

const router = Router();

// all app routes
router.use("/v1/forms", formsRoutes);
router.use("/v1/equipment", equipmentRoutes);
router.use("/v1/cost-codes", costCodesRoute);
router.use("/v1/jobsite", jobsiteRoutes);
router.use("/v1/user", userRoutes);
router.use("/v1/timesheet", timesheetRoutes);
router.use("/v1/mechanic-logs", mechanicLogsRoutes);
router.use("/v1/trucking-logs", truckingLogsRoutes);
router.use("/v1/tasco-logs", tascoLogsRoutes);
router.use("/v1", initRoutes);
router.use("/v1/admins", adminsBaseRoutes);

router.use("/notifications", notificationRoutes);
router.use("/push-notifications", pushNotificationsRoute);
router.use("/storage", blobRoutes);
router.use("/tokens", tokenRoutes);
router.use("/location", locationRoutes);
router.use("/cookies", cookiesRoutes);

export default router;
