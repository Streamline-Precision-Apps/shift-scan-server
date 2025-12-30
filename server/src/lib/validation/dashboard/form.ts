import { z } from "zod";

// --- Form Template Schemas ---

// Settings schema for form template
// Settings schema for form template (matches request body)
const formSettingsSchema = z.object({
  id: z.string().optional(),
  companyId: z.string().optional().nullable(),
  name: z.string().min(1, "Form name is required"),
  formType: z.string().min(1, "Form type is required"),
  description: z.string().optional(),
  status: z.string().optional(),
  requireSignature: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  isActive: z.string().optional(),
  isSignatureRequired: z.boolean().optional(),
  isApprovalRequired: z.boolean().optional(),
  FormGrouping: z.array(z.unknown()).optional(),
});

// Option schema for form fields
const formFieldOptionSchema = z.object({
  id: z.string().optional(),
  value: z.string().min(1),
});

// Field schema for form template (expanded for update)
const formFieldSchema = z.object({
  id: z.string().min(1),
  formGroupingId: z.string().optional().nullable(),
  label: z.string().min(1),
  spanishLabel: z.string().nullable().optional(),
  type: z.string().min(1),
  required: z.boolean(),
  order: z.number(),
  placeholder: z.string().optional(),
  minLength: z.number().nullable().optional(),
  maxLength: z.number().nullable().optional(),
  multiple: z.boolean().optional(),
  content: z.string().nullable().optional(),
  filter: z.string().nullable().optional(),
  conditionalOnFieldId: z.string().nullable().optional(),
  conditionType: z.string().nullable().optional(),
  conditionalOnValue: z.string().nullable().optional(),
  Options: z.array(formFieldOptionSchema).optional(),
});

/**
 * Zod schema for creating a form template (POST /api/v1/admins/forms/template)
 */
export const createFormTemplateSchema = z.object({
  settings: formSettingsSchema,
  fields: z.array(formFieldSchema),
  companyId: z.string().optional().nullable(),
});

/**
 * Zod schema for updating a form template (PUT /api/v1/admins/forms/template/:id)
 * Accepts all fields present in the provided request body
 */
export const updateFormTemplateSchema = z.object({
  settings: formSettingsSchema,
  fields: z.array(formFieldSchema),
  companyId: z.string().optional().nullable(),
  formId: z.string().optional(),
});

// --- Form Submission Schemas ---

/**
 * Zod schema for creating a form submission (POST /api/v1/admins/forms/template/:id/submissions)
 */
export const createFormSubmissionSchema = z.object({
  formTemplateId: z.string().min(1),
  data: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()])
  ),
  submittedBy: z.object({
    id: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
  adminUserId: z.string().optional().nullable(),
  comment: z.string().optional(),
  signature: z.string().optional(),
  status: z.string().optional(),
});

/**
 * Zod schema for updating a form submission (PUT /api/v1/admins/forms/submissions/:submissionId)
 */
export const updateFormSubmissionSchema = z.object({
  submissionId: z.union([z.string(), z.number()]),
  data: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()])
  ),
  adminUserId: z.string().optional().nullable(),
  comment: z.string().optional(),
  signature: z.string().optional(),
  updateStatus: z.string().optional(),
});

/**
 * Zod schema for approving a form submission (PUT /api/v1/admins/forms/submissions/:submissionId/approve)
 */
export const approveFormSubmissionSchema = z.object({
  comment: z.string().optional(),
  adminUserId: z.string().optional(),
});

/**
 * Zod schema for publishing a form template (PUT /api/v1/admins/forms/template/:id/publish)
 * No body expected, so use an empty object schema
 */
export const publishFormTemplateSchema = z.object({});

/**
 * Zod schema for archiving a form template (PUT /api/v1/admins/forms/template/:id/archive)
 * No body expected, so use an empty object schema
 */
export const archiveFormTemplateSchema = z.object({});

/** * Zod schema for restoring a form template (PUT /api/v1/admins/forms/template/:id/restore)
 * No body expected, so use an empty object schema
 */
export const restoreFormTemplateSchema = z.object({});
