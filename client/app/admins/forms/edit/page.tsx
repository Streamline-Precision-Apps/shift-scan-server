"use client";

import { useSearchParams } from "next/navigation";
import FormPageClient from "./FormPageClient";

export default function FormPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No form ID provided. Please use ?id=your-id-here</p>
      </div>
    );
  }

  return <FormPageClient id={id} />;
}
