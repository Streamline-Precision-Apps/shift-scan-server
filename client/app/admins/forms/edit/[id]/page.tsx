"use client";
import FormPageClient from "./FormPageClient";

export default function FormPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <FormPageClient id={id} />;
}
