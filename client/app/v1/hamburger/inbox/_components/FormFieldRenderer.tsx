"use client";

import { useEffect, useState, useMemo } from "react";
import type { FormTemplate, FormFieldValue } from "@/app/lib/types/forms";
import { useEquipmentStore } from "@/app/lib/store/equipmentStore";
import { useProfitStore } from "@/app/lib/store/profitStore";
import { useCostCodeStore } from "@/app/lib/store/costCodeStore";
import { apiRequest } from "@/app/lib/utils/api-Utils";
// NOTE: This file now uses the unified FormBridge via the compatibility
// wrapper. When the migration completes, the wrapper and legacy files can be
// removed in favor of directly importing `FormBridge`.
import FormBridgeWrapper from "../../../../admins/forms/_components/RenderFields/FormBridgeWrapper";
import { sortFormTemplate } from "@/app/lib/utils/formOrdering";

// ============================================================================
// TYPES
// ============================================================================

interface UserOption {
  value: string;
  label: string;
}

interface EquipmentOption {
  value: string;
  label: string;
}

interface JobsiteOption {
  value: string;
  label: string;
}

interface CostCodeOption {
  value: string;
  label: string;
}

/**
 * Props for FormFieldRenderer component.
 * Accepts FormTemplate from FormContext and manages conversion to RenderFields.
 */
export interface FormFieldRendererProps {
  formData: FormTemplate;
  formValues: Record<string, FormFieldValue>;
  setFormValues?: (values: Record<string, FormFieldValue>) => void;
  readOnly?: boolean;
  disabled?: boolean;
  useNativeInput?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * FormFieldRenderer Component
 *
 * Bridges FormContext (FormTemplate) with RenderFields component.
 * Handles:
 * - Converting FormTemplate to FormIndividualTemplate
 * - Fetching dependent data (users, equipment, jobsites, cost codes)
 * - Managing field value conversions
 * - Delegating rendering to RenderFields
 *
 * @param props - FormFieldRendererProps
 * @returns Rendered form fields via RenderFields
 */
export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  formData,
  formValues,
  setFormValues,
  readOnly = false,
  disabled = false,
  useNativeInput = false,
}) => {
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [equipmentOptions, setEquipmentOptions] = useState<EquipmentOption[]>(
    []
  );
  const [jobsiteOptions, setJobsiteOptions] = useState<JobsiteOption[]>([]);
  const [costCodeOptions, setCostCodeOptions] = useState<CostCodeOption[]>([]);

  const { costCodes } = useCostCodeStore();
  const { jobsites } = useProfitStore();
  const { equipments } = useEquipmentStore();

  // =========================================================================
  // EFFECTS: Fetch and convert dependent data
  // =========================================================================

  /**
   * Convert equipment store data to option format
   */
  useEffect(() => {
    if (equipments && Array.isArray(equipments)) {
      const options: EquipmentOption[] = equipments.map((equipment) => ({
        value: equipment.id,
        label: equipment.name,
      }));
      setEquipmentOptions(options);
    }
  }, [equipments]);

  /**
   * Convert jobsite store data to option format
   */
  useEffect(() => {
    if (jobsites && Array.isArray(jobsites)) {
      const options: JobsiteOption[] = jobsites.map((jobsite) => ({
        value: jobsite.id,
        label: jobsite.name,
      }));
      setJobsiteOptions(options);
    }
  }, [jobsites]);

  /**
   * Convert cost code store data to option format
   */
  useEffect(() => {
    if (costCodes && Array.isArray(costCodes)) {
      const options: CostCodeOption[] = costCodes.map((costcode) => ({
        value: costcode.id,
        label: costcode.name,
      }));
      setCostCodeOptions(options);
    }
  }, [costCodes]);

  /**
   * Fetch user options from API
   */
  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const employeesRes = await apiRequest(`/api/v1/user/all`, "GET");
        const employees = Array.isArray(employeesRes.data)
          ? employeesRes.data
          : [];

        if (Array.isArray(employees)) {
          const options: UserOption[] = employees.map(
            (user: { id: string; firstName: string; lastName: string }) => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName}`,
            })
          );
          setUserOptions(options);
        } else {
          setUserOptions([]);
          console.warn("Expected array for employees, got:", employees);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUserOptions([]);
      }
    };

    fetchUsers();
  }, []);

  // =========================================================================
  // CONVERSIONS: FormTemplate <-> FormIndividualTemplate
  // =========================================================================

  /**
   * Sort form template to ensure proper ordering
   * Groupings sorted by order, then fields within each grouping sorted by order
   */
  const sortedFormData = useMemo(() => {
    const sorted = sortFormTemplate(formData);
    // Always filter out signature and state fields
    return {
      ...sorted,
      FormGrouping: sorted.FormGrouping.map((group) => ({
        ...group,
        Fields: group.Fields.filter((field) => {
          const id = field.id.toLowerCase();
          return id !== "signature" && id !== "state";
        }),
      })),
    };
  }, [formData]);

  /**
   * Handle field changes from RenderFields.
   * FormFieldValue types are compatible, so we pass through directly.
   *
   * @param fieldId - The ID of the field that changed
   * @param value - The new value from RenderFields
   */
  const handleFieldChange = (fieldId: string, value: FormFieldValue): void => {
    if (!readOnly && setFormValues) {
      const newValues: Record<string, FormFieldValue> = {
        ...formValues,
        [fieldId]: value,
      };
      setFormValues(newValues);
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <FormBridgeWrapper
      formTemplate={sortedFormData}
      userOptions={userOptions}
      submittedBy={null}
      setSubmittedBy={() => {}}
      submittedByTouched={false}
      formData={formValues}
      handleFieldChange={handleFieldChange}
      equipmentOptions={equipmentOptions}
      jobsiteOptions={jobsiteOptions}
      costCodeOptions={costCodeOptions}
      readOnly={readOnly || disabled}
      hideSubmittedBy={true}
      disabled={disabled}
      useNativeInput={useNativeInput}
    />
  );
};

export default FormFieldRenderer;
