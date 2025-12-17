import { z } from "zod";

/**
 * POST /api/tokens/fcm
 * Only allows 'token' (string, required)
 */
export const saveFCMTokenSchema = z.object({
  token: z.string().min(1, "token is required"),
}).strict();

/**
 * POST /api/tokens/password-reset
 * Only allows 'email' (string, required)
 */
export const requestPasswordResetSchema = z.object({
  email: z.string().email("Valid email is required"),
}).strict();

/**
 * POST /api/tokens/reset-password
 * Only allows 'token' (string, required) and 'password' (string, required)
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).strict();
