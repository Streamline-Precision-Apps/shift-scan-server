"use client";
import EquipmentIdClientPageWrapper from "./_components/EquipmentIdClientPageWrapper";
import { getAllEquipmentLogIds } from "./_components/getAllEquipmentLogIds";

// Static params generator for Next.js App Router
export async function generateStaticParams() {
  const ids = await getAllEquipmentLogIds();
  return ids.map((id: string) => ({ id }));
}

// Server Component: receives params and passes id to client component
const EquipmentLogPage = async ({ params }: { params: { id: string } }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return <EquipmentIdClientPageWrapper id={id} />;
};
