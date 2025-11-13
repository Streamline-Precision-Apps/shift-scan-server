"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Buttons } from "@/app/v1/components/(reusable)/buttons";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { Images } from "@/app/v1/components/(reusable)/images";
import { Inputs } from "@/app/v1/components/(reusable)/inputs";
import { Labels } from "@/app/v1/components/(reusable)/labels";
import { Texts } from "@/app/v1/components/(reusable)/texts";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import Spinner from "@/app/v1/components/(animations)/spinner";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";

import { usePermissions } from "@/app/lib/context/permissionContext";
import Capitalize from "@/app/lib/utils/capitalizeFirst";
import { useCookieStore } from "@/app/lib/store/cookieStore";
import { useUserStore } from "@/app/lib/store/userStore";
import { useTimeSheetData } from "@/app/lib/context/TimeSheetIdContext";
import { useSavedCostCode } from "@/app/lib/context/CostCodeContext";
import { useCommentData } from "@/app/lib/context/CommentContext";
import {
  createNewSession,
  handleMechanicTimeSheet,
} from "@/app/lib/actions/timeSheetActions";
import { sendNotification } from "@/app/lib/actions/generatorActions";
import {
  startClockInTracking,
  getStoredCoordinates,
} from "@/app/lib/client/locationTracking";
import { useSessionStore } from "@/app/lib/store/sessionStore";
import { set } from "lodash";

type Option = {
  id: string;
  label: string;
  code: string;
};
type VerifyProcessProps = {
  handleNextStep?: () => void;
  type: string;
  role: string;
  option?: string;
  comments?: string;
  clockInRoleTypes: string | undefined;
  handlePrevStep: () => void;
  returnPathUsed: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  jobsite: Option;
};

export default function MechanicVerificationStep({
  handlePrevStep,
  type,
  handleNextStep,
  role,
  clockInRoleTypes,
  returnPathUsed,
  setStep,
  jobsite,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const router = useRouter();
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUserStore();
  const setCurrentPageView = useCookieStore(
    (state) => state.setCurrentPageView
  );
  const setWorkRole = useCookieStore((state) => state.setWorkRole);
  const setLaborType = useCookieStore((state) => state.setLaborType);
  const { savedCommentData, setCommentData } = useCommentData();
  const { setCostCode } = useSavedCostCode();
  const costCode = "#00.50 Mechanics";
  const { savedTimeSheetData, refetchTimesheet } = useTimeSheetData();
  const { permissionStatus } = usePermissions();
  const { currentSessionId, setCurrentSession } = useSessionStore();

  useEffect(() => {
    setCostCode(costCode);
  }, [costCode]);

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
      const coordinates = await getStoredCoordinates();

      // Check for session data
      let sessionId = null;
      if (currentSessionId === null) {
        // No session exists, create a new one
        sessionId = await createNewSession(id);
        setCurrentSession(sessionId);
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
            useSessionStore.getState().clearSessions();
            sessionId = await createNewSession(id);
            setCurrentSession(sessionId);
          } else {
            // Less than 4 hours, create a new session but keep old one in history
            sessionId = await createNewSession(id);
            setCurrentSession(sessionId);
          }
        } else {
          // Session is still active, reuse it
          sessionId = currentSessionId;
        }
      }

      // Build the payload for handleMechanicTimeSheet
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
        sessionId?: number | null;
        clockOutLat?: number | null;
        clockOutLong?: number | null;
      } = {
        date: new Date().toISOString(),
        jobsiteId: jobsite?.id || "",
        workType: role,
        userId: id?.toString() || "",
        costCode: costCode || "",
        startTime: new Date().toISOString(),
        sessionId,
        clockInLat: coordinates ? coordinates.lat : null,
        clockInLong: coordinates ? coordinates.lng : null,
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

      const responseAction = await handleMechanicTimeSheet(payload);

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
      }

      // Send notification to admins for approval if switching jobs
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
      }

      // Start location tracking for clock in
      let trackingResult = { success: true };
      if (type !== "switchJobs" && sessionId) {
        trackingResult = await startClockInTracking(id, sessionId);
      }

      // Update state and redirect
      setCommentData(null);
      localStorage.removeItem("savedCommentData");

      if (trackingResult?.success) {
        setCurrentPageView("dashboard");
        setWorkRole(role);
        setLaborType(clockInRoleTypes || "");
        await refetchTimesheet();
        router.push("/v1/dashboard");
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
    <>
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
            <TitleBoxes position={"row"} gap={3} onClick={handlePrevStep}>
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
                  className="row-start-1 row-end-7 border-[3px] rounded-[10px] border-black h-full pt-1"
                >
                  <Contents width={"section"} className="h-full">
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
                    <Labels size={"p3"} position={"left"}>
                      {t("LaborType")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="jobsiteId"
                      variant={"white"}
                      data={Capitalize(role)}
                      className="text-center"
                    />

                    <Labels size={"p3"} position={"left"}>
                      {t("JobSite-label")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="jobsiteId"
                      variant={"white"}
                      data={jobsite?.label || ""}
                      className="text-center"
                    />
                    <Labels size={"p3"} position={"left"}>
                      {t("CostCode-label")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="costcode"
                      variant={"white"}
                      data={costCode}
                      className="text-center"
                    />
                  </Contents>
                </Holds>

                <Holds className="row-start-7 row-end-8">
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
    </>
  );
}
