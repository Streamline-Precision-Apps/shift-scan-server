// server/src/routes/jobsiteRoutes.ts

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4b241164-22f7-5dda-b706-6a6f4db3676d")}catch(e){}}();
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
//# debugId=4b241164-22f7-5dda-b706-6a6f4db3676d
