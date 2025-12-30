import { z } from "zod";

/**
 * Zod schema for creating a jobsite (POST /api/v1/admins/jobsite)
 */
export const createJobsiteSchema = z.object({
  code: z.string().min(1, "Jobsite code is required"),
  name: z.string().min(1, "Jobsite name is required"),
  description: z.string().optional(),
  ApprovalStatus: z.string().min(1, "ApprovalStatus is required"),
  status: z.string().min(1, "Status is required"),
  Address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip code is required"),
  }),
  CCTags: z.array(z.object({ id: z.string().min(1) })).optional(),
  CreatedVia: z.string().min(1, "CreatedVia is required"),
  createdById: z.string().min(1, "createdById is required"),
});

/**
 * Zod schema for updating a jobsite (PUT /api/v1/admins/jobsite/:id)
 * All fields optional for PATCH-like flexibility
 */
export const updateJobsiteSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  approvalStatus: z.string().optional(),
  status: z.string().optional(),
  creationReason: z.string().optional(),
  CCTags: z.array(z.object({ id: z.string().min(1) })).optional(),
  Address: z
    .object({
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zipCode: z.string().min(1, "Zip code is required"),
    })
    .optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
  userId: z.string().optional(),
});

/**
 * Zod schema for archiving a jobsite (PUT /api/v1/admins/jobsite/:id/archive)
 * No body expected, so use an empty object schema
 */
export const archiveJobsiteSchema = z.object({});

/**
 * Zod schema for restoring a jobsite (PUT /api/v1/admins/jobsite/:id/restore)
 * No body expected, so use an empty object schema
 */
export const restoreJobsiteSchema = z.object({});
