import type { Request, Response, NextFunction } from "express";

/**
 * Middleware to ensure no body or query params are sent
 * Allows only cookies to be present in the request
 */
export const requireOnlyCookies = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hasBody = req.body && Object.keys(req.body).length > 0;
  const hasQuery = req.query && Object.keys(req.query).length > 0;

  if (hasBody || hasQuery) {
    return res.status(400).json({
      success: false,
      error: "Invalid request format.",
    });
  }
  next();
};
