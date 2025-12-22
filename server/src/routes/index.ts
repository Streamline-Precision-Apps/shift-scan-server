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
import costCodesRoute from "./costCodesRoute.js";
import adminsBaseRoutes from "./adminBaseRoute.js";
import adminsPersonnelRoutes from "./adminsPersonnelRoutes.js";
import adminsEquipmentRoutes from "./adminsEquipmentRoutes.js";
import adminsJobsiteRoutes from "./adminsJobsiteRoutes.js";
import adminsTagsRoutes from "./adminsTagsRoutes.js";
import adminsCostCodesRoutes from "./adminsCostCodesRoutes.js";
import adminsReportRoutes from "./adminsReportRoutes.js";
import adminsFormRoutes from "./adminsFormRoutes.js";
import adminsTimesheetRoutes from "./adminsTimesheetRoutes.js";
import { apiLimiter } from "../middleware/rateLimitMiddleware.js";

const router = Router();

// all app routes
router.use("/v1/forms", apiLimiter, formsRoutes);
router.use("/v1/equipment", apiLimiter, equipmentRoutes);
router.use("/v1/cost-codes", apiLimiter, costCodesRoute);
router.use("/v1/jobsite", apiLimiter, jobsiteRoutes);
router.use("/v1/user", apiLimiter, userRoutes);
router.use("/v1/timesheet", apiLimiter, timesheetRoutes);
router.use("/v1/mechanic-logs", apiLimiter, mechanicLogsRoutes);
router.use("/v1/trucking-logs", apiLimiter, truckingLogsRoutes);
router.use("/v1/tasco-logs", apiLimiter, tascoLogsRoutes);
router.use("/v1", apiLimiter, initRoutes);
router.use("/v1/admins", apiLimiter, adminsBaseRoutes);
router.use("/v1/admins/personnel", apiLimiter, adminsPersonnelRoutes);
router.use("/v1/admins/equipment", apiLimiter, adminsEquipmentRoutes);
router.use("/v1/admins/jobsite", apiLimiter, adminsJobsiteRoutes);
router.use("/v1/admins/tags", apiLimiter, adminsTagsRoutes);
router.use("/v1/admins/cost-codes", apiLimiter, adminsCostCodesRoutes);
router.use("/v1/admins/report", apiLimiter, adminsReportRoutes);
router.use("/v1/admins/forms", apiLimiter, adminsFormRoutes);
router.use("/v1/admins/timesheet", apiLimiter, adminsTimesheetRoutes);

router.use("/notifications", apiLimiter, notificationRoutes);
router.use("/push-notifications", apiLimiter, notificationRoutes);

router.use("/storage", apiLimiter, blobRoutes);
router.use("/tokens", tokenRoutes);
router.use("/location", apiLimiter, locationRoutes);
router.use("/cookies", apiLimiter, cookiesRoutes);

export default router;
