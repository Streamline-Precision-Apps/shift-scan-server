import type { Request, Response } from "express";
/**
 * GET /api/v1/admins/timesheet
 * Get all timesheets with pagination, filtering, and search
 */
export declare function getAllTimesheetsController(req: Request, res: Response): Promise<void>;
/**
 * GET /api/v1/admins/timesheet/:id
 * Get a single timesheet by ID with all related data
 */
export declare function getTimesheetByIdController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * GET /api/v1/admins/timesheet/:id/change-logs
 * Get change logs for a specific timesheet
 */
export declare function getTimesheetChangeLogsController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * POST /api/v1/admins/timesheet
 * Create a new timesheet (admin creation)
 */
export declare function createTimesheetController(req: Request, res: Response): Promise<void>;
/**
 * POST /api/v1/admins/timesheet/export
 * Export timesheets to Excel
 */
export declare function exportTimesheetsController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PUT /api/v1/admins/timesheet/:id
 * Update a timesheet (optimized update with change tracking)
 */
export declare function updateTimesheetController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PUT /api/v1/admins/timesheet/:id/status
 * Update timesheet status (approve/deny)
 */
export declare function updateTimesheetStatusController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * DELETE /api/v1/admins/timesheet/:id
 * Delete a timesheet by ID
 */
export declare function deleteTimesheetController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * GET /api/v1/admins/tasco-material-types
 * Get all Tasco material types
 */
export declare function getAllTascoMaterialTypesController(req: Request, res: Response): Promise<void>;
/**
 * POST /api/v1/admins/timesheet/resolve-notification
 * Check timesheet status and resolve notification if already approved/rejected
 */
export declare function resolveTimecardNotificationController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=adminTimesheetController.d.ts.map