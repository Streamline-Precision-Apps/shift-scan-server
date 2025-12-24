import express from "express";
import { exportAllFormats } from "../services/dataExportService.js";

/**
 * Controller for exporting database data in multiple formats
 * Generates Prisma seed file, JSON export, and SQL export
 */
export const exportDataController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log("Export data request received");

    // Execute the export
    const result = await exportAllFormats();

    // Return success response with file paths and metadata
    return res.status(200).json({
      success: true,
      message: "Data exported successfully in all formats",
      files: result.files,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Error in export data controller:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to export data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Controller for checking export status and available exports
 */
export const getExportStatusController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Export service is available",
      tables: [
        "Company",
        "CostCode",
        "CCTag",
        "Crew",
        "Equipment",
        "FormTemplate",
        "FormGrouping",
        "FormField",
        "FormFieldOption",
        "Jobsite",
        "Material",
        "User",
        "UserSettings",
        "Contacts",
      ],
      formats: ["prisma", "json", "sql"],
    });
  } catch (error) {
    console.error("Error in export status controller:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get export status",
    });
  }
};
