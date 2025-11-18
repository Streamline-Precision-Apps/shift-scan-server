/**
 * FORM ERROR VIEW
 *
 * Unified error component for form views.
 * Simple error display used by all form view components.
 */

"use client";

import { Contents } from "@/app/v1/components/(reusable)/contents";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import React from "react";

/**
 * FormErrorView Component
 *
 * Displays an error message in a styled error box.
 * Used by FormDraftView, FormSubmittedView, and FormApprovalView.
 *
 * @param error - Error message to display
 * @returns Rendered error view
 *
 * Usage:
 * ```
 * {error && <FormErrorView error={error} />}
 * ```
 */
export function FormErrorView({ error }: { error: string }) {
  return (
    <div className="h-full w-full bg-white flex flex-col rounded-lg pb-2">
      {/* Header - matches FormDraftView */}
      <TitleBoxes className="h-16 border-b-2 pb-2 rounded-lg border-neutral-100 shrink-0 sticky top-0 z-10 bg-white">
        <div className="w-full h-full flex items-end justify-center">
          <Titles size={"md"} className="truncate max-w-[200px]">
            Error
          </Titles>
        </div>
      </TitleBoxes>

      {/* Scrollable Content - matches FormDraftView */}
      <div className="bg-slate-50 flex-1 overflow-y-auto no-scrollbar flex flex-col justify-start items-center">
        <Contents width={"section"} className="pb-24 w-full max-w-md mx-auto">
          <div className="h-full w-full bg-white flex flex-col rounded-lg items-center  p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 max-w-md w-full">
              <p className="font-semibold">Error Loading Form</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </Contents>
      </div>
    </div>
  );
}

export default FormErrorView;
