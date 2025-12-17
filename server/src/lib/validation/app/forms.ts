import { z } from "zod";

// POST /submission
export const createFormSubmissionSchema = z.object({
  formTemplateId: z.string().min(1, "formTemplateId is required"),
  userId: z.string().min(1, "userId is required"),
});
export type CreateFormSubmissionInput = z.infer<
  typeof createFormSubmissionSchema
>;

// PUT /submission/:id (partial update allowed)
export const updateFormSubmissionSchema = z.object({
  submissionId: z.number().optional(), // If present in body
  formData: z.record(z.string(), z.string()).optional(),
  formTemplateId: z.string().optional(),
  userId: z.string().optional(),
  formType: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
});
export type UpdateFormSubmissionInput = z.infer<
  typeof updateFormSubmissionSchema
>;

// POST /draft
export const saveDraftSchema = z.object({
  formData: z.record(z.string(), z.string()),
  formTemplateId: z.string().min(1, "formTemplateId is required"),
  userId: z.string().min(1, "userId is required"),
  formType: z.string().optional(),
  submissionId: z.number().optional(),
  title: z.string().optional(),
});
export type SaveDraftInput = z.infer<typeof saveDraftSchema>;

// POST /draft-to-pending
export const saveDraftToPendingSchema = z.object({
  formData: z.record(z.string(), z.string()),
  isApprovalRequired: z.boolean(),
  formTemplateId: z.string().min(1, "formTemplateId is required"),
  userId: z.string().min(1, "userId is required"),
  formType: z.string().optional(),
  submissionId: z.number().optional(),
  title: z.string().optional(),
});
export type SaveDraftToPendingInput = z.infer<typeof saveDraftToPendingSchema>;

// POST /pending
export const savePendingSchema = z.object({
  formData: z.record(z.string(), z.string()),
  formTemplateId: z.string().min(1, "formTemplateId is required"),
  userId: z.string().min(1, "userId is required"),
  formType: z.string().optional(),
  submissionId: z.number().optional(),
  title: z.string().optional(),
});
export type SavePendingInput = z.infer<typeof savePendingSchema>;

// POST /approval
export const createFormApprovalSchema = z.object({
  formSubmissionId: z.number(),
  signedBy: z.string().min(1, "signedBy is required"),
  signature: z.string().min(1, "signature is required"),
  comment: z.string().optional(),
  approval: z.string().min(1, "approval is required"),
});
export type CreateFormApprovalInput = z.infer<typeof createFormApprovalSchema>;

// PUT /approval/update
export const updateFormApprovalSchema = z.object({
  id: z.string().min(1, "id is required"),
  formSubmissionId: z.number(),
  comment: z.string().optional(),
  isApproved: z.boolean(),
  managerId: z.string().min(1, "managerId is required"),
});
export type UpdateFormApprovalInput = z.infer<typeof updateFormApprovalSchema>;
