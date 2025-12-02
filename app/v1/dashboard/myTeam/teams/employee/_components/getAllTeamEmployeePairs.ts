export async function getAllTeamEmployeePairs() {
  // Fetch all teams
  const teamsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/teams`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BUILD_TOKEN ?? ""}`,
      },
      cache: "no-store",
    }
  );
  if (!teamsRes.ok) throw new Error("Failed to fetch teams");
  const teamsData = await teamsRes.json();
  const teams: { id: string }[] = teamsData.data || [];

  // Fetch all employees
  const employeesRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/All`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BUILD_TOKEN ?? ""}`,
      },
      cache: "no-store",
    }
  );
  if (!employeesRes.ok) throw new Error("Failed to fetch employees");
  const employeesData = await employeesRes.json();
  const employees: { id: string }[] = employeesData.data || [];

  // Create all possible {id, employeeId} pairs
  const pairs: { id: string; employeeId: string }[] = [];
  for (const team of teams) {
    for (const emp of employees) {
      pairs.push({ id: team.id, employeeId: emp.id });
    }
  }
  return pairs;
}
