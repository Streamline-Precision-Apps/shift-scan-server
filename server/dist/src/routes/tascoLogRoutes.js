
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d6a68697-1b34-5875-b246-b175e6bbfb88")}catch(e){}}();
import { Router } from "express";
import { getTascoLogController, getTascoLogsByTimesheetController, updateLoadQuantityController, updateTascoCommentController, createRefuelLogController, getRefuelLogsController, updateRefuelLogController, deleteRefuelLogController, createFLoadController, getFLoadsController, updateFLoadController, deleteFLoadController, getCompleteTascoLogController, deleteTascoLogController, getTascoLogFieldController, getActiveTascoLogController, } from "../controllers/tascoLogController.js";
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
router.get("/user/:userId/active", getActiveTascoLogController);
/**
 * GET /api/v1/tasco-logs/timesheet/:timesheetId
 * Get all Tasco Logs for a timesheet
 */
router.get("/timesheet/:timesheetId", getTascoLogsByTimesheetController);
// ============================================================================
// ROUTES WITH PATH EXTENSIONS - MUST COME BEFORE GENERIC :id
// ============================================================================
/**
 * GET /api/v1/tasco-logs/:id/field/:field
 * Get specific field data for a Tasco Log
 * Supported fields: comment, loadCount, refuelLogs, fLoads
 */
router.get("/:id/field/:field", getTascoLogFieldController);
/**
 * GET /api/v1/tasco-logs/:id/complete
 * Get complete Tasco Log data with all relations
 */
router.get("/:id/complete", getCompleteTascoLogController);
/**
 * PUT /api/v1/tasco-logs/:id/load-quantity
 * Update Tasco Log load quantity
 */
router.put("/:id/load-quantity", updateLoadQuantityController);
/**
 * PUT /api/v1/tasco-logs/:id/comment
 * Update Tasco Log comment
 */
router.put("/:id/comment", updateTascoCommentController);
/**
 * GET /api/v1/tasco-logs/:id/refuel-logs
 * Get all Refuel Logs for a Tasco Log
 */
router.get("/:id/refuel-logs", getRefuelLogsController);
/**
 * POST /api/v1/tasco-logs/:id/refuel-logs
 * Create a new Refuel Log
 */
router.post("/:id/refuel-logs", createRefuelLogController);
/**
 * GET /api/v1/tasco-logs/:id/f-loads
 * Get all F-Loads for a Tasco Log
 */
router.get("/:id/f-loads", getFLoadsController);
/**
 * POST /api/v1/tasco-logs/:id/f-loads
 * Create a new TascoFLoad
 */
router.post("/:id/f-loads", createFLoadController);
// ============================================================================
// TASCO LOG ENDPOINTS - GENERIC :id (MUST COME LAST)
// ============================================================================
/**
 * GET /api/v1/tasco-logs/:id
 * Get a single Tasco Log by ID
 */
router.get("/:id", getTascoLogController);
/**
 * DELETE /api/v1/tasco-logs/:id
 * Delete a Tasco Log (cascades to all related records)
 */
router.delete("/:id", deleteTascoLogController);
// ============================================================================
// REFUEL LOG ENDPOINTS (nested under :id handled above)
// ============================================================================
/**
 * PUT /api/v1/tasco-logs/refuel-logs/:refuelLogId
 * Update a Refuel Log
 */
router.put("/refuel-logs/:refuelLogId", updateRefuelLogController);
/**
 * DELETE /api/v1/tasco-logs/refuel-logs/:refuelLogId
 * Delete a Refuel Log
 */
router.delete("/refuel-logs/:refuelLogId", deleteRefuelLogController);
// ============================================================================
// TASCO F-LOADS ENDPOINTS (nested under :id handled above)
// ============================================================================
/**
 * PUT /api/v1/tasco-logs/f-loads/:fLoadId
 * Update a TascoFLoad
 */
router.put("/f-loads/:fLoadId", updateFLoadController);
/**
 * DELETE /api/v1/tasco-logs/f-loads/:fLoadId
 * Delete a TascoFLoad
 */
router.delete("/f-loads/:fLoadId", deleteFLoadController);
export default router;
//# sourceMappingURL=tascoLogRoutes.js.map
//# debugId=d6a68697-1b34-5875-b246-b175e6bbfb88
