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

// /api/v1/admins/tags - gets all tags for admin -- summary
router.get("/", verifyToken, getTagSummaryController);

// /api/v1/admins/tags/:id - get tag by id
router.get("/:id", verifyToken, getTagByIdController);

// /api/v1/admins/tags/ - create tag
router.post(
  "/",
  verifyToken,
  validateRequest(createTagSchema),
  createTagController
);

// /api/v1/admins/tags/:id - update tag
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateTagSchema),
  updateTagController
);

// /api/v1/admins/tags/:id - delete tag
router.delete("/:id", verifyToken, deleteTagController);

export default router;
