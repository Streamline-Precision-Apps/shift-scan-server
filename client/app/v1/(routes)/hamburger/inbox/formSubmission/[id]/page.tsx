/**
 * DYNAMIC FORM PAGE
 *
 * Simplified page component for form submission management.
 * Replaces the old ~750 line page.tsx with clean ~150 line version.
 *
 * Responsibilities:
 * 1. Extract URL params (formId, submissionId, approvalId)
 * 2. Use useFormManager hook to load and manage all data
 * 3. Provide FormContextProvider to child components
 * 4. Route to appropriate view based on submission status and query params
 *
 * All data normalization, validation, and persistence is handled by:
 * - useFormManager hook (lifecycle management)
 * - FormContextProvider (state distribution)
 * - Specialized view components (UI rendering)
 *
 * Zero transformation logic in this component.
 */

"use client";

import { use, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormContextProvider } from "@/app/lib/context/FormContext";
import { useFormManager } from "@/app/lib/hooks/useFormManager";
import FormDraftView from "./_components/FormDraftView";
import FormSubmittedView from "./_components/FormSubmittedView";
import FormApprovalView from "./_components/FormApprovalView";
import { FormStatus } from "@/app/lib/types/forms";
import FormLoadingView from "./_components/FormLoadingView";
import FormErrorView from "./_components/FormErrorView";
import { Capacitor } from "@capacitor/core";

/**
 * Page component props
 */
interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Dynamic Form Submission Page
 *
 * Routes between different form views based on status and query params:
 * - Draft: FormDraftView (editable)
 * - Submitted/Pending: FormSubmittedView (read-only)
 * - Approval: FormApprovalView (with signature/comment)
 * - Approved/Denied: FormSubmittedView (read-only with status)
 *
 * @param props - Page props with dynamic [id] param
 * @returns Rendered form page with appropriate view
 *
 * Query Parameters:
 * - approvingStatus=true : Show approval interface
 * - submissionId=123 : Load existing submission
 * - approvalId=abc : Load specific approval record
 */
export default function DynamicForm({ params }: PageProps) {
  // Extract route params
  const { id: formId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query params
  const submissionId = searchParams.get("submissionId")
    ? parseInt(searchParams.get("submissionId")!)
    : undefined;
  const approvalId = searchParams.get("approvalId") ?? undefined;
  const approvingStatus = searchParams.get("approvingStatus") === "true";

  // =========================================================================
  // FORM MANAGEMENT
  // =========================================================================

  /**
   * Load form data and manage lifecycle
   * All normalization happens in this hook
   */
  const {
    template,
    submission,
    approval,
    values,
    isLoading,
    error,
    updateValue,
    submitForm,
    saveAsDraft,
    deleteSubmission,
    validateForm,
  } = useFormManager({
    formId,
    submissionId,
    approvalId,
    autoSaveEnabled: true,
    autoSaveDelay: 2000,
    onSaved: () => {},
    onError: (error) => {},
  });

  // =========================================================================
  // HANDLERS
  // =========================================================================

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    try {
      await submitForm(values);
      // Navigate back to inbox after successful submission
      router.push("/v1/hamburger/inbox");
    } catch (err) {
      console.error("Submit failed:", err);
    }
  }, [submitForm, values, router]);

  /**
   * Handle save as draft
   */
  const handleSaveDraft = useCallback(async () => {
    try {
      await saveAsDraft(values);
    } catch (err) {
      console.error("Save draft failed:", err);
    }
  }, [saveAsDraft, values]);

  /**
   * Handle form deletion
   */
  const handleDelete = useCallback(async () => {
    try {
      await deleteSubmission();
      router.push("/v1/hamburger/inbox");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, [deleteSubmission, router]);

  /**
   * Handle edit (manager view)
   */
  const handleEdit = useCallback(() => {
    // Remove approvingStatus param to go back to edit mode
    const params = new URLSearchParams(searchParams);
    params.delete("approvingStatus");
    router.push(
      `/v1/hamburger/inbox/formSubmission/${formId}?${params.toString()}`
    );
  }, [formId, searchParams, router]);

  /**
   * Handle approval
   */
  const handleApprove = useCallback(
    async (signature: string, comment: string) => {
      try {
        // Call approval endpoint
        // For now, this is a placeholder
        // Implementation depends on your approval workflow

        router.push("/hamburger/inbox");
      } catch (err) {
        console.error("Approval failed:", err);
      }
    },
    [router]
  );

  /**
   * Handle denial
   */
  const handleDeny = useCallback(
    async (comment: string) => {
      try {
        // Call denial endpoint
        // For now, this is a placeholder
        console.log("Form denied", { comment });
        router.push("/hamburger/inbox");
      } catch (err) {
        console.error("Denial failed:", err);
      }
    },
    [router]
  );

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  // =========================================================================
  // DETERMINE VIEW
  // =========================================================================

  /**
   * Determine which view to render based on submission status and query params
   */
  const getView = useMemo(() => {
    // Loading state
    if (isLoading) {
      return <FormLoadingView />;
    }

    // Error state
    if (error) {
      return <FormErrorView error={error} />;
    }

    // No template loaded
    if (!template) {
      return <FormLoadingView />;
    }

    // DRAFT VIEW
    if (!submission || submission.status === FormStatus.DRAFT) {
      return (
        <FormDraftView
          onSubmit={handleSubmit}
          onSave={handleSaveDraft}
          onDelete={handleDelete}
        />
      );
    }

    // APPROVAL VIEW
    if (approvingStatus && submission.status === FormStatus.PENDING) {
      return (
        <FormApprovalView
          requireSignature={template.isSignatureRequired}
          onApprove={handleApprove}
          onDeny={handleDeny}
          onCancel={handleCancel}
        />
      );
    }

    // SUBMITTED VIEW
    if (
      submission.status === FormStatus.PENDING ||
      submission.status === FormStatus.APPROVED ||
      submission.status === FormStatus.DENIED
    ) {
      return <FormSubmittedView showApprovalInfo={true} onEdit={handleEdit} />;
    }

    // Fallback to submitted view
    return <FormSubmittedView showApprovalInfo={true} />;
  }, [
    isLoading,
    error,
    template,
    submission,
    approvingStatus,
    handleSubmit,
    handleSaveDraft,
    handleDelete,
    handleApprove,
    handleDeny,
    handleCancel,
    handleEdit,
  ]);

  // =========================================================================
  // RENDER
  // =========================================================================
  const android = Capacitor.getPlatform() === "android";
  const ios = Capacitor.getPlatform() === "ios";
  return (
    <div
      className={`h-screen w-full container mx-auto max-w-4xl rounded-[10px] pb-8 px-5 ${
        android ? "pt-3" : ios ? "pt-6" : "pt-3"
      }`}
    >
      {/* Page Header */}

      {/* Form Content with Context */}
      <FormContextProvider
        template={template}
        submission={submission}
        approval={approval}
        values={values}
        onUpdateValue={updateValue}
        loading={isLoading}
        error={error}
      >
        {getView}
      </FormContextProvider>
    </div>
  );
}
