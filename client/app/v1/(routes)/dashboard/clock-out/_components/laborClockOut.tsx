"use client";
import { sendNotification } from "@/app/lib/actions/generatorActions";
// import { updateTimeSheet } from "@/app/lib/actions/timeSheetActions";
import { useUserStore } from "@/app/lib/store/userStore";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import {
  stopClockOutTracking,
  getStoredCoordinates,
} from "@/app/lib/client/locationTracking";
import { useCookieStore } from "@/app/lib/store/cookieStore";
import Spinner from "@/app/v1/components/(animations)/spinner";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Buttons } from "@/app/v1/components/(reusable)/buttons";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { Images } from "@/app/v1/components/(reusable)/images";
import { Inputs } from "@/app/v1/components/(reusable)/inputs";
import { Labels } from "@/app/v1/components/(reusable)/labels";
import { Texts } from "@/app/v1/components/(reusable)/texts";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { Capacitor } from "@capacitor/core";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { enqueue } from "@/app/lib/queue/jobQueue";

export type TimeSheet = {
  submitDate: string;
  date: Date | string;
  id: string;
  userId: string;
  jobsiteId: string;
  costcode: string;
  startTime: string;
  endTime: string | null;
  workType: string;
  Jobsite: {
    name: string;
  };
  TascoLogs: {
    laborType: string;
    shiftType: string;
  }[];
};

export const LaborClockOut = ({
  prevStep,
  commentsValue,
  pendingTimeSheets,
  wasInjured,
  timeSheetId,
  refetchTimesheet,
  coordinates,
}: {
  prevStep: () => void;
  commentsValue: string;
  pendingTimeSheets: TimeSheet | undefined;
  wasInjured: boolean;
  timeSheetId: number | undefined;
  refetchTimesheet: () => Promise<void>;
  coordinates?: { lat: number; lng: number } | null;
}) => {
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  const t = useTranslations("ClockOut");
  const [date] = useState(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  // No need to prefetch here, now passed from page
  const router = useRouter();
  const { user } = useUserStore();
  const { reset } = useCookieStore();
  // Prefetch coordinates as soon as possible

  if (!user) return null;
  const fullName = user?.firstName + user?.lastName;
  async function handleSubmitTimeSheet() {
    console.log("[ClockOut] Starting clock-out");
    setLoading(true);

    if (!timeSheetId || isNaN(Number(timeSheetId))) {
      alert("Timesheet ID is missing or invalid.");
      return;
    }

    try {
      // Always attempt a fresh coordinate with a 4-second timeout
      let coords = coordinates;
      let locationTimestamp = Date.now();

      try {
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("Geolocation timeout")), 4000)
        );
        const freshCoords = await Promise.race([
          getStoredCoordinates(),
          timeoutPromise,
        ]);
        if (freshCoords) {
          coords = freshCoords;
          locationTimestamp = Date.now();
          console.log("[ClockOut] Fresh coordinates obtained");
        }
      } catch (err) {
        console.warn(
          "[ClockOut] Fresh coordinate attempt failed, using prefetched:",
          err
        );
        // Fall back to prefetched coordinates (already set above)
      }

      const body = {
        userId: user?.id,
        endTime: new Date().toISOString(),
        timeSheetComments: commentsValue,
        wasInjured,
        clockOutLat: coords?.lat ?? null,
        clockOutLng: coords?.lng ?? null,
        locationTimestamp,
      };

      reset(); // Clear cookie store immediately
      // 🟢 INSTANT — No waiting for API or GPS
      router.push("/v1");

      // 🟡 Queue heavy work
      enqueue(async () => {
        console.log("[Queue] Clock-out API");
        await apiRequest(
          `/api/v1/timesheet/${timeSheetId}/clock-out`,
          "PUT",
          body
        );
      });

      enqueue(async () => {
        console.log("[Queue] Stop ClockOut tracking");
        await stopClockOutTracking();
      });

      enqueue(async () => {
        console.log("[Queue] Send notification");
        await sendNotification({
          topic: "timecard-submission",
          title: "Timecard Approval Needed",
          message: `#${timeSheetId} has been submitted by ${fullName}.`,
          link: `/admins/timesheets?id=${timeSheetId}`,
          referenceId: timeSheetId,
        });
      });

      enqueue(async () => {
        console.log("[Queue] Delete cookies");
        const cookiesToDelete: string[] = [
          "currentPageView",
          "costCode",
          "equipment",
          "jobSite",
          "startingMileage",
          "timeSheetId",
          "truckId",
          "adminAccess",
          "laborType",
          "workRole",
        ];

        const query = cookiesToDelete
          .map((c) => `name=${encodeURIComponent(c)}`)
          .join("&");

        await apiRequest(`/api/cookies/list?${query}`, "DELETE");
        localStorage.removeItem("timesheetId");
      });

      enqueue(async () => {
        console.log("[Queue] Refetch timesheet");
        await refetchTimesheet();
      });

      console.log("[ClockOut] All tasks queued");
    } catch (err) {
      console.error("Clock-out error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Bases>
      <Contents>
        <Holds
          className={ios ? "pt-12 h-full" : android ? "pt-4 h-full" : "h-full"}
        >
          {loading && (
            <Holds className="h-full absolute justify-center items-center">
              <Spinner size={40} />
            </Holds>
          )}
          <Holds
            background={"white"}
            className={
              loading
                ? `h-full w-full flex flex-col items-center opacity-[0.50]`
                : `h-full w-full flex flex-col items-center `
            }
          >
            <TitleBoxes onClick={prevStep} className="h-24">
              <Holds className="h-full justify-end">
                <Holds position={"row"} className="justify-center gap-3">
                  <Titles size={"lg"} position={"right"}>
                    {t("ClockOut")}
                  </Titles>

                  <Images
                    titleImg="/clockOut.svg"
                    titleImgAlt="Verify"
                    className="max-w-6 h-auto"
                  />
                </Holds>
              </Holds>
            </TitleBoxes>

            <div className="w-[90%] grow flex flex-col pb-5">
              <Holds
                background={"timeCardYellow"}
                className="h-full w-full rounded-[10px] border-[3px] border-black mt-8"
              >
                <Holds className="h-full w-full px-3 py-2">
                  <Holds position={"row"} className="justify-between">
                    <Texts size={"p7"} className="font-bold">
                      {date.toLocaleDateString()}
                    </Texts>
                    <Texts size={"p7"}>
                      {date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: false,
                      })}
                    </Texts>
                  </Holds>
                  <Holds className="h-full w-full py-5">
                    <Labels htmlFor="laborType" size={"p5"} position={"left"}>
                      {t("LaborType")}
                    </Labels>
                    {pendingTimeSheets?.workType === "TASCO" ? (
                      <Inputs
                        state="disabled"
                        name="laborType"
                        className="text-center"
                        variant={"white"}
                        data={
                          pendingTimeSheets?.TascoLogs[0].laborType ===
                          "tascoAbcdLabor"
                            ? t("TascoLabor")
                            : t("TascoOperator")
                        }
                      />
                    ) : (
                      <Inputs
                        state="disabled"
                        name="laborType"
                        className="text-center"
                        variant={"white"}
                        data={
                          pendingTimeSheets?.workType === "LABOR"
                            ? t("GeneralLabor")
                            : pendingTimeSheets?.workType === "TRUCK_DRIVER"
                            ? t("TruckDriver")
                            : pendingTimeSheets?.workType === "MECHANIC"
                            ? t("Mechanic")
                            : ""
                        }
                      />
                    )}
                    {pendingTimeSheets?.workType === "TASCO" && (
                      <>
                        <Labels
                          htmlFor="laborType"
                          size={"p5"}
                          position={"left"}
                        >
                          {t("ShiftType")}
                        </Labels>
                        <Inputs
                          state="disabled"
                          name="laborType"
                          className="text-center"
                          variant={"white"}
                          data={pendingTimeSheets?.TascoLogs[0].shiftType || ""}
                        />
                      </>
                    )}
                    <Labels htmlFor="jobsiteId" size={"p5"} position={"left"}>
                      {t("JobSite")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="jobsiteId"
                      className="text-center"
                      variant={"white"}
                      data={pendingTimeSheets?.Jobsite.name || ""}
                    />
                    <Labels htmlFor="costcode" size={"p6"} position={"left"}>
                      {t("CostCode")}
                    </Labels>
                    <Inputs
                      state="disabled"
                      name="costcode"
                      variant={"white"}
                      className="text-center"
                      data={pendingTimeSheets?.costcode || ""}
                    />
                  </Holds>
                </Holds>
              </Holds>
            </div>

            <div className="w-[90%] flex justify-end  pb-4 h-[70px] ">
              <Buttons
                background={"red"}
                onClick={handleSubmitTimeSheet}
                className="h-[60px] w-full"
              >
                <Titles size={"md"}>{t("EndDay")}</Titles>
              </Buttons>
            </div>
          </Holds>
        </Holds>
      </Contents>
    </Bases>
  );
};
