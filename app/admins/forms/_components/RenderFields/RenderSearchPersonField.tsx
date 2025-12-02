"use client";
import { SingleCombobox } from "@/app/v1/components/ui/single-combobox";
import { MobileSingleCombobox } from "@/app/v1/components/ui/mobileFormCombobox";
import { Label } from "@/app/v1/components/ui/label";
import type { ComboboxOption } from "@/app/v1/components/ui/single-combobox";
import { X } from "lucide-react";
export interface Fields {
  id: string;
  formGroupingId: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  placeholder?: string | null;
  minLength?: number | null;
  maxLength?: number | null;
  multiple: boolean | null;
  content?: string | null;
  filter?: string | null;
  Options?: FieldOption[];
}

interface FieldOption {
  id: string;
  fieldId: string;
  value: string;
}

// Define a Person interface to replace any type
interface Person {
  id: string;
  name: string;
}
export default function RenderSearchPersonField({
  field,
  value,
  handleFieldChange,
  handleFieldTouch,
  touchedFields,
  error,
  userOptions,
  formData,
  disabled,
  useNativeInput = false,
}: {
  field: {
    id: string;
    formGroupingId: string;
    label: string;
    type: string;
    required: boolean;
    order: number;
    placeholder?: string | null;
    minLength?: number | null;
    maxLength?: number | null;
    multiple?: boolean | null;
    content?: string | null;
    filter?: string | null;
    Options?: Array<{
      id: string;
      fieldId: string;
      value: string;
    }>;
  };
  userOptions: {
    value: string;
    label: string;
  }[];
  value: string;
  handleFieldChange: (
    fieldId: string,
    value: string | Date | string[] | object | boolean | number | null
  ) => void;
  formData: Record<string, unknown>;
  handleFieldTouch: (id: string) => void;
  touchedFields: Record<string, boolean>;
  error: string | null;
  disabled?: boolean;
  useNativeInput?: boolean;
}) {
  if (field.multiple) {
    const selectedPeople: Person[] = Array.isArray(formData[field.id])
      ? (formData[field.id] as Person[])
      : formData[field.id]
      ? [formData[field.id] as Person]
      : [];

    // No need to filter out already selected people, MobileSingleCombobox handles selection state

    const showError = field.required && selectedPeople.length === 0;

    return (
      <div
        key={field.id}
        className="flex flex-col"
        onBlur={() => handleFieldTouch(field.id)}
      >
        <Label className="text-sm font-medium mb-1">
          {field.label}{" "}
          {field.required && <span className="text-red-500">*</span>}
        </Label>
        {useNativeInput ? (
          <MobileSingleCombobox
            options={userOptions}
            value={selectedPeople.map((p) => p.id)}
            multiple={true}
            onChange={(
              val: string | string[],
              option?: ComboboxOption | ComboboxOption[]
            ) => {
              const selectedIds = Array.isArray(val) ? val : val ? [val] : [];
              const updatedPeople = selectedIds
                .map((id) => {
                  const found = userOptions.find((o) => o.value === id);
                  return found ? { id: found.value, name: found.label } : null;
                })
                .filter(Boolean) as Person[];
              handleFieldChange(field.id, updatedPeople);
            }}
            placeholder="Select people..."
            filterKeys={["value", "label"]}
            disabled={disabled}
          />
        ) : (
          <SingleCombobox
            options={userOptions}
            value={""}
            onChange={(val, option) => {
              if (option) {
                // Check if person is already selected
                const isSelected = selectedPeople.some(
                  (p: Person) => p.id === option.value
                );
                if (!isSelected) {
                  const newPerson = {
                    id: option.value,
                    name: option.label,
                  };
                  const updatedPeople = [...selectedPeople, newPerson];
                  handleFieldChange(field.id, updatedPeople);
                }
              }
            }}
            placeholder="Select people..."
            filterKeys={["value", "label"]}
            disabled={disabled}
          />
        )}
        {/* Display selected people as tags */}
        {selectedPeople.length > 0 && (
          <div className="max-w-md flex flex-wrap gap-2 mt-3 mb-2">
            {selectedPeople.map((person: Person, idx: number) => (
              <div
                key={person.id || `person-${idx}`}
                className={`${
                  useNativeInput ? "text-lg px-3 py-2  " : "text-xs px-3 py-1 "
                }   rounded-lg flex items-center gap-2 bg-green-100 text-green-800  `}
              >
                <span className=" font-medium">{person.name}</span>
                <button
                  type="button"
                  className="text-green-800 hover:text-green-900 text-2xl font-bold leading-none"
                  onClick={() => {
                    const updatedPeople = selectedPeople.filter(
                      (_: Person, i: number) => i !== idx
                    );
                    handleFieldChange(
                      field.id,
                      updatedPeople.length ? updatedPeople : null
                    );
                  }}
                  aria-label={`Remove ${person.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Show error message if required and no people selected */}
        {showError && touchedFields[field.id] && (
          <p className="text-xs text-red-500 mt-1">Field is required.</p>
        )}
      </div>
    );
  } else {
    const showError = error && touchedFields[field.id];
    const selectedPerson = formData[field.id] as Person | undefined;
    const displayValue = selectedPerson?.id || "";

    return (
      <div
        key={field.id}
        className="flex flex-col"
        onBlur={() => handleFieldTouch(field.id)}
      >
        <Label className="text-sm font-medium mb-1">
          {field.label}{" "}
          {field.required && <span className="text-red-500">*</span>}
        </Label>
        {useNativeInput ? (
          <MobileSingleCombobox
            options={userOptions}
            value={displayValue}
            onChange={(
              val: string | string[],
              option?: ComboboxOption | ComboboxOption[]
            ) => {
              const id = Array.isArray(val) ? val[0] : val;
              if (option && !Array.isArray(option)) {
                handleFieldChange(field.id, {
                  id: option.value,
                  name: option.label,
                });
              } else {
                handleFieldChange(field.id, null);
              }
            }}
            disabled={disabled}
            placeholder="Select person..."
            filterKeys={["value", "label"]}
          />
        ) : (
          <SingleCombobox
            options={userOptions}
            value={displayValue}
            onChange={(val, option) => {
              if (option) {
                handleFieldChange(field.id, {
                  id: option.value,
                  name: option.label,
                });
              } else {
                handleFieldChange(field.id, null);
              }
            }}
            disabled={disabled}
          />
        )}
        {/* Display selected person as tag */}
        {selectedPerson && (
          <div className="flex flex-wrap gap-2 mt-3 mb-2">
            <div
              className={`${
                useNativeInput ? "text-lg px-3 py-2  " : "text-xs px-3 py-1 "
              }   rounded-lg flex items-center gap-2 bg-green-100 text-green-800  `}
            >
              <span className=" font-medium">{selectedPerson.name}</span>
              <button
                type="button"
                className="text-green-800 hover:text-green-900 text-2xl font-bold leading-none"
                onClick={() => {
                  handleFieldChange(field.id, null);
                }}
                aria-label={`Remove ${selectedPerson.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        {showError && touchedFields[field.id] && (
          <p className="text-xs text-red-500 mt-1">This field is required.</p>
        )}
      </div>
    );
  }
}
