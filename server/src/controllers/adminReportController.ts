import type { Request, Response } from "express";
import {
  getTascoReport as getTascoReportService,
  getTruckingReport as getTruckingReportService,
  getMechanicReport as getMechanicReportService,
} from "../services/adminsReportService.js";

export async function getTascoReport(req: Request, res: Response) {
  try {
    const data = await getTascoReportService();
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
