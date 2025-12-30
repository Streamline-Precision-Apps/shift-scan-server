import { Router } from "express";
import {
  getTagSummaryController,
  getTagByIdController,
  createTagController,
  updateTagController,
  deleteTagController,
} from "../controllers/adminTagsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

import { validateRequest } from "../middleware/validateRequest.js";
import {
  createTagSchema,
  updateTagSchema,
} from "../lib/validation/dashboard/tags.js";

const router = Router();

/**
 * @swagger
 * /api/v1/admins/tags:
 *   get:
 *     tags:
 *       - Admins - Tags
 *     summary: Get all tags (summary)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tags summary retrieved successfully
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *       - Admins - Tags
 *     summary: Create a new tag
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTagRequest'
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, getTagSummaryController);
router.post(
  "/",
  verifyToken,
  validateRequest(createTagSchema),
  createTagController
);

/**
 * @swagger
 * /api/v1/admins/tags/{id}:
 *   get:
 *     tags:
 *       - Admins - Tags
 *     summary: Get tag by ID
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
 *         description: Tag retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tag not found
 *   put:
 *     tags:
 *       - Admins - Tags
 *     summary: Update tag by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTagRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tag not found
 *   delete:
 *     tags:
 *       - Admins - Tags
 *     summary: Delete tag by ID
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
 *         description: Tag deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tag not found
 */
router.get("/:id", verifyToken, getTagByIdController);
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateTagSchema),
  updateTagController
);
router.delete("/:id", verifyToken, deleteTagController);

export default router;
