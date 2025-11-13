
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="14fd7f5e-1a25-5e42-b18b-41d48d8f29d0")}catch(e){}}();
import express from "express";
import dotenv from "dotenv";
import { getUserWithSettingsById } from "../services/initService.js";
dotenv.config();
export const initHandler = async (req, res) => {
    const userId = req.body.userId;
    const token = req.body.token;
    if (!token) {
        return res.status(400).json({ error: "Missing token" });
    }
    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
    }
    try {
        const data = await getUserWithSettingsById(userId);
        if (!data.user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: "Server error", details: String(err) });
    }
};
//# sourceMappingURL=initController.js.map
//# debugId=14fd7f5e-1a25-5e42-b18b-41d48d8f29d0
