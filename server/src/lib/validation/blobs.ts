import { z } from "zod";

/**
 * Zod schema for blob upload (POST /storage/upload)
 * Only allows userId (string, required), folder (string, optional), and file (any, required for multer).
 * Strips unknown fields.
 */
export const blobUploadSchema = z
  .object({
    userId: z.string().min(1, "userId is required"),
    folder: z.string().optional(),
    // file is handled by multer, but we can check presence in controller if needed
  })
  .strict();
