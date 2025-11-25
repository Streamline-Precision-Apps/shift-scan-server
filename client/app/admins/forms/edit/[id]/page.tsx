import { getAllFormTemplatesIds } from "./formTemplates";
import FormPageClient from "./FormPageClient";

export async function generateStaticParams() {
  const ids = await getAllFormTemplatesIds();
  return ids.map((id) => ({ id }));
}

// Server Component: fetches params and passes to client component
export default async function FormPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <FormPageClient id={id} />;
}
