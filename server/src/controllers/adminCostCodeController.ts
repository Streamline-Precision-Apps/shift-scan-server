import express from "express";
import {
  getCostCodes,
  getCostCodesById,
  createCostCodes,
  updateCostCodes,
  archiveCostCodes,
  restoreCostCodes,
  deleteCostCodes,
  getCostCodeSummary,
} from "../services/adminsCostCodeService.js";

export const getCostCodesController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : 10;
    let skip = (page - 1) * pageSize;
    const result = await getCostCodes({ search, page, pageSize, skip });
    return res.json(result);
  } catch (error) {
    console.error("Error fetching cost codes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCostCodeSummaryController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await getCostCodeSummary();
    return res.json(result);
  } catch (error) {
    console.error("Error fetching cost code summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCostCodeByIdController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id parameter" });
    const result = await getCostCodesById(id);
    if (!result) return res.status(404).json({ error: "Cost code not found" });
    return res.json(result);
  } catch (error) {
    console.error("Error fetching cost code by id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createCostCodeController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await createCostCodes(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating cost code:", error);
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to create cost code",
    });
  }
};

export const updateCostCodeController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id parameter" });
    const result = await updateCostCodes(id, req.body);
    return res.json(result);
  } catch (error) {
    console.error("Error updating cost code:", error);
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to update cost code",
    });
  }
};

export const archiveCostCodeController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id parameter" });
    const result = await archiveCostCodes(id);
    return res.json(result);
  } catch (error) {
    console.error("Error archiving cost code:", error);
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to archive cost code",
    });
  }
};

export const restoreCostCodeController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id parameter" });
    const result = await restoreCostCodes(id);
    return res.json(result);
  } catch (error) {
    console.error("Error restoring cost code:", error);
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to restore cost code",
    });
  }
};

export const deleteCostCodeController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Missing id parameter" });
    await deleteCostCodes(id);
    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting cost code:", error);
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "Failed to delete cost code",
    });
  }
};
