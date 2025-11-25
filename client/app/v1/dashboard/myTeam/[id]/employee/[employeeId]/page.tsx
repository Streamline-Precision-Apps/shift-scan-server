import TeamMemberClientPage from "./_components/TeamMemberClientPage";
import { getAllTeamEmployeePairs } from "./_components/getAllTeamEmployeePairs";

// Static params generator for Next.js App Router
export async function generateStaticParams() {
  const pairs = await getAllTeamEmployeePairs();
  return pairs;
}

// Server Component: receives params and passes to client component
const TeamMemberPage = async ({
  params,
}: {
  params: { id: string; employeeId: string };
}) => {
  return <TeamMemberClientPage id={params.id} employeeId={params.employeeId} />;
};

export default TeamMemberPage;
