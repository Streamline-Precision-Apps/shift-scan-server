import { Router } from "express";
import {
  baseController,
  getDashboardDataController,
  getUserTopicPreferencesController,
} from "../controllers/adminBaseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/notification-center", verifyToken, baseController);
router.get("/dashboard-data", verifyToken, getDashboardDataController);
router.get(
  "/notification-preferences",
  verifyToken,
  getUserTopicPreferencesController
);

export default router;
