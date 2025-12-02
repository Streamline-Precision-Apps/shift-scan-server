import {
  FormTemplate,
  FormSubmission,
  FormApproval,
  FormFieldValue,
  FormField,
  FormGrouping,
  FormStatus,
  UserInfo,
} from "../types/forms";
import { sortFormTemplate } from "./formOrdering";

// ============================================================================
// FORM TEMPLATE NORMALIZATION
// ============================================================================

/**
 * Converts API FormIndividualTemplate response to canonical FormTemplate
 *
 * Handles shape mapping and validation of required properties.
 * Ensures FormGrouping/Fields structure is uniform.
 *
 * @param apiResponse - Raw API response
 * @returns Normalized FormTemplate
 * @throws Error if required fields are missing
 */
export function normalizeFormTemplate(apiResponse: any): FormTemplate {
  if (!apiResponse) {
    throw new Error("Cannot normalize null/undefined form template");
  }

  const {
    id,
    name,
    formType,
    createdAt,
    updatedAt,
    isActive,
    description,
    isSignatureRequired,
    isApprovalRequired,
    FormGrouping,
  } = apiResponse;

  // Validate required fields
  if (!id || !name || !formType) {
    throw new Error(
      "Form template missing required fields: id, name, formType"
    );
  }

  // Normalize FormGrouping array
  let normalizedGrouping = (FormGrouping || []).map(
    (group: any) => normalizeFormGrouping(group) as FormGrouping
  );

  // If signature is required, ensure a signature field exists in the last group
  if (Boolean(isSignatureRequired)) {
    // Check if any field has id 'signature'
    const hasSignatureField = normalizedGrouping.some((group: FormGrouping) =>
      group.Fields.some((field: FormField) => field.id === "signature")
    );
    if (!hasSignatureField) {
      // Create a signature field
      const signatureField = {
        id: "signature",
        formGroupingId: "", // will be set below
        label: "Signature",
        type: "CHECKBOX",
        required: true,
        order: 9999,
        placeholder: undefined,
        minLength: undefined,
        maxLength: undefined,
        multiple: false,
        content: null,
        filter: null,
        Options: undefined,
      };
      if (normalizedGrouping.length === 0) {
        // If no groups exist, create one
        const groupId = "signature-group";
        signatureField.formGroupingId = groupId;
        normalizedGrouping.push({
          id: groupId,
          title: "Signatures",
          order: 9999,
          Fields: [signatureField],
        });
      } else {
        // Add to last group
        const lastGroup = normalizedGrouping[normalizedGrouping.length - 1];
        signatureField.formGroupingId = lastGroup.id;
        lastGroup.Fields = [...lastGroup.Fields, signatureField];
      }
    }
  }

  const template: FormTemplate = {
    id,
    name,
    formType,
    createdAt: createdAt || new Date().toISOString(),
    updatedAt: updatedAt || new Date().toISOString(),
    isActive: (isActive?.toUpperCase() || "DRAFT") as
      | "ACTIVE"
      | "DRAFT"
      | "ARCHIVED",
    description: description || null,
    isSignatureRequired: Boolean(isSignatureRequired),
    isApprovalRequired: Boolean(isApprovalRequired),
    FormGrouping: normalizedGrouping,
  };

  // Ensure template is properly sorted before returning
  const sortedTemplate = sortFormTemplate(template);

  return sortedTemplate;
}

/**
 * Normalizes a single FormGrouping
 */
function normalizeFormGrouping(group: any): FormGrouping {
  if (!group) {
    throw new Error("Cannot normalize null/undefined form grouping");
  }

  const { id, title, order, Fields } = group;

  if (!id) {
    throw new Error("Form grouping missing required field: id");
  }

  const normalizedFields = (Fields || []).map(
    (field: any) => normalizeFormField(field) as FormField
  );

  return {
    id,
    title: title || "",
    order: Number(order) || 0,
    Fields: normalizedFields,
  };
}

/**
 * Normalizes a single FormField
 */
function normalizeFormField(field: any): FormField {
  if (!field) {
    throw new Error("Cannot normalize null/undefined form field");
  }

  const {
    id,
    formGroupingId,
    label,
    type,
    required,
    order,
    placeholder,
    minLength,
    maxLength,
    multiple,
    content,
    filter,
    Options,
  } = field;

  if (!id || !label || !type) {
    throw new Error("Form field missing required fields: id, label, type");
  }

  const normalizedOptions = (Options || []).map((opt: any) => ({
    id: opt.id,
    fieldId: opt.fieldId || id,
    value: opt.value,
  }));

  return {
    id,
    formGroupingId: formGroupingId || "",
    label,
    type,
    required: Boolean(required),
    order: Number(order) || 0,
    placeholder: placeholder || undefined,
    minLength: minLength ? Number(minLength) : undefined,
    maxLength: maxLength ? Number(maxLength) : undefined,
    multiple: multiple === undefined ? false : Boolean(multiple),
    content: content || null,
    filter: filter || null,
    Options: normalizedOptions.length > 0 ? normalizedOptions : undefined,
  };
}

// ============================================================================
// FORM SUBMISSION NORMALIZATION
// ============================================================================

/**
 * Converts API submission response to canonical FormSubmission
 *
 * Ensures data field values are keyed by field ID.
 * Parses dates correctly.
 * Validates field ID references exist in template.
 *
 * @param apiResponse - Raw API response
 * @param template - FormTemplate for validation (optional)
 * @returns Normalized FormSubmission
 * @throws Error if required fields are missing or validation fails
 */
export function normalizeFormSubmission(
  apiResponse: any,
  template?: FormTemplate
): FormSubmission {
  if (!apiResponse) {
    throw new Error("Cannot normalize null/undefined form submission");
  }

  const {
    id,
    title,
    formTemplateId,
    userId,
    formType,
    data,
    createdAt,
    updatedAt,
    submittedAt,
    status,
    User,
    Approvals,
    FormTemplate,
  } = apiResponse;

  // Validate required fields
  if (!id || !formTemplateId || !userId) {
    throw new Error(
      "Form submission missing required fields: id, formTemplateId, userId"
    );
  }

  // Use provided template or normalize from response
  const normalizedTemplate = template
    ? template
    : FormTemplate
    ? normalizeFormTemplate(FormTemplate)
    : undefined;

  // Normalize submission data - ensure values are keyed by field ID
  const normalizedData = normalizeSubmissionData(
    data || {},
    normalizedTemplate
  );

  // Normalize approvals if present
  const normalizedApprovals = (Approvals || []).map(
    (approval: any) => normalizeFormApproval(approval) as FormApproval
  );

  // Parse status
  const normalizedStatus = (status?.toUpperCase() || "DRAFT") as FormStatus;

  return {
    id,
    title: title || null,
    formTemplateId,
    userId,
    formType: formType || null,
    data: normalizedData,
    createdAt: parseDate(createdAt),
    updatedAt: parseDate(updatedAt),
    submittedAt: submittedAt ? parseDate(submittedAt) : new Date(0),
    status: normalizedStatus,
    User: normalizeUserInfo(User),
    Approvals: normalizedApprovals.length > 0 ? normalizedApprovals : undefined,
    FormTemplate: normalizedTemplate || ({} as FormTemplate),
  };
}

/**
 * Normalizes submission data values
 * Ensures all keys are field IDs and values are properly typed
 */
function normalizeSubmissionData(
  data: Record<string, unknown>,
  template?: FormTemplate
): Record<string, FormFieldValue> {
  const normalized: Record<string, FormFieldValue> = {};

  if (!data) return normalized;

  // Build map of field IDs from template
  const fieldIdMap = buildFieldIdMap(template);

  for (const [key, value] of Object.entries(data)) {
    // Validate field ID exists in template if template provided
    if (template && !fieldIdMap.has(key)) {
      console.warn(
        `[FORM SYNC ERROR] Submission data contains unknown field ID: ${key}. ` +
          `This field exists in saved data but not in current template. ` +
          `The template may have been modified (fields deleted/renamed). ` +
          `This value will be skipped. ` +
          `To fix: Either restore the field in the template or delete this submission and recreate it.`
      );
      continue;
    }

    // Type coercion for special field types
    normalized[key] = normalizeFieldValue(value, fieldIdMap.get(key));
  }

  // If template requires signature, ensure 'signature' key is present
  if (template && template.isSignatureRequired) {
    if (!Object.prototype.hasOwnProperty.call(normalized, "signature")) {
      normalized["signature"] = null;
    }
  }

  return normalized;
}

/**
 * Normalizes a single field value based on field type
 */
function normalizeFieldValue(
  value: unknown,
  fieldInfo?: { type: string }
): FormFieldValue {
  if (value === null || value === undefined) {
    return null;
  }

  const fieldType = fieldInfo?.type;

  // Handle different field types
  switch (fieldType) {
    case "DATE":
    case "TIME":
      // Ensure dates are Date objects
      if (typeof value === "string") {
        return parseDate(value);
      }
      return value instanceof Date ? value : null;

    case "NUMBER":
      // Ensure numbers are actually numbers
      if (typeof value === "string") {
        return isNaN(Number(value)) ? value : Number(value);
      }
      return typeof value === "number" ? value : null;

    case "CHECKBOX":
      // Ensure booleans are actual booleans
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      return Boolean(value);

    case "MULTISELECT":
    case "SEARCH_PERSON":
    case "SEARCH_ASSET":
      // Ensure arrays/objects stay as-is
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value as FormFieldValue;

    default:
      // For TEXT, DROPDOWN, RADIO, TEXTAREA - convert to string
      if (typeof value === "object") {
        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      }
      return String(value);
  }
}

// ============================================================================
// FORM APPROVAL NORMALIZATION
// ============================================================================

/**
 * Converts API approval response to canonical FormApproval
 *
 * Handles signature and comment fields.
 * Parses dates correctly.
 * Null-checks user/approver data.
 *
 * @param apiResponse - Raw API response
 * @returns Normalized FormApproval
 * @throws Error if required fields are missing
 */
export function normalizeFormApproval(apiResponse: any): FormApproval {
  if (!apiResponse) {
    throw new Error("Cannot normalize null/undefined form approval");
  }

  const {
    id,
    formSubmissionId,
    signedBy,
    submittedAt,
    updatedAt,
    signature,
    comment,
    Approver,
  } = apiResponse;

  // Validate required fields
  if (!id || formSubmissionId === undefined) {
    throw new Error(
      "Form approval missing required fields: id, formSubmissionId"
    );
  }

  return {
    id,
    formSubmissionId: Number(formSubmissionId),
    signedBy: signedBy || null,
    submittedAt: parseDate(submittedAt),
    updatedAt: parseDate(updatedAt),
    signature: signature || null,
    comment: comment || null,
    Approver: Approver ? normalizeUserInfo(Approver) : null,
  };
}

// ============================================================================
// REVERSE NORMALIZATION (for API submission)
// ============================================================================

/**
 * Converts canonical FormSubmission data back to API format
 *
 * Transforms field values as needed for API submission.
 * Handles special types (dates, arrays, objects).
 *
 * @param template - FormTemplate for field type info
 * @param formValues - Normalized form values
 * @returns API payload format
 */
export function denormalizeFormValues(
  template: FormTemplate,
  formValues: Record<string, FormFieldValue>
): Record<string, any> {
  const apiData: Record<string, any> = {};

  // Build field info map for type lookup
  const fieldInfoMap = buildFieldInfoMap(template);

  for (const [fieldId, value] of Object.entries(formValues)) {
    if (value === null || value === undefined) {
      apiData[fieldId] = null;
      continue;
    }

    const fieldInfo = fieldInfoMap.get(fieldId);
    apiData[fieldId] = denormalizeFieldValue(value, fieldInfo?.type);
  }

  return apiData;
}

/**
 * Denormalizes a single field value back to API format
 */
function denormalizeFieldValue(value: FormFieldValue, fieldType?: string): any {
  if (value === null || value === undefined) {
    return null;
  }

  switch (fieldType) {
    case "DATE":
    case "TIME":
      // Convert Date to ISO string for API
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;

    case "MULTISELECT":
    case "SEARCH_PERSON":
    case "SEARCH_ASSET":
      // Keep arrays/objects as-is (API accepts JSON)
      return value;

    default:
      // Convert everything else to string for safety
      if (typeof value === "object") {
        return JSON.stringify(value);
      }
      return value;
  }
}

// ============================================================================
// FIELD MAPPING UTILITIES
// ============================================================================

/**
 * Maps field IDs to labels for display
 *
 * @param template - FormTemplate to search
 * @param fieldId - Field ID to look up
 * @returns Field label or null if not found
 */
export function mapFieldIdToLabel(
  template: FormTemplate | null,
  fieldId: string
): string | null {
  if (!template) return null;

  for (const grouping of template.FormGrouping) {
    for (const field of grouping.Fields) {
      if (field.id === fieldId) {
        return field.label;
      }
    }
  }

  return null;
}

/**
 * Maps field labels back to IDs
 * NOTE: This assumes labels are unique, which may not always be true.
 * Prefer using field IDs directly when possible.
 *
 * @param template - FormTemplate to search
 * @param fieldLabel - Field label to look up
 * @returns Field ID or null if not found
 */
export function mapLabelToFieldId(
  template: FormTemplate | null,
  fieldLabel: string
): string | null {
  if (!template) return null;

  for (const grouping of template.FormGrouping) {
    for (const field of grouping.Fields) {
      if (field.label === fieldLabel) {
        return field.id;
      }
    }
  }

  return null;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates that submission field IDs match template
 * Early detection of structural mismatches
 *
 * @param template - FormTemplate
 * @param submission - FormSubmission to validate
 * @returns Validation result with errors if any
 */
export function validateFieldStructure(
  template: FormTemplate,
  submission: FormSubmission
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validFieldIds = new Set<string>();

  // Build set of valid field IDs from template
  for (const grouping of template.FormGrouping) {
    for (const field of grouping.Fields) {
      validFieldIds.add(field.id);
    }
  }
  // Defensive: if template requires signature, always allow 'signature' as a valid field
  if (template.isSignatureRequired) {
    validFieldIds.add("signature");
  }

  // Check submission data
  for (const fieldId of Object.keys(submission.data)) {
    if (!validFieldIds.has(fieldId)) {
      errors.push(
        `Submission contains unknown field ID: ${fieldId} (not in template)`
      );
    }
  }

  // Check for required fields that are missing/empty
  for (const grouping of template.FormGrouping) {
    for (const field of grouping.Fields) {
      if (field.required) {
        const value = submission.data[field.id];
        if (value === null || value === undefined || value === "") {
          errors.push(
            `Required field "${field.label}" (${field.id}) is missing or empty`
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a single field value against template field definition
 */
export function validateFieldValue(
  template: FormTemplate,
  fieldId: string,
  value: FormFieldValue
): { valid: boolean; error?: string } {
  const fieldInfo = findFieldInTemplate(template, fieldId);

  if (!fieldInfo) {
    return {
      valid: false,
      error: `Field ${fieldId} not found in template`,
    };
  }

  // Check required
  if (
    fieldInfo.required &&
    (value === null || value === undefined || value === "")
  ) {
    return {
      valid: false,
      error: `${fieldInfo.label} is required`,
    };
  }

  // Check length constraints for text fields
  if (typeof value === "string") {
    if (fieldInfo.minLength && value.length < fieldInfo.minLength) {
      return {
        valid: false,
        error: `${fieldInfo.label} must be at least ${fieldInfo.minLength} characters`,
      };
    }
    if (fieldInfo.maxLength && value.length > fieldInfo.maxLength) {
      return {
        valid: false,
        error: `${fieldInfo.label} must not exceed ${fieldInfo.maxLength} characters`,
      };
    }
  }

  return { valid: true };
}

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Parses a date string to Date object, handling various formats
 */
function parseDate(dateValue: any): Date {
  if (dateValue instanceof Date) {
    return dateValue;
  }
  if (typeof dateValue === "string") {
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
}

/**
 * Normalizes user info with fallback values
 */
function normalizeUserInfo(user: any): UserInfo {
  if (!user) {
    return {
      id: "",
      firstName: "Unknown",
      lastName: "User",
    };
  }

  return {
    id: user.id || "",
    firstName: user.firstName || "Unknown",
    lastName: user.lastName || "User",
    signature: user.signature,
  };
}

/**
 * Builds a map of field IDs from template
 * Returns Map<fieldId, { type: string }>
 */
function buildFieldIdMap(
  template?: FormTemplate
): Map<string, { type: string }> {
  const map = new Map<string, { type: string }>();

  if (!template) return map;

  for (const grouping of template.FormGrouping) {
    for (const field of grouping.Fields) {
      map.set(field.id, { type: field.type });
    }
  }

  return map;
}

/**
 * Diagnoses field ID mismatches between submission data and template
 * Useful for debugging orphaned field errors
 *
 * @param data - Submission data object
 * @param template - Form template
 * @returns Diagnostic report with orphaned and missing fields
 */
export function diagnoseFieldIdMismatch(
  data: Record<string, unknown>,
  template?: FormTemplate
): {
  orphanedFieldIds: string[];
  validFieldIds: string[];
  templateFieldIds: string[];
  missingInData: string[];
} {
  const fieldIdMap = buildFieldIdMap(template);
  const dataFieldIds = Object.keys(data || {});
  const templateFieldIds = Array.from(fieldIdMap.keys());

  const orphanedFieldIds = dataFieldIds.filter((id) => !fieldIdMap.has(id));
  const validFieldIds = dataFieldIds.filter((id) => fieldIdMap.has(id));
  const missingInData = templateFieldIds.filter(
    (id) => !dataFieldIds.includes(id)
  );

  return {
    orphanedFieldIds,
    validFieldIds,
    templateFieldIds,
    missingInData,
  };
}

/**
 * Builds a map of field info from template
 * Returns Map<fieldId, FormField>
 */
function buildFieldInfoMap(template: FormTemplate): Map<string, FormField> {
  const map = new Map<string, FormField>();

  for (const grouping of template.FormGrouping) {
    for (const field of grouping.Fields) {
      map.set(field.id, field);
    }
  }

  return map;
}

/**
 * Finds a field in template by ID
 */
function findFieldInTemplate(
  template: FormTemplate,
  fieldId: string
): FormField | null {
  for (const grouping of template.FormGrouping) {
    for (const field of grouping.Fields) {
      if (field.id === fieldId) {
        return field;
      }
    }
  }
  return null;
}

// ============================================================================
// EXPORT SUMMARY
// ============================================================================

/**
 * PUBLIC API SUMMARY
 *
 * Data Flow:
 * 1. API Response → normalizeFormTemplate/Submission/Approval() → Canonical Types
 * 2. Canonical Types + Component updates → denormalizeFormValues() → API Payload
 *
 * Mapping:
 * - mapFieldIdToLabel() - For display purposes
 * - mapLabelToFieldId() - For reverse lookup (use sparingly)
 *
 * Validation:
 * - validateFieldStructure() - Check entire submission structure
 * - validateFieldValue() - Check single field value
 */

/**
 * Converts canonical approval data to API format for approval update/create
 *
 * @param params - Approval update params
 * @returns API payload for approval update
 */
export function denormalizeFormApproval({
  id,
  formSubmissionId,
  comment,
  managerId,
  isApproved,
}: {
  id: string;
  formSubmissionId: number;
  comment: string;
  managerId: string;
  isApproved: boolean;
}) {
  return {
    id,
    formSubmissionId,
    comment,
    managerId,
    isApproved,
  };
}

/**
 * FORM NORMALIZATION UTILITIES
 *
 * This module handles converting API responses to canonical form types,
 * and converting canonical types back to API format.
 *
 * All normalization happens in one place to ensure consistency.
 * Components receive already-normalized data with zero transformation.
 */
