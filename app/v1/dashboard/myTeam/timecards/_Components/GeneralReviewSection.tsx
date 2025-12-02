"use client";

type TimeSheet = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  jobsiteId: string;
  workType: string;
  status: string;

  CostCode: {
    name: string;
  };
  Jobsite: {
    name: string;
  };
  TascoLogs: {
    id: string;
    shiftType: string;
    laborType: string;
    materialType: string | null;
    LoadQuantity: number;
    Equipment: {
      id: string;
      name: string;
    };
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
    }[];
  }[];
  TruckingLogs: {
    id: string;
    laborType: string;
    startingMileage: number;
    endingMileage: number | null;
    Truck: {
      id: string;
      name: string;
    };
    Trailer: {
      id: string;
      name: string;
    };
    Equipment: {
      id: string;
      name: string;
    };
    Materials: {
      id: string;
      name: string;
      quantity: number;
      loadType: string;
      unit: string;
      locationOfMaterial: string | null;
      materialWeight: number;
    }[];
    EquipmentHauled: {
      id: string;
      source: string;
      destination: string;
      Equipment: {
        name: string;
      };
    }[];
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
      milesAtFueling?: number;
    }[];
    StateMileages: {
      id: string;
      state: string;
      stateLineMileage: number;
    }[];
  }[];
  EmployeeEquipmentLogs: {
    id: string;
    startTime: string;
    endTime: string;
    Equipment: {
      id: string;
      name: string;
    };
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
    }[];
  }[];
};
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { Images } from "@/app/v1/components/(reusable)/images";
import { Texts } from "@/app/v1/components/(reusable)/texts";
import { Button } from "@/app/v1/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/app/v1/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/app/v1/components/ui/accordion";
import React, { useState } from "react";

import { format } from "date-fns/format";
import { apiRequest } from "@/app/lib/utils/api-Utils";

export default function GeneralReviewSection({
  currentTimeSheets,
  isScrolling, // Default to 'verticle' if not provided
  scrollSwipeHandlers,
  onEditTimesheet,
  onDeleteTimesheet,
}: {
  currentTimeSheets: TimeSheet[];
  isScrolling: boolean;
  scrollSwipeHandlers?: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  onEditTimesheet?: (timesheetId: string) => void;
  onDeleteTimesheet?: (timesheetId: string) => void;
}) {
  const t = useTranslations("TimeCardSwiper");

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    if (isNaN(diffMs) || diffMs < 0) return "-";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  };

  // Helper to get duration in minutes
  const getDurationMinutes = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 0;
    return Math.floor(diffMs / (1000 * 60));
  };

  return (
    <>
      <Accordion type="single" collapsible>
        {currentTimeSheets
          .slice()
          .sort((a, b) => {
            const startTimeA = new Date(a.startTime).getTime();
            const startTimeB = new Date(b.startTime).getTime();
            return startTimeA - startTimeB;
          })
          .map((timesheet, index) => (
            <AccordionItem
              value={String(timesheet.id)}
              key={timesheet.id}
              className="bg-white rounded-lg mb-2"
            >
              <AccordionTrigger className="p-2 focus:outline-none hover:no-underline focus:underline-none focus:border-none ">
                <p className="text-xs ">{`Id: #${timesheet.id}`}</p>
                <p className="text-xs">
                  {`${t("Duration")}: ${getDuration(
                    timesheet.startTime,
                    timesheet.endTime
                  )}`}
                </p>
              </AccordionTrigger>

              <AccordionContent>
                <Holds className="p-2  bg-white flex flex-col items-start relative border-t border-gray-200">
                  <Images
                    titleImg={
                      timesheet.workType === "TRUCK_DRIVER"
                        ? "/trucking.svg"
                        : timesheet.workType === "MECHANIC"
                        ? "/mechanic.svg"
                        : timesheet.workType === "TASCO"
                        ? "/tasco.svg"
                        : "/equipment.svg"
                    }
                    titleImgAlt="WorkType Icon"
                    className="w-7 h-7 mb-1 absolute top-1 right-1"
                  />
                  <Texts size="sm" className="text-xs">
                    <strong>{t("Submitted")}:</strong>{" "}
                    {timesheet.startTime
                      ? format(new Date(timesheet.date), "MM/dd/yyyy")
                      : "-"}
                  </Texts>
                  <Texts size="sm" className="text-xs">
                    <strong>{t("Start")}:</strong>{" "}
                    {timesheet.startTime
                      ? new Date(timesheet.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "-"}
                  </Texts>
                  <Texts size="sm" className="text-xs">
                    <strong>{t("End")}:</strong>{" "}
                    {timesheet.endTime
                      ? new Date(timesheet.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "-"}
                  </Texts>
                  <Texts
                    size="sm"
                    className="text-xs text-left truncate max-w-[200px] "
                  >
                    <strong>{t("Jobsite")}:</strong> {timesheet.Jobsite.name}
                  </Texts>
                  <Texts size="sm" className="text-xs truncate max-w-[200px]">
                    <strong>{t("Costcode")}:</strong>{" "}
                    {timesheet.CostCode.name.split(" ")[0]}
                  </Texts>
                  <div className="w-full flex flex-row gap-2  mt-2 justify-end items-end">
                    {getDurationMinutes(
                      timesheet.startTime,
                      timesheet.endTime
                    ) < 5 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            size={"sm"}
                            className="border border-red-200 hover:bg-red-100 "
                            aria-label="Delete timesheet"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Timesheet?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete timesheet #
                              {timesheet.id}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() =>
                                onDeleteTimesheet?.(String(timesheet.id))
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {onEditTimesheet && (
                      <Button
                        size={"sm"}
                        onClick={() => onEditTimesheet(String(timesheet.id))}
                        className=" px-6 bg-app-orange hover:bg-app-orange/80 text-black font-medium"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </Holds>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </>
  );
}
