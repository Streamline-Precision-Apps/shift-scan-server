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
/**
 * @swagger
 * /api/v1/jobsites/:
 *   get:
 *     tags:
 *       - App - Jobsites
 *     summary: Get a list of all jobsites
 *     responses:
 *       200:
 *         description: List of jobsites
 *       400:
 *         description: Failed to retrieve jobsites
 *   post:
 *     tags:
 *       - App - Jobsites
 *     summary: Create a new jobsite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobsiteRequest'
 *     responses:
 *       201:
 *         description: Jobsite created
 *       400:
 *         description: Invalid request or failed to create jobsite
 */
router.get("/", getJobsites);
router.post("/", validateRequest(createJobsiteSchema), createJobsite);

/**
 * @swagger
 * /api/v1/jobsites/{id}:
 *   get:
 *     tags:
 *       - App - Jobsites
 *     summary: Get jobsite details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobsite found
 *       404:
 *         description: Jobsite not found
 */
router.get("/:id", getJobsiteById);

/**
 * @swagger
 * /api/v1/jobsites/qr/{qrId}:
 *   get:
 *     tags:
 *       - App - Jobsites
 *     summary: Get jobsite details by QR code ID
 *     parameters:
 *       - in: path
 *         name: qrId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobsite found
 *       404:
 *         description: Jobsite not found
 */
router.get("/qr/:qrId", getJobsiteByQrId);
export default router;
