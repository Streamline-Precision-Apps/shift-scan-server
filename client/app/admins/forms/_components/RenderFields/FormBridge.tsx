"use client";
import React, { useCallback, useMemo, useState } from "react";
import RenderInputField from "./RenderInputField";
import RenderTextArea from "./RenderTextAreaField";
import RenderNumberField from "./RenderNumberField";
import RenderDateField from "./RenderDateField";
import RenderTimeField from "./RenderTimeField";
import RenderDropdownField from "./RenderDropdownField";
import RenderRadioField from "./RenderRadioField";
import RenderCheckboxField from "./RenderCheckboxField";
import RenderMultiselectField from "./RenderMultiselectField";
import RenderSearchPersonField from "./RenderSearchPersonField";
import RenderSearchAssetField from "./RenderSearchAssetField";
import { Label } from "@/app/v1/components/ui/label";
import { SingleCombobox } from "@/app/v1/components/ui/single-combobox";
import { FormTemplate, FormField, FormFieldValue } from "@/app/lib/types/forms";

/**
 * FormBridgeProps: a minimal contract for the unified bridge.
 * It intentionally accepts form values and setters so it is stateless and testable.
 */
export interface FormBridgeProps {
  formTemplate: FormTemplate | null;
  formValues: Record<string, FormFieldValue>;
  setFormValues?: (values: Record<string, FormFieldValue>) => void;
  onFieldChange?: (fieldId: string, value: FormFieldValue) => void;
  userOptions?: { value: string; label: string }[];
  equipmentOptions?: { value: string; label: string }[];
  jobsiteOptions?: { value: string; label: string }[];
  costCodeOptions?: { value: string; label: string }[];
  readOnly?: boolean;
  disabled?: boolean;
  hideSubmittedBy?: boolean;
  submittedBy?: { id: string; firstName: string; lastName: string } | null;
  setSubmittedBy?: (
    user: { id: string; firstName: string; lastName: string } | null
  ) => void;
  submittedByTouched?: boolean;
  useNativeInput?: boolean;
}

/**
 * Basic helper to maintain touched state and simple validation. This mirrors
 * the behavior from the legacy `RenderFields` until validation is centralized.
 */
export function FormBridge({
  formTemplate,
  formValues,
  setFormValues,
  onFieldChange,
  userOptions = [],
  equipmentOptions = [],
  jobsiteOptions = [],
  costCodeOptions = [],
  readOnly = false,
  disabled = false,
  hideSubmittedBy = false,
  submittedBy,
  setSubmittedBy,
  submittedByTouched = false,
  useNativeInput = false,
}: FormBridgeProps) {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const handleFieldTouch = useCallback((fieldId: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldId]: true }));
  }, []);

  const handleInternalFieldChange = useCallback(
    (id: string, value: FormFieldValue) => {
      if (readOnly) return;
      if (onFieldChange) {
        onFieldChange(id, value);
      }
      if (setFormValues) {
        setFormValues({ ...(formValues || {}), [id]: value });
      }
    },
    [formValues, setFormValues, onFieldChange, readOnly]
  );

  // Basic validation as in the legacy implementation
  const handleFieldValidation = useCallback(
    (field: any, value: FormFieldValue) => {
      if (
        field?.required &&
        (value === null || value === undefined || value === "")
      ) {
        return `Required`;
      }
      return null;
    },
    []
  );

  const getTypedValue = useCallback((field: any, rawValue: FormFieldValue) => {
    if (rawValue === null || rawValue === undefined) {
      switch (field.type) {
        case "TEXT":
        case "INPUT":
        case "TEXTAREA":
        case "DROPDOWN":
        case "RADIO":
        case "TIME":
        case "SEARCH_PERSON":
        case "SEARCH_ASSET":
        case "NUMBER":
          return "";
        case "CHECKBOX":
          return false;
        case "DATE":
        case "DATE_TIME":
          return null;
        case "MULTISELECT":
          return [];
        default:
          return "";
      }
    }
    return rawValue;
  }, []);

  const sortedTemplate = useMemo(() => {
    if (!formTemplate) return null;
    const sorted = {
      ...formTemplate,
      FormGrouping: (formTemplate.FormGrouping || [])
        .map((g) => ({
          ...g,
          Fields: (g.Fields || [])
            .slice()
            .sort((a: FormField, b: FormField) => a.order - b.order),
        }))
        .sort((a, b) => a.order - b.order),
    };
    return sorted;
  }, [formTemplate]);

  if (!sortedTemplate) return null;

  return (
    <>
      {!hideSubmittedBy && (
        <div className="mb-4">
          <Label className="text-sm font-medium mb-1 ">
            Submitted By <span className="text-red-500">*</span>
          </Label>
          <SingleCombobox
            options={userOptions}
            value={submittedBy?.id || ""}
            onChange={(val, option) => {
              if (!readOnly) {
                if (option && setSubmittedBy) {
                  setSubmittedBy({
                    id: option.value,
                    firstName: option.label.split(" ")[0],
                    lastName: option.label.split(" ")[1],
                  });
                } else if (setSubmittedBy) {
                  setSubmittedBy(null);
                }
              }
            }}
            placeholder="Select user"
            filterKeys={["value", "label"]}
            disabled={disabled}
          />
        </div>
      )}

      {sortedTemplate.FormGrouping.map((group, groupIndex) => (
        <div key={group.id || `group-${groupIndex}`} className="mb-4">
          <div className="flex flex-col gap-5">
            {group.Fields.map((field, fieldIndex) => {
              const rawValue =
                (formValues &&
                  (formValues[field.id] ?? formValues[field.label])) ??
                null;
              const value = getTypedValue(field, rawValue);
              const options = (field as any).Options || [];
              const error = handleFieldValidation(field, value);
              const fieldKey =
                field.id ||
                `field-${group.id}-${fieldIndex}` ||
                `field-${groupIndex}-${fieldIndex}`;

              const commonPropsBase = {
                field,
                handleFieldChange: (id: string, val: FormFieldValue) =>
                  handleInternalFieldChange(id, val),
                handleFieldTouch,
                touchedFields,
                error,
                disabled,
                useNativeInput,
              };

              switch (field.type) {
                case "TEXT":
                case "INPUT":
                  return (
                    <RenderInputField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      value={value as string}
                      handleFieldChange={(id: string, v: string) =>
                        handleInternalFieldChange(id, v)
                      }
                    />
                  );
                case "TEXTAREA":
                  return (
                    <RenderTextArea
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      value={value as string}
                      handleFieldChange={(id: string, v: string) =>
                        handleInternalFieldChange(id, v)
                      }
                    />
                  );
                case "NUMBER":
                  return (
                    <RenderNumberField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      value={value as string | null}
                      handleFieldChange={(id: string, v: string) =>
                        handleInternalFieldChange(id, v)
                      }
                    />
                  );
                case "DATE":
                case "DATE_TIME":
                  return (
                    <RenderDateField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      value={value as string}
                      handleFieldChange={(id: string, v: string) =>
                        handleInternalFieldChange(id, v)
                      }
                    />
                  );
                case "TIME":
                  return (
                    <RenderTimeField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      value={value as any}
                      handleFieldChange={(
                        id: string,
                        v: string | Date | null
                      ) => handleInternalFieldChange(id, v as any)}
                    />
                  );
                case "DROPDOWN":
                  return (
                    <RenderDropdownField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      options={options}
                      value={value as string}
                      handleFieldChange={(id: string, v: string) =>
                        handleInternalFieldChange(id, v)
                      }
                    />
                  );
                case "RADIO":
                  return (
                    <RenderRadioField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      options={options}
                      value={value as string}
                      handleFieldChange={(id: string, v: string) =>
                        handleInternalFieldChange(id, v)
                      }
                    />
                  );
                case "CHECKBOX":
                  return (
                    <RenderCheckboxField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      value={value as string | boolean}
                      handleFieldChange={(id: string, v: string | boolean) =>
                        handleInternalFieldChange(id, v as any)
                      }
                    />
                  );
                case "MULTISELECT":
                  return (
                    <RenderMultiselectField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      options={options}
                      value={value as string[]}
                      handleFieldChange={(id: string, v: string | string[]) =>
                        handleInternalFieldChange(id, v as any)
                      }
                    />
                  );
                case "SEARCH_PERSON":
                  return (
                    <RenderSearchPersonField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      userOptions={userOptions}
                      formData={formValues}
                      disabled={disabled || readOnly}
                    />
                  );
                case "SEARCH_ASSET":
                  return (
                    <RenderSearchAssetField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      equipmentOptions={equipmentOptions}
                      jobsiteOptions={jobsiteOptions}
                      costCodeOptions={costCodeOptions}
                      formData={formValues}
                    />
                  );
                default:
                  return (
                    <RenderInputField
                      key={fieldKey}
                      {...(commonPropsBase as any)}
                      handleFieldChange={(id: string, v: string) =>
                        handleInternalFieldChange(id, v)
                      }
                    />
                  );
              }
            })}
          </div>
        </div>
      ))}
    </>
  );
}

export default FormBridge;
