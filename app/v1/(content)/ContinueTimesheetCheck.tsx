"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTimeSheetData } from "@/app/lib/context/TimeSheetIdContext";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { useUserStore } from "@/app/lib/store/userStore";

export default function ContinueTimesheetCheck({
  id,
}: {
  id: number | undefined;
}) {
  const { user } = useUserStore();
  const userId = user?.id;
  const router = useRouter();
  const { setTimeSheetData } = useTimeSheetData();
  useEffect(() => {
    const continueTimesheet = async () => {
      if (!id || !userId) return; // Don't make the request if ID or userId is undefined

      try {
        const response = await apiRequest(
          `/api/v1/timesheet/${id}/user/${userId}/continue-timesheet`,
          "GET"
        );
        if (response.success && response.data) {
          setTimeSheetData({
            id: response.data.id,
            endTime: response.data.endTime || null,
          });
          router.push("/v1/dashboard");
        }
      } catch (error) {
        console.error("Error continuing timesheet:", error);
      }
    };
    continueTimesheet();
  }, [id, userId]);

  return null; // This component does not render anything
}
