"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { handleTruckTimeSheet } from "@/app/lib/actions/timeSheetActions";

import {
  setCurrentPageView,
  setLaborType,
  setWorkRole,
} from "@/app/lib/actions/cookieActions";
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

type Options = {
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
  laborType?: string;
  truck: Options | null;
  // trailer?: Options | null;
  startingMileage?: number;
  clockInRoleTypes: string | undefined;
  handlePrevStep: () => void;
  equipment: Options | null;
  jobsite: Options | null;
  cc: Options | null;
};

export default function TruckVerificationStep({
  type,
  handleNextStep,
  comments,
  role,
  truck,
  // trailer,
  startingMileage,
  laborType,
  clockInRoleTypes,
  handlePrevStep,
  equipment,
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
        startingMileage: number;
        laborType: string;
        truck: string;
        equipmentId?: string;
      } = {
        date: new Date().toISOString(),
        jobsiteId: jobsite?.id || "",
        workType: role,
        userId: id?.toString() || "",
        costCode: cc?.code || "",
        startTime: new Date().toISOString(),
        clockInLat: null,
        clockInLong: null,
        startingMileage: startingMileage || 0,
        laborType: clockInRoleTypes || "",
        truck: truck?.id || "",
        equipmentId: equipment?.id || "",

        // Uncomment and set these if you have coordinates
        // clockInLat: getStoredCoordinatesResult?.latitude ?? null,
        // clockInLong: getStoredCoordinatesResult?.longitude ?? null,
      };

      // If switching jobs, include the previous timesheet ID
      if (type === "switchJobs") {
        // const timeSheetId = await fetchRecentTimeSheetId();
        let timeSheetId = savedTimeSheetData?.id;
        if (!timeSheetId) {
          await refetchTimesheet();
          const ts = savedTimeSheetData?.id;
          if (!ts) {
            console.error("No active timesheet found for job switch.");
          }
          return (timeSheetId = ts);
        }

        payload.type = "switchJobs";
        payload.previousTimeSheetId = timeSheetId;
        payload.endTime = new Date().toISOString();
        payload.previoustimeSheetComments =
          savedCommentData?.id?.toString() || "";
        // Uncomment and set these if you have coordinates
        // payload.clockOutLat = getStoredCoordinatesResult?.latitude ?? null;
        // payload.clockOutLong = getStoredCoordinatesResult?.longitude ?? null;
      }

      // Use the new transaction-based function
      const responseAction = await handleTruckTimeSheet(payload);
      if (
        type === "switchJobs" &&
        responseAction &&
        responseAction.createdTimeSheet &&
        responseAction.createdTimeSheet.id
      ) {
        await sendNotification({
          topic: "timecard-submission",
          title: "Timecard Approval Needed",
          message: `#${responseAction.createdTimeCard.id} has been submitted by ${responseAction.createdTimeCard.User.firstName} ${responseAction.createdTimeCard.User.lastName} for approval.`,
          link: `/admins/timesheets?id=${responseAction.createdTimeCard.id}`,
          referenceId: responseAction.createdTimeCard.id,
        });
      }

      setCommentData(null);
      localStorage.removeItem("savedCommentData");

      await Promise.all([
        setCurrentPageView("dashboard"),
        setWorkRole(role),
        setLaborType(clockInRoleTypes || ""),
        refetchTimesheet(),
      ]).then(() => router.push("/v1/dashboard"));
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Holds className="h-full w-full relative">
        {loading && (
          <Holds className="h-full absolute justify-center items-center">
            <Spinner size={40} />
          </Holds>
        )}
        <Holds
          background={"white"}
          className={
            loading ? `h-full w-full opacity-[0.50]` : `h-full w-full `
          }
        >
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="row-start-1 row-end-2 h-full w-full">
              <TitleBoxes position={"row"} onClick={handlePrevStep}>
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
                    className="row-start-1 row-end-7 w-full h-full rounded-[10px] border-[3px] border-black"
                  >
                    <Contents width={"section"} className="h-full py-2">
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
                        <Holds
                          className={
                            clockInRoleTypes === "truckDriver"
                              ? "row-span-1 col-span-1"
                              : "row-span-1 col-span-2"
                          }
                        >
                          <Labels
                            htmlFor="clockInRole"
                            size={"p3"}
                            position={"left"}
                          >
                            {t("LaborType")}
                          </Labels>
                          <Inputs
                            state="disabled"
                            name="clockInRole"
                            variant={"white"}
                            data={
                              clockInRoleTypes === "truckDriver"
                                ? t("TruckDriver")
                                : clockInRoleTypes === "truckEquipmentOperator"
                                ? t("TruckEquipmentOperator")
                                : t("TruckLabor")
                            }
                            className={"pl-2 text-base text-center"}
                          />
                        </Holds>
                        <Holds className={"row-span-1 col-span-2"}>
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
                            className={"pl-2 text-base text-center"}
                          />
                        </Holds>
                        <Holds className={"row-span-1 col-span-2"}>
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
                            className={"pl-2 text-base text-center"}
                          />
                        </Holds>
                        {clockInRoleTypes === "truckDriver" && (
                          <>
                            <Holds className={"row-span-1 col-span-2"}>
                              <Labels
                                htmlFor="truckId"
                                size={"p3"}
                                position={"left"}
                              >
                                {t("Truck-label")}
                              </Labels>
                              <Inputs
                                state="disabled"
                                name="truckId"
                                variant={"white"}
                                data={truck?.label || ""}
                                className={"pl-2 text-base text-center"}
                              />
                            </Holds>
                            {/* <Holds className={"row-span-1 col-span-2"}>
                            <Labels
                              htmlFor="trailerId"
                              size={"p3"}
                              position={"left"}
                            >
                              {t("Trailer-label", { default: "Trailer" })}
                            </Labels>
                            <Inputs
                              state="disabled"
                              name="trailerId"
                              variant={"white"}
                              data={
                                trailer?.label ||
                                t("NoTrailerOption", { default: "No Trailer" })
                              }
                              className={"pl-2 text-base text-center"}
                            />
                          </Holds> */}
                          </>
                        )}
                        {clockInRoleTypes === "truckEquipmentOperator" && (
                          <Holds className={"row-span-1 col-span-2"}>
                            <Labels
                              htmlFor="SelectedEquipment"
                              size={"p3"}
                              position={"left"}
                            >
                              {t("SelectedEquipment")}
                            </Labels>
                            <Inputs
                              state="disabled"
                              name="SelectedEquipment"
                              variant={"white"}
                              data={equipment?.label || ""}
                              className={"pl-2 text-base text-center"}
                            />
                          </Holds>
                        )}
                      </div>
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
      </Holds>
    </>
  );
}
