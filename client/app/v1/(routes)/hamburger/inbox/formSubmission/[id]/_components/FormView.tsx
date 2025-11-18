/**
 * FORM VIEW - Base Component
 *
 * Base component that handles common form rendering logic.
 * Contains:
 * - Field grouping rendering
 * - Field value rendering
 * - Loading/error states
 * - Read-only mode
 *
 * Specialized views (FormDraftView, FormSubmittedView, etc) wrap this component
 * and add their own specific UI (buttons, approval interface, etc).
 *
 * All data consumed from FormContext - no transformation in this component.
 */

"use client";

import { ReactNode, useMemo } from "react";
import type { FormFieldValue } from "@/app/lib/types/forms";
import { useFormContext } from "@/app/lib/hooks/useFormContext";
import { sortFormTemplate } from "@/app/lib/utils/formOrdering";
import { FormFieldRenderer } from "../../../_components/FormFieldRenderer";
import FormLoadingView from "./FormLoadingView";

/**
 * Props for FormView
 */
export interface FormViewProps {
  /**
   * Whether to render in read-only mode
   * (no input changes allowed)
   */
  readOnly?: boolean;

  /**
   * Whether to disable all form inputs
   */
  disabled?: boolean;

  /**
   * Custom wrapper for the entire form
   */
  className?: string;

  /**
   * Custom wrapper for each grouping section
   */
  groupingClassName?: string;

  /**
   * Custom wrapper for the grouping header
   */
  groupingHeaderClassName?: string;

  /**
   * Custom wrapper for the grouping content
   */
  groupingContentClassName?: string;

  /**
   * Additional content to render after form fields
   * (e.g., signatures, approval info)
   */
  additionalContent?: ReactNode;

  /**
   * Show/hide grouping titles
   */
  showGroupingTitles?: boolean;

  /**
   * Custom component to render when loading
   */
  loadingComponent?: ReactNode;

  /**
   * Custom component to render when there's an error
   */
  errorComponent?: (error: string) => ReactNode;

  /**
   * Whether to use native HTML inputs or custom components
   * Useful for testing or specific UI frameworks
   */
  useNativeInput?: boolean;
}

/**
 * FormView Component
 *
 * Base form rendering component that uses FormContext.
 * All data is already normalized and ready to render.
 *
 * Handles:
 * - Grouping rendering
 * - Field rendering through FormFieldRenderer
 * - Load/error states
 * - Read-only mode
 *
 * Child components extend this for specific views.
 *
 * @param props - FormViewProps
 * @returns Rendered form view
 *
 * @throws Error if used outside FormContextProvider
 *
 * Usage:
 * ```
 * <FormView
 *   readOnly={submission?.status === "APPROVED"}
 *   additionalContent={<ApprovalSection />}
 * />
 * ```
 */
export function FormView({
  readOnly = false,
  disabled = false,
  className = "space-y-8",
  groupingClassName = "border rounded-lg p-6 space-y-4",
  groupingHeaderClassName = "border-b pb-4",
  groupingContentClassName = "space-y-4",
  additionalContent,
  showGroupingTitles = true,
  loadingComponent,
  errorComponent,
  useNativeInput = false,
}: FormViewProps) {
  const { template, values, updateValue, loading, error, submission } =
    useFormContext();
  /**
   * Sort template to ensure proper ordering:
   * 1. FormGrouping sorted by order
   * 2. Fields within each grouping sorted by order
   */
  const sortedTemplate = useMemo(() => {
    return template ? sortFormTemplate(template) : null;
  }, [template]);

  // =========================================================================
  // RENDER STATES
  // =========================================================================

  if (loading) {
    return loadingComponent || <FormLoadingView />;
  }

  if (error) {
    return (
      errorComponent?.(error) || (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error Loading Form</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )
    );
  }

  if (!template) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
        <p className="font-semibold">Form Template Not Found</p>
        <p className="text-sm mt-1">Unable to load the form structure.</p>
      </div>
    );
  }

  // =========================================================================
  // RENDER FORM
  // =========================================================================

  return (
    <div className={className}>
      <FormFieldRenderer
        formData={sortedTemplate!}
        formValues={values}
        setFormValues={(newValues: Record<string, FormFieldValue>) => {
          // Update each changed value in context
          for (const [fieldId, value] of Object.entries(newValues)) {
            if (values[fieldId] !== value) {
              updateValue(fieldId, value);
            }
          }
        }}
        readOnly={readOnly || disabled}
        disabled={disabled}
        useNativeInput={useNativeInput}
      />
      {/* Additional content (signatures, approvals, etc) */}
      {additionalContent}

      {/* Signature section if required by template */}
    </div>
  );
}

export default FormView;
