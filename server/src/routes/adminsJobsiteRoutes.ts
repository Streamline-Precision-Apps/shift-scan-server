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
/**
 * @swagger
 * /api/v1/admins/jobsite:
 *   get:
 *     summary: Get all jobsites (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Jobsites retrieved successfully
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new jobsite (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobsiteRequest'
 *     responses:
 *       201:
 *         description: Jobsite created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */

router.get("/", verifyToken, getAllJobsitesController);
router.post(
  "/",
  verifyToken,
  validateRequest(createJobsiteSchema),
  createJobsiteController
);

/**
 * @swagger
 * /api/v1/admins/jobsite/{id}:
 *   get:
 *     summary: Get a specific jobsite by ID (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobsite retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Jobsite not found
 *   put:
 *     summary: Update a specific jobsite by ID (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateJobsiteRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobsite updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Jobsite not found
 *   delete:
 *     summary: Delete a specific jobsite by ID (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobsite deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Jobsite not found
 */

router.get("/:id", verifyToken, getJobsiteByIdController);
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateJobsiteSchema),
  updateJobsiteController
);
router.delete("/:id", verifyToken, deleteJobsiteController);

/**
 * @swagger
 * /api/v1/admins/jobsite/{id}/archive:
 *   put:
 *     summary: Archive a specific jobsite by ID (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArchiveJobsiteRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobsite archived successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Jobsite not found
 */

router.put(
  "/:id/archive",
  verifyToken,
  validateRequest(archiveJobsiteSchema),
  archiveJobsiteController
);

/**
 * @swagger
 * /api/v1/admins/jobsite/{id}/restore:
 *   put:
 *     summary: Restore a specific jobsite by ID (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestoreJobsiteRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Jobsite restored successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Jobsite not found
 */

router.put(
  "/:id/restore",
  verifyToken,
  validateRequest(restoreJobsiteSchema),
  restoreJobsiteController
);

export default router;
