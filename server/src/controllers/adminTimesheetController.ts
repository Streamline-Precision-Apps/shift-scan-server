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
} from "../services/adminTimesheetService.js";

/**
 * GET /api/v1/admins/timesheet
 * Get all timesheets with pagination, filtering, and search
 */
export async function getAllTimesheetsController(req: Request, res: Response) {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : "all";
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
    const statusFilters = req.query.status
      ? Array.isArray(req.query.status)
        ? req.query.status
        : [req.query.status]
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

    // Date range
    const dateFrom = req.query.dateFrom
      ? new Date(req.query.dateFrom as string)
      : undefined;
    const dateTo = req.query.dateTo
      ? new Date(req.query.dateTo as string)
      : undefined;

    const skip = (page - 1) * pageSize;

    const result = await getAllTimesheets({
      status,
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

    // Parse date range if provided
    let parsedDateRange: { from?: Date; to?: Date } | undefined;
    if (dateRange) {
      parsedDateRange = {};
      if (dateRange.from) parsedDateRange.from = new Date(dateRange.from);
      if (dateRange.to) parsedDateRange.to = new Date(dateRange.to);
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

    await updateTimesheetStatus(id, status, changes || {});

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
