"use client";
import React from "react";
import FormBridge, { FormBridgeProps } from "./FormBridge";
import { FormTemplate, FormFieldValue } from "@/app/lib/types/forms";

/**
 * Wrapper that maps the legacy RenderFields API to the new FormBridge.
 * This file intentionally preserves the old prop names and forwards them
 * to the new bridge to keep existing call sites functioning.
 */
export default function FormBridgeWrapper({
  formTemplate,
  userOptions = [],
  submittedBy,
  setSubmittedBy,
  submittedByTouched,
  formData,
  handleFieldChange,
  equipmentOptions = [],
  jobsiteOptions = [],
  costCodeOptions = [],
  readOnly = false,
  hideSubmittedBy = false,
  disabled = false,
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
  const bridgeProps: FormBridgeProps = {
    formTemplate,
    formValues: formData,
    setFormValues: undefined,
    onFieldChange: handleFieldChange,
    userOptions,
    equipmentOptions,
    jobsiteOptions,
    costCodeOptions,
    readOnly,
    disabled,
    hideSubmittedBy,
    submittedBy,
    setSubmittedBy,
    submittedByTouched,
    useNativeInput,
  };

  return <FormBridge {...bridgeProps} />;
}
