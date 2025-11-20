// GET /api/cookies?name=key

!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3b1b6516-59f7-5b49-91f6-8b9dbdb79225")}catch(e){}}();
import express from "express";
export function getCookie(req, res) {
    let { name } = req.query;
    if (!name) {
        console.warn("❌ GET cookie: Missing cookie name parameter");
        return res.status(400).json({ error: "Missing cookie name" });
    }
    if (Array.isArray(name))
        name = name[0];
    if (typeof name !== "string") {
        console.warn("❌ GET cookie: Invalid cookie name type");
        return res.status(400).json({ error: "Invalid cookie name" });
    }
    const value = req.cookies?.[name];
    if (value === undefined) {
        if (name === "currentPageView") {
            return res.status(200).json({ value: "" });
        }
        console.warn(`⚠️  Cookie not found: ${name}`);
        return res.status(204).send(); // No Content
    }
    res.json({ value });
}
// GET /api/cookies?name=key1&name=key2&name=key3
export function getCookieList(req, res) {
    let { name } = req.query;
    if (!name) {
        console.warn("❌ GET cookies: Missing cookie name parameter");
        return res.status(400).json({ error: "Missing cookie name(s)" });
    }
    if (typeof name === "string") {
        name = [name];
    }
    if (!Array.isArray(name) || !name.every((n) => typeof n === "string")) {
        console.warn("❌ GET cookies: Invalid cookie name type");
        return res.status(400).json({ error: "Invalid cookie name(s)" });
    }
    const values = {};
    name.forEach((cookieName) => {
        values[cookieName] = req.cookies?.[cookieName];
    });
    res.json({ value: values });
}
// POST or PUT /api/cookies { name, value, options }
// UPSERT: Creates cookie if it doesn't exist, updates if it does
export function setCookie(req, res) {
    const { name, value, options } = req.body;
    if (!name || value === undefined) {
        console.error("❌ Missing name or value in request");
        return res.status(400).json({ error: "Missing name or value" });
    }
    // Get current cookie value to check if it exists
    const existingValue = req.cookies?.[name];
    const isUpdate = existingValue !== undefined;
    // IMPORTANT: Set proper cookie options to ensure browser receives it
    const cookieOptions = {
        path: "/",
        httpOnly: false, // Must be false so client can read it
        maxAge: 60 * 60 * 24 * 365, // 1 year
        ...options, // Merge with provided options
    };
    // Set the cookie
    res.cookie(name, value, cookieOptions);
    res.json({
        message: `Cookie ${isUpdate ? "updated" : "created"}`,
        name,
        value,
        action: isUpdate ? "UPDATE" : "CREATE",
        options: cookieOptions,
    });
} // DELETE /api/cookies?name=key or /api/cookies (delete all)
export function deleteCookie(req, res) {
    let { name } = req.query;
    if (name) {
        if (Array.isArray(name))
            name = name[0];
        if (typeof name === "string") {
            res.clearCookie(name);
            return res.json({ message: `Cookie '${name}' deleted` });
        }
        else {
            return res.status(400).json({ error: "Invalid cookie name" });
        }
    }
    // Delete all cookies
    if (req.cookies) {
        Object.keys(req.cookies).forEach((cookieName) => {
            res.clearCookie(cookieName);
        });
    }
    res.json({ message: "All cookies deleted" });
}
export function deleteAllCookie(req, res) {
    // Always delete all cookies, regardless of query params
    if (req.cookies) {
        Object.keys(req.cookies).forEach((cookieName) => {
            res.clearCookie(cookieName);
        });
    }
    res.json({ message: "All cookies deleted" });
}
// DELETE /api/cookies/list?name=key1&name=key2
export function deleteCookieList(req, res) {
    let { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: "Missing cookie name(s)" });
    }
    if (typeof name === "string") {
        name = [name];
    }
    if (!Array.isArray(name) || !name.every((n) => typeof n === "string")) {
        return res.status(400).json({ error: "Invalid cookie name(s)" });
    }
    name.forEach((cookieName) => {
        res.clearCookie(cookieName);
    });
    res.json({ message: `Cookies deleted: ${name.join(", ")}` });
}
//# sourceMappingURL=cookiesController.js.map
//# debugId=3b1b6516-59f7-5b49-91f6-8b9dbdb79225
