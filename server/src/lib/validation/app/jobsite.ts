import { z } from "zod";

// Schema for creating a jobsite
export const createJobsiteSchema = z.object({
  name: z
    .string()
    .min(1, "name is required")
    .or(z.string().min(1, "temporaryJobsiteName is required"))
    .optional(),
  temporaryJobsiteName: z.string().optional(),
  code: z.string().optional(),
  qrId: z.string().min(1, "qrId is required"),
  creationComment: z.string().optional(),
  creationReasoning: z.string().optional(),
  createdById: z.string().min(1, "createdById is required").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export type CreateJobsiteInput = z.infer<typeof createJobsiteSchema>;
