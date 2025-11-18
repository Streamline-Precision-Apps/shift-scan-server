/**
 * FORM SUBMITTED VIEW
 *
 * Wraps FormView for submitted form views.
 * Styled to match FormDraftView and FormApprovalView with header/content/footer layout.
 * Adds:
 * - Read-only display
 * - Submitted/Approved/Denied status badge
 * - Submission metadata (submitted by, date)
 * - Approval info if available
 *
 * Used when submission status is PENDING, APPROVED, or DENIED.
 */

"use client";

import React, { useCallback } from "react";
import { format } from "date-fns";
import {
  useFormSubmission,
  useFormApproval,
  useFormReadOnly,
  useFormState,
  useFormContext,
} from "@/app/lib/hooks/useFormContext";
import FormView from "./FormView";
import { FormStatus } from "@/app/lib/types/forms";
import { Buttons } from "@/app/v1/components/(reusable)/buttons";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import FormLoadingView from "./FormLoadingView";
import FormErrorView from "./FormErrorView";
import { useUserStore } from "@/app/lib/store/userStore";

/**
 * Props for FormSubmittedView
 */
export interface FormSubmittedViewProps {
  /**
   * Callback when user clicks edit (for manager view)
   */
  onEdit?: () => void;

  /**
   * Show approval information if available
   */
  showApprovalInfo?: boolean;

  /**
   * Custom class names
   */
  className?: string;
}

/**
 * Formats date for display
 */
function formatSubmissionDate(date: Date | null | undefined): string {
  if (!date) return "N/A";
  return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
}

/**
 * Get status badge color and text
 */
function getStatusInfo(status: FormStatus | null): {
  color: string;
  label: string;
  bgColor: string;
} {
  switch (status) {
    case FormStatus.APPROVED:
      return {
        color: "text-green-700",
        label: "Approved",
        bgColor: "bg-green-50",
      };
    case FormStatus.DENIED:
      return {
        color: "text-red-700",
        label: "Denied",
        bgColor: "bg-red-50",
      };
    case FormStatus.PENDING:
      return {
        color: "text-yellow-700",
        label: "Pending Approval",
        bgColor: "bg-yellow-50",
      };
    default:
      return {
        color: "text-gray-700",
        label: "Unknown",
        bgColor: "bg-gray-50",
      };
  }
}

/**
 * FormSubmittedView Component
 *
 * Renders form in submitted/approved/denied mode with FormDraftView layout:
 * - Header with form title
 * - Scrollable content with form details and status info
 * - Sticky footer with edit button (if available)
 *
 * All fields are read-only.
 *
 * @param props - FormSubmittedViewProps
 * @returns Rendered submitted form view
 *
 * @throws Error if used outside FormContextProvider
 *
 * Usage:
 * ```
 * <FormSubmittedView
 *   showApprovalInfo={true}
 *   onEdit={() => navigate('/edit')}
 * />
 * ```
 */
export function FormSubmittedView({
  onEdit,
  showApprovalInfo = true,
  className = "space-y-6",
}: FormSubmittedViewProps) {
  const { template, values, updateValue } = useFormContext();
  const submission = useFormSubmission();
  const approval = useFormApproval();
  const isReadOnly = useFormReadOnly();
  const { submissionStatus, loading, error } = useFormState();
  const { user } = useUserStore();

  const signatureImg = user?.signature || null;
  // Use template name as the form title
  const formTitle = template?.name || "Form Submission";

  if (loading) {
    return <FormLoadingView />;
  }

  if (error) {
    return <FormErrorView error={error} />;
  }

  const statusInfo = getStatusInfo(submissionStatus);
  const statusColor = statusInfo.bgColor.replace("bg-", "");

  return (
    <div className="h-full w-full bg-white flex flex-col rounded-lg pb-2">
      {/* Header - matches FormDraftView */}
      <TitleBoxes className="h-16 border-b-2 pb-2 rounded-lg border-neutral-100 shrink-0 sticky top-0 z-10 bg-white">
        <div className="w-full h-full flex items-end justify-center">
          <Titles size={"md"} className="truncate max-w-[200px]">
            {formTitle}
          </Titles>
        </div>
      </TitleBoxes>

      {/* Scrollable Content - matches FormDraftView */}
      <div className="bg-slate-50 flex-1 overflow-y-auto no-scrollbar flex flex-col justify-start items-center">
        <Contents width={"section"} className="pb-24 w-full max-w-md mx-auto">
          <div className="py-4 px-1 flex flex-col space-y-4">
            {/* Status Card */}
            <div
              className={`${statusInfo.bgColor} rounded-lg shadow-sm border border-gray-100 p-4`}
            >
              <h3 className={`font-semibold text-sm mb-3 ${statusInfo.color}`}>
                {statusInfo.label}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                {submission && (
                  <>
                    <p>
                      Submitted by{" "}
                      <span className="font-medium">
                        {submission.User?.firstName} {submission.User?.lastName}
                      </span>
                    </p>
                    <p>
                      On{" "}
                      <span className="font-medium">
                        {formatSubmissionDate(submission?.submittedAt)}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Form Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-40">
              <div className="mb-4">
                <h3 className="text-blue-600 font-semibold text-sm">
                  Form Details
                </h3>
              </div>
              <FormView
                readOnly={true}
                disabled={true}
                additionalContent={
                  <>
                    {template?.isSignatureRequired && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-40">
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Signature
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            id="user-signature-checkbox"
                            checked={
                              values.signature === true ||
                              values.signature === "true"
                            }
                            onChange={(e) =>
                              updateValue(
                                "signature",
                                e.target.checked ? true : null
                              )
                            }
                            disabled={true}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="user-signature-checkbox"
                            className="text-sm text-gray-700 select-none cursor-pointer font-medium"
                          >
                            I electronically sign this submission
                          </label>
                        </div>
                        {/* Show user signature image if signed and available */}
                        {(values.signature === true ||
                          values.signature === "true") &&
                          signatureImg && (
                            <div className="mt-4 flex flex-col items-center border border-gray-200">
                              <img
                                src={signatureImg}
                                alt="User Signature"
                                className="w-32 h-auto  rounded"
                              />
                            </div>
                          )}
                      </div>
                    )}
                  </>
                }
              />
            </div>

            {/* Approval Information */}
            {showApprovalInfo &&
              approval &&
              submissionStatus === FormStatus.APPROVED && (
                <div className="bg-green-50 rounded-lg shadow-sm border border-green-100 p-4 mb-40">
                  <h3 className="text-green-700 font-semibold text-sm mb-3">
                    Approval Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Approved by{" "}
                      <span className="font-medium">
                        {approval.Approver?.firstName}{" "}
                        {approval.Approver?.lastName}
                      </span>
                    </p>
                    <p>
                      On{" "}
                      <span className="font-medium">
                        {formatSubmissionDate(approval.submittedAt)}
                      </span>
                    </p>
                    {approval.comment && (
                      <p>
                        <span className="text-gray-600">Comment:</span>
                        <span className="font-medium block mt-2 italic text-gray-700">
                          "{approval.comment}"
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* Denial Information */}
            {showApprovalInfo &&
              approval &&
              submissionStatus === FormStatus.DENIED && (
                <div className="bg-red-50 rounded-lg shadow-sm border border-red-100 p-4 mb-40">
                  <h3 className="text-red-700 font-semibold text-sm mb-3">
                    Denial Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Denied by{" "}
                      <span className="font-medium">
                        {approval.Approver?.firstName}{" "}
                        {approval.Approver?.lastName}
                      </span>
                    </p>
                    <p>
                      On{" "}
                      <span className="font-medium">
                        {formatSubmissionDate(approval.submittedAt)}
                      </span>
                    </p>
                    {approval.comment && (
                      <p>
                        <span className="text-gray-600">Reason:</span>
                        <span className="font-medium block mt-2 italic text-gray-700">
                          "{approval.comment}"
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}
          </div>
        </Contents>
      </div>
    </div>
  );
}

export default FormSubmittedView;
