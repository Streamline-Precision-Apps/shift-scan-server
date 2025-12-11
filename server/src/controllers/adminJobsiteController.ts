import type { Request, Response } from "express";
import {
  getAllJobsites,
  getJobsiteById,
  createJobsite,
  updateJobsite,
  archiveJobsite,
  restoreJobsite,
  deleteJobsite,
} from "../services/adminJobsiteService.js";

// GET /api/v1/admins/jobsite
export async function getAllJobsitesController(req: Request, res: Response) {
  try {
    // Extract filter parameters - status can be array or single value
    const statusParam = req.query.status;
    const statusFilters = Array.isArray(statusParam) 
      ? statusParam.filter((s): s is string => typeof s === "string")
      : typeof statusParam === "string" ? [statusParam] : [];

    // Extract approval status filters - can be array or single value
    const approvalStatusParam = req.query.approvalStatus;
    const approvalStatusFilters = Array.isArray(approvalStatusParam)
      ? approvalStatusParam.filter((s): s is string => typeof s === "string")
      : typeof approvalStatusParam === "string" ? [approvalStatusParam] : [];

    // Extract hasTimesheets filter - single boolean value
    const hasTimesheetsParam = req.query.hasTimesheets;
    const hasTimesheets = hasTimesheetsParam === "true" ? true 
                        : hasTimesheetsParam === "false" ? false 
                        : undefined;

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 25;
    let skip = (page - 1) * pageSize;
    let totalPages = 1;
    let total = 0;
    const result = await getAllJobsites(
      statusFilters,
      approvalStatusFilters,
      hasTimesheets,
      page,
      pageSize,
      skip,
      totalPages,
      total
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobsites",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// GET /api/v1/admins/jobsite/:id
export async function getJobsiteByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Jobsite ID is required",
      });
    }
    const jobsite = await getJobsiteById(id);
    if (!jobsite) {
      return res.status(404).json({
        success: false,
        message: "Jobsite not found",
      });
    }
    res.status(200).json(jobsite);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobsite",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// --- Types for Jobsite creation and update ---
export interface JobsiteCreateBody {
  code: string;
  name: string;
  description: string;
  ApprovalStatus: string;
  status: string;
  Address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  Client?: {
    id: string;
  } | null;
  CCTags?: Array<{ id: string }>;
  CreatedVia: string;
  createdById: string;
}

export interface JobsiteUpdateBody {
  code?: string;
  name?: string;
  description?: string;
  approvalStatus?: string;
  status?: string;
  creationReason?: string;
  CCTags?: Array<{ id: string }>;
  Address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  updatedAt?: Date;
  userId: string;
}

// POST /api/v1/admins/jobsite
export async function createJobsiteController(
  req: Request<{}, {}, JobsiteCreateBody>,
  res: Response
) {
  try {
    const payload = req.body;
    await createJobsite(payload);
    res.status(201).json({
      success: true,
      message: "Jobsite created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create jobsite",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// PUT /api/v1/admins/jobsite/:id
export async function updateJobsiteController(
  req: Request<{ id: string }, {}, JobsiteUpdateBody>,
  res: Response
) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Jobsite ID is required",
      });
    }
    const updateData = req.body;
    // You may want to get userId from auth middleware/session
    const updated = await updateJobsite(id, updateData);
    res.status(200).json({
      success: true,
      message: "Jobsite updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update jobsite",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// PUT /api/v1/admins/jobsite/:id/archive
export async function archiveJobsiteController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Jobsite ID is required",
      });
    }

    await archiveJobsite(id);
    res.status(200).json({
      success: true,
      message: "Jobsite archived successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to archive jobsite",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// PUT /api/v1/admins/jobsite/:id/restore
export async function restoreJobsiteController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Jobsite ID is required",
      });
    }
    await restoreJobsite(id);

    res.status(200).json({
      success: true,
      message: "Jobsite restored successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to restore jobsite",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// DELETE /api/v1/admins/jobsite/:id
export async function deleteJobsiteController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Jobsite ID is required",
      });
    }
    await deleteJobsite(id);
    res.status(200).json({
      success: true,
      message: "Jobsite deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete jobsite",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
