"use client";

import Spinner from "@/app/v1/components/(animations)/spinner";
import { Button } from "@/app/v1/components/ui/button";
import FormBridge from "../../../RenderFields/FormBridge";
import { FormFieldValue, FormTemplate } from "@/app/lib/types/forms";
import { FormSettings } from "../../types";

interface FormBuilderPlaceholderProps {
  loading: boolean;
  addField: (fieldType: string) => void;
  formSettings: FormSettings;
}

export const PanelCenterMobilePreview: React.FC<
  FormBuilderPlaceholderProps
> = ({ loading, addField, formSettings }) => {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center absolute inset-0">
        <Spinner size={40} />
        <p className="text-sm text-gray-500 mt-2">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center absolute inset-0">
      <div className="w-full border border-slate-200 shadow-lg bg-white  flex flex-col items-center justify-center overflow-hidden">
        {/* Simulate a mobile device frame */}
        <div className="w-full h-full max-h-[43px] bg-slate-100 flex items-center justify-center  border-b border-slate-200">
          <span className="text-xs text-black font-bold">
            Mobile Form Preview
          </span>
        </div>
        <div className="w-full bg-slate-50 flex-1 overflow-y-auto py-4 flex flex-col items-center ">
          <div className="w-[370px] bg-white shadow-sm border border-gray-200 rounded-lg p-4">
            <FormBridge
              formTemplate={
                {
                  ...formSettings,
                  isActive:
                    formSettings.isActive === "ACTIVE" ||
                    formSettings.isActive === "ARCHIVED" ||
                    formSettings.isActive === "DRAFT"
                      ? formSettings.isActive
                      : "DRAFT",
                  // Add FormGrouping and Fields with correct types if needed, or remove if not used
                  FormGrouping:
                    (formSettings as any).FormGrouping?.map((group: any) => ({
                      ...group,
                      Fields: group.Fields?.map((field: any) => ({
                        ...field,
                        Options: field.Options?.map((opt: any) => ({
                          ...opt,
                          fieldId: field.id,
                        })),
                      })),
                    })) ?? [],
                } as FormTemplate
              }
              formValues={{}}
              // Prefer single-field updates via onFieldChange to avoid wholesale
              // replace of the values object and to match the existing update flow
              onFieldChange={(fieldId: string, value: FormFieldValue) => {
                console.log("Read-only preview - no changes allowed");
              }}
              userOptions={[]}
              equipmentOptions={[]}
              jobsiteOptions={[]}
              costCodeOptions={[]}
              readOnly={true}
              disabled={true}
              useNativeInput={true}
              hideSubmittedBy={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
