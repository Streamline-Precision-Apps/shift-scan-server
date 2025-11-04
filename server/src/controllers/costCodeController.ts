import express from "express";
import { getCostCodes } from "../services/costCodeService.js";

export async function getCostCodeController(
  req: express.Request,
  res: express.Response
) {
  try {
    const costCodes = await getCostCodes();
    res.status(200).json(costCodes);
  } catch (error) {
    console.error("Error fetching cost codes:", error);
    res.status(500).json({ error: "Failed to fetch cost codes" });
  }
}
