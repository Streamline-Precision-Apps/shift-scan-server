import { Router } from "express";
import {
  baseController,
  getDashboardDataController,
  getUserTopicPreferencesController,
} from "../controllers/adminBaseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
/**
 * @swagger
 * /api/v1/admins/notification-center:
 *   get:
 *     tags:
 *       - Admin - Home
 *     summary: Get notification center data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification center data retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 */
router.get("/notification-center", verifyToken, baseController);

/**
 * @swagger
 * /api/v1/admins/dashboard-data:
 *   get:
 *     tags:
 *       - Admin - Home
 *     summary: Get dashboard data for admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 */
router.get("/dashboard-data", verifyToken, getDashboardDataController);

/**
 * @swagger
 * /api/v1/admins/notification-preferences:
 *   get:
 *     tags:
 *       - Admin - Home
 *     summary: Get user notification topic preferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences retrieved successfully
 *       401:
 *         description: Unauthorized - invalid or missing bearer token
 */
router.get(
  "/notification-preferences",
  verifyToken,
  getUserTopicPreferencesController
);

export default router;
