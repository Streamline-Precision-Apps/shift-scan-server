/**
 * FORM DRAFT VIEW
 *
 * Wraps FormView for draft submission views.
 * Adds:
 * - Edit/Save buttons
 * - Delete option
 * - Auto-save indicator
 * - Draft status badge
 *
 * Used when submission status is DRAFT or no submission exists yet.
 */

"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  useFormContext,
  useFormState,
  useFormIsDraft,
} from "@/app/lib/hooks/useFormContext";
import { useRouter, usePathname } from "next/navigation";
// Utility to detect route change in Next.js app router
function useRouteChange(onRouteChange: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const lastPathRef = useRef(pathname);
  useEffect(() => {
    if (lastPathRef.current !== pathname) {
      onRouteChange();
      lastPathRef.current = pathname;
    }
  }, [pathname, onRouteChange]);
}
import { Buttons } from "@/app/v1/components/(reusable)/buttons";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Inputs } from "@/app/v1/components/(reusable)/inputs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/v1/components/ui/alert-dialog";
import FormView from "./FormView";
import FormLoadingView from "./FormLoadingView";
import FormErrorView from "./FormErrorView";

/**
 * Props for FormDraftView
 */
export interface FormDraftViewProps {
  /**
   * Callback when form is submitted
   */
  onSubmit?: () => void;

  /**
   * Callback when form is deleted
   */
  onDelete?: () => void;

  /**
   * Callback when form is saved
   */
  onSave?: () => void;

  /**
   * Custom class names
   */
  className?: string;
}

/**
 * FormDraftView Component
 *
 * Renders form in draft mode with:
 * - All fields editable
 * - Save as Draft button
 * - Submit button (triggers submission)
 * - Delete button
 * - Auto-save status
 *
 * @param props - FormDraftViewProps
 * @returns Rendered draft form view
 *
 * @throws Error if used outside FormContextProvider
 *
 * Usage:
 * ```
 * <FormDraftView
 *   onSubmit={() => navigate('/inbox')}
 *   onDelete={() => navigate('/forms')}
 * />
 * ```
 */
export function FormDraftView({
  onSubmit,
  onDelete,
  onSave,
  className = "space-y-6",
}: FormDraftViewProps) {
  const { submissionStatus, loading, error } = useFormState();
  const isDraft = useFormIsDraft();
  const { template, values, updateValue } = useFormContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteRequestModal, setDeleteRequestModal] = useState(false);
  const [userDisplayTitle, setUserDisplayTitle] = useState("");

  // AlertDialog for unsaved changes
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const pendingRouteChange = useRef<null | (() => void)>(null);

  // Use template name as the form title
  const formTitle = template?.name || "Untitled Form";

  // Save draft logic
  const handleSaveDraft = useCallback(async () => {
    if (onSave) {
      await onSave();
    }
  }, [onSave]);
  // Prompt user before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes. Do you want to save your draft before leaving?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Route change detection for Next.js navigation
  useRouteChange(() => {
    setShowLeaveDialog(true);
    // Block navigation until user confirms
    pendingRouteChange.current = () => {
      setShowLeaveDialog(false);
      pendingRouteChange.current = null;
    };
  });

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      onSubmit?.();
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);

  const handleDelete = useCallback(async () => {
    setDeleteRequestModal(false);
    onDelete?.();
  }, [onDelete]);

  if (loading) {
    return <FormLoadingView />;
  }

  if (error) {
    return <FormErrorView error={error} />;
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmit();
      }}
      className="h-full w-full bg-white flex flex-col rounded-lg "
    >
      <TitleBoxes
        className="h-16 border-b-2 pb-2 rounded-lg border-neutral-100 shrink-0 sticky top-0 z-10 bg-white"
        onClick={async () => {
          // Set up a pending navigation to inbox, but do not navigate yet

          await handleSaveDraft();
          router.push("/v1/hamburger/inbox");
        }}
      >
        <div className="w-full h-full flex items-end  justify-center">
          <Titles size={"md"} className="truncate max-w-[200px]">
            {formTitle}
          </Titles>
        </div>
      </TitleBoxes>

      <div className="bg-slate-50 flex-1 overflow-y-auto no-scrollbar flex flex-col justify-start items-center">
        <Contents width={"section"} className="pb-24 w-full max-w-md mx-auto">
          <div className="py-4 px-1 flex flex-col">
            {/* Title input section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Title (Optional)
                </span>
              </div>
              <Inputs
                type="text"
                placeholder="Enter a title here"
                name="title"
                value={userDisplayTitle}
                className="text-center text-base border border-gray-200 rounded-md p-2 w-full"
                onChange={(e) => setUserDisplayTitle(e.target.value)}
              />
            </div>

            {/* Form fields section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-40">
              <div className="mb-6">
                <h3 className="text-blue-600 font-semibold text-sm">
                  Form Details
                </h3>
              </div>
              <FormView
                readOnly={false}
                disabled={isSubmitting}
                useNativeInput={true}
              />
            </div>
          </div>
        </Contents>
      </div>

      {/* Action buttons */}
      <div className="w-full h-20 flex px-2 gap-x-4 shrink-0 sticky bottom-0 z-10 bg-white border-t rounded-lg">
        <Buttons
          type="button"
          background={"red"}
          onClick={() => setDeleteRequestModal(true)}
          className="w-full h-12 rounded-md shadow-sm"
        >
          <Titles size={"sm"}>Delete Draft</Titles>
        </Buttons>
        <Buttons
          type="submit"
          background={"green"}
          disabled={isSubmitting}
          className="w-full h-12 rounded-md shadow-sm"
        >
          <Titles size={"sm"}>
            {isSubmitting ? "Submitting" : "Submit Request"}
          </Titles>
        </Buttons>
      </div>

      <AlertDialog
        open={deleteRequestModal}
        onOpenChange={setDeleteRequestModal}
      >
        <AlertDialogContent className="w-[90%] bg-white rounded-xl max-w-md mx-auto">
          <AlertDialogHeader className="grow flex justify-center items-center">
            <AlertDialogTitle className="text-lg font-medium text-gray-700 text-center">
              Are you sure you want to delete this request?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-4 mt-4 ">
            <AlertDialogCancel className="w-full h-10 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 sm:w-auto border-0 mt-0">
              <span className="font-medium">Cancel</span>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full h-10 rounded-md bg-app-red text-white hover:bg-app-red/90 "
            >
              <span className="font-medium">Yes</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

export default FormDraftView;
