import type { Request, Response } from "express";
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../services/adminTagService.js";

export async function getTagSummaryController(req: Request, res: Response) {
  try {
    // Use req.query for search, page, and pageSize
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;
    let skip = (page - 1) * pageSize;

    const result = await getAllTags(search, page, pageSize, skip);

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

export async function getTagByIdController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id parameter" });
    const tag = await getTagById(id);
    if (!tag) return res.status(404).json({ error: "Tag not found" });
    res.status(200).json(tag);
  } catch (error) {
    console.error("Error fetching tag by id:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tag by id",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function createTagController(req: Request, res: Response) {
  try {
    const tag = await createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create tag",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateTagController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id parameter" });

    const tag = await updateTag(id, req.body);
    res.status(200).json(tag);
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update tag",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteTagController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id parameter" });
    await deleteTag(id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(400).json({
      success: false,
      message: "Failed to delete tag",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
