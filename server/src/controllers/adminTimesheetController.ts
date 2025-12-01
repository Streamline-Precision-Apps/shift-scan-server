import type { Request, Response } from "express";
import {
  getAllTimesheets,
  getTimesheetById,
  createTimesheet,
  updateTimesheet,
  updateTimesheetStatus,
  deleteTimesheet,
  exportTimesheets,
  getTimesheetChangeLogs,
  getAllTascoMaterialTypes,
  resolveTimecardNotification,
} from "../services/adminTimesheetService.js";

/**
 * GET /api/v1/admins/timesheet
 * Get all timesheets with pagination, filtering, and search
 */
export async function getAllTimesheetsController(req: Request, res: Response) {
  try {
    // Status param for showPendingOnly behavior
    // Extract the first 'status' param if it's a string (from showPendingOnly)
    // If status is an array, use "all" as default for showPendingOnly
    let statusParam = "all";
    let statusFilters: string[] = [];
    
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        // Multiple status values = filter selections
        statusFilters = req.query.status as string[];
      } else if (typeof req.query.status === "string") {
        // Single status value could be either:
        // 1. "pending" or "all" from showPendingOnly
        // 2. A single filter selection like "APPROVED"
        const statusValue = req.query.status.toLowerCase();
        if (statusValue === "pending" || statusValue === "all") {
          statusParam = statusValue;
        } else {
          // It's a filter selection
          statusFilters = [req.query.status];
        }
      }
    }
    
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 25;
    const search = typeof req.query.search === "string" ? req.query.search : "";

    // Filter parameters (arrays)
    const jobsiteId = req.query.jobsiteId
      ? Array.isArray(req.query.jobsiteId)
        ? req.query.jobsiteId
        : [req.query.jobsiteId]
      : [];
    const costCode = req.query.costCode
      ? Array.isArray(req.query.costCode)
        ? req.query.costCode
        : [req.query.costCode]
      : [];
    const equipmentId = req.query.equipmentId
      ? Array.isArray(req.query.equipmentId)
        ? req.query.equipmentId
        : [req.query.equipmentId]
      : [];
    const equipmentLogTypes = req.query.equipmentLogTypes
      ? Array.isArray(req.query.equipmentLogTypes)
        ? req.query.equipmentLogTypes
        : [req.query.equipmentLogTypes]
      : [];
    const changes = req.query.changes
      ? Array.isArray(req.query.changes)
        ? req.query.changes
        : [req.query.changes]
      : [];
    const id = req.query.id
      ? Array.isArray(req.query.id)
        ? req.query.id
        : [req.query.id]
      : [];
    const notificationId = req.query.notificationId
      ? Array.isArray(req.query.notificationId)
        ? req.query.notificationId
        : [req.query.notificationId]
      : [];

    // Date range - handle date-only strings (YYYY-MM-DD) from frontend
    let dateFrom: Date | undefined = undefined;
    let dateTo: Date | undefined = undefined;
    
    if (req.query.dateFrom) {
      const dateStr = req.query.dateFrom as string;
      // If date-only format (YYYY-MM-DD), set to start of day
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        dateFrom = new Date(dateStr + 'T00:00:00.000Z');
      } else {
        dateFrom = new Date(dateStr);
      }
    }
    
    if (req.query.dateTo) {
      const dateStr = req.query.dateTo as string;
      // If date-only format (YYYY-MM-DD), set to end of day
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        dateTo = new Date(dateStr + 'T23:59:59.999Z');
      } else {
        dateTo = new Date(dateStr);
      }
    }

    const skip = (page - 1) * pageSize;

    const result = await getAllTimesheets({
      status: statusParam,
      page,
      pageSize,
      skip,
      search,
      filters: {
        jobsiteId: jobsiteId as string[],
        costCode: costCode as string[],
        equipmentId: equipmentId as string[],
        equipmentLogTypes: equipmentLogTypes as string[],
        status: statusFilters as string[],
        changes: changes as string[],
        id: id as string[],
        notificationId: notificationId as string[],
        dateRange: {
          from: dateFrom,
          to: dateTo,
        },
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch timesheets",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * GET /api/v1/admins/timesheet/:id
 * Get a single timesheet by ID with all related data
 */
export async function getTimesheetByIdController(req: Request, res: Response) {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid timesheet ID",
      });
    }

    const timesheet = await getTimesheetById(id);
    if (!timesheet) {
      return res.status(404).json({
        success: false,
        message: "Timesheet not found",
      });
    }

    res.status(200).json(timesheet);
  } catch (error) {
    console.error("Error fetching timesheet:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch timesheet",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * GET /api/v1/admins/timesheet/:id/change-logs
 * Get change logs for a specific timesheet
 */
export async function getTimesheetChangeLogsController(
  req: Request,
  res: Response
) {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid timesheet ID",
      });
    }

    const changeLogs = await getTimesheetChangeLogs(id);
    res.status(200).json(changeLogs);
  } catch (error) {
    console.error("Error fetching change logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch change logs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/v1/admins/timesheet
 * Create a new timesheet (admin creation)
 */
export async function createTimesheetController(req: Request, res: Response) {
  try {
    const payload = req.body;
    const result = await createTimesheet(payload);
    res.status(201).json({
      success: true,
      message: "Timesheet created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating timesheet:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create timesheet",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/v1/admins/timesheet/export
 * Export timesheets to Excel
 */
export async function exportTimesheetsController(req: Request, res: Response) {
  try {
    const { timesheetIds = [], fields, dateRange, filters } = req.body;
    
    if (!Array.isArray(timesheetIds)) {
      return res.status(400).json({
        success: false,
        message: "Invalid timesheet IDs format",
      });
    }

    // Parse date range if provided - handle date-only strings (YYYY-MM-DD)
    let parsedDateRange: { from?: Date; to?: Date } | undefined;
    if (dateRange) {
      parsedDateRange = {};
      if (dateRange.from) {
        const fromStr = dateRange.from;
        // If date-only format (YYYY-MM-DD), set to start of day
        if (typeof fromStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fromStr)) {
          parsedDateRange.from = new Date(fromStr + 'T00:00:00.000Z');
        } else {
          parsedDateRange.from = new Date(fromStr);
        }
      }
      if (dateRange.to) {
        const toStr = dateRange.to;
        // If date-only format (YYYY-MM-DD), set to end of day
        if (typeof toStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(toStr)) {
          parsedDateRange.to = new Date(toStr + 'T23:59:59.999Z');
        } else {
          parsedDateRange.to = new Date(toStr);
        }
      }
    }

    const result = await exportTimesheets(
      timesheetIds, 
      fields, 
      parsedDateRange,
      filters
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error exporting timesheets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export timesheets",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * PUT /api/v1/admins/timesheet/:id
 * Update a timesheet (optimized update with change tracking)
 */
export async function updateTimesheetController(req: Request, res: Response) {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid timesheet ID",
      });
    }

    const {
      data,
      originalData,
      changes,
      editorId,
      changeReason,
      wasStatusChanged,
      numberOfChanges,
    } = req.body;

    const result = await updateTimesheet(id, {
      data,
      originalData,
      changes,
      editorId,
      changeReason,
      wasStatusChanged,
      numberOfChanges,
    });

    res.status(200).json({
      success: true,
      message: "Timesheet updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating timesheet:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update timesheet",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * PUT /api/v1/admins/timesheet/:id/status
 * Update timesheet status (approve/deny)
 */
export async function updateTimesheetStatusController(
  req: Request,
  res: Response
) {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid timesheet ID",
      });
    }

    const { status, changes } = req.body;
    
    if (!status || !["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Get authenticated user ID from JWT token
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    await updateTimesheetStatus(id, status, changes || {}, userId);

    res.status(200).json({
      success: true,
      message: `Timesheet ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Error updating timesheet status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update timesheet status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * DELETE /api/v1/admins/timesheet/:id
 * Delete a timesheet by ID
 */
export async function deleteTimesheetController(req: Request, res: Response) {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid timesheet ID",
      });
    }

    await deleteTimesheet(id);

    res.status(200).json({
      success: true,
      message: "Timesheet deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting timesheet:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete timesheet",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * GET /api/v1/admins/tasco-material-types
 * Get all Tasco material types
 */
export async function getAllTascoMaterialTypesController(
  req: Request,
  res: Response
) {
  try {
    const result = await getAllTascoMaterialTypes();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching Tasco material types:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Tasco material types",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/v1/admins/timesheet/resolve-notification
 * Check timesheet status and resolve notification if already approved/rejected
 */
export async function resolveTimecardNotificationController(
  req: Request,
  res: Response
) {
  try {
    const { timesheetId, notificationId } = req.body;
    
    if (!timesheetId || !notificationId) {
      return res.status(400).json({
        success: false,
        message: "Timesheet ID and notification ID are required",
      });
    }

    // Get authenticated user ID
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await resolveTimecardNotification(
      timesheetId,
      parseInt(notificationId),
      userId
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error resolving timecard notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resolve timecard notification",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
