"use client";
import FormPageClient from "./FormPageClient";
import { getAllFormTemplatesIds } from "./formTemplates";

<<<<<<< HEAD:app/admins/forms/edit/[id]/page.tsx
export async function generateStaticParams() {
  const ids = await getAllFormTemplatesIds();
  return ids.map((id) => ({ id }));
}

// Server Component: fetches params and passes to client component
export default async function FormPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
=======
export default function FormPage({ params }: { params: { id: string } }) {
  const { id } = params;
>>>>>>> 95da5110 (save no static):client/app/admins/forms/edit/[id]/page.tsx
  return <FormPageClient id={id} />;
}
