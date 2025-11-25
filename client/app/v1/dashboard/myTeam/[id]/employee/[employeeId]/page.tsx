"use client";
import TeamMemberClientPage from "./_components/TeamMemberClientPage";

export default function TeamMemberPage({
  params,
}: {
  params: { id: string; employeeId: string };
}) {
  return <TeamMemberClientPage id={params.id} employeeId={params.employeeId} />;
}
