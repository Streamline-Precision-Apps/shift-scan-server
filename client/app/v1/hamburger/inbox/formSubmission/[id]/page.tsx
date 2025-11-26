import FormSubmissionClientPage from "./_components/FormSubmissionClientPage";

interface PageProps {
  params: { id: string };
}

// Server Component: receives params and passes id to client component
const FormSubmissionPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return <FormSubmissionClientPage id={id} />;
};

export default FormSubmissionPage;
