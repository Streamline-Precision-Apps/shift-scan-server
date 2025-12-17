import { z } from "zod";

/**
 * Schema for updating Tasco Log load quantity (PUT /:id/load-quantity)
 */
export const updateLoadQuantitySchema = z.object({
  loadCount: z.number().optional(),
});

/**
 * Schema for updating Tasco Log comment (PUT /:id/comment)
 */
export const updateTascoCommentSchema = z.object({
  comment: z.string().nullable().optional(),
});

/**
 * Schema for creating a Refuel Log (POST /:id/refuel-logs)
 * No body required, but accept empty object
 */
export const createRefuelLogSchema = z.object({}).strict();

/**
 * Schema for updating a Refuel Log (PUT /refuel-logs/:refuelLogId)
 */
export const updateRefuelLogSchema = z
  .object({
    gallonsRefueled: z.number().optional(),
    milesAtFueling: z.number().optional(),
  })
  .refine(
    (data) =>
      data.gallonsRefueled !== undefined || data.milesAtFueling !== undefined,
    {
      message:
        "At least one field (gallonsRefueled, milesAtFueling) must be provided",
      path: ["root"],
    }
  );

/**
 * Schema for creating a TascoFLoad (POST /:id/f-loads)
 * No body required, but accept empty object
 */
export const createFLoadSchema = z.object({}).strict();

/**
 * Schema for updating a TascoFLoad (PUT /f-loads/:fLoadId)
 */
export const updateFLoadSchema = z
  .object({
    weight: z.number().nullable().optional(),
    screenType: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      Object.keys(data).length === 0 ||
      data.weight !== undefined ||
      data.screenType !== undefined,
    {
      message: "At least one field (weight, screenType) must be provided",
      path: ["root"],
    }
  );
