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

import React, { useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import {
  useFormSubmission,
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
import { Images } from "@/app/v1/components/(reusable)/images";
import { TextAreas } from "@/app/v1/components/(reusable)/textareas";
import FormLoadingView from "./FormLoadingView";
import FormErrorView from "./FormErrorView";

/**
 * Props for FormApprovalView
 */
export interface FormApprovalViewProps {
  /**
   * Callback when form is approved
   */
  onApprove?: (signature: string, comment: string) => Promise<void>;

  /**
   * Callback when form is denied
   */
  onDeny?: (comment: string) => Promise<void>;

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
function formatSubmissionDate(date: Date | null | undefined): string {
  if (!date) return "N/A";
  return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
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
  onDeny,
  onCancel,
  requireSignature = true,
  className = "space-y-6",
}: FormApprovalViewProps) {
  const { template } = useFormContext();
  const submission = useFormSubmission();
  const isReadOnly = useFormReadOnly();
  const { submissionStatus, loading, error } = useFormState();

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [comment, setComment] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isDenying, setIsDenying] = useState(false);
  const [signatureEmpty, setSignatureEmpty] = useState(true);

  // Use template name as the form title
  const formTitle = template?.name || "Form Approval";

  if (loading) {
    return <FormLoadingView />;
  }

  if (error) {
    return <FormErrorView error={error} />;
  }

  const handleClearSignature = useCallback(() => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureEmpty(true);
      }
    }
  }, []);

  const handleApprove = useCallback(async () => {
    if (requireSignature && signatureEmpty) {
      alert("Please provide a signature to approve");
      return;
    }

    try {
      setIsApproving(true);
      const canvas = signatureCanvasRef.current;
      const signatureData = canvas?.toDataURL("image/png") || "";

      await onApprove?.(signatureData, comment);
    } finally {
      setIsApproving(false);
    }
  }, [requireSignature, signatureEmpty, comment, onApprove]);

  const handleDeny = useCallback(async () => {
    if (!comment.trim()) {
      alert("Please provide a reason for denial");
      return;
    }

    try {
      setIsDenying(true);
      await onDeny?.(comment);
    } finally {
      setIsDenying(false);
    }
  }, [comment, onDeny]);

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = signatureCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

      ctx.beginPath();
      ctx.moveTo(x, y);
      setSignatureEmpty(false);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x2 =
          ((moveEvent.clientX - rect.left) / rect.width) * canvas.width;
        const y2 =
          ((moveEvent.clientY - rect.top) / rect.height) * canvas.height;
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    []
  );

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
            {/* Form Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="mb-4">
                <h3 className="text-blue-600 font-semibold text-sm">
                  Form Details
                </h3>
              </div>
              <FormView readOnly={true} disabled={true} useNativeInput={true} />
              <div className="flex flex-col gap-2 mt-4 pt-3 border-t text-sm text-gray-600">
                <p>
                  Originally Submitted{" "}
                  <span className="font-medium">
                    {formatSubmissionDate(submission?.submittedAt)}
                  </span>
                </p>
                <p>
                  Submitted by{" "}
                  <span className="font-medium">
                    {submission?.User?.firstName} {submission?.User?.lastName}
                  </span>
                </p>
              </div>
            </div>

            {/* Manager Approval Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-40">
              <div className="mb-4">
                <h3 className="text-blue-600 font-semibold text-sm">
                  Manager Approval
                </h3>
              </div>

              {/* Comment Field */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Comments (Optional)
                </label>
                <TextAreas
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

              {/* Signature Canvas */}
              {requireSignature && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Signature <span className="text-red-500">*</span>
                  </label>
                  {signatureEmpty ? (
                    <Buttons
                      onClick={() => {
                        // Activate canvas by clearing it first then setting focus
                        const canvas = signatureCanvasRef.current;
                        if (canvas) {
                          canvas.focus();
                          setSignatureEmpty(false);
                        }
                      }}
                      className="w-full"
                    >
                      <Titles size={"sm"}>Tap to Sign</Titles>
                    </Buttons>
                  ) : (
                    <div className="relative border-2 border-gray-300 rounded-md p-3 bg-white">
                      <canvas
                        ref={signatureCanvasRef}
                        width={400}
                        height={200}
                        className="w-full cursor-crosshair bg-white"
                        onMouseDown={handleCanvasMouseDown}
                      />
                      <button
                        type="button"
                        onClick={handleClearSignature}
                        className="absolute top-2 right-2 bg-orange-400 hover:bg-orange-500 text-white p-2 rounded-md transition-colors"
                      >
                        <Images titleImg="/eraser.svg" titleImgAlt="Eraser" />
                      </button>
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
          disabled={isDenying || isApproving || !comment.trim()}
          className="w-full h-12 rounded-md shadow-sm"
        >
          <Titles size={"sm"}>{isDenying ? "Denying..." : "Deny"}</Titles>
        </Buttons>
        <Buttons
          type="button"
          background={"green"}
          onClick={handleApprove}
          disabled={
            isApproving || isDenying || (requireSignature && signatureEmpty)
          }
          className="w-full h-12 rounded-md shadow-sm"
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
