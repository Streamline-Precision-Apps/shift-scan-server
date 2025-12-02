"use client";

import { useSearchParams } from "next/navigation";
import FormSubmissionClientPage from "./_components/FormSubmissionClientPage";

export default function FormSubmissionPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No form ID provided. Please use ?id=your-form-id</p>
      </div>
    );
  }

  return <FormSubmissionClientPage id={id} />;
}
