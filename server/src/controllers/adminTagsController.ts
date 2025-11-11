import type { Request, Response } from "express";
import { getAllTags } from "../services/adminTagService.js";

export async function getTagsController(req: Request, res: Response) {
  try {
    // Use req.query for search, page, and pageSize
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;
    let total = 0;
    let skip = (page - 1) * pageSize;
    let totalPages = 1;

    const result = await getAllTags(
      total,
      page,
      pageSize,
      skip,
      totalPages,
      search
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tags",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
