
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9092bcf6-a00f-5434-a70d-d9960289a085")}catch(e){}}();
import { Router } from "express";
import { getAllJobsitesController, getJobsiteByIdController, createJobsiteController, updateJobsiteController, archiveJobsiteController, restoreJobsiteController, deleteJobsiteController, } from "../controllers/adminJobsiteController.js";
const router = Router();
// /api/v1/admins/jobsite/:id - gets a specific jobsite for admin
router.get("/:id", getJobsiteByIdController);
// /api/v1/admins/jobsite - gets all jobsites for admin
router.get("/", getAllJobsitesController);
// /api/v1/admins/jobsite - creates a new jobsite
router.post("/", createJobsiteController);
// /api/v1/admins/jobsite/:id - updates a specific jobsite for admin
router.put("/:id", updateJobsiteController);
// /api/v1/admins/jobsite/:id/archive - archives a specific jobsite for admin
router.put("/:id/archive", archiveJobsiteController);
// /api/v1/admins/jobsite/:id/restore - restores a specific jobsite for admin
router.put("/:id/restore", restoreJobsiteController);
// /api/v1/admins/jobsite/:id - deletes a specific jobsite for admin
router.delete("/:id", deleteJobsiteController);
export default router;
//# sourceMappingURL=adminsJobsiteRoutes.js.map
//# debugId=9092bcf6-a00f-5434-a70d-d9960289a085
