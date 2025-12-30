import express from "express";
import jwt from "jsonwebtoken";
import config from "../lib/config.js";
import type { JwtUserPayload } from "../lib/jwt.js";

export interface AuthenticatedRequest extends express.Request {
  user?: JwtUserPayload;
}

/**
 * Express middleware to verify JWT token from Authorization header or session cookie.
 * Attaches decoded user payload to req.user if valid.
 */

export function verifyToken(
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers["authorization"] as string | undefined;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    const cookie = req.cookies["session"];
    token = cookie; // Use utility for cookie access
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Allow build token for static export/build processes
  if (process.env.BUILD_TOKEN && token === process.env.BUILD_TOKEN) {
    req.user = { id: "build-script" } as JwtUserPayload;
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

// middleware/authMiddleware.js
export function authorizeRoles(
  ...allowedRoles: ("USER" | "MANAGER" | "ADMIN" | "SUPERADMIN")[]
) {
  return (
    req: AuthenticatedRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Permission check removed: JWT only contains user ID now

    next();
  };
}
