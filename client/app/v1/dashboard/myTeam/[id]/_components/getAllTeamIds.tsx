export async function getAllTeamIds() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/teams`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BUILD_TOKEN ?? ""}`,
      },
      cache: "no-store",
    }
  );
  const result = await res.json();

  if (!result.success) throw new Error("Failed to fetch teams");

  // The backend should return: { success: true, data: [{ id: string }, ...] }

  const teams: { id: string }[] = result.data || [];
  return teams.map((team) => team.id);
}
