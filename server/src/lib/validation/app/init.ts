import { z } from "zod";

/**
 * Schema for POST /init
 * Only allows: token (string), userId (string)
 */
export const initRequestSchema = z
  .object({
    userId: z.string().min(1, "userId is required"),
  })
  .strict();

/**
 * Schema for POST /pay-period-timesheets
 * Only allows: userId (string)
 */
export const payPeriodTimesheetsSchema = z
  .object({
    userId: z.string().min(1, "userId is required"),
  })
  .strict();
