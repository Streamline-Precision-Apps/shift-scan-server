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

import { ReactNode, useMemo, useEffect, useState } from "react";
import type { FormFieldValue } from "@/app/lib/types/forms";
import { useFormContext } from "@/app/lib/hooks/useFormContext";
import { sortFormTemplate } from "@/app/lib/utils/formOrdering";
import FormBridge from "@/app/admins/forms/_components/RenderFields/FormBridge";
import { useEquipmentStore } from "@/app/lib/store/equipmentStore";
import { useProfitStore } from "@/app/lib/store/profitStore";
import { useCostCodeStore } from "@/app/lib/store/costCodeStore";
import { apiRequest } from "@/app/lib/utils/api-Utils";
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
  const [userOptions, setUserOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [equipmentOptions, setEquipmentOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [jobsiteOptions, setJobsiteOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [costCodeOptions, setCostCodeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const { costCodes } = useCostCodeStore();
  const { jobsites } = useProfitStore();
  const { equipments } = useEquipmentStore();

  useEffect(() => {
    if (equipments && Array.isArray(equipments)) {
      const options = equipments.map((equipment) => ({
        value: equipment.id,
        label: equipment.name,
      }));
      setEquipmentOptions(options);
    }
  }, [equipments]);

  useEffect(() => {
    if (jobsites && Array.isArray(jobsites)) {
      const options = jobsites.map((jobsite) => ({
        value: jobsite.id,
        label: jobsite.name,
      }));
      setJobsiteOptions(options);
    }
  }, [jobsites]);

  useEffect(() => {
    if (costCodes && Array.isArray(costCodes)) {
      const options = costCodes.map((cost) => ({
        value: cost.id,
        label: cost.name,
      }));
      setCostCodeOptions(options);
    }
  }, [costCodes]);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const employeesRes = await apiRequest(`/api/v1/user/all`, "GET");
        const employees = Array.isArray(employeesRes.data)
          ? employeesRes.data
          : [];
        if (Array.isArray(employees)) {
          const options = employees.map((user: any) => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName}`,
          }));
          setUserOptions(options);
        } else {
          setUserOptions([]);
          console.warn("Expected array for employees, got:", employees);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUserOptions([]);
      }
    };

    fetchUsers();
  }, []);
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
      <FormBridge
        formTemplate={sortedTemplate!}
        formValues={values}
        // Prefer single-field updates via onFieldChange to avoid wholesale
        // replace of the values object and to match the existing update flow
        onFieldChange={(fieldId: string, value: FormFieldValue) => {
          if (values[fieldId] !== value) {
            updateValue(fieldId, value);
          }
        }}
        userOptions={userOptions}
        equipmentOptions={equipmentOptions}
        jobsiteOptions={jobsiteOptions}
        costCodeOptions={costCodeOptions}
        readOnly={readOnly || disabled}
        disabled={disabled}
        useNativeInput={true}
        hideSubmittedBy={true}
      />
      {/* Additional content (signatures, approvals, etc) */}
      {additionalContent}

      {/* Signature section if required by template */}
    </div>
  );
}

export default FormView;
