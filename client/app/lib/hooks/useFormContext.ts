/**
 * FORM CONTEXT HOOKS
 *
 * Re-export all form context hooks from FormContext.tsx for convenience.
 * This allows importing hooks directly:
 *
 * import { useFormContext, useFormValues } from '@/lib/hooks/useFormContext'
 *
 * Instead of:
 *
 * import { useFormContext, useFormValues } from '@/lib/context/FormContext'
 */

export {
  useFormContext,
  useFormTemplate,
  useFormSubmission,
  useFormApproval,
  useFormValues,
  useFormState,
  useFormReadOnly,
  useFormIsDraft,
  useFormField,
  useFormGroupings,
  useFieldValue,
  useUpdateFieldValue,
} from "../context/FormContext";
