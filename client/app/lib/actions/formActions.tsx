"use client";

import { apiRequest } from "../utils/api-Utils";

/**
 * FORM ACTIONS
 *
 * Server actions for form submission management.
 * All endpoints use the apiRequest utility for consistent authentication and error handling.
 *
 * Endpoints:
 * - POST /api/v1/forms/submission - Create form submission
 * - DELETE /api/v1/forms/submission/:id - Delete form submission
 * - POST /api/v1/forms/draft - Save as draft
 * - POST /api/v1/forms/draft-to-pending - Save draft and move to pending
 * - POST /api/v1/forms/pending - Save pending submission
 * - POST /api/v1/forms/approval - Create approval
 * - PUT /api/v1/forms/approval/update - Update approval
 */

/**
 * Create a new form submission
 * @param formData - FormData containing formTemplateId and userId
 * @returns Created submission
 */
export async function createFormSubmission(formData: FormData) {
  const body: Record<string, any> = {};
  formData.forEach((value, key) => {
    body[key] = value;
  });
  return apiRequest("/api/v1/forms/submission", "POST", body);
}

export async function deleteFormSubmission(id: number) {
  await apiRequest(`/api/v1/forms/submission/${id}`, "DELETE", {});
  return true;
}

export async function saveDraft(
  formData: Record<string, string | boolean | number>,
  formTemplateId: string,
  userId: string,
  formType?: string,
  submissionId?: number,
  title?: string
) {
  const body = {
    formData,
    formTemplateId,
    userId,
    formType,
    submissionId,
    title,
  };
  return apiRequest("/api/v1/forms/draft", "POST", body);
}

export async function saveDraftToPending(
  formData: Record<string, string | boolean | number>,
  isApprovalRequired: boolean,
  formTemplateId: string,
  userId: string,
  formType?: string,
  submissionId?: number,
  title?: string
) {
  const body = {
    formData,
    isApprovalRequired,
    formTemplateId,
    userId,
    formType,
    submissionId,
    title,
  };
  return apiRequest("/api/v1/forms/draft-to-pending", "POST", body);
}

export async function savePending(
  formData: Record<string, string | boolean | number>,
  formTemplateId: string,
  userId: string,
  formType?: string,
  submissionId?: number,
  title?: string
) {
  const body = {
    formData,
    formTemplateId,
    userId,
    formType,
    submissionId,
    title,
  };
  return apiRequest("/api/v1/forms/pending", "POST", body);
}

/**
 * Create a form approval
 * @param formData - FormData containing approval details
 * @param approval - "APPROVED" or "DENIED"
 * @returns Approval result
 */
export async function createFormApproval(
  formData: FormData,
  approval: "APPROVED" | "DENIED"
) {
  const body: Record<string, any> = { approval };
  formData.forEach((value, key) => {
    body[key] = value;
  });
  return apiRequest("/api/v1/forms/approval", "POST", body);
}

/**
 * Update a form approval
 * @param formData - FormData containing approval details
 * @returns Update result
 */
export async function updateFormApproval(formData: FormData) {
  const body: Record<string, any> = {};
  formData.forEach((value, key) => {
    body[key] = value;
  });
  return apiRequest("/api/v1/forms/approval/update", "PUT", body);
}
