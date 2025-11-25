import { useUserStore } from "@/app/lib/store/userStore";
import FormPageClient from "./FormPageClient";
import { getAllTeamIds } from "./_components/getAllTeamIds";

// Static params generator for Next.js App Router
export async function generateStaticParams() {
  const ids = await getAllTeamIds();
  return ids.map((id: string) => ({ id }));
}

// Server Component: receives params and passes id to client component
const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return <FormPageClient id={id} />;
};

export default Page;
