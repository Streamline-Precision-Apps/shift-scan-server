
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="78a08668-9e18-572f-98b4-50debb8e2cd4")}catch(e){}}();
import express from "express";
import jwt from "jsonwebtoken";
import config from "../lib/config.js";
export function verifyToken(req, res, next) {
    // Check Authorization header first (Bearer <token>) then fall back to cookie
    const authHeader = req.headers["authorization"];
    let token;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token)
        return res.status(401).json({ message: "No token provided" });
    // Allow build token for static export/build processes
    if (process.env.BUILD_TOKEN && token === process.env.BUILD_TOKEN) {
        req.user = { id: "build-script" }; // dummy user info
        return next();
    }
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
}
// middleware/authMiddleware.js
export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        // Permission check removed: JWT only contains user ID now
        next();
    };
}
//# sourceMappingURL=authMiddleware.js.map
//# debugId=78a08668-9e18-572f-98b4-50debb8e2cd4
