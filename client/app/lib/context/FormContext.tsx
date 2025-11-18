/**
 * FORM CONTEXT
 *
 * Provides centralized access to normalized form data across all child components.
 * All data is already normalized by the time it reaches the context provider,
 * so components can consume directly without transformation.
 *
 * Data Flow:
 * API Response → Normalization → FormContext → Components (no transformation)
 */

"use client";

import React, { createContext, useCallback, useMemo, ReactNode } from "react";
import {
  FormTemplate,
  FormSubmission,
  FormApproval,
  FormFieldValue,
  FormContextValue,
  FormStatus,
} from "../types/forms";

/**
 * FormContext - Single source of truth for form state
 * Provides normalized template, submission, approval, and value management
 */
export const FormContext = createContext<FormContextValue | null>(null);

/**
 * Props for FormContextProvider
 */
export interface FormContextProviderProps {
  template: FormTemplate | null;
  submission: FormSubmission | null;
  approval: FormApproval | null;
  values: Record<string, FormFieldValue>;
  onUpdateValue: (fieldId: string, value: FormFieldValue) => void;
  loading?: boolean;
  error?: string | null;
  children: ReactNode;
}

/**
 * FormContextProvider - Wraps form-related components
 *
 * Provides:
 * - template: FormTemplate (from FormBuilder)
 * - submission: FormSubmission | null (user's form submission)
 * - approval: FormApproval | null (if in approval view)
 * - values: Record<string, FormFieldValue> (current form state, keyed by field ID)
 * - updateValue: (fieldId: string, value: FormFieldValue) => void
 * - loading: boolean (if data is loading)
 * - error: string | null (if there's an error)
 * - submissionId: number | null (ID of current submission)
 * - submissionStatus: FormStatus | null (current submission status)
 *
 * All data is already normalized - no transformation in components
 */
export function FormContextProvider({
  template,
  submission,
  approval,
  values,
  onUpdateValue,
  loading = false,
  error = null,
  children,
}: FormContextProviderProps) {
  // Memoize updateValue callback to prevent unnecessary re-renders
  const updateValue = useCallback(
    (fieldId: string, value: FormFieldValue) => {
      onUpdateValue(fieldId, value);
    },
    [onUpdateValue]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: FormContextValue = useMemo(
    () => ({
      template,
      submission,
      approval,
      values,
      updateValue,
      loading,
      error,
      submissionId: submission?.id ?? null,
      submissionStatus: submission?.status ?? null,
    }),
    [template, submission, approval, values, updateValue, loading, error]
  );

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}

/**
 * Hook to consume FormContext
 *
 * @throws Error if used outside FormContextProvider
 * @returns FormContextValue with all form data and utilities
 *
 * Usage:
 * ```
 * const { template, values, updateValue } = useFormContext();
 * ```
 */
export function useFormContext(): FormContextValue {
  const context = React.useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used within a FormContextProvider");
  }

  return context;
}

/**
 * Hook to get form template only (for templates)
 *
 * @throws Error if used outside FormContextProvider
 * @returns FormTemplate | null
 */
export function useFormTemplate(): FormTemplate | null {
  const { template } = useFormContext();
  return template;
}

/**
 * Hook to get form submission only
 *
 * @throws Error if used outside FormContextProvider
 * @returns FormSubmission | null
 */
export function useFormSubmission(): FormSubmission | null {
  const { submission } = useFormContext();
  return submission;
}

/**
 * Hook to get form approval only
 *
 * @throws Error if used outside FormContextProvider
 * @returns FormApproval | null
 */
export function useFormApproval(): FormApproval | null {
  const { approval } = useFormContext();
  return approval;
}

/**
 * Hook to get and update form values
 *
 * @throws Error if used outside FormContextProvider
 * @returns Object with values and updateValue function
 *
 * Usage:
 * ```
 * const { values, updateValue } = useFormValues();
 * updateValue('field-id', 'new value');
 * ```
 */
export function useFormValues() {
  const { values, updateValue } = useFormContext();

  return {
    values,
    updateValue,
  };
}

/**
 * Hook to get form loading/error state
 *
 * @throws Error if used outside FormContextProvider
 * @returns Object with loading, error, and submissionId states
 */
export function useFormState() {
  const { loading, error, submissionId, submissionStatus } = useFormContext();

  return {
    loading,
    error,
    submissionId,
    submissionStatus,
  };
}

/**
 * Hook to check if form is in read-only mode
 * (i.e., submitted/approved/denied, not draft)
 *
 * @throws Error if used outside FormContextProvider
 * @returns boolean - true if form is read-only
 */
export function useFormReadOnly(): boolean {
  const { submission } = useFormContext();

  if (!submission) return false;

  return (
    submission.status === FormStatus.APPROVED ||
    submission.status === FormStatus.DENIED
  );
}

/**
 * Hook to check if form is in draft status
 *
 * @throws Error if used outside FormContextProvider
 * @returns boolean - true if form is draft
 */
export function useFormIsDraft(): boolean {
  const { submission } = useFormContext();

  if (!submission) return true;

  return submission.status === FormStatus.DRAFT;
}

/**
 * Hook to get field information from template
 * Useful for rendering field labels, types, validation rules
 *
 * @throws Error if used outside FormContextProvider
 * @param fieldId - The field ID to look up
 * @returns Field definition or null if not found
 */
export function useFormField(fieldId: string) {
  const { template } = useFormContext();

  if (!template) return null;

  for (const grouping of template.FormGrouping) {
    for (const field of grouping.Fields) {
      if (field.id === fieldId) {
        return field;
      }
    }
  }

  return null;
}

/**
 * Hook to get all field groupings from template
 * Useful for rendering form sections
 *
 * @throws Error if used outside FormContextProvider
 * @returns Array of FormGrouping or empty array
 */
export function useFormGroupings() {
  const { template } = useFormContext();

  return template?.FormGrouping ?? [];
}

/**
 * Hook to get value for a specific field
 *
 * @throws Error if used outside FormContextProvider
 * @param fieldId - The field ID to get value for
 * @returns Field value or null if not set
 */
export function useFieldValue(fieldId: string): FormFieldValue {
  const { values } = useFormContext();

  return values[fieldId] ?? null;
}

/**
 * Hook to update value for a specific field
 *
 * @throws Error if used outside FormContextProvider
 * @param fieldId - The field ID to update
 * @returns Function to update the field value
 *
 * Usage:
 * ```
 * const updateField = useUpdateFieldValue('field-id');
 * updateField('new value');
 * ```
 */
export function useUpdateFieldValue(fieldId: string) {
  const { updateValue } = useFormContext();

  return useCallback(
    (value: FormFieldValue) => {
      updateValue(fieldId, value);
    },
    [fieldId, updateValue]
  );
}
