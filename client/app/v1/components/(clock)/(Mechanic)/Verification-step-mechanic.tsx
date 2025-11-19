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
  isTrackingActive,
} from "@/app/lib/client/locationTracking";
import { useSessionStore } from "@/app/lib/store/sessionStore";

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
      if (!id) throw new Error("User ID does not exist");

      // Ensure location permissions
      if (!permissionStatus.location) {
        console.error("Location permissions are required to clock in.");
        return;
      }

      // Get current coordinates (fast snapshot)
      const coordinates = await getStoredCoordinates();

      // Determine session ID
      let sessionId = currentSessionId;
      if (!sessionId) {
        sessionId = await createNewSession(id);
        setCurrentSession(sessionId);
      } else {
        const currentSession = useSessionStore.getState().getSession(sessionId);
        if (currentSession?.endTime) {
          const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
          const endTime = new Date(currentSession.endTime).getTime();
          if (Date.now() - endTime > FOUR_HOURS_MS) {
            useSessionStore.getState().clearSessions();
            sessionId = await createNewSession(id);
            setCurrentSession(sessionId);
          } else {
            sessionId = await createNewSession(id);
            setCurrentSession(sessionId);
          }
        }
      }

      // Build payload
      const payload: any = {
        date: new Date().toISOString(),
        jobsiteId: jobsite?.id || "",
        workType: role,
        userId: id.toString(),
        costCode: costCode,
        startTime: new Date().toISOString(),
        sessionId,
        clockInLat: coordinates?.lat ?? null,
        clockInLong: coordinates?.lng ?? null,
      };

      // Handle job switch
      if (type === "switchJobs") {
        let timeSheetId = savedTimeSheetData?.id;
        if (!timeSheetId) {
          await refetchTimesheet();
          timeSheetId = savedTimeSheetData?.id;
          if (!timeSheetId) {
            console.error("No active timesheet found for job switch.");
            return;
          }
        }
        payload.type = "switchJobs";
        payload.previousTimeSheetId = timeSheetId;
        payload.endTime = new Date().toISOString();
        payload.previoustimeSheetComments =
          savedCommentData?.id?.toString() ?? "";

        const clockOutCoordinates = await getStoredCoordinates();
        payload.clockOutLat = clockOutCoordinates?.lat ?? null;
        payload.clockOutLong = clockOutCoordinates?.lng ?? null;
      }

      // Start location tracking for clock in (if not switching jobs)
      if (type !== "switchJobs" && sessionId && !isTrackingActive()) {
        const trackingResult = await startClockInTracking(id, sessionId);
        if (!trackingResult.success) {
          throw new Error(
            "Failed to start location tracking. Cannot clock in."
          );
        }
      }

      // Submit timesheet
      const responseAction = await handleMechanicTimeSheet(payload);

      // Save timesheet ID in session store
      if (responseAction?.createdTimeSheet?.id && sessionId) {
        useSessionStore
          .getState()
          .setTimesheetId(sessionId, responseAction.createdTimeSheet.id);
      }

      // Send notification if switching jobs
      if (type === "switchJobs" && responseAction?.createdTimeSheet?.id) {
        await sendNotification({
          topic: "timecard-submission",
          title: "Timecard Approval Needed",
          message: `#${responseAction.createdTimeSheet.id} has been submitted by ${responseAction.createdTimeSheet.User.firstName} ${responseAction.createdTimeSheet.User.lastName} for approval.`,
          link: `/admins/timesheets?id=${responseAction.createdTimeSheet.id}`,
          referenceId: responseAction.createdTimeSheet.id,
        });
      }

      // Cleanup and redirect
      setCommentData(null);
      localStorage.removeItem("savedCommentData");
      setCurrentPageView("dashboard");
      setWorkRole(role);
      setLaborType(clockInRoleTypes || "");

      await refetchTimesheet();
      router.push("/v1/dashboard");
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
