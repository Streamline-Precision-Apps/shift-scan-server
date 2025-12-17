import { z } from "zod";

/**
 * ===== Cookie Schemas =====
 */

export const getCookieSchema = z.object({
  name: z
    .string()
    .min(1, "Cookie name is required")
    .max(100, "Cookie name must be less than 100 characters"),
});

export type GetCookieInput = z.infer<typeof getCookieSchema>;

export const getCookieListSchema = z.object({
  name: z
    .union([
      z.string().min(1, "Cookie name must not be empty"),
      z.array(z.string().min(1, "Cookie name must not be empty")),
    ])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});

export type GetCookieListInput = z.infer<typeof getCookieListSchema>;

export const setCookieSchema = z.object({
  name: z
    .string()
    .min(1, "Cookie name is required")
    .max(100, "Cookie name must be less than 100 characters"),
  value: z.string().max(4096, "Cookie value must be less than 4096 characters"),
  options: z
    .object({
      path: z.string().optional(),
      httpOnly: z.boolean().optional(),
      maxAge: z.number().optional(),
      sameSite: z.enum(["strict", "lax", "none"]).optional(),
      secure: z.boolean().optional(),
    })
    .optional(),
});

export type SetCookieInput = z.infer<typeof setCookieSchema>;

export const deleteCookieListSchema = z.object({
  name: z
    .union([
      z.string().min(1, "Cookie name must not be empty"),
      z.array(z.string().min(1, "Cookie name must not be empty")),
    ])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});

export type DeleteCookieListInput = z.infer<typeof deleteCookieListSchema>;
