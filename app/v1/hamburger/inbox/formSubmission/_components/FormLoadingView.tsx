/**
 * FORM LOADING VIEW
 *
 * Unified loading component for form views.
 * Simple spinner display used by all form view components.
 */

"use client";

import { Contents } from "@/app/v1/components/(reusable)/contents";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import React from "react";

/**
 * FormLoadingView Component
 *
 * Displays a centered loading spinner.
 * Used by FormDraftView, FormSubmittedView, and FormApprovalView.
 *
 * @returns Rendered loading view
 *
 * Usage:
 * ```
 * {isLoading && <FormLoadingView />}
 * ```
 */
export function FormLoadingView() {
  return (
    <div className="h-full w-full bg-white flex flex-col rounded-lg pb-2">
      {/* Header - matches FormDraftView */}
      <TitleBoxes className="h-16 border-b-2 pb-2 rounded-lg border-neutral-100 shrink-0 sticky top-0 z-10 bg-white">
        <div className="w-full h-full flex items-end justify-center">
          <Titles size={"md"} className="truncate max-w-[200px]">
            Loading Form...
          </Titles>
        </div>
      </TitleBoxes>

      {/* Scrollable Content - matches FormDraftView */}
      <div className="bg-slate-50 flex-1 overflow-y-auto no-scrollbar flex flex-col justify-start items-center">
        <Contents width={"section"} className="pb-24 w-full max-w-md mx-auto">
          <div className="h-full w-full bg-white flex flex-col rounded-lg items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <p className="text-gray-600 font-medium">Loading form...</p>
            </div>
          </div>
        </Contents>
      </div>
    </div>
  );
}

export default FormLoadingView;
