"use client";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { useEffect, useState, Suspense } from "react";
import Counter from "./counter";
import { NewTab } from "@/app/v1/components/(reusable)/newTabs";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import RefuelLayout from "./RefuelLayout";
import LoadsLayout from "./LoadsLayout";
import TascoComments from "./tascoComments";
import TascoCommentsSkeleton from "./TascoCommentsSkeleton";
import { SetLoad } from "@/app/lib/actions/tascoActions";
import { apiRequest, getUserId } from "@/app/lib/utils/api-Utils";

import { useTranslations } from "next-intl";
import { Texts } from "@/app/v1/components/(reusable)/texts";
import { useAutoSave } from "@/app/lib/hooks/useAutoSave";

export type LoadType = "UNSCREENED" | "SCREENED";

export type TascoFLoad = {
  id: number;
  tascoLogId: string;
  weight: number | null;
  screenType: LoadType | null;
};

export type Refueled = {
  id: string;
  tascoLogId: string;
  gallonsRefueled: number;
};

export default function TascoEQClientPage({
  laborType,
}: {
  laborType: string;
}) {
  const t = useTranslations("Tasco");
  const [isLoading, setIsLoading] = useState(false);
  const [loadCount, setLoadCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState(1);
  const [tascoLogId, setTascoLogId] = useState<string>();
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [fLoads, setFLoads] = useState<TascoFLoad[]>(); // New state for F-shift loads
  const [comment, setComment] = useState<string>("");

  const isFShift = laborType === "FShift";

  // Combine the initial data fetching into a single useEffect
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Get current user ID
        const userId = getUserId();
        if (!userId) {
          throw new Error("User not authenticated. Please log in first.");
        }

        // Fetch the active Tasco Log for the user
        const res = await apiRequest(
          `/api/v1/tasco-logs/user/${userId}/active`,
          "GET"
        );

        if (!res.success) {
          throw new Error("Failed to fetch active Tasco Log");
        }
        const tascoLogId = res.data.id;

        if (!tascoLogId) {
          throw new Error(
            "No active Tasco Log found. Please start a shift first."
          );
        }

        setTascoLogId(tascoLogId);

        // Fetch all core data in parallel using unified field endpoint with apiRequest
        const [commentRes, loadCountRes, refuelRes, fLoadsRes] =
          await Promise.all([
            apiRequest(`/api/v1/tasco-logs/${tascoLogId}/field/comment`, "GET"),
            apiRequest(
              `/api/v1/tasco-logs/${tascoLogId}/field/loadCount`,
              "GET"
            ),
            apiRequest(
              `/api/v1/tasco-logs/${tascoLogId}/field/refuelLogs`,
              "GET"
            ),
            apiRequest(`/api/v1/tasco-logs/${tascoLogId}/field/fLoads`, "GET"),
          ]);

        // Extract data from responses
        const commentData = commentRes?.data?.TimeSheet?.comment || "";
        const loadCountData = loadCountRes?.data?.LoadQuantity || 0;
        const refuelData = refuelRes?.data || [];
        const fLoadsData = fLoadsRes?.data || [];

        // Set core data
        setComment(commentData);
        setRefuelLogs(refuelData);

        // Handle F-shift specific data separately for clarity
        if (isFShift) {
          setFLoads(fLoadsData);
          setLoadCount(fLoadsData?.length || 0); // For F-shift, count is based on number of loads
        } else {
          setLoadCount(Number(loadCountData)); // For regular shifts, use LoadQuantity
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Consider adding error state handling here
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [isFShift]);

  const saveDraftData = async (values: {
    tascoLogId: string;
    loadCount: number;
  }) => {
    try {
      // Include the title in the values object
      const dataToSave = { ...values };
      const formData = new FormData();
      formData.append("tascoLogId", dataToSave.tascoLogId);
      formData.append("loadCount", dataToSave.loadCount.toString());
      await SetLoad(formData);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  // Use the auto-save hook with the FormValues type
  const autoSave = useAutoSave<{
    values: { tascoLogId: string; loadCount: number };
  }>((data) => saveDraftData(data.values), 1000); // Increased debounce time from 400ms to 1000ms

  // Trigger auto-save when formValues or formTitle changes
  useEffect(() => {
    if (!tascoLogId) return;
    // For F-shift, don't auto-save the counter since it's managed by individual loads
    if (!isFShift) {
      autoSave.autoSave({ values: { tascoLogId, loadCount } });
    }
  }, [loadCount, isFShift]);

  return (
    // <Holds className="h-full overflow-y-hidden no-scrollbar">
    <>
      <Grids rows={"10"} gap={"3"} className={"h-full w-full"}>
        <Holds
          className="w-full h-full items-center row-start-1 row-end-3 "
          background={"white"}
        >
          <Holds className="w-full h-full items-center py-2">
            <Titles size={"h5"}>{t("LoadCounter")}</Titles>
            <Counter
              count={loadCount}
              setCount={setLoadCount}
              isLoading={isLoading}
              isFShift={isFShift}
            />
          </Holds>
        </Holds>

        <Holds className="row-start-3 row-end-11 h-full w-full">
          <Holds position={"row"} className="gap-1.5 h-[50px]">
            <NewTab
              titleImage="/comment.svg"
              titleImageAlt={t("Comments")}
              onClick={() => setActiveTab(1)}
              isActive={activeTab === 1}
              isComplete={comment.trim().length > 0}
            >
              <Texts size={"lg"}>{t("Comments")}</Texts>
            </NewTab>
            <NewTab
              titleImage="/refuel.svg"
              titleImageAlt={t("RefuelIcon")}
              onClick={() => setActiveTab(2)}
              isActive={activeTab === 2}
              isComplete={
                refuelLogs === undefined ||
                refuelLogs.length === 0 ||
                refuelLogs.every((log) => log.gallonsRefueled > 0)
              }
            >
              <Texts size={"lg"}>{t("RefuelLogs")}</Texts>
            </NewTab>
            {isFShift && (
              <NewTab
                titleImage="/tasco.svg"
                titleImageAlt="Loads"
                onClick={() => setActiveTab(3)}
                isActive={activeTab === 3}
                isComplete={
                  fLoads === undefined ||
                  fLoads.length === 0 ||
                  fLoads.every(
                    (load) => load.weight !== null && load.weight > 0
                  )
                }
              >
                <Texts size={"lg"}>Loads</Texts>
              </NewTab>
            )}
          </Holds>

          <Holds
            background={"white"}
            className="rounded-t-none h-full w-full overflow-hidden"
          >
            {activeTab === 1 && (
              <Contents width={"section"} className="h-full">
                <Holds className="h-full w-full relative pt-2">
                  <Suspense fallback={<TascoCommentsSkeleton />}>
                    <TascoComments
                      tascoLog={tascoLogId}
                      comments={comment}
                      setComments={setComment}
                    />
                  </Suspense>
                </Holds>
              </Contents>
            )}
            {activeTab === 2 && (
              <RefuelLayout
                tascoLog={tascoLogId}
                refuelLogs={refuelLogs}
                setRefuelLogs={setRefuelLogs}
              />
            )}
            {activeTab === 3 && isFShift && (
              <LoadsLayout
                tascoLog={tascoLogId}
                fLoads={fLoads}
                setFLoads={setFLoads}
                setLoadCount={setLoadCount}
              />
            )}
          </Holds>
        </Holds>
      </Grids>
    </>
  );
}
