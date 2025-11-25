import FormSubmissionClientPage from "./_components/FormSubmissionClientPage";

interface PageProps {
  params: { id: string };
}

// Static params generator for Next.js App Router
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/forms/submissions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BUILD_TOKEN ?? ""}`,
        },
        cache: "no-store",
      }
    );

    const result = await res.json();
    const ids = Array.isArray(result) ? result : result.data || [];
    return ids.map((submission: { id: string | number } | string | number) => {
      let id: string;
      if (
        typeof submission === "object" &&
        submission !== null &&
        "id" in submission
      ) {
        id = submission.id.toString();
      } else {
        id = submission.toString();
      }
      return { id };
    });
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    return [];
  }
}

// Server Component: receives params and passes id to client component
const FormSubmissionPage = async ({ params }: PageProps) => {
  const { id } = params;
  return <FormSubmissionClientPage id={id} />;
};

export default FormSubmissionPage;
