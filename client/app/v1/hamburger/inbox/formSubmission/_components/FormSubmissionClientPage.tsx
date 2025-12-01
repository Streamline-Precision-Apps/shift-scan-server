"use client";
import { use, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormContextProvider } from "@/app/lib/context/FormContext";
import { useFormManager } from "@/app/lib/hooks/useFormManager";
import FormDraftView from "./FormDraftView";
import FormSubmittedView from "./FormSubmittedView";
import FormApprovalView from "./FormApprovalView";
import { FormStatus } from "@/app/lib/types/forms";
import FormLoadingView from "./FormLoadingView";
import FormErrorView from "./FormErrorView";
import { Capacitor } from "@capacitor/core";

interface FormSubmissionClientPageProps {
  id: string;
}

export default function FormSubmissionClientPage({ id }: FormSubmissionClientPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query params
  const submissionId = searchParams.get("submissionId")
    ? parseInt(searchParams.get("submissionId")!)
    : undefined;
  const approvalId = searchParams.get("approvalId") ?? undefined;
  const approvingStatus = searchParams.get("approvingStatus") === "true";

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
    approveForm,
  } = useFormManager({
    formId: id,
    submissionId,
    approvalId,
    autoSaveEnabled: true,
    autoSaveDelay: 2000,
    onSaved: () => {},
    onError: (error) => {},
  });

  const handleSubmit = useCallback(async () => {
    try {
      await submitForm(values);
      router.push("/v1/hamburger/inbox");
    } catch (err) {
      console.error("Submit failed:", err);
    }
  }, [submitForm, values, router]);

  const handleSaveDraft = useCallback(async () => {
    try {
      await saveAsDraft(values);
    } catch (err) {
      console.error("Save draft failed:", err);
    }
  }, [saveAsDraft, values]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteSubmission();
      router.push("/v1/hamburger/inbox");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, [deleteSubmission, router]);

  const handleEdit = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("approvingStatus");
    router.push(`/v1/hamburger/inbox/formSubmission?id=${id}&${params.toString()}`);
  }, [id, searchParams, router]);

  const handleApprove = useCallback(
    async (
      approvalStatus: "APPROVED" | "DENIED",
      managerSignature: string,
      managerId: string,
      comment: string,
      submissionId: number
    ) => {
      try {
        await approveForm(
          values,
          approvalStatus,
          managerSignature,
          managerId,
          comment,
          submissionId
        );
        router.push("/v1/hamburger/inbox");
      } catch (err) {
        console.error("Approval failed:", err);
      }
    },
    [approveForm, values, router]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const getView = useMemo(() => {
    if (isLoading) {
      return <FormLoadingView />;
    }
    if (error) {
      return <FormErrorView error={error} />;
    }
    if (!template) {
      return <FormLoadingView />;
    }
    if (!submission || submission.status === FormStatus.DRAFT) {
      return (
        <FormDraftView
          onSubmit={handleSubmit}
          onSave={handleSaveDraft}
          onDelete={handleDelete}
        />
      );
    }
    if (approvingStatus && submission.status === FormStatus.PENDING) {
      return (
        <FormApprovalView
          requireSignature={template.isSignatureRequired}
          onApprove={handleApprove}
          onCancel={handleCancel}
        />
      );
    }
    if (
      submission.status === FormStatus.PENDING ||
      submission.status === FormStatus.APPROVED ||
      submission.status === FormStatus.DENIED
    ) {
      return <FormSubmittedView showApprovalInfo={true} onEdit={handleEdit} />;
    }
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
    handleCancel,
    handleEdit,
  ]);

  const android = Capacitor.getPlatform() === "android";
  const ios = Capacitor.getPlatform() === "ios";
  return (
    <div
      className={`h-screen w-full container mx-auto max-w-4xl rounded-[10px] pb-7 px-5 ${
        android ? "pt-4" : ios ? "pt-12" : "pt-3.5"
      }`}
    >
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