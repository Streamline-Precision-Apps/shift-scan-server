import { z } from "zod";

/**
 * Zod schema for creating a cost code (POST /api/v1/admins/cost-codes)
 */
export const createCostCodeSchema = z.object({
  code: z.string().min(1, "Cost code is required"),
  name: z.string().min(1, "Cost code name is required"),
  isActive: z.boolean(),
  CCTags: z
    .array(
      z.union([
        z.string().min(1),
        z.object({ id: z.string().min(1), name: z.string().optional() }),
      ])
    )
    .optional(),
});

/**
 * Zod schema for updating a cost code (PUT /api/v1/admins/cost-codes/:id)
 * All fields optional for PATCH-like flexibility
 */
export const updateCostCodeSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  isActive: z.boolean().optional(),
  CCTags: z
    .array(
      z.union([
        z.string().min(1),
        z.object({ id: z.string().min(1), name: z.string().optional() }),
      ])
    )
    .optional(),
});

/**
 * Zod schema for archiving a jobsite (PUT /api/v1/admins/jobsite/:id/archive)
 * No body expected, so use an empty object schema
 */
export const archiveCostCodeSchema = z.object({});

/**
 * Zod schema for restoring a jobsite (PUT /api/v1/admins/jobsite/:id/restore)
 * No body expected, so use an empty object schema
 */
export const restoreCostCodeSchema = z.object({});
