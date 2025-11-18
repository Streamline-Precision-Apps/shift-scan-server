/**
 * USE FORM MANAGER HOOK
 *
 * Handles complete form lifecycle without component logic:
 * - Loading template and submission data
 * - Normalizing API responses
 * - Managing form values and state
 * - Auto-save functionality
 * - Form validation
 * - Submission and draft save
 * - Approval handling
 *
 * All data is normalized immediately, so consumers get canonical types.
 * All transformation logic is encapsulated here.
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  FormTemplate,
  FormSubmission,
  FormApproval,
  FormFieldValue,
  FormManagerState,
  FormStatus,
} from "../types/forms";
import {
  normalizeFormTemplate,
  normalizeFormSubmission,
  normalizeFormApproval,
  validateFieldStructure,
  validateFieldValue,
  denormalizeFormValues,
} from "../utils/formNormalization";
import { apiRequest } from "../utils/api-Utils";

/**
 * Configuration for useFormManager
 */
export interface UseFormManagerConfig {
  formId: string;
  submissionId?: number;
  approvalId?: string;
  autoSaveDelay?: number; // ms to debounce auto-save
  autoSaveEnabled?: boolean;
  onSaved?: () => void;
  onError?: (error: Error) => void;
}

/**
 * useFormManager Hook
 *
 * Manages complete form lifecycle without component logic.
 * Handles loading, normalization, validation, and persistence.
 *
 * @param config - Configuration object
 * @returns FormManagerState with all form data and utilities
 *
 * Usage:
 * ```
 * const {
 *   template,
 *   submission,
 *   values,
 *   isLoading,
 *   error,
 *   updateValue,
 *   submitForm,
 *   saveAsDraft,
 * } = useFormManager({
 *   formId: 'form-001',
 *   submissionId: 1,
 *   autoSaveEnabled: true,
 * });
 * ```
 */
export function useFormManager(config: UseFormManagerConfig): FormManagerState {
  const {
    formId,
    submissionId,
    approvalId,
    autoSaveDelay = 2000,
    autoSaveEnabled = true,
    onSaved,
    onError,
  } = config;

  // State
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [approval, setApproval] = useState<FormApproval | null>(null);
  const [values, setValues] = useState<Record<string, FormFieldValue>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refs for auto-save debouncing
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedValuesRef = useRef<Record<string, FormFieldValue>>({});

  // =========================================================================
  // DATA LOADING
  // =========================================================================

  /**
   * Load form template from API
   */
  const loadTemplate = useCallback(async () => {
    try {
      // Use admin API endpoint: /api/v1/admins/forms/template/:id
      const apiData = await apiRequest(
        `/api/v1/admins/forms/template/${formId}`,
        "GET"
      );
      console.log("[FormManager] Loaded template data from API:", apiData);
      const normalized = normalizeFormTemplate(apiData);
      setTemplate(normalized);
      return normalized;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      throw err;
    }
  }, [formId, onError]);

  /**
   * Load form submission from API
   */
  const loadSubmission = useCallback(
    async (template?: FormTemplate) => {
      if (!submissionId) return null;

      try {
        // Use admin API endpoint: /api/v1/admins/forms/submissions/:submissionId
        const apiData = await apiRequest(
          `/api/v1/admins/forms/submissions/${submissionId}`,
          "GET"
        );
        const normalized = normalizeFormSubmission(apiData, template);
        setSubmission(normalized);
        setValues({ ...normalized.data });
        lastSavedValuesRef.current = { ...normalized.data };
        return normalized;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        onError?.(new Error(errorMsg));
        throw err;
      }
    },
    [submissionId, onError]
  );

  /**
   * Load form approval from API
   */
  const loadApproval = useCallback(async () => {
    if (!approvalId) return null;

    try {
      // Use apiRequest with the correct endpoint: /api/v1/forms/managerFormApproval/:id
      const apiData = await apiRequest(
        `/api/v1/forms/managerFormApproval/${approvalId}`,
        "GET"
      );
      const normalized = normalizeFormApproval(apiData);
      setApproval(normalized);
      return normalized;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      throw err;
    }
  }, [approvalId, onError]);

  /**
   * Initialize all data loading
   */
  // Memoize the callbacks to ensure stable references
  // (already done above with useCallback, but double-check dependencies)
  useEffect(() => {
    let isMounted = true;

    const initializeForm = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load template first
        const loadedTemplate = await loadTemplate();

        // Load submission if ID provided
        let loadedSubmission = null;
        if (submissionId) {
          loadedSubmission = await loadSubmission(loadedTemplate);
        }

        // Load approval if ID provided
        if (approvalId) {
          await loadApproval();
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeForm();

    return () => {
      isMounted = false;
    };
  }, [formId, submissionId, approvalId]);

  // =========================================================================
  // VALUE MANAGEMENT
  // =========================================================================

  /**
   * Update a single field value
   */
  const updateValue = useCallback(
    (fieldId: string, value: FormFieldValue) => {
      if (!template) return;

      // Validate field exists in template
      const validation = validateFieldValue(template, fieldId, value);
      if (!validation.valid) {
        console.warn(`Field validation failed: ${validation.error}`);
      }

      // Update values
      setValues((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
    },
    [template]
  );

  // =========================================================================
  // AUTO-SAVE
  // =========================================================================

  /**
   * Perform auto-save of current form values
   */
  const autoSave = useCallback(async () => {
    if (!submission || !template) return;

    // Check if values have changed
    const hasChanges =
      JSON.stringify(values) !== JSON.stringify(lastSavedValuesRef.current);
    if (!hasChanges) return;

    try {
      const apiPayload = denormalizeFormValues(template, values);

      // Use admin API endpoint for PATCH request
      await apiRequest(
        `/api/v1/admins/forms/submissions/${submission.id}`,
        "PUT",
        {
          data: apiPayload,
        }
      );

      lastSavedValuesRef.current = { ...values };
      onSaved?.();
    } catch (err) {
      console.error("Auto-save failed:", err);
      // Don't set global error for auto-save failures
    }
  }, [submission, template, values, onSaved]);

  /**
   * Trigger auto-save with debouncing
   */
  useEffect(() => {
    if (!autoSaveEnabled || !submission || !template) return;

    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, autoSaveDelay);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [values, autoSaveEnabled, submission, template, autoSaveDelay, autoSave]);

  // =========================================================================
  // FORM VALIDATION
  // =========================================================================

  /**
   * Validate entire form against template
   */
  const validateForm = useCallback(
    (valuesToValidate?: Record<string, FormFieldValue>) => {
      if (!template) {
        return {
          valid: false,
          errors: ["Template not loaded"],
        };
      }

      const valuesToCheck = valuesToValidate || values;

      // Create temporary submission for validation
      const tempSubmission: FormSubmission = {
        id: submission?.id ?? 0,
        title: submission?.title ?? null,
        formTemplateId: template.id,
        userId: submission?.userId ?? "",
        formType: submission?.formType ?? null,
        data: valuesToCheck,
        createdAt: submission?.createdAt ?? new Date(),
        updatedAt: new Date(),
        submittedAt: submission?.submittedAt ?? null,
        status: submission?.status ?? FormStatus.DRAFT,
        User: submission?.User ?? { id: "", firstName: "", lastName: "" },
        FormTemplate: template,
      };

      const validation = validateFieldStructure(template, tempSubmission);
      return validation;
    },
    [template, submission, values]
  );

  // =========================================================================
  // FORM SUBMISSION
  // =========================================================================

  /**
   * Submit form (mark as submitted)
   */
  const submitForm = useCallback(
    async (valuesToSubmit?: Record<string, FormFieldValue>) => {
      if (!submission || !template) {
        throw new Error("Cannot submit: template or submission not loaded");
      }

      const submitValues = valuesToSubmit || values;

      // Validate before submission
      const validation = validateForm(submitValues);
      if (!validation.valid) {
        throw new Error(
          `Form validation failed:\n${validation.errors.join("\n")}`
        );
      }

      try {
        const apiPayload = denormalizeFormValues(template, submitValues);

        // Use admin API endpoint for approve/submit
        const apiData = await apiRequest(
          `/api/v1/admins/forms/submissions/${submission.id}/approve`,
          "PUT",
          {
            action: "APPROVED",
            formData: apiPayload,
            formTemplateId: template.id,
            isApprovalRequired: template.isApprovalRequired,
            submissionId: submission.id,
          }
        );

        const normalized = normalizeFormSubmission(apiData, template);

        setSubmission(normalized);
        setValues({ ...normalized.data });
        lastSavedValuesRef.current = { ...normalized.data };
        onSaved?.();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        throw err;
      }
    },
    [submission, template, values, validateForm, onSaved]
  );

  /**
   * Save form as draft
   */
  const saveAsDraft = useCallback(
    async (valuesToSave?: Record<string, FormFieldValue>) => {
      if (!template) {
        throw new Error("Cannot save: template not loaded");
      }

      const saveValues = valuesToSave || values;

      try {
        // If no submission exists, create one
        if (!submission) {
          const apiPayload = denormalizeFormValues(template, saveValues);

          // Use admin API endpoint for creating a new submission
          const apiData = await apiRequest(
            `/api/v1/admins/forms/template/${template.id}/submissions`,
            "POST",
            {
              formData: apiPayload,
              formTemplateId: template.id,
              formType: template.formType,
            }
          );

          const normalized = normalizeFormSubmission(apiData, template);

          setSubmission(normalized);
          setValues({ ...normalized.data });
          lastSavedValuesRef.current = { ...normalized.data };
          onSaved?.();
        } else {
          // Update existing submission
          const apiPayload = denormalizeFormValues(template, saveValues);

          // Use admin API endpoint for updating a submission
          const apiData = await apiRequest(
            `/api/v1/admins/forms/submissions/${submission.id}`,
            "PUT",
            {
              data: apiPayload,
              formTemplateId: template.id,
              submissionId: submission.id,
            }
          );

          const normalized = normalizeFormSubmission(apiData, template);

          setSubmission(normalized);
          setValues({ ...normalized.data });
          lastSavedValuesRef.current = { ...normalized.data };
          onSaved?.();
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        throw err;
      }
    },
    [template, submission, values, onSaved]
  );

  // =========================================================================
  // DELETION
  // =========================================================================

  /**
   * Delete a submission
   */
  const deleteSubmission = useCallback(async () => {
    if (!submission) {
      throw new Error("Cannot delete: no submission to delete");
    }

    try {
      // Use admin API endpoint for DELETE request
      console.log("[FormManager] Deleting submission", submission?.id);
      const response = await apiRequest(
        `/api/v1/admins/forms/submissions/${submission.id}`,
        "DELETE"
      );
      console.log("[FormManager] Delete API response:", response);

      setSubmission(null);
      setValues({});
      lastSavedValuesRef.current = {};
      console.log("[FormManager] Submission state cleared after delete");
      onSaved?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      console.error("[FormManager] Delete submission error:", errorMsg);
      throw err;
    }
  }, [submission, onSaved]);

  // =========================================================================
  // RETURN STATE
  // =========================================================================

  return {
    template,
    submission,
    approval,
    values,
    isLoading,
    error,
    updateValue,
    submitForm,
    saveAsDraft,
    deleteSubmission,
    validateForm,
  };
}
