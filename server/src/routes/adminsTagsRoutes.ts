import { Router } from "express";
import {
  getTagSummaryController,
  getTagByIdController,
  createTagController,
  updateTagController,
  deleteTagController,
} from "../controllers/adminTagsController.js";

const router = Router();

// /api/v1/admins/tags - gets all tags for admin -- summary
router.get("/", getTagSummaryController);

// /api/v1/admins/tags/:id - get tag by id
router.get("/:id", getTagByIdController);

// /api/v1/admins/tags/ - create tag
router.post("/", createTagController);

// /api/v1/admins/tags/:id - update tag
router.put("/:id", updateTagController);

// /api/v1/admins/tags/:id - delete tag
router.delete("/:id", deleteTagController);

export default router;
