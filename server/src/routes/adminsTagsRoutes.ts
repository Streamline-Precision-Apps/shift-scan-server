import { Router } from "express";
import { getTagsController } from "../controllers/adminTagsController.js";

const router = Router();

// /api/v1/admins/tags -  gets all tags for admin
router.get("/", getTagsController);

export default router;
