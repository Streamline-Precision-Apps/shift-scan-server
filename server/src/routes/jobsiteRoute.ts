// server/src/routes/jobsiteRoutes.ts

import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { createJobsiteSchema } from "../lib/validation/app/jobsite.js";
import {
  createJobsite,
  getJobsiteById,
  getJobsites,
  getJobsiteByQrId,
} from "../controllers/jobsiteController.js";
const router = Router();

router.get("/qr/:qrId", getJobsiteByQrId);

router.get("/", getJobsites);

router.get("/:id", getJobsiteById);

router.post("/", validateRequest(createJobsiteSchema), createJobsite);

export default router;
