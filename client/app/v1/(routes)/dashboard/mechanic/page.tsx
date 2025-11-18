"use client";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Suspense } from "react";
import { MechanicDisplayList } from "./_components/mechanic-display-list";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { Buttons } from "@/app/v1/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Capacitor } from "@capacitor/core";

export default function Mechanic() {
  const t = useTranslations("MechanicWidget");
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";

  return (
    <Bases>
      <Contents>
        {/* <MechanicDisplay isManager={isManager} /> */}
        <Suspense
          fallback={
            <Grids
              rows="7"
              gap="5"
              className={ios ? "pt-12" : android ? "pt-4" : ""}
            >
              {/* Header */}
              <Holds
                background={"white"}
                className={`row-start-1 row-end-2 h-full `}
              >
                <TitleBoxes>
                  <Titles size="lg">{t("Projects")}</Titles>
                </TitleBoxes>
              </Holds>

              <Holds
                background={"white"}
                className={`row-start-2 row-end-8 h-full animate-pulse`}
              >
                <Contents width={"section"} className="py-3">
                  {/* List of Projects with Pull-to-refresh */}
                  <div className="h-full border-gray-200 bg-gray-50 border rounded-md px-2 overflow-hidden"></div>
                  <div className="h-12 mt-2 flex items-center">
                    <Buttons
                      shadow={"none"}
                      background={"green"}
                      className={`h-10 w-full opacity-70`}
                    >
                      <Titles size={"md"}>{t("StartProject")}</Titles>
                    </Buttons>
                  </div>
                </Contents>
              </Holds>
            </Grids>
          }
        >
          <MechanicDisplayList ios={ios} android={android} />
        </Suspense>
      </Contents>
    </Bases>
  );
}
