"use client";
import { useCookieStore } from "@/app/lib/store/cookieStore";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";

import {
  createNewSession,
  handleTascoTimeSheet,
} from "@/app/lib/actions/timeSheetActions"; // Updated import

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

import { useUserStore } from "@/app/lib/store/userStore";
import { usePermissions } from "@/app/lib/context/permissionContext";
import { useCommentData } from "@/app/lib/context/CommentContext";
import { useTimeSheetData } from "@/app/lib/context/TimeSheetIdContext";
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
  laborType: string;
  materialType: string;
  shiftType: string;
  clockInRoleTypes: string | undefined;
  handlePreviousStep: () => void;
  returnPathUsed: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  jobsite: Option | null;
  cc: Option | null;
  equipment: Option | null;
};

export default function TascoVerificationStep({
  type,
  handleNextStep,
  role,
  laborType,
  materialType,
  shiftType,
  comments,
  clockInRoleTypes,
  handlePreviousStep,
  returnPathUsed,
  setStep,
  jobsite,
  cc,
  equipment,
}: VerifyProcessProps) {
  const t = useTranslations("Clock");
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useUserStore();
  const setCurrentPageView = useCookieStore(
    (state) => state.setCurrentPageView
  );
  const setWorkRole = useCookieStore((state) => state.setWorkRole);
  const setLaborType = useCookieStore((state) => state.setLaborType);
  const { savedCommentData, setCommentData } = useCommentData();
  const router = useRouter();
  const { savedTimeSheetData, refetchTimesheet } = useTimeSheetData();
  const { permissionStatus } = usePermissions();
  const { currentSessionId, setCurrentSession, setPreWarmActive } =
    useSessionStore();

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

      // Disable pre-warm tracking
      setPreWarmActive(false);
      // Get current coordinates
      const coordinates = await getStoredCoordinates();
      // Simplified session logic
      let sessionId = currentSessionId;
      if (type !== "switchJobs") {
        if (currentSessionId === null) {
          // No session exists, create a new one
          sessionId = await createNewSession(id);
          setCurrentSession(sessionId);
        } else {
          // Session exists, check if it has an endTime
          const currentSession = useSessionStore
            .getState()
            .getSession(currentSessionId);
          if (!currentSession || currentSession.endTime) {
            // No session or session ended, create a new one
            sessionId = await createNewSession(id);
            setCurrentSession(sessionId);
          } else {
            // Session is still active, reuse it
            sessionId = currentSessionId;
          }
        }
      } else {
        // For switchJobs, always use the current session
        sessionId = currentSessionId;
      }

      // Build the payload for handleTascoTimeSheet
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
        shiftType?: string;
        laborType?: string;
        materialType?: string;
        equipmentId?: string;
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

      if (clockInRoleTypes === "tascoAbcdEquipment") {
        payload.materialType = materialType;
        payload.shiftType = "ABCD Shift";
        payload.laborType = "Operator";
      }

      if (clockInRoleTypes === "tascoAbcdLabor") {
        payload.materialType = materialType;
        payload.shiftType = "ABCD Shift";
        payload.laborType = "Manual Labor";
      }
      if (clockInRoleTypes === "tascoEEquipment") {
        payload.materialType = materialType;
        payload.shiftType = "E shift";
        payload.laborType = "EShift";
      }
      if (clockInRoleTypes === "tascoFEquipment") {
        payload.materialType = materialType;
        payload.shiftType = "F shift";
        payload.laborType = "FShift";
      }
      payload.workType = role;
      payload.equipmentId = equipment?.id || "";

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

      // Start location tracking FIRST for clock in (before submitting timesheet)
      let trackingResult = { success: false };
      if (type !== "switchJobs" && sessionId) {
        // Check if tracking is already active to prevent duplicate tracking
        if (!isTrackingActive()) {
          trackingResult = await startClockInTracking(id, sessionId);
        } else {
          console.warn("Location tracking already active, skipping start");
          trackingResult = { success: true };
        }
      }

      // Only proceed with timesheet submission if tracking succeeded or is not required
      if (!trackingResult?.success && type !== "switchJobs") {
        throw new Error("Failed to start location tracking. Cannot clock in.");
      }

      const responseAction = await handleTascoTimeSheet(payload);

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

      // Update state and redirect
      setCommentData(null);
      localStorage.removeItem("savedCommentData");

      setCurrentPageView("dashboard");
      setWorkRole(role);
      setLaborType(
        clockInRoleTypes === "tascoEEquipment"
          ? "EShift"
          : clockInRoleTypes === "tascoFEquipment"
          ? "FShift"
          : clockInRoleTypes || ""
      );
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
        className={loading ? `h-full w-full opacity-[0.50]` : `h-full w-full`}
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
                className="w-6 h-6 "
              />
            </TitleBoxes>
          </Holds>
          <Holds className="row-start-2 row-end-8 h-full w-full">
            <Contents width={"section"}>
              <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
                <Holds
                  background={"timeCardYellow"}
                  className="row-start-1 row-end-7 w-full h-full rounded-[10px] border-[3px] border-black pt-1"
                >
                  <Contents width={"section"} className="h-full ">
                    <div className="h-full overflow-y-auto no-scrollbar">
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
                      <Holds className="pb-2">
                        <Labels
                          htmlFor="clockInRoleTypes"
                          size={"p3"}
                          position={"left"}
                        >
                          {t("LaborType")}
                        </Labels>
                        <Inputs
                          state="disabled"
                          name="jobsiteId"
                          variant={"white"}
                          data={
                            clockInRoleTypes === "tascoAbcdLabor"
                              ? "TASCO ABCD Labor"
                              : clockInRoleTypes === "tascoAbcdEquipment"
                              ? "TASCO ABCD EQ Operator"
                              : clockInRoleTypes === "tascoEEquipment"
                              ? "TASCO E EQ Operator"
                              : clockInRoleTypes === "tascoFEquipment"
                              ? "TASCO F EQ Operator"
                              : clockInRoleTypes
                          }
                          className="text-center text-base"
                        />
                      </Holds>
                      <Holds className="pb-2">
                        <Labels
                          htmlFor="jobsiteId"
                          size={"p3"}
                          position={"left"}
                        >
                          {t("JobSite-label")}
                        </Labels>
                        <Inputs
                          state="disabled"
                          name="jobsiteId"
                          variant={"white"}
                          data={jobsite?.label || ""}
                          className="text-center text-base"
                        />
                      </Holds>
                      <Holds className="pb-2">
                        <Labels
                          htmlFor="costcode"
                          size={"p3"}
                          position={"left"}
                        >
                          {t("CostCode-label")}
                        </Labels>
                        <Inputs
                          state="disabled"
                          name="costcode"
                          variant={"white"}
                          data={cc?.label || ""}
                          className="text-center text-base"
                        />
                      </Holds>

                      <Holds className="pb-2">
                        <Labels
                          htmlFor="materialType-label"
                          size={"p3"}
                          position={"left"}
                        >
                          {t("MaterialType")}
                        </Labels>
                        <Inputs
                          state="disabled"
                          name="materialType-label"
                          variant={"white"}
                          data={materialType || ""}
                          className="text-center text-base"
                        />
                      </Holds>
                      {equipment?.label && (
                        <Holds className="pb-2">
                          <Labels
                            htmlFor="Equipment-label"
                            size={"p3"}
                            position={"left"}
                          >
                            {t("Equipment")}
                          </Labels>
                          <Inputs
                            state="disabled"
                            name="Equipment-label"
                            variant={"white"}
                            data={equipment?.label || ""}
                            className="text-center text-base"
                          />
                        </Holds>
                      )}
                    </div>
                  </Contents>
                </Holds>

                <Holds className="row-start-7 row-end-8 ">
                  <Buttons
                    onClick={() => handleSubmit()}
                    background={"green"}
                    className=" py-2"
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
