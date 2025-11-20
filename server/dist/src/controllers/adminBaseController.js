
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="eaf5a636-4094-5046-8cf6-b65033b702aa")}catch(e){}}();
import express from "express";
import { fetchNotificationServiceByUserId, getDashboardData, getUserTopicPreferences, } from "../services/adminBaseService.js";
export const baseController = async (req, res) => {
    try {
        const { userId, resolvedSince } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter" });
        }
        if (typeof userId !== "string") {
            return res.status(400).json({ error: "userId must be a string" });
        }
        const result = await fetchNotificationServiceByUserId(userId, resolvedSince);
        return res.json(result);
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getDashboardDataController = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter" });
        }
        if (typeof userId !== "string") {
            return res.status(400).json({ error: "userId must be a string" });
        }
        const result = await getDashboardData(userId);
        return res.json(result);
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getUserTopicPreferencesController = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId parameter" });
        }
        if (typeof userId !== "string") {
            return res.status(400).json({ error: "userId must be a string" });
        }
        const result = await getUserTopicPreferences(userId);
        return res.json(result);
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
//# sourceMappingURL=adminBaseController.js.map
//# debugId=eaf5a636-4094-5046-8cf6-b65033b702aa
