// server/src/routes/jobsiteRoutes.ts

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="eb81720b-aef5-5031-bf4c-c33478b4ee87")}catch(e){}}();
import { Router } from "express";
import { createJobsite, deleteJobsite, getJobsiteById, getJobsites, updateJobsite, getJobsiteByQrId, } from "../controllers/jobsiteController.js";
const router = Router();
router.get("/qr/:qrId", getJobsiteByQrId);
router.get("/", getJobsites);
// Get a jobsite by ID
router.get("/:id", getJobsiteById);
// Create a jobsite
router.post("/", createJobsite);
// Update a jobsite
router.put("/:id", updateJobsite);
// Delete a jobsite
router.delete("/:id", deleteJobsite);
export default router;
//# sourceMappingURL=jobsiteRoute.js.map
//# debugId=eb81720b-aef5-5031-bf4c-c33478b4ee87
