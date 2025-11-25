"use client";
import { Input } from "@/app/v1/components/ui/input";
import { Label } from "@/app/v1/components/ui/label";

export default function RenderTimeField({
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
  value: string;
  handleFieldChange: (id: string, value: string) => void;
  handleFieldTouch: (id: string) => void;
  touchedFields: Record<string, boolean>;
  error: string | null;
  disabled?: boolean;
  useNativeInput?: boolean;
}) {
  function formatTimeForInput(value: Date | string | null | undefined): string {
    if (!value) return "";

    // If it's already in HH:mm format (from time input), return as-is
    if (typeof value === "string" && /^\d{2}:\d{2}/.test(value)) {
      return value.substring(0, 5); // Ensure we only get HH:mm
    }

    // Otherwise, parse as date and extract time
    const date = typeof value === "string" ? new Date(value) : value;
    if (isNaN(date.getTime())) return "";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  return (
    <div key={field.id} className="flex flex-col">
      <Label htmlFor={field.id} className="text-sm font-medium mb-1">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </Label>

      <Input
        type="time"
        id={field.id}
        value={formatTimeForInput(value)}
        placeholder="Select time"
        className={`w-full border rounded px-2 py-1 cursor-pointer bg-white appearance-none  ${
          error && touchedFields[field.id] ? "border-red-500" : ""
        }`}
        autoComplete="off"
        onChange={(e) => handleFieldChange(field.id, e.target.value)}
        onBlur={() => handleFieldTouch(field.id)}
        required={field.required}
        disabled={disabled}
      />

      {error && touchedFields[field.id] && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
