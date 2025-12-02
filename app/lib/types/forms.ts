/**
 * UNIFIED FORM SYSTEM TYPES
 *
 * This is the SINGLE SOURCE OF TRUTH for all form-related types.
 * All form-related components (FormBuilder, FormSubmission, FormApproval)
 * should import types from this file ONLY.
 *
 * FormBuilder types are re-exported as canonical, and submission-specific
 * types extend from them.
 */

// ============================================================================
// FORMBUILDER CANONICAL TYPES (Re-exported from FormBuilder)
// ============================================================================

/**
 * A single form field definition.
 * Created in FormBuilder, used throughout form submission lifecycle.
 */
export interface FormField {
  id: string;
  formGroupingId: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  placeholder?: string;
  minLength?: number | undefined;
  maxLength?: number | undefined;
  multiple?: boolean;
  content?: string | null;
  filter?: string | null;
  Options?: FormFieldOption[];
}

/**
 * A grouping/section of fields within a form.
 * Contains an ordered array of FormFields.
 */
export interface FormGrouping {
  id: string;
  title: string;
  order: number;
  Fields: FormField[];
}

/**
 * Option within a dropdown, multiselect, radio, or checkbox field.
 */
export interface FormFieldOption {
  id: string;
  fieldId: string;
  value: string;
}

// ============================================================================
// SUBMISSION EXTENSION TYPES
// ============================================================================

/**
 * Complete form template.
 * This is what FormBuilder creates and what submissions are based on.
 */
export interface FormTemplate {
  id: string;
  name: string;
  formType: string;
  createdAt: string;
  updatedAt: string;
  isActive: "ACTIVE" | "DRAFT" | "ARCHIVED";
  description: string | null;
  isSignatureRequired: boolean;
  isApprovalRequired: boolean;
  FormGrouping: FormGrouping[];
}

/**
 * Form submission data.
 * Represents a user's filled-out form.
 */
export interface FormSubmission {
  id: number;
  title: string | null;
  formTemplateId: string;
  userId: string;
  formType: string | null;
  data: Record<string, FormFieldValue>;
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date;
  status: FormStatus;
  User: UserInfo;
  Approvals?: FormApproval[];
  FormTemplate: FormTemplate;
}

/**
 * Form approval record.
 * Created when a form is submitted for approval.
 */
export interface FormApproval {
  id: string;
  formSubmissionId: number;
  signedBy: string | null;
  submittedAt: Date;
  updatedAt: Date;
  signature: string | null;
  comment: string | null;
  Approver: UserInfo | null;
}

/**
 * Basic user information.
 * Used in submissions and approvals.
 */
export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  signature?: string;
}

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Possible states for a form submission.
 */
export enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

/**
 * All possible field types that can be used in a form.
 */
export type FieldType =
  | "TEXT"
  | "NUMBER"
  | "DATE"
  | "TIME"
  | "DROPDOWN"
  | "TEXTAREA"
  | "CHECKBOX"
  | "RADIO"
  | "MULTISELECT"
  | "SEARCH_PERSON"
  | "SEARCH_ASSET";

/**
 * Possible values for a form field.
 * Covers all field types and their possible value representations.
 */
export type FormFieldValue =
  | string
  | Date
  | string[]
  | object
  | boolean
  | number
  | null;

// ============================================================================
// LEGACY/COMPATIBILITY TYPES
// These are kept for backward compatibility during migration.
// DEPRECATION WARNING: Remove these once all components are refactored.
// ============================================================================

/**
 * @deprecated Use FormTemplate instead
 * Legacy type kept for backward compatibility during migration.
 */
export interface FormIndividualTemplate extends FormTemplate {
  Submissions?: Submission[];
  total?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

/**
 * @deprecated Use FormFieldOption instead
 * Legacy type kept for backward compatibility during migration.
 */
export interface FieldOption extends FormFieldOption {}

/**
 * @deprecated Use FormGrouping instead
 * Legacy type kept for backward compatibility during migration.
 */
export interface Grouping extends FormGrouping {
  Fields: Fields[];
}

/**
 * @deprecated Use FormField instead
 * Legacy type kept for backward compatibility during migration.
 */
export interface Fields extends FormField {
  formGroupingId: string;
}

/**
 * @deprecated Use FormSubmission instead
 * Legacy type kept for backward compatibility during migration.
 */
export interface Submission {
  id: number;
  title: string;
  formTemplateId: string;
  userId: string;
  formType: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  status: string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
    signature: string;
  };
}

/**
 * @deprecated Use FormSubmission instead
 * Legacy type kept for backward compatibility during migration.
 */
export interface FormSubmissionWithTemplate extends FormSubmission {
  Approvals?: Array<{
    id: string;
    formSubmissionId: number;
    signedBy: string | null;
    submittedAt: Date;
    updatedAt: Date;
    signature: string | null;
    comment: string | null;
    Approver: {
      id: string;
      firstName: string;
      lastName: string;
    } | null;
  }>;
}

// ============================================================================
// COMPONENT PROP TYPES (Used in UI Components)
// ============================================================================

/**
 * Props for form field renderer components.
 * Used by FormFieldRenderer and RenderFields.
 */
export interface FormFieldRendererProps {
  formData: FormTemplate;
  formValues: Record<string, FormFieldValue>;
  setFormValues?: (values: Record<string, FormFieldValue>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  useNativeInput?: boolean;
}

/**
 * Props for form context consumers.
 * Provided by FormContext to child components.
 */
export interface FormContextValue {
  template: FormTemplate | null;
  submission: FormSubmission | null;
  approval: FormApproval | null;
  values: Record<string, FormFieldValue>;
  updateValue: (fieldId: string, value: FormFieldValue) => void;
  loading: boolean;
  error: string | null;
  submissionId: number | null;
  submissionStatus: FormStatus | null;
}

/**
 * Props returned by useFormManager hook.
 */
export interface FormManagerState {
  template: FormTemplate | null;
  submission: FormSubmission | null;
  approval: FormApproval | null;
  values: Record<string, FormFieldValue>;
  isLoading: boolean;
  error: string | null;
  updateValue: (fieldId: string, value: FormFieldValue) => void;
  submitForm: (values: Record<string, FormFieldValue>) => Promise<void>;
  saveAsDraft: (values: Record<string, FormFieldValue>) => Promise<void>;
  deleteSubmission: () => Promise<void>;
  validateForm: (values: Record<string, FormFieldValue>) => {
    valid: boolean;
    errors: string[];
  };
  approveForm: (
    values: Record<string, FormFieldValue>,
    approvalStatus: "APPROVED" | "DENIED",
    managerSignature: string,
    managerId: string,
    comment: string,
    submissionId: number
  ) => Promise<void>;
}

// ============================================================================
// API RESPONSE TYPES
// These match the actual API response structures.
// ============================================================================

/**
 * Raw API response from form template endpoint.
 */
export interface FormTemplateApiResponse {
  id: string;
  name: string;
  formType: string;
  createdAt: string;
  updatedAt: string;
  isActive: string;
  description: string | null;
  isSignatureRequired: boolean;
  isApprovalRequired: boolean;
  FormGrouping: FormGrouping[];
}

/**
 * Raw API response from form submission endpoint.
 */
export interface FormSubmissionApiResponse {
  id: number;
  title: string | null;
  formTemplateId: string;
  userId: string;
  formType: string | null;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  status: string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
    signature?: string;
  };
  Approvals?: Array<{
    id: string;
    formSubmissionId: number;
    signedBy: string | null;
    submittedAt: string;
    updatedAt: string;
    signature: string | null;
    comment: string | null;
    Approver: {
      id: string;
      firstName: string;
      lastName: string;
    } | null;
  }>;
  FormTemplate: FormTemplateApiResponse;
}

/**
 * Raw API response from form approval endpoint.
 */
export interface FormApprovalApiResponse {
  id: string;
  formSubmissionId: number;
  signedBy: string | null;
  submittedAt: string;
  updatedAt: string;
  signature: string | null;
  comment: string | null;
  Approver: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}
