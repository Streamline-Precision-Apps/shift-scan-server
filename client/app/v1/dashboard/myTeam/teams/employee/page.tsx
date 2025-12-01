"use client";
import { useSearchParams } from "next/navigation";
import TeamMemberClientPage from "./_components/TeamMemberClientPage";

export default function TeamMemberPage() {
  const searchParams = useSearchParams();
  const tId = searchParams.get("tId");
  const eId = searchParams.get("eId");

  if (!tId || !eId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>
          Missing required parameters. Please use ?tId=team-id&eId=employee-id
        </p>
      </div>
    );
  }

  return <TeamMemberClientPage id={tId} employeeId={eId} />;
}
