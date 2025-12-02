"use client";
import { useEffect } from "react";
import { useCookieStore } from "@/app/lib/store/cookieStore";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/utils/api-Utils";

type ActiveTimesheetCheckProps = {
  userId: string;
};

export default function ActiveTimesheetCheck({
  userId,
}: ActiveTimesheetCheckProps) {
  const router = useRouter();

  const resetCookieStore = useCookieStore((state) => state.reset);

  useEffect(() => {
    const checkActiveTimesheet = async () => {
      try {
        // Call backend API to check active timesheet status
        const response = await apiRequest(
          `/api/v1/timesheet/user/${userId}/active-status`,
          "GET"
        );
        // If no active timesheet found, clear all cookies and Zustand store, then redirect to home
        if (!response?.data?.hasActiveTimesheet) {
          // Clear all timesheet cookies
          await apiRequest(`/api/cookies/clear-all`, "DELETE");
          // Clear Zustand cookie store
          resetCookieStore();
          // Redirect to home page
          router.replace("/v1");
        }
      } catch (error) {
        console.error("Failed to check active timesheet status:", error);
        // Don't redirect on error to avoid disrupting user experience
      }
    };

    // Add a short delay to avoid race conditions after navigation
    const timeout = setTimeout(() => {
      checkActiveTimesheet();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [userId, resetCookieStore, router]);

  // This component doesn't render anything visible
  return null;
}
