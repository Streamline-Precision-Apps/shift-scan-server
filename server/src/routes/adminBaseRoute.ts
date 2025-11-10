import { Router } from "express";
import {
  baseController,
  getDashboardDataController,
  getUserTopicPreferencesController,
} from "../controllers/adminBaseController.js";
import { get } from "http";

const router = Router();

router.get("/notification-center", baseController);
router.get("/dashboard-data", getDashboardDataController);
router.get("/notification-preferences", getUserTopicPreferencesController);

export default router;
