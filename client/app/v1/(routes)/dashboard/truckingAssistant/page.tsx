"use client";

import { Holds } from "@/app/v1/components/(reusable)/holds";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { Images } from "@/app/v1/components/(reusable)/images";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import TruckDriver from "./TruckingDriver";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import TruckDriverSkeleton from "./components/TruckDriverSkeleton";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { set } from "lodash";
import { Capacitor } from "@capacitor/core";

export default function TruckingContexts() {
  const t = useTranslations("Widgets");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [laborType, setLaborType] = useState<string | null>(null);
  const android = Capacitor.getPlatform() === "android";
  const ios = Capacitor.getPlatform() === "ios";

  useEffect(() => {
    const fetchLaborType = async () => {
      try {
        setLoading(true);
        await apiRequest(`/api/cookies?name=laborType`, "GET");
        setLaborType(laborType);
      } catch (error) {
        console.error("Error fetching labor type:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLaborType();
  }, []);

  if (loading) {
    return (
      <Bases>
        <Contents>
          <Grids
            rows={"7"}
            gap={"5"}
            className={ios ? "pt-12" : android ? "pt-4" : ""}
          >
            <Holds
              background={"white"}
              className="row-start-1 row-end-2 h-full "
            >
              <TitleBoxes onClick={() => router.push("/v1/dashboard")}>
                <Holds
                  position={"row"}
                  className=" w-full justify-center items-center space-x-2 animate-pulse"
                ></Holds>
              </TitleBoxes>
            </Holds>
            <Holds className="row-start-2 row-end-8 h-full">
              <Suspense fallback={<TruckDriverSkeleton />}>
                <TruckDriver />
              </Suspense>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  return (
    <Bases>
      <Contents>
        <Grids
          rows={"7"}
          gap={"5"}
          className={ios ? "pt-12" : android ? "pt-4" : ""}
        >
          <Holds background={"white"} className="row-start-1 row-end-2 h-full ">
            <TitleBoxes onClick={() => router.push("/v1/dashboard")}>
              <Holds
                position={"row"}
                className=" w-full justify-center items-center space-x-2"
              >
                <Titles size={"lg"} className="">
                  {laborType === "truckDriver"
                    ? t("TruckDriver")
                    : laborType === "operator"
                    ? t("Operator")
                    : laborType === "manualLabor"
                    ? t("ManualLabor")
                    : t("TruckingAssistant")}
                </Titles>
                <Images
                  className="max-w-8 h-auto object-contain"
                  titleImg={"/trucking.svg"}
                  titleImgAlt={"Truck"}
                />
              </Holds>
            </TitleBoxes>
          </Holds>
          <Holds className="row-start-2 row-end-8 h-full">
            <Suspense fallback={<TruckDriverSkeleton />}>
              <TruckDriver />
            </Suspense>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
