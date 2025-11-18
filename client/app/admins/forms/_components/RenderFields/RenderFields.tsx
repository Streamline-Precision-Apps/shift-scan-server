import { Label } from "@/app/v1/components/ui/label";
import { useState } from "react";
import { SingleCombobox } from "@/app/v1/components/ui/single-combobox";
import RenderSearchPersonField, {
  Fields,
} from "../../../../v1/(routes)/hamburger/inbox/_components/RenderSearchPersonField";
import RenderSearchAssetField from "../../../../v1/(routes)/hamburger/inbox/_components/RenderSearchAssetField";
import RenderTimeField from "../../../../v1/(routes)/hamburger/inbox/_components/RenderTimeField";
import RenderInputField from "./RenderInputField";
import RenderTextArea from "./RenderTextAreaField";
import RenderNumberField from "./RenderNumberField";
import RenderDateField from "./RenderDateField";
import RenderDropdownField from "./RenderDropdownField";
import RenderRadioField from "./RenderRadioField";
import RenderCheckboxField from "./RenderCheckboxField";
import RenderMultiselectField from "./RenderMultiselectField";
import { FormTemplate, FormField, FormFieldValue } from "@/app/lib/types/forms";

/**
 * Type adapter: Convert canonical FormField to legacy Fields type for backward-compatible components.
 * This adapter is temporary and should be removed once all child components are updated to use FormField.
 */
function adaptFormFieldToLegacy(field: FormField): Fields {
  return {
    ...field,
    // Ensure nullable fields are properly handled for legacy components
    multiple: field.multiple ?? null,
    placeholder: field.placeholder ?? undefined,
    maxLength: field.maxLength ?? undefined,
    minLength: field.minLength ?? undefined,
    content: field.content ?? undefined,
    filter: field.filter ?? undefined,
  };
}

export default function RenderFields({
  formTemplate,
  userOptions,
  submittedBy,
  setSubmittedBy,
  submittedByTouched,
  formData,
  handleFieldChange,
  disabled,
  equipmentOptions = [],
  jobsiteOptions = [],
  costCodeOptions = [],
  readOnly = false,
  hideSubmittedBy = false,
  useNativeInput = false,
}: {
  formTemplate: FormTemplate;
  userOptions: { value: string; label: string }[];
  submittedBy: { id: string; firstName: string; lastName: string } | null;
  setSubmittedBy: (
    user: { id: string; firstName: string; lastName: string } | null
  ) => void;
  submittedByTouched: boolean;
  formData: Record<string, FormFieldValue>;
  handleFieldChange: (fieldId: string, value: FormFieldValue) => void;
  equipmentOptions?: { value: string; label: string }[];
  jobsiteOptions?: { value: string; label: string }[];
  costCodeOptions?: { value: string; label: string }[];
  readOnly?: boolean;
  hideSubmittedBy?: boolean;
  disabled?: boolean;
  useNativeInput?: boolean;
}) {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const handleFieldTouch = (fieldId: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldId]: true }));
  };

  const handleFieldValidation = (field: Fields, value: FormFieldValue) => {
    if (
      field.required &&
      (value === null || value === undefined || value === "")
    ) {
      return `Required`;
    }
    return null;
  };

  // Helper function to get correctly typed value based on field type
  const getTypedValue = (
    field: Fields,
    rawValue: FormFieldValue
  ): FormFieldValue => {
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
  };

  if (!formTemplate?.FormGrouping) return null;

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
                if (option) {
                  setSubmittedBy({
                    id: option.value,
                    firstName: option.label.split(" ")[0],
                    lastName: option.label.split(" ")[1],
                  });
                } else {
                  setSubmittedBy(null);
                }
              }
            }}
            placeholder="Select user"
            filterKeys={["value", "label"]}
            disabled={disabled}
          />
          {submittedByTouched && !submittedBy?.id.trim() && (
            <span className="text-xs text-red-500">
              This field is required.
            </span>
          )}
        </div>
      )}
      {formTemplate.FormGrouping?.sort((a, b) => a.order - b.order).map(
        (group, groupIndex) => (
          <div key={group.id || `group-${groupIndex}`} className="mb-4">
            <div className="flex flex-col gap-5">
              {group.Fields?.sort((a, b) => a.order - b.order).map(
                (formField: FormField, fieldIndex) => {
                  // Adapt canonical FormField to legacy Fields type for backward-compatible components
                  const field = adaptFormFieldToLegacy(formField);

                  // Get properly typed value based on field type - use same fallback pattern as admin
                  const rawValue =
                    formData[field.id] ?? formData[field.label] ?? null;
                  const value = getTypedValue(field, rawValue);
                  const options = field.Options || [];
                  const error = handleFieldValidation(field, value);

                  // Ensure unique key, fallback to field position if no ID
                  const fieldKey =
                    field.id ||
                    `field-${group.id}-${fieldIndex}` ||
                    `field-${groupIndex}-${fieldIndex}`;

                  switch (field.type) {
                    case "TEXT":
                    case "INPUT":
                      return (
                        <RenderInputField
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                          useNativeInput={useNativeInput}
                        />
                      );
                    case "TEXTAREA":
                      return (
                        <RenderTextArea
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                          useNativeInput={useNativeInput}
                        />
                      );
                    case "NUMBER":
                      return (
                        <RenderNumberField
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                          useNativeInput={useNativeInput}
                        />
                      );
                    case "DATE":
                    case "DATE_TIME":
                      return (
                        <RenderDateField
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          useNativeInput={useNativeInput}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                        />
                      );
                    case "TIME":
                      return (
                        <RenderTimeField
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                          useNativeInput={useNativeInput}
                        />
                      );
                    case "DROPDOWN":
                      return (
                        <RenderDropdownField
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          options={options}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                          useNativeInput={useNativeInput}
                        />
                      );
                    case "RADIO":
                      return (
                        <RenderRadioField
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          options={options}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                          useNativeInput={useNativeInput}
                        />
                      );
                    case "CHECKBOX":
                      return (
                        <RenderCheckboxField
                          key={fieldKey}
                          field={field}
                          value={value as string | boolean}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string | boolean) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                          useNativeInput={useNativeInput}
                        />
                      );
                    case "HEADER":
                      return (
                        <div key={fieldKey} className="col-span-2">
                          <h2 className="text-xl font-bold my-2">
                            {field.label}
                          </h2>
                          <h2 className="text-xl font-bold my-2">
                            {field.content}
                          </h2>
                        </div>
                      );
                    case "PARAGRAPH":
                      return (
                        <div key={fieldKey} className="col-span-2">
                          <p className="text-gray-700 text-sm">{field.label}</p>
                          <p className="text-gray-700 my-2">{field.content}</p>
                        </div>
                      );
                    case "MULTISELECT":
                      return (
                        <RenderMultiselectField
                          key={fieldKey}
                          field={field}
                          value={value as string | string[]}
                          options={options}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string | string[]) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                          useNativeInput={useNativeInput}
                        />
                      );
                    case "SEARCH_PERSON":
                      return (
                        <RenderSearchPersonField
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          userOptions={userOptions} // Use the userOptions array
                          handleFieldChange={
                            readOnly
                              ? () => {
                                  return;
                                }
                              : (
                                  id: string,
                                  val:
                                    | string
                                    | Date
                                    | string[]
                                    | Record<string, any>
                                    | boolean
                                    | number
                                    | null
                                ) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          formData={formData}
                          disabled={disabled || readOnly}
                          useNativeInput={useNativeInput}
                        />
                      );
                    case "SEARCH_ASSET":
                      return (
                        <RenderSearchAssetField
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (
                                  id: string,
                                  val:
                                    | string
                                    | Date
                                    | string[]
                                    | Record<string, any>
                                    | boolean
                                    | number
                                    | null
                                ) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          formData={formData}
                          equipmentOptions={equipmentOptions || []}
                          jobsiteOptions={jobsiteOptions || []}
                          costCodeOptions={costCodeOptions || []}
                          error={error}
                          disabled={disabled || readOnly}
                          useNativeInput={useNativeInput}
                        />
                      );
                    default:
                      return (
                        <RenderInputField
                          key={fieldKey}
                          field={field}
                          value={value as string}
                          handleFieldChange={
                            readOnly
                              ? () => {}
                              : (id: string, val: string) => {
                                  handleFieldChange(id, val);
                                }
                          }
                          handleFieldTouch={handleFieldTouch}
                          touchedFields={touchedFields}
                          error={error}
                          disabled={disabled}
                          useNativeInput={useNativeInput}
                        />
                      );
                  }
                }
              ) || []}
            </div>
          </div>
        )
      ) || []}
    </>
  );
}
