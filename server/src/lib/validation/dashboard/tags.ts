import { z } from "zod";

/**
 * Zod schema for creating a tag (POST /api/v1/admins/tags)
 */
export const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  description: z.string().optional(),
  CostCodes: z
    .array(z.object({ id: z.string().min(1), name: z.string().optional() }))
    .optional(),
  Jobsites: z
    .array(z.object({ id: z.string().min(1), name: z.string().optional() }))
    .optional(),
});

/**
 * Zod schema for updating a tag (PUT /api/v1/admins/tags/:id)
 * All fields optional for PATCH-like flexibility
 */
export const updateTagSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  CostCodes: z
    .array(
      z.union([
        z.string().min(1),
        z.object({ id: z.string().min(1), name: z.string().optional() }),
      ])
    )
    .optional(),
  Jobsites: z
    .array(
      z.union([
        z.string().min(1),
        z.object({ id: z.string().min(1), name: z.string().optional() }),
      ])
    )
    .optional(),
});
