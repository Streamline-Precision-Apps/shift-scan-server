import { Router } from "express";
import {
  exportDataController,
  getExportStatusController,
} from "../controllers/dataExportController.js";

const router = Router();

/**
 * @swagger
 * /api/v1/export/status:
 *   get:
 *     summary: Get export service status
 *     description: Get information about the export service and available tables for export.
 *     tags:
 *       - Data Export
 *     responses:
 *       200:
 *         description: Export service status and available tables
 */
router.get("/status", getExportStatusController);

/**
 * @swagger
 * /api/v1/export:
 *   post:
 *     summary: Export data tables
 *     description: Export all specified tables in multiple formats (Prisma seed, JSON, SQL). Generates files in the prisma/seeds and prisma/exports directories.
 *     tags:
 *       - Data Export
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tables:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of table names to export
 *     responses:
 *       200:
 *         description: Export completed successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", exportDataController);

export default router;
