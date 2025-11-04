"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTimeSheetData } from "@/app/lib/context/TimeSheetIdContext";
import { apiRequest } from "@/app/lib/utils/api-Utils";

export default function ContinueTimesheetCheck({
  id,
}: {
  id: number | undefined;
}) {
  const router = useRouter();
  const { setTimeSheetData } = useTimeSheetData();
  useEffect(() => {
    const continueTimesheet = async () => {
      if (!id) return; // Don't make the request if ID is undefined

      try {
        const response = await apiRequest(
          `/api/v1/continue-timesheet?id=${id}`,
          "GET"
        );
        if (response.success) {
          setTimeSheetData({ id: response.id });
          router.push("/v1/dashboard");
        }
      } catch (error) {
        console.error("Error continuing timesheet:", error);
      }
    };
    continueTimesheet();
  }, [id]);

  return null; // This component does not render anything
}
