import { Router } from "express";
import {
  exportDataController,
  getExportStatusController,
} from "../controllers/dataExportController.js";

const router = Router();

/**
 * GET /export/status
 * Get information about the export service and available tables
 */
router.get("/status", getExportStatusController);

/**
 * POST /export
 * Export all specified tables in multiple formats (Prisma seed, JSON, SQL)
 * Generates files in the prisma/seeds and prisma/exports directories
 */
router.post("/", exportDataController);

export default router;
