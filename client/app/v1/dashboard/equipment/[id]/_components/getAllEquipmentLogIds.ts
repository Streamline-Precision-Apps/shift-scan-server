export async function getAllEquipmentLogIds() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/timesheet/equipment-log`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BUILD_TOKEN ?? ""}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch equipment logs");
  const result = await res.json();
  // Expecting: { success: true, data: [{ id: string }, ...] }
  const logs: { id: string }[] = result.data || [];
  return logs.map((log) => log.id);
}
