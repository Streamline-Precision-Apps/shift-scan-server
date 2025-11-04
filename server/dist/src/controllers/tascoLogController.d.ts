import type { Request, Response } from "express";
/**
 * TascoLog Controller
 * Handles HTTP requests and responses for Tasco-related operations
 */
/**
 * GET /api/v1/tasco-logs/:id
 * Get a single Tasco Log by ID
 */
export declare function getTascoLogController(req: Request, res: Response): Promise<void>;
/**
 * GET /api/v1/tasco-logs/timesheet/:timesheetId
 * Get all Tasco Logs for a timesheet
 */
export declare function getTascoLogsByTimesheetController(req: Request, res: Response): Promise<void>;
/**
 * PUT /api/v1/tasco-logs/:id/load-quantity
 * Update Tasco Log load quantity
 */
export declare function updateLoadQuantityController(req: Request, res: Response): Promise<void>;
/**
 * PUT /api/v1/tasco-logs/:id/comment
 * Update Tasco Log comment
 */
export declare function updateTascoCommentController(req: Request, res: Response): Promise<void>;
/**
 * POST /api/v1/tasco-logs/:id/refuel-logs
 * Create a new Refuel Log
 */
export declare function createRefuelLogController(req: Request, res: Response): Promise<void>;
/**
 * GET /api/v1/tasco-logs/:id/refuel-logs
 * Get all Refuel Logs for a Tasco Log
 */
export declare function getRefuelLogsController(req: Request, res: Response): Promise<void>;
/**
 * PUT /api/v1/tasco-logs/refuel-logs/:refuelLogId
 * Update a Refuel Log
 */
export declare function updateRefuelLogController(req: Request, res: Response): Promise<void>;
/**
 * DELETE /api/v1/tasco-logs/refuel-logs/:refuelLogId
 * Delete a Refuel Log
 */
export declare function deleteRefuelLogController(req: Request, res: Response): Promise<void>;
/**
 * POST /api/v1/tasco-logs/:id/f-loads
 * Create a new TascoFLoad
 */
export declare function createFLoadController(req: Request, res: Response): Promise<void>;
/**
 * GET /api/v1/tasco-logs/:id/f-loads
 * Get all F-Loads for a Tasco Log
 */
export declare function getFLoadsController(req: Request, res: Response): Promise<void>;
/**
 * PUT /api/v1/tasco-logs/f-loads/:fLoadId
 * Update a TascoFLoad
 */
export declare function updateFLoadController(req: Request, res: Response): Promise<void>;
/**
 * DELETE /api/v1/tasco-logs/f-loads/:fLoadId
 * Delete a TascoFLoad
 */
export declare function deleteFLoadController(req: Request, res: Response): Promise<void>;
/**
 * GET /api/v1/tasco-logs/:id/complete
 * Get complete Tasco Log data with all relations
 */
export declare function getCompleteTascoLogController(req: Request, res: Response): Promise<void>;
/**
 * DELETE /api/v1/tasco-logs/:id
 * Delete a Tasco Log (cascades to all related records)
 */
export declare function deleteTascoLogController(req: Request, res: Response): Promise<void>;
/**
 * GET /api/v1/tasco-logs/:id/field/:field
 * Get specific field data for a Tasco Log
 * Supported fields: comment, loadCount, refuelLogs, fLoads
 */
export declare function getTascoLogFieldController(req: Request, res: Response): Promise<void>;
/**
 * GET /api/v1/tasco-logs/user/:userId/active
 * Get the active Tasco Log for a user
 */
export declare function getActiveTascoLogController(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=tascoLogController.d.ts.map