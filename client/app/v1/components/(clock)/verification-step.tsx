"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import {
  createNewSession,
  handleGeneralTimeSheet,
} from "@/app/lib/actions/timeSheetActions";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "../(reusable)/contents";
import { Labels } from "../(reusable)/labels";
import { Inputs } from "../(reusable)/inputs";
import { Images } from "../(reusable)/images";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";

import {
  setCurrentPageView,
  setLaborType,
  setWorkRole,
} from "@/app/lib/actions/cookieActions";
import { Titles } from "../(reusable)/titles";
import { useRouter } from "next/navigation";
import Spinner from "../(animations)/spinner";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { Texts } from "../(reusable)/texts";
import { useUserStore } from "@/app/lib/store/userStore";
import { useCommentData } from "@/app/lib/context/CommentContext";
import { usePermissions } from "@/app/lib/context/permissionContext";
import { useTimeSheetData } from "@/app/lib/context/TimeSheetIdContext";
import { sendNotification } from "@/app/lib/actions/generatorActions";
import {
  startClockInTracking,
  getStoredCoordinates,
} from "@/app/lib/client/locationTracking";
import { useSessionStore } from "@/app/lib/store/sessionStore";

type Options = {
  id: string;
  label: string;
  code: string;
};
type VerifyProcessProps = {
  type: string;
  role: string;
  option?: string;
  comments?: string;
  handlePreviousStep?: () => void;
  laborType?: string;
  clockInRoleTypes: string | undefined;
  returnPathUsed: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  jobsite: Options | null;
  cc: Options | null;
};

export default function VerificationStep({
  type,
  comments,
  role,
  handlePreviousStep,
  laborType,
  clockInRoleTypes,
  returnPathUsed,
  setStep,
  jobsite,
  cc,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUserStore();
  const { savedCommentData, setCommentData } = useCommentData();
  const router = useRouter();
  const { savedTimeSheetData, refetchTimesheet } = useTimeSheetData();
  const { permissionStatus } = usePermissions();
  const { currentSessionId, setCurrentSession } = useSessionStore();

  if (!user) return null; // Conditional rendering for session
  const id = user.id;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!id) {
        console.error("User ID does not exist");
        return;
      }
      // Check if location permissions are granted if not clock in does not work
      if (!permissionStatus.location) {
        console.error("Location permissions are required to clock in.");
        return;
      }

      // Get current coordinates
      console.log("Getting current coordinates for clock in...");
      const coordinates = await getStoredCoordinates();
      console.log("Coordinates:", coordinates);

      // Check for session data
      let sessionId = null;
      if (currentSessionId === null) {
        // No session exists, create a new one
        console.log("No session exists, creating new session...");
        sessionId = await createNewSession(id);
        setCurrentSession(sessionId);
        console.log("New session created:", sessionId);
      } else {
        // Session exists, check if it's ended
        const currentSession = useSessionStore
          .getState()
          .getSession(currentSessionId);
        if (currentSession && currentSession.endTime) {
          // Session has ended, check if 4+ hours have passed
          const endTime = new Date(currentSession.endTime).getTime();
          const currentTime = new Date().getTime();
          const FOUR_HOURS_MS = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

          if (currentTime - endTime > FOUR_HOURS_MS) {
            // More than 4 hours have passed, clear sessions and create a new one
            console.log(
              "Session expired (4+ hours since end), clearing storage and creating new session"
            );
            useSessionStore.getState().clearSessions();
            sessionId = await createNewSession(id);
            setCurrentSession(sessionId);
            console.log("New session created after expiration:", sessionId);
          } else {
            // Less than 4 hours, create a new session but keep old one in history
            console.log("Session still valid, creating new session...");
            sessionId = await createNewSession(id);
            setCurrentSession(sessionId);
            console.log("New session created:", sessionId);
          }
        } else {
          // Session is still active, reuse it
          console.log(
            "Session still active, reusing session:",
            currentSessionId
          );
          sessionId = currentSessionId;
        }
      }

      // Build the payload for handleGeneralTimeSheet
      const payload: {
        date: string;
        jobsiteId: string;
        workType: string;
        userId: string;
        costCode: string;
        startTime: string;
        clockInLat?: number | null;
        clockInLong?: number | null;
        type?: string;
        previousTimeSheetId?: number;
        endTime?: string;
        previoustimeSheetComments?: string;
        clockOutLat?: number | null;
        clockOutLong?: number | null;
        sessionId?: number | null;
      } = {
        date: new Date().toISOString(),
        jobsiteId: jobsite?.id || "",
        workType: role,
        userId: id?.toString() || "",
        costCode: cc?.code || "",
        startTime: new Date().toISOString(),
        clockInLat: coordinates ? coordinates.lat : null,
        clockInLong: coordinates ? coordinates.lng : null,
        sessionId,
      };

      if (type === "switchJobs") {
        let timeSheetId = savedTimeSheetData?.id;
        if (!timeSheetId) {
          await refetchTimesheet();
          const ts = savedTimeSheetData?.id;
          if (!ts) {
            console.error("No active timesheet found for job switch.");
            return;
          }
          timeSheetId = ts;
        }
        payload.type = "switchJobs";
        payload.previousTimeSheetId = timeSheetId;
        payload.endTime = new Date().toISOString();
        payload.previoustimeSheetComments =
          savedCommentData?.id?.toString() || "";
        // For clock out, get coordinates again
        const clockOutCoordinates = await getStoredCoordinates();
        payload.clockOutLat = clockOutCoordinates
          ? clockOutCoordinates.lat
          : null;
        payload.clockOutLong = clockOutCoordinates
          ? clockOutCoordinates.lng
          : null;
      }

      console.log("Submitting timesheet payload:", payload);
      const responseAction = await handleGeneralTimeSheet(payload);

      console.log("TimeSheet action response:", responseAction);

      // Add timesheet ID to session store after successful creation
      if (
        responseAction &&
        responseAction.createdTimeSheet &&
        responseAction.createdTimeSheet.id &&
        sessionId
      ) {
        useSessionStore
          .getState()
          .setTimesheetId(sessionId, responseAction.createdTimeSheet.id);
        console.log(
          "Timesheet ID set in session store:",
          responseAction.createdTimeSheet.id
        );
      }

      if (
        type === "switchJobs" &&
        responseAction &&
        responseAction.createdTimeSheet &&
        responseAction.createdTimeSheet.id
      ) {
        await sendNotification({
          topic: "timecard-submission",
          title: "Timecard Approval Needed",
          message: `#${responseAction.createdTimeSheet.id} has been submitted by ${responseAction.createdTimeSheet.User.firstName} ${responseAction.createdTimeSheet.User.lastName} for approval.`,
          link: `/admins/timesheets?id=${responseAction.createdTimeSheet.id}`,
          referenceId: responseAction.createdTimeSheet.id,
        });
        console.log("Notification sent for timesheet approval.");
      }

      // Start location tracking for clock in
      let trackingResult = { success: true };
      if (type !== "switchJobs" && sessionId) {
        console.log("Starting clock in tracking...");
        trackingResult = await startClockInTracking(id, sessionId);
        console.log("Clock in tracking result:", trackingResult);
      }

      // Update state and redirect
      setCommentData(null);
      localStorage.removeItem("savedCommentData");

      if (trackingResult?.success) {
        console.log("Redirecting to dashboard...");
        await Promise.all([
          setCurrentPageView("dashboard"),
          setWorkRole(role),
          setLaborType(clockInRoleTypes || ""),
          refetchTimesheet(),
        ]);
        setTimeout(() => router.push("/v1/dashboard"), 500); // 500ms delay
      } else {
        console.error("Clock in tracking failed, not redirecting.");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Holds className="h-full w-full relative">
      {loading && (
        <Holds className="h-full absolute justify-center items-center">
          <Spinner size={40} />
        </Holds>
      )}
      <Holds
        background={"white"}
        className={loading ? `h-full w-full opacity-[0.50]` : `h-full w-full `}
      >
        <Grids rows={"7"} gap={"5"} className="h-full w-full">
          <Holds className="row-start-1 row-end-2 h-full w-full">
            <TitleBoxes position={"row"} onClick={handlePreviousStep}>
              <Titles position={"right"} size={"md"}>
                {t("VerifyJobSite")}
              </Titles>
              <Images
                titleImg="/clockIn.svg"
                titleImgAlt="Verify"
                className="w-6 h-6"
              />
            </TitleBoxes>
          </Holds>
          <Holds className="row-start-2 row-end-8 h-full w-full">
            <Contents width={"section"}>
              <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                <Holds
                  background={"timeCardYellow"}
                  className="row-start-1 row-end-7 h-full border-[3px] rounded-[10px] border-black"
                >
                  <Contents width={"section"} className="h-full py-2">
                    <Holds className="flex flex-row justify-between pb-3">
                      <Texts size={"p7"} position={"left"}>
                        {date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </Texts>
                      <Texts size={"p7"} position={"right"}>
                        {date.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </Texts>
                    </Holds>

                    <Labels htmlFor="jobsiteId" size={"p3"} position={"left"}>
                      {t("LaborType")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="jobsiteId"
                      variant={"white"}
                      data={"General Labor"}
                      className="text-center"
                    />

                    <Labels htmlFor="jobsiteId" size={"p3"} position={"left"}>
                      {t("JobSite-label")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="jobsiteId"
                      variant={"white"}
                      data={jobsite?.label || ""}
                      className="text-center"
                    />
                    <Labels htmlFor="costcode" size={"p3"} position={"left"}>
                      {t("CostCode-label")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="costcode"
                      variant={"white"}
                      data={cc?.label || ""}
                      className="text-center"
                    />
                  </Contents>
                </Holds>

                <Holds className="row-start-7 row-end-8   ">
                  <Buttons
                    onClick={() => handleSubmit()}
                    background={"green"}
                    className=" w-full h-full py-2"
                    disabled={loading}
                  >
                    <Titles size={"md"}>{t("StartDay")}</Titles>
                  </Buttons>
                </Holds>
              </Grids>
            </Contents>
          </Holds>
        </Grids>
      </Holds>
    </Holds>
  );
}
