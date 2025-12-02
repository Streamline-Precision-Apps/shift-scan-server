"use client";
import { Input } from "@/app/v1/components/ui/input";
import { Label } from "@/app/v1/components/ui/label";

export default function RenderNumberField({
  field,
  value,
  handleFieldChange,
  handleFieldTouch,
  touchedFields,
  error,
  disabled,
  useNativeInput = false,
}: {
  field: {
    id: string;
    label: string;
    required: boolean;
  };
  value: string | null;
  handleFieldChange: (id: string, value: string) => void;
  handleFieldTouch: (id: string) => void;
  touchedFields: Record<string, boolean>;
  error: string | null;
  disabled?: boolean;
  useNativeInput?: boolean;
}) {
  // Only allow numbers (including decimals) in the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Remove all non-numeric characters except dot and minus
    val = val.replace(/[^0-9.-]/g, "");
    // Prevent multiple dots or minus signs
    if ((val.match(/\./g) || []).length > 1) {
      val = val.replace(/\.(?=.*\.)/g, "");
    }
    if ((val.match(/-/g) || []).length > 1) {
      val = val.replace(/-(?=.*-)/g, "");
    }
    handleFieldChange(field.id, val);
  };

  // Show error if value is not a valid number
  const isInvalidNumber =
    value !== null && value !== "" && isNaN(Number(value));
  const showError = (touchedFields[field.id] && error) || isInvalidNumber;
  const errorMessage = isInvalidNumber ? "Please enter a valid number." : error;

  return (
    <div key={field.id} className="flex flex-col">
      <Label className="text-sm font-medium mb-1">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        type="text"
        inputMode="decimal"
        pattern="[0-9]*"
        className={`border rounded px-2 py-1 ${
          showError ? "border-red-500" : ""
        }`}
        value={value !== null ? value : ""}
        onChange={handleInputChange}
        onBlur={() => handleFieldTouch(field.id)}
        disabled={disabled}
        autoComplete="off"
      />
      {showError && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
    </div>
  );
}
