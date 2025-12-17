import { z } from "zod";

/**
 * Schema for creating a mechanic log (POST /)
 * Required: timeSheetId (string), equipmentId (string)
 * Optional: hours (number), description (string)
 */
export const createMechanicLogSchema = z.object({
  timeSheetId: z.number().min(1, "timeSheetId is required"),
  equipmentId: z.string().min(1, "equipmentId is required"),
  hours: z.number().optional(),
  description: z.string().optional(),
});

/**
 * Schema for updating a mechanic log (PUT /:id)
 * All fields optional, but at least one must be present
 */
export const updateMechanicLogSchema = z
  .object({
    equipmentId: z.string().min(1, "equipmentId is required").optional(),
    hours: z.number().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) =>
      data.equipmentId !== undefined ||
      data.hours !== undefined ||
      data.description !== undefined,
    {
      message:
        "At least one field (equipmentId, hours, description) must be provided",
      path: ["root"],
    }
  );
