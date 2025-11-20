
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="df05d497-50fc-5f7c-9aff-22139f4dbffa")}catch(e){}}();
import express from "express";
import { getCostCodes, getCostCodesById, createCostCodes, updateCostCodes, archiveCostCodes, restoreCostCodes, deleteCostCodes, getCostCodeSummary, } from "../services/adminsCostCodeService.js";
export const getCostCodesController = async (req, res) => {
    try {
        const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageSize = req.query.pageSize
            ? parseInt(req.query.pageSize, 10)
            : 10;
        let skip = (page - 1) * pageSize;
        const result = await getCostCodes({ search, page, pageSize, skip });
        return res.json(result);
    }
    catch (error) {
        console.error("Error fetching cost codes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getCostCodeSummaryController = async (req, res) => {
    try {
        const result = await getCostCodeSummary();
        return res.json(result);
    }
    catch (error) {
        console.error("Error fetching cost code summary:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getCostCodeByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ error: "Missing id parameter" });
        const result = await getCostCodesById(id);
        if (!result)
            return res.status(404).json({ error: "Cost code not found" });
        return res.json(result);
    }
    catch (error) {
        console.error("Error fetching cost code by id:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const createCostCodeController = async (req, res) => {
    try {
        const result = await createCostCodes(req.body);
        return res.status(201).json(result);
    }
    catch (error) {
        console.error("Error creating cost code:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to create cost code",
        });
    }
};
export const updateCostCodeController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ error: "Missing id parameter" });
        const result = await updateCostCodes(id, req.body);
        return res.json(result);
    }
    catch (error) {
        console.error("Error updating cost code:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to update cost code",
        });
    }
};
export const archiveCostCodeController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ error: "Missing id parameter" });
        const result = await archiveCostCodes(id);
        return res.json(result);
    }
    catch (error) {
        console.error("Error archiving cost code:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to archive cost code",
        });
    }
};
export const restoreCostCodeController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ error: "Missing id parameter" });
        const result = await restoreCostCodes(id);
        return res.json(result);
    }
    catch (error) {
        console.error("Error restoring cost code:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to restore cost code",
        });
    }
};
export const deleteCostCodeController = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ error: "Missing id parameter" });
        await deleteCostCodes(id);
        return res.status(204).end();
    }
    catch (error) {
        console.error("Error deleting cost code:", error);
        res.status(400).json({
            error: error instanceof Error ? error.message : "Failed to delete cost code",
        });
    }
};
//# sourceMappingURL=adminCostCodeController.js.map
//# debugId=df05d497-50fc-5f7c-9aff-22139f4dbffa
