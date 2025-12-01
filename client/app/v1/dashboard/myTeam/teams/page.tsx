"use client";

import { useSearchParams } from "next/navigation";
import FormPageClient from "./FormPageClient";

const Page = () => {
  const searchParams = useSearchParams();
  const tId = searchParams.get("tId");

  if (!tId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No team ID provided. Please use ?tId=your-team-id</p>
      </div>
    );
  }

  return <FormPageClient id={tId} />;
};

export default Page;
