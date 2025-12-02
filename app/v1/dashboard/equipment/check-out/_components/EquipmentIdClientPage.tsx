"use client";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { differenceInSeconds, parseISO } from "date-fns";
import {
  deleteEmployeeEquipmentLog,
  deleteEquipmentRefuelLog,
  updateRefuelLog,
} from "@/app/lib/actions/truckingActions";
import Spinner from "@/app/v1/components/(animations)/spinner";
import UsageData from "./UsageData";
import { Buttons } from "@/app/v1/components/(reusable)/buttons";
import { Titles } from "@/app/v1/components/(reusable)/titles";

import {
  UnifiedEquipmentState,
  EmployeeEquipmentLogData,
  EquipmentLog,
  RefuelLogData,
  Refueled,
  EquipmentState,
} from "../types";

import { useNotification } from "@/app/lib/context/NotificationContext";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/v1/components/ui/alert-dialog";
import { Button } from "@/app/v1/components/ui/button";

export type FormStatus = "DRAFT" | "PENDING" | "APPROVED" | "DENIED";
// Helper function to transform API response to form state
function transformApiToFormState(
  apiData: EmployeeEquipmentLogData
): EquipmentLog {
  return {
    id: apiData.id,
    equipmentId: apiData.equipmentId,
    startTime: apiData.startTime || "",
    endTime: apiData.endTime || "",
    comment: apiData.comment || "",
    isFinished: apiData.isFinished,
    equipment: {
      name: apiData.Equipment.name,
      status: apiData.Equipment.state,
    },
    maintenanceId: apiData.MaintenanceId
      ? {
          id: apiData.MaintenanceId.id,
          equipmentIssue: apiData.MaintenanceId.equipmentIssue,
          additionalInfo: apiData.MaintenanceId.additionalInfo,
        }
      : null,
    refuelLogs: apiData.RefuelLog
      ? {
          id: apiData.RefuelLog.id,
          gallonsRefueled: apiData.RefuelLog.gallonsRefueled,
        }
      : null,

    fullyOperational: !apiData.MaintenanceId && apiData.isFinished,
  };
}

// Initial state factory
function createInitialState(): UnifiedEquipmentState {
  return {
    isLoading: true,
    hasChanged: false,
    formState: {
      id: "",
      equipmentId: "",
      startTime: "",
      endTime: "",
      comment: "",
      isFinished: false,
      equipment: {
        name: "",
        status: "OPERATIONAL" as EquipmentState, // Default to OPERATIONAL
      },
      maintenanceId: null,
      refuelLogs: null,
      fullyOperational: true,
    },
    markedForRefuel: false,
    error: null,
  };
}

export default function CombinedForm({ id }: { id: string }) {
  const router = useRouter();

  const { setNotification } = useNotification();
  const t = useTranslations("Equipment");
  const [state, setState] = useState<UnifiedEquipmentState>(
    createInitialState()
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch equipment log data
  useEffect(() => {
    const fetchEqLog = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await apiRequest(
          `/api/v1/timesheet/equipment-log/${id}`,
          "GET"
        );

        const apiData = response.data as EmployeeEquipmentLogData;

        const formState = transformApiToFormState(apiData);

        // If the log isn't finished, set the end time to now when opening the form
        if (!apiData.isFinished) {
          formState.endTime = new Date().toISOString();
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          formState: formState,
          markedForRefuel: Boolean(formState.refuelLogs),
        }));
      } catch (error) {
        console.error("Error fetching equipment log:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch equipment log",
        }));
      }
    };

    fetchEqLog();
  }, [id]);

  const handleFieldChange = (
    field: string,
    value:
      | string
      | number
      | boolean
      | FormStatus
      | EquipmentState
      | Refueled
      | null
  ) => {
    setState((prev) => {
      if (field.startsWith("equipment.")) {
        const equipmentField = field.split(".")[1];
        return {
          ...prev,
          hasChanged: true,
          formState: {
            ...prev.formState,
            equipment: {
              ...prev.formState.equipment,
              [equipmentField]: value,
            },
          },
        };
      }

      if (field.startsWith("maintenanceId.")) {
        const maintenanceField = field.split(".")[1];
        return {
          ...prev,
          hasChanged: true,
          formState: {
            ...prev.formState,
            maintenanceId: {
              ...(prev.formState.maintenanceId || {
                id: "",
                equipmentIssue: "",
                additionalInfo: null,
              }),
              [maintenanceField]: value,
            },
          },
        };
      }

      return {
        ...prev,
        hasChanged: true,
        formState: {
          ...prev.formState,
          [field]: value,
        },
      };
    });
  };

  const addRefuelLog = async (gallons: number, existingLogId?: string) => {
    if (!state.formState.id) {
      setNotification(t("NoEquipmentLog"), "error");
      return;
    }

    try {
      // If an existingLogId is provided, update the existing log
      if (existingLogId) {
        const formData = new FormData();
        formData.append("id", existingLogId);
        formData.append("gallonsRefueled", gallons.toString());

        const response = await updateRefuelLog(formData);

        if (response) {
          // Update the existing log in state
          setState((prev) => ({
            ...prev,
            formState: {
              ...prev.formState,
              refuelLogs: {
                ...prev.formState.refuelLogs!,
                gallonsRefueled: gallons,
              },
            },
            hasChanged: true,
          }));

          setNotification("Refuel log updated successfully", "success");
        }
      }
    } catch (error) {
      console.error("Error managing refuel log:", error);
      setNotification("Failed to save refuel log", "error");
    }
  };

  const handleChangeRefueled = () => {
    setState((prev) => ({
      ...prev,
      markedForRefuel: !prev.markedForRefuel,
      hasChanged: true,
    }));
  };
  const handleFullOperational = () => {
    setState((prev) => ({
      ...prev,
      formState: {
        ...prev.formState,
        fullyOperational: !prev.formState.fullyOperational,
      },
      hasChanged: true,
    }));
  };
  const deleteLog = async () => {
    try {
      // Delete refuel log if it exists
      if (state.formState.refuelLogs) {
        await deleteEquipmentRefuelLog(state.formState.refuelLogs.id);
      }
      // Always delete the equipment log itself
      await deleteEmployeeEquipmentLog(state.formState.id);
      setNotification(t("Deleted"), "success");
      router.replace("/v1/dashboard/equipment");
    } catch (error) {
      console.error("Error deleting equipment log:", error);
      setNotification(t("FailedToDelete"), "error");
    }
  };

  // deleteEquipmentLog is now handled by deleteLog

  const handleDeleteConfirm = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteLog();
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteLog]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const openDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const saveEdits = async () => {
    try {
      const formData = new FormData();

      // Add basic form field data
      Object.entries(state.formState).forEach(([key, value]) => {
        if (
          key === "equipment" ||
          key === "maintenanceId" ||
          key === "refuelLogs"
        ) {
          // Handle these separately
        } else {
          formData.append(key, String(value));
        }
      });

      // Add equipment status
      formData.append("Equipment.status", state.formState.equipment.status);

      // Handle maintenance data
      if (!state.formState.fullyOperational) {
        if (state.formState.maintenanceId) {
          // Add maintenance fields
          if (state.formState.maintenanceId.id) {
            formData.append("maintenanceId", state.formState.maintenanceId.id);
          }
          formData.append(
            "equipmentIssue",
            state.formState.maintenanceId.equipmentIssue || ""
          );
          formData.append(
            "additionalInfo",
            state.formState.maintenanceId.additionalInfo || ""
          );
        }
      }

      // Handle refuel log data
      // Check if we need to disconnect/delete an existing refuel log
      if (state.formState.refuelLogs === null) {
        // If refuelLogs is null, we want to disconnect any existing refuel log
        formData.append("disconnectRefuelLog", "true");
      } else if (state.formState.refuelLogs) {
        formData.append(
          "refuelLogId",
          state.formState.refuelLogs.id.startsWith("temp-")
            ? "__NULL__" // This indicates we need to create a new log
            : state.formState.refuelLogs.id
        );
        formData.append(
          "gallonsRefueled",
          state.formState.refuelLogs.gallonsRefueled?.toString() || "__NULL__"
        );
      }

      // Add standard fields
      formData.append("priority", "LOW");
      formData.append("repaired", String(false));

      const body = {
        equipmentId: state.formState.equipmentId,
        startTime: state.formState.startTime,
        endTime: state.formState.endTime,
        comment: state.formState.comment,
        disconnectRefuelLog: state.formState.refuelLogs === null,
        refuelLogId: state.formState.refuelLogs?.id,
        gallonsRefueled: state.formState.refuelLogs?.gallonsRefueled,
      };

      await apiRequest(
        `/api/v1/timesheet/equipment-log/${state.formState.id}`,
        "PUT",
        body
      );

      setState((prev) => ({
        ...prev,
        hasChanged: false,
      }));

      router.replace("/v1/dashboard/equipment");
      setNotification(t("Saved"), "success");
    } catch (error) {
      console.error("Error saving equipment log:", error);
      setNotification(t("FailedToSave"), "error");
    }
  };

  // Calculate formatted time
  const formattedTime = (() => {
    if (!state.formState.startTime) return "00:00:00";

    const start = parseISO(state.formState.startTime);
    const end = state.formState.endTime
      ? parseISO(state.formState.endTime)
      : new Date();
    const diffInSeconds = differenceInSeconds(end, start);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  })();

  // Validation function
  const isFormValid = useCallback(() => {
    // Equipment is always valid now that we've removed the maintenance requirement
    return true;
  }, []);

  const setRefuelLog = (
    updater:
      | ((prev: RefuelLogData | null) => RefuelLogData | null)
      | RefuelLogData
      | null
  ) => {
    setState((prev) => {
      const newRefuelLog =
        typeof updater === "function"
          ? updater(prev.formState.refuelLogs)
          : updater;

      return {
        ...prev,
        formState: {
          ...prev.formState,
          refuelLogs: newRefuelLog,
        },
        refueledLogs: Boolean(newRefuelLog), // Update the refueledLogs flag based on whether there is a refuel log
        hasChanged: true,
      };
    });
  };

  // Show error state
  if (state.error) {
    return (
      <>
        <Holds className="h-full w-full justify-center items-center row-span-1">
          <Titles size="lg">Error: {state.error}</Titles>
          <Buttons
            onClick={() => router.push("/v1/dashboard/equipment")}
            background="lightBlue"
          >
            <Titles size="h5">{t("BacktoEquipment")}</Titles>
          </Buttons>
        </Holds>
        <Holds className="row-start-2 row-end-8 h-full w-full bg-white"></Holds>
      </>
    );
  }

  return (
    <>
      <Holds
        background="white"
        className={
          state.isLoading
            ? "row-span-1 h-full justify-center animate-pulse"
            : "row-span-1 h-full justify-center"
        }
      >
        <TitleBoxes onClick={() => router.push("/v1/dashboard/equipment")}>
          <Titles size={"md"}>
            {state.isLoading
              ? "Loading..."
              : `${state.formState.equipment.name.slice(0, 16)}${
                  state.formState.equipment.name.length > 16 ? "..." : ""
                }`}
          </Titles>
        </TitleBoxes>
      </Holds>
      <Holds className="row-start-2 row-end-8 h-full w-full">
        <Grids rows={"10"} className="h-full w-full ">
          <Holds
            background="white"
            className={
              state.isLoading
                ? "row-start-1 row-end-11 h-full  animate-pulse"
                : "row-start-1 row-end-11 h-full "
            }
          >
            {state.isLoading ? (
              <Holds className="h-full w-full justify-center">
                <Spinner />
              </Holds>
            ) : (
              <Contents width={"section"}>
                <Grids rows={"8"} className="h-full w-full border-gray-200">
                  <UsageData
                    formState={state.formState}
                    refuelLog={state.formState.refuelLogs}
                    setRefuelLog={setRefuelLog}
                    handleFieldChange={handleFieldChange}
                    formattedTime={formattedTime}
                    isRefueled={state.markedForRefuel}
                    handleChangeRefueled={handleChangeRefueled}
                    AddRefuelLog={addRefuelLog}
                    handleFullOperational={handleFullOperational}
                    t={t}
                    deleteLog={deleteLog}
                    saveEdits={saveEdits}
                    isFormValid={isFormValid}
                  />
                  <Holds
                    position={"row"}
                    background="white"
                    className="w-full gap-x-4 row-start-8 row-end-9 border-t border-t-gray-200 py-2 rounded-none"
                  >
                    <Buttons
                      shadow={"none"}
                      onClick={openDeleteDialog}
                      background="red"
                      className="w-full "
                      disabled={isDeleting}
                    >
                      <Titles size="sm">{t("DeleteLog")}</Titles>
                    </Buttons>

                    {state.hasChanged && (
                      <Buttons
                        shadow={"none"}
                        onClick={() => {
                          if (!isFormValid()) {
                            setNotification(
                              "Please complete maintenance requirements",
                              "error"
                            );
                            return;
                          }
                          saveEdits();
                        }}
                        background={isFormValid() ? "lightBlue" : "darkGray"}
                        className="w-full "
                        disabled={!isFormValid()}
                      >
                        <Titles size="sm">{t("FinishLogs")}</Titles>
                      </Buttons>
                    )}
                  </Holds>
                </Grids>
              </Contents>
            )}
          </Holds>
        </Grids>
      </Holds>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="max-w-[450px] rounded-[10px] w-[90%]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-center">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-center pb-3">
              {t("DeletePrompt")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full flex flex-row items-center justify-center gap-4">
            <AlertDialogCancel
              asChild
              className="border-gray-200 hover:bg-white rounded-[10px]"
            >
              <Button
                size={"lg"}
                variant="outline"
                className="bg-gray-200 text-black px-6 py-2 rounded-md mt-0 w-24"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                {t("Cancel")}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction
              asChild
              className=" bg-red-500 hover:bg-red-600 border-none rounded-[10px] w-24"
              onClick={handleDeleteConfirm}
            >
              <Button
                size={"lg"}
                variant="destructive"
                className="bg-app-red text-white px-6 py-2 rounded-md"
              >
                {t("Delete")}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
