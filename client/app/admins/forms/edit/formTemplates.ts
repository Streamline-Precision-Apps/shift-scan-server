export async function getAllFormTemplatesIds() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admins/forms/template`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BUILD_TOKEN ?? ""}`,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch forms");

  const result = await res.json();
  const forms: { id: string }[] = Array.isArray(result.data) ? result.data : [];
  return forms.map((form) => form.id);
}
