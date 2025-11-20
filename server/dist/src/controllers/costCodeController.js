
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7417c919-ab13-55d1-9c42-6227e3e89477")}catch(e){}}();
import express from "express";
import { getCostCodes } from "../services/costCodeService.js";
export async function getCostCodeController(req, res) {
    try {
        const costCodes = await getCostCodes();
        res.status(200).json(costCodes);
    }
    catch (error) {
        console.error("Error fetching cost codes:", error);
        res.status(500).json({ error: "Failed to fetch cost codes" });
    }
}
//# sourceMappingURL=costCodeController.js.map
//# debugId=7417c919-ab13-55d1-9c42-6227e3e89477
