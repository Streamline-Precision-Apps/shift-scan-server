import { Router } from "express";
import { getCostCodeController } from "../controllers/costCodeController.js";

const router = Router();

/**
 * @swagger
 * /v1/costCodes/:
 *   get:
 *     summary: Get a list of all cost codes
 *     responses:
 *       200:
 *         description: List of cost codes
 *       400:
 *         description: Failed to retrieve cost codes
 */
router.get("/", getCostCodeController);

export default router;
