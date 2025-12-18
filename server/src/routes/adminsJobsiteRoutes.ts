import { Router } from "express";
import {
  getAllJobsitesController,
  getJobsiteByIdController,
  createJobsiteController,
  updateJobsiteController,
  archiveJobsiteController,
  restoreJobsiteController,
  deleteJobsiteController,
} from "../controllers/adminJobsiteController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createJobsiteSchema,
  updateJobsiteSchema,
  archiveJobsiteSchema,
  restoreJobsiteSchema,
} from "../lib/validation/dashboard/jobsite.js";

const router = Router();

// /api/v1/admins/jobsite/:id - gets a specific jobsite for admin
router.get("/:id", verifyToken, getJobsiteByIdController);
// /api/v1/admins/jobsite - gets all jobsites for admin
router.get("/", verifyToken, getAllJobsitesController);

// /api/v1/admins/jobsite - creates a new jobsite
router.post(
  "/",
  verifyToken,
  validateRequest(createJobsiteSchema),
  createJobsiteController
);

// /api/v1/admins/jobsite/:id - updates a specific jobsite for admin
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateJobsiteSchema),
  updateJobsiteController
);
// /api/v1/admins/jobsite/:id/archive - archives a specific jobsite for admin
router.put(
  "/:id/archive",
  verifyToken,
  validateRequest(archiveJobsiteSchema),
  archiveJobsiteController
);
// /api/v1/admins/jobsite/:id/restore - restores a specific jobsite for admin
router.put(
  "/:id/restore",
  verifyToken,
  validateRequest(restoreJobsiteSchema),
  restoreJobsiteController
);

// /api/v1/admins/jobsite/:id - deletes a specific jobsite for admin
router.delete("/:id", verifyToken, deleteJobsiteController);

export default router;
