/**
 * FORM APPROVAL VIEW
 *
 * Full approval interface for managers.
 * Includes:
 * - Read-only form display
 * - Manager comments
 * - Signature display
 * - Approve/Deny buttons
 *
 * Used when manager is reviewing a submitted form for approval.
 * Styled to match FormDraftView with header/content/footer layout.
 */

"use client";

import React, { useState, useCallback } from "react";
import { format } from "date-fns";
import {
  useFormSubmission,
  useFormReadOnly,
  useFormState,
  useFormContext,
} from "@/app/lib/hooks/useFormContext";
import { useUserStore } from "@/app/lib/store/userStore";
import FormView from "./FormView";
import { FormStatus } from "@/app/lib/types/forms";
import { Buttons } from "@/app/v1/components/(reusable)/buttons";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Images } from "@/app/v1/components/(reusable)/images";
import { TextAreas } from "@/app/v1/components/(reusable)/textareas";
import FormLoadingView from "./FormLoadingView";
import FormErrorView from "./FormErrorView";
import { Textarea } from "@/app/v1/components/ui/textarea";
import { app } from "@/app/lib/firebase";

/**
 * Props for FormApprovalView
 */
export interface FormApprovalViewProps {
  /**
   * Callback when form is approved
   */
  onApprove?: (
    approvalStatus: "APPROVED" | "DENIED",
    managerSignature: string,
    managerId: string,
    comment: string,
    submissionId: number
  ) => Promise<void>;

  /**
   * Callback when cancelled
   */
  onCancel?: () => void;

  /**
   * Show signature requirement
   */
  requireSignature?: boolean;

  /**
   * Custom class names
   */
  className?: string;
}

/**
 * Formats date for display
 */
function formatSubmissionDate(
  date: Date | null | undefined,
  type?: string
): string {
  if (!date) return "N/A";
  if (type === "submitted") {
    return format(new Date(date), "EE, MMMM d, yyyy");
  } else {
    return format(new Date(date), "MMM dd, yy 'at' h:mm a");
  }
}

/**
 * FormApprovalView Component
 *
 * Renders approval interface styled to match FormDraftView:
 * - Header with form title
 * - Scrollable content with form details and approval interface
 * - Sticky footer with approve/deny buttons
 *
 * @param props - FormApprovalViewProps
 * @returns Rendered approval form view
 *
 * @throws Error if used outside FormContextProvider
 *
 * Usage:
 * ```
 * <FormApprovalView
 *   requireSignature={true}
 *   onApprove={async (sig, comment) => { ... }}
 *   onDeny={async (comment) => { ... }}
 * />
 * ```
 */
export function FormApprovalView({
  onApprove,
  onCancel,
  requireSignature = true,
  className = "space-y-6",
}: FormApprovalViewProps) {
  const { template } = useFormContext();
  const submission = useFormSubmission();
  const isReadOnly = useFormReadOnly();
  const { submissionStatus, loading, error } = useFormState();

  const [comment, setComment] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isDenying, setIsDenying] = useState(false);
  const [signed, setSigned] = useState(false);
  const { user } = useUserStore();
  const signatureImg = user?.signature || null;

  // Use template name as the form title
  const formTitle = template?.name || "Form Approval";

  if (loading) {
    return <FormLoadingView />;
  }

  if (error) {
    return <FormErrorView error={error} />;
  }

  const handleApprove = useCallback(async () => {
    if (requireSignature) {
      if (!signed) {
        alert("You must check the signature box before approving.");
        return;
      }
      if (!signatureImg) {
        alert(
          "No signature found for this user. Please set your signature in your profile."
        );
        return;
      }
    }
    try {
      setIsApproving(true);
      if (!submission) {
        return;
      }
      await onApprove?.(
        "APPROVED",
        signatureImg || "",
        user?.id || "",
        comment,
        submission.id
      );
    } finally {
      setIsApproving(false);
    }
  }, [requireSignature, signatureImg, comment, onApprove, signed]);

  const handleDeny = useCallback(async () => {
    if (requireSignature && !signed) {
      alert("You must check the signature box before denying.");
      return;
    }
    if (!comment.trim()) {
      alert("Please provide a reason for denial");
      return;
    }
    try {
      setIsDenying(true);
      if (!submission) {
        return;
      }
      await onApprove?.(
        "DENIED",
        signatureImg || "",
        user?.id || "",
        comment,
        submission.id
      );
    } finally {
      setIsDenying(false);
    }
  }, [requireSignature, signed, comment]);

  return (
    <form className="h-full w-full bg-white flex flex-col rounded-lg">
      {/* Header - matches FormDraftView */}
      <TitleBoxes
        className="h-16 border-b-2 pb-2 rounded-lg border-neutral-100 shrink-0 sticky top-0 z-10 bg-white"
        onClick={onCancel}
      >
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
            {/* Form Submission Details*/}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
              <div className="mb-4 flex flex-row items-center gap-4">
                <div className="flex flex-row justify-center items-start gap-2">
                  <div className="w-[35%]">
                    <p className="text-sm font-semibold text-blue-600">
                      Created by:{" "}
                    </p>
                  </div>
                  <div className="w-[65%]">
                    <p className="text-sm text-gray-600">
                      {`${submission?.User?.firstName} ${
                        submission?.User?.lastName
                      } on ${formatSubmissionDate(
                        submission?.submittedAt,
                        "submitted"
                      )}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Form Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="mb-4 w-full flex flex-row justify-between items-center">
                <h3 className="text-blue-600 font-semibold text-base">
                  Form Details
                </h3>
                <p className="text-gray-600 text-sm">
                  {`ID: ${submission?.id}`}
                </p>
              </div>
              <FormView readOnly={true} disabled={true} useNativeInput={true} />
            </div>

            {/* Manager Approval Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-40">
              <div className="mb-4">
                <h3 className="text-blue-600 font-semibold text-sm">
                  Manager Approval
                </h3>
              </div>

              {/* Comment Field - styled like signature area */}
              <div className="mb-4 py-4">
                <div className="mb-2 flex flex-row items-center  ">
                  <p className="text-sm  text-black pr-1.5">Comments</p>
                  <p className="text-xs  text-gray-600 ">(Optional)</p>
                </div>
                <Textarea
                  maxLength={500}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add any comments or notes..."
                  className="w-full"
                />
                <span className="text-xs text-gray-500">
                  {comment.length} / 500
                </span>
              </div>

              {/* Signature Checkbox (like Draft) */}
              {requireSignature && (
                <div className="py-4 mb-2">
                  <div className="mb-4 flex flex-row ">
                    <span className="text-sm font-medium text-black  ">
                      Signature
                    </span>
                    <span className="text-red-500 pl-1.5 flex justify-center">
                      *
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="manager-signature-checkbox"
                      checked={signed}
                      onChange={(e) => setSigned(e.target.checked)}
                      className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
                    />
                    <label
                      htmlFor="manager-signature-checkbox"
                      className="text-sm text-gray-700 select-none cursor-pointer font-medium"
                    >
                      I electronically sign this approval
                    </label>
                  </div>
                  {/* Show user signature image if signed and available */}
                  {signed && signatureImg && (
                    <div className="mt-4 flex flex-col items-center border border-gray-200">
                      <img
                        src={signatureImg}
                        alt="User Signature"
                        className="w-32 h-auto rounded"
                      />
                    </div>
                  )}
                  {signed && !signatureImg && (
                    <div className="mt-2 text-xs text-red-500">
                      No signature found. Please set your signature in your
                      profile.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Contents>
      </div>

      {/* Sticky Footer - matches FormDraftView */}
      <div className="w-full h-20 flex px-2 gap-x-4 shrink-0 sticky bottom-0 z-10 bg-white border-t rounded-lg">
        <Buttons
          type="button"
          background={"red"}
          onClick={handleDeny}
          disabled={
            isDenying ||
            isApproving ||
            !comment.trim() ||
            (requireSignature && !signed)
          }
          className={`w-full h-12 rounded-md shadow-sm ${
            isDenying ||
            isApproving ||
            !comment.trim() ||
            (requireSignature && !signed)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <Titles size={"sm"}>{isDenying ? "Denying..." : "Deny"}</Titles>
        </Buttons>
        <Buttons
          type="button"
          background={"green"}
          onClick={handleApprove}
          disabled={
            isApproving ||
            isDenying ||
            (requireSignature && (!signed || !signatureImg))
          }
          className={`w-full h-12 rounded-md shadow-sm ${
            isApproving ||
            isDenying ||
            (requireSignature && (!signed || !signatureImg))
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <Titles size={"sm"}>
            {isApproving ? "Approving..." : "Approve"}
          </Titles>
        </Buttons>
      </div>
    </form>
  );
}

export default FormApprovalView;
