import { Router } from "express";
import {
  getTascoLogController,
  getTascoLogsByTimesheetController,
  updateLoadQuantityController,
  updateTascoCommentController,
  createRefuelLogController,
  getRefuelLogsController,
  updateRefuelLogController,
  deleteRefuelLogController,
  createFLoadController,
  getFLoadsController,
  updateFLoadController,
  deleteFLoadController,
  getCompleteTascoLogController,
  deleteTascoLogController,
  getTascoLogFieldController,
  getActiveTascoLogController,
} from "../controllers/tascoLogController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  updateLoadQuantitySchema,
  updateTascoCommentSchema,
  createRefuelLogSchema,
  updateRefuelLogSchema,
  createFLoadSchema,
  updateFLoadSchema,
} from "../lib/validation/app/tascoLogs.js";

const router = Router();

/**
 * Tasco Log Routes
 * Base: /api/v1/tasco-logs
 *
 * IMPORTANT: Route order matters! More specific routes must come before generic :id routes
 */

// ============================================================================
// SPECIAL ROUTES - MUST COME FIRST
// ============================================================================

/**
 * GET /api/v1/tasco-logs/user/:userId/active
 * Get the active Tasco Log for a user
 */
router.get("/user/:userId/active", verifyToken, getActiveTascoLogController);

/**
 * GET /api/v1/tasco-logs/timesheet/:timesheetId
 * Get all Tasco Logs for a timesheet
 */
router.get(
  "/timesheet/:timesheetId",
  verifyToken,
  getTascoLogsByTimesheetController
);

// ============================================================================
// ROUTES WITH PATH EXTENSIONS - MUST COME BEFORE GENERIC :id
// ============================================================================

/**
 * GET /api/v1/tasco-logs/:id/field/:field
 * Get specific field data for a Tasco Log
 * Supported fields: comment, loadCount, refuelLogs, fLoads
 */
router.get("/:id/field/:field", verifyToken, getTascoLogFieldController);

/**
 * GET /api/v1/tasco-logs/:id/complete
 * Get complete Tasco Log data with all relations
 */
router.get("/:id/complete", verifyToken, getCompleteTascoLogController);

/**
 * PUT /api/v1/tasco-logs/:id/load-quantity
 * Update Tasco Log load quantity
 */
router.put(
  "/:id/load-quantity",
  verifyToken,
  validateRequest(updateLoadQuantitySchema),
  updateLoadQuantityController
);

/**
 * PUT /api/v1/tasco-logs/:id/comment
 * Update Tasco Log comment
 */
router.put(
  "/:id/comment",
  verifyToken,
  validateRequest(updateTascoCommentSchema),
  updateTascoCommentController
);

/**
 * GET /api/v1/tasco-logs/:id/refuel-logs
 * Get all Refuel Logs for a Tasco Log
 */
router.get("/:id/refuel-logs", verifyToken, getRefuelLogsController);

/**
 * POST /api/v1/tasco-logs/:id/refuel-logs
 * Create a new Refuel Log
 */
router.post(
  "/:id/refuel-logs",
  verifyToken,
  validateRequest(createRefuelLogSchema),
  createRefuelLogController
);

/**
 * GET /api/v1/tasco-logs/:id/f-loads
 * Get all F-Loads for a Tasco Log
 */
router.get("/:id/f-loads", verifyToken, getFLoadsController);

/**
 * POST /api/v1/tasco-logs/:id/f-loads
 * Create a new TascoFLoad
 */
router.post(
  "/:id/f-loads",
  verifyToken,
  validateRequest(createFLoadSchema),
  createFLoadController
);

// ============================================================================
// TASCO LOG ENDPOINTS - GENERIC :id (MUST COME LAST)
// ============================================================================

/**
 * GET /api/v1/tasco-logs/:id
 * Get a single Tasco Log by ID
 */
router.get("/:id", verifyToken, getTascoLogController);

/**
 * DELETE /api/v1/tasco-logs/:id
 * Delete a Tasco Log (cascades to all related records)
 */
router.delete("/:id", verifyToken, deleteTascoLogController);

// ============================================================================
// REFUEL LOG ENDPOINTS (nested under :id handled above)
// ============================================================================

/**
 * PUT /api/v1/tasco-logs/refuel-logs/:refuelLogId
 * Update a Refuel Log
 */
router.put(
  "/refuel-logs/:refuelLogId",
  verifyToken,
  validateRequest(updateRefuelLogSchema),
  updateRefuelLogController
);

/**
 * DELETE /api/v1/tasco-logs/refuel-logs/:refuelLogId
 * Delete a Refuel Log
 */
router.delete(
  "/refuel-logs/:refuelLogId",
  verifyToken,
  deleteRefuelLogController
);

// ============================================================================
// TASCO F-LOADS ENDPOINTS (nested under :id handled above)
// ============================================================================

/**
 * PUT /api/v1/tasco-logs/f-loads/:fLoadId
 * Update a TascoFLoad
 */
router.put(
  "/f-loads/:fLoadId",
  verifyToken,
  validateRequest(updateFLoadSchema),
  updateFLoadController
);

/**
 * DELETE /api/v1/tasco-logs/f-loads/:fLoadId
 * Delete a TascoFLoad
 */
router.delete("/f-loads/:fLoadId", verifyToken, deleteFLoadController);

export default router;
