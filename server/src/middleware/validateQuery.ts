import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export interface ValidatedRequest extends Request {
  validatedQuery?: unknown;
}

/**
 * Middleware factory for request query parameter validation
 * Validates req.query against a Zod schema and returns 400 with detailed errors on validation failure
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 *
 * @example
 * router.get("/cookies", validateQuery(getCookieSchema), getCookie);
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const errors = result.error.issues.map((error: any) => ({
          field: error.path.join(".") || "root",
          message: error.message,
        }));

        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors,
        });
      }

      // Attach validated data to request for use in controller
      req.validatedQuery = result.data;
      next();
    } catch (error) {
      console.error("[Query Validation Error]", error);
      res.status(500).json({
        success: false,
        error: "Internal validation error",
      });
    }
  };
};
