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
        maxLength?: number | null;
        minLength?: number | null;
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

    // Show error if value is not a valid number or exceeds max/min
    const numValue = value !== null && value !== "" ? Number(value) : null;
    const isInvalidNumber = value !== null && value !== "" && isNaN(numValue!);

    // Check max/min constraints
    let constraintError: string | null = null;
    if (numValue !== null && !isNaN(numValue)) {
        if (
            field.maxLength !== null &&
            field.maxLength !== undefined &&
            numValue > field.maxLength
        ) {
            constraintError = `Value cannot exceed ${field.maxLength}`;
        } else if (
            field.minLength !== null &&
            field.minLength !== undefined &&
            numValue < field.minLength
        ) {
            constraintError = `Value must be at least ${field.minLength}`;
        }
    }

    const showError =
        (touchedFields[field.id] && error) ||
        isInvalidNumber ||
        constraintError;
    const errorMessage =
        constraintError ||
        (isInvalidNumber ? "Please enter a valid number." : error);

    return (
        <div key={field.id} className="flex flex-col">
            <Label className="text-sm font-medium mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
                type="number"
                inputMode="decimal"
                className={`border rounded px-2 py-1 ${
                    showError ? "border-red-500" : ""
                }`}
                value={value !== null ? value : ""}
                onChange={handleInputChange}
                onBlur={() => handleFieldTouch(field.id)}
                disabled={disabled}
                autoComplete="off"
                max={field.maxLength ?? undefined}
                min={field.minLength ?? undefined}
            />
            {showError && (
                <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
            )}
        </div>
    );
}
