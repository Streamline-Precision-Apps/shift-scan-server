"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import QR from "./qr";
import { Buttons } from "../(reusable)/buttons";
import { Texts } from "../(reusable)/texts";
import { Titles } from "../(reusable)/titles";
import { Holds } from "../(reusable)/holds";
import { Grids } from "../(reusable)/grids";
import { Images } from "../(reusable)/images";
import { Contents } from "../(reusable)/contents";
import { TitleBoxes } from "../(reusable)/titleBoxes";
import { usePermissions } from "@/app/lib/context/permissionContext";
import { Capacitor } from "@capacitor/core";

type Option = {
  id: string;
  label: string;
  code: string;
};
type QRStepProps = {
  handleAlternativePath: () => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleReturn?: () => void;
  handleReturnPath: () => void;
  handleScanJobsite?: (type: string) => void;
  type: string;
  url: string;
  option?: string;
  clockInRole: string | undefined;
  setClockInRole: React.Dispatch<React.SetStateAction<string | undefined>>;
  clockInRoleTypes: string | undefined;
  setClockInRoleTypes: Dispatch<SetStateAction<string | undefined>>;
  setJobsite: Dispatch<SetStateAction<Option>>;
};

export default function QRStep({
  option,
  handleReturnPath,
  handleAlternativePath,
  handleNextStep,
  handleScanJobsite,
  type,
  url,
  clockInRole,
  handlePrevStep,
  setJobsite,
}: QRStepProps) {
  const t = useTranslations("Clock");
  const native = Capacitor.isNativePlatform();
  const [startCamera, setStartCamera] = useState<boolean>(false);
  const [failedToScan, setFailedToScan] = useState(false);
  const {
    permissionStatus,
    requestCameraPermission,
    requestLocationPermission,
  } = usePermissions();

  // Request permissions when component mounts (entering QR scan step)
  // Only request if permissions are not already granted
  useEffect(() => {
    const requestPermissions = async () => {
      // Skip if both permissions are already granted
      if (permissionStatus.camera && permissionStatus.location) {
        return;
      }

      try {
        if (!permissionStatus.camera) {
          await requestCameraPermission();
        }
        if (!permissionStatus.location) {
          await requestLocationPermission();
        }
      } catch (error) {
        console.error("Error requesting permissions:", error);
      }
    };

    requestPermissions();
  }, [permissionStatus, requestCameraPermission, requestLocationPermission]);

  useEffect(() => {
    setTimeout(() => {
      setFailedToScan(false);
    }, 5000);
  }, [failedToScan]);

  return (
    <Holds background={"white"} className="h-full w-full">
      <Grids rows={"7"} gap={"5"} className="h-full w-full">
        <Holds className="row-start-1 row-end-2 h-full w-full">
          <TitleBoxes onClick={handleReturnPath} className="h-full">
            <Titles size={"h3"} className="flex flex-col justify-end">
              {t("SelectLaborType")}
            </Titles>
          </TitleBoxes>
        </Holds>
        <Holds className="row-start-2 row-end-8 h-full w-full">
          <Grids rows={"7"} gap={"5"} className="h-full w-full pb-5">
            {!startCamera ? (
              <Holds className={"h-full w-full row-start-1 row-end-7"}>
                <Contents width={"section"}>
                  <Holds className="h-full w-full  justify-center border-[3px] border-black rounded-[10px] p-3">
                    <Images
                      titleImg="/camera.svg"
                      titleImgAlt="clockIn"
                      position={"center"}
                      size={"40"}
                    />

                    {failedToScan === true && (
                      <Holds className="h-full w-full row-start-6 row-end-7 justify-center">
                        <Texts text={"red"} size={"p4"}>
                          {t("FailedToScanJobSiteDoesNotExist")}
                        </Texts>
                      </Holds>
                    )}
                  </Holds>

                  <Holds className="h-20 w-full  justify-center">
                    <Buttons
                      background={"none"}
                      shadow={"none"}
                      onClick={handleAlternativePath}
                      className="underline text-app-dark-blue"
                    >
                      <Texts
                        size={"md"}
                        className="underline underline-offset-4 "
                      >
                        {t("TroubleScanning")}
                      </Texts>
                    </Buttons>
                  </Holds>
                </Contents>
              </Holds>
            ) : (
              <Holds className={"h-full w-full row-start-1 row-end-7"}>
                <Grids rows={"7"} gap={"5"}>
                  <Holds className="h-full w-full row-start-2 row-end-7 justify-center ">
                    <QR
                      handleScanJobsite={handleScanJobsite}
                      url={url}
                      clockInRole={clockInRole || ""}
                      type={type}
                      handleNextStep={handleNextStep}
                      startCamera={startCamera}
                      setStartCamera={setStartCamera}
                      setFailedToScan={setFailedToScan}
                      setJobsite={setJobsite}
                    />
                  </Holds>

                  <Holds className="h-full w-full row-start-7 row-end-8 justify-center">
                    <Buttons
                      background={"none"}
                      shadow={"none"}
                      onClick={handleAlternativePath}
                      className="underline text-app-dark-blue"
                    >
                      <Texts
                        size={"md"}
                        className="underline underline-offset-4 "
                      >
                        {t("TroubleScanning")}
                      </Texts>
                    </Buttons>
                  </Holds>
                </Grids>
              </Holds>
            )}
            {!startCamera ? (
              <Holds className="row-start-7 row-end-8 h-full w-full justify-center py-2">
                <Contents width={"section"}>
                  <Buttons
                    onClick={() => setStartCamera(!startCamera)}
                    background={"green"}
                  >
                    <Titles size={"md"}>{t("StartCamera")}</Titles>
                  </Buttons>
                </Contents>
              </Holds>
            ) : null}
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
