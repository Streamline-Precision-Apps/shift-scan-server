import type { Request, Response } from "express";
import {
  getTascoReport as getTascoReportService,
  getTruckingReport as getTruckingReportService,
  getMechanicReport as getMechanicReportService,
  getTascoFilterOptions as getTascoFilterOptionsService,
} from "../services/adminsReportService.js";

export async function getTascoReport(req: Request, res: Response) {
  try {
    // Parse query parameters
    const filters: {
      jobsiteIds?: string[];
      shiftTypes?: string[];
      employeeIds?: string[];
      laborTypes?: string[];
      equipmentIds?: string[];
      materialTypes?: string[];
    } = {};

    if (req.query.jobsiteIds) {
      filters.jobsiteIds = (req.query.jobsiteIds as string).split(",");
    }
    if (req.query.shiftTypes) {
      filters.shiftTypes = (req.query.shiftTypes as string).split(",");
    }
    if (req.query.employeeIds) {
      filters.employeeIds = (req.query.employeeIds as string).split(",");
    }
    if (req.query.laborTypes) {
      filters.laborTypes = (req.query.laborTypes as string).split(",");
    }
    if (req.query.equipmentIds) {
      filters.equipmentIds = (req.query.equipmentIds as string).split(",");
    }
    if (req.query.materialTypes) {
      filters.materialTypes = (req.query.materialTypes as string).split(",");
    }

    const data = await getTascoReportService(filters);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Tasco report",
      error: error instanceof Error ? error.message : error,
    });
  }
}

export async function getTruckingReport(req: Request, res: Response) {
  try {
    const data = await getTruckingReportService();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Trucking report",
      error: error instanceof Error ? error.message : error,
    });
  }
}

export async function getMechanicReport(req: Request, res: Response) {
  try {
    const data = await getMechanicReportService();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Mechanic report",
      error: error instanceof Error ? error.message : error,
    });
  }
}

export async function getTascoFilterOptions(req: Request, res: Response) {
  try {
    const data = await getTascoFilterOptionsService();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Tasco filter options",
      error: error instanceof Error ? error.message : error,
    });
  }
}
