import { Router } from "express";
import { getCostCodeController } from "../controllers/costCodeController.js";

const router = Router();

/**
 * @swagger
 * /api/v1/costCodes/:
 *   get:
 *     tags:
 *       - App - CostCodes
 *     summary: Get all cost codes
 *     responses:
 *       200:
 *         description: List of cost codes
 *       400:
 *         description: Failed to retrieve cost codes
 */
router.get("/", getCostCodeController);

export default router;
