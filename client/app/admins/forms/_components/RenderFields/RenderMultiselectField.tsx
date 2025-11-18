"use client";
import { Checkbox } from "@/app/v1/components/ui/checkbox";
import { Label } from "@/app/v1/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/v1/components/ui/radio-group";

export default function RenderMultiselectField({
  field,
  value,
  handleFieldChange,
  error,
  options,
  disabled,
  useNativeInput = false,
}: {
  field: {
    id: string;
    label: string;
    required: boolean;
  };
  options: {
    id: string;
    value: string;
  }[];
  value: string | string[];
  handleFieldChange: (id: string, value: string | string[]) => void;
  handleFieldTouch: (id: string) => void;
  touchedFields: Record<string, boolean>;
  error: string | null;
  disabled?: boolean;
  useNativeInput?: boolean;
}) {
  const arrayValue = Array.isArray(value) ? value : [];

  return (
    <div key={field.id} className="flex flex-col gap-2">
      <Label className="text-sm font-medium">
        {field.label}{" "}
        {field.required && <span className="text-red-500">*</span>}
      </Label>

      {useNativeInput ? (
        // Custom checkbox multiselect with improved UI (replacing native select)
        <div
          className={`border-2 rounded-lg p-4 bg-slate-50 transition-colors ${
            error ? "border-red-500 bg-red-50" : "border-slate-200"
          } ${disabled ? "bg-slate-100 opacity-50" : ""}`}
        >
          <div className="flex flex-col gap-3">
            {options.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                No options available
              </p>
            ) : (
              options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 cursor-pointer select-none hover:bg-white rounded px-2 py-1 transition-colors"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Checkbox
                      checked={arrayValue.includes(opt.value)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...arrayValue, opt.value]
                          : arrayValue.filter((v) => v !== opt.value);
                        handleFieldChange(field.id, updatedValue);
                      }}
                      id={`${field.id}-${opt.id}`}
                      disabled={disabled}
                      className="size-5"
                    />
                  </div>
                  <span className="text-sm text-slate-700">{opt.value}</span>
                </label>
              ))
            )}
          </div>
        </div>
      ) : (
        // Custom checkbox multiselect with improved UI
        <div
          className={`border-2 rounded-lg p-4 bg-slate-50 transition-colors ${
            error ? "border-red-500 bg-red-50" : "border-slate-200"
          } ${disabled ? "bg-slate-100 opacity-50" : ""}`}
        >
          <div className="flex flex-col gap-3">
            {options.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                No options available
              </p>
            ) : (
              options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 cursor-pointer select-none hover:bg-white rounded px-2 py-1 transition-colors"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Checkbox
                      checked={arrayValue.includes(opt.value)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...arrayValue, opt.value]
                          : arrayValue.filter((v) => v !== opt.value);
                        handleFieldChange(field.id, updatedValue);
                      }}
                      id={`${field.id}-${opt.id}`}
                      disabled={disabled}
                      className="size-5"
                    />
                  </div>
                  <span className="text-sm text-slate-700">{opt.value}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
