import { Router } from "express";
import {
  getMechanicReport,
  getTascoReport,
  getTruckingReport,
  getTascoFilterOptions,
} from "../controllers/adminReportController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = Router();

/**
 * @swagger
 * /api/v1/admins/reports/tasco:
 *   get:
 *     summary: Get Tasco report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasco report retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/tasco", verifyToken, getTascoReport);
/**
 * @swagger
 * /api/v1/admins/reports/tasco/filters:
 *   get:
 *     summary: Get Tasco report filter options
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasco filter options retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/tasco/filters", verifyToken, getTascoFilterOptions);
/**
 * @swagger
 * /api/v1/admins/reports/trucking:
 *   get:
 *     summary: Get Trucking report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trucking report retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/trucking", verifyToken, getTruckingReport);
/**
 * @swagger
 * /api/v1/admins/reports/mechanic:
 *   get:
 *     summary: Get Mechanic report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mechanic report retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/mechanic", verifyToken, getMechanicReport);

export default router;
