"use client";
import TeamMemberClientPage from "./_components/TeamMemberClientPage";

export default async function TeamMemberPage({
  params,
}: {
  params: { id: string; employeeId: string };
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const employeeId = resolvedParams.employeeId;
  return <TeamMemberClientPage id={id} employeeId={employeeId} />;
}
