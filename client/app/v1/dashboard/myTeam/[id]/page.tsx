import FormPageClient from "./FormPageClient";
import { getAllTeamIds } from "./_components/getAllTeamIds";

// Static params generator for Next.js App Router
export async function generateStaticParams() {
  const ids = await getAllTeamIds();
  return ids.map((id: string) => ({ id }));
}

// Server Component: receives params and passes id to client component

const Page = async ({ params }: { params: { id: string } }) => {
  const resolvedParams = await params; // unwrap the promise
  const id = resolvedParams.id;

  return <FormPageClient id={id} />;
};
