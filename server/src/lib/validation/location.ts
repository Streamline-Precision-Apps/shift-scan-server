import { z } from "zod";

/**
 * Schema for POST/PUT location updates
 * Only allows userId (string), sessionId (number or string), coords (object with lat/lng required, accuracy/speed/heading optional), and device (optional object)
 */
export const locationUpdateSchema = z
  .object({
    userId: z.string().min(1, "userId is required"),
    sessionId: z.string(),
    coords: z.object({
      lat: z.number(),
      lng: z.number(),
      accuracy: z.number().nullable().optional(),
      speed: z.number().nullable().optional(),
      heading: z.number().nullable().optional(),
    }),
    device: z.record(z.string(), z.any()).optional(),
  })
  .strict();
