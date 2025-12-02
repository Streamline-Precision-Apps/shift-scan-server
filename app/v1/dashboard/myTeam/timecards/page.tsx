"use client";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import TimeCardApprover from "./_Components/TimeCardApprover";
import Spinner from "@/app/v1/components/(animations)/spinner";
import { Capacitor } from "@capacitor/core";

function TimeCardsContent() {
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  const t = useTranslations("TimeCardSwiper");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const url = searchParams.get("rPath");
  return (
    <Bases>
      <Contents>
        <Grids
          rows={"7"}
          className={`h-full rounded-[10px]  ${loading && "animate-pulse"} ${
            ios ? "pt-12" : android ? "pt-4" : ""
          }`}
        >
          <Holds className="row-span-1 h-full bg-white rounded-t-[10px]">
            <TitleBoxes
              onClick={() => router.push(`/v1/dashboard/myTeam?rPath=${url}`)}
            >
              <Holds className="h-full justify-end">
                <Titles size={"lg"}>{t("ReviewYourTeam")}</Titles>
              </Holds>
            </TitleBoxes>
          </Holds>
          <Suspense
            fallback={
              <Holds className="row-start-2 row-end-8 h-full w-full bg-white rounded-b-[10px]">
                <Spinner />
              </Holds>
            }
          >
            <Holds className="row-start-2 row-end-8 h-full w-full bg-white pt-5 rounded-b-[10px]">
              <TimeCardApprover loading={loading} setLoading={setLoading} />
            </Holds>
          </Suspense>
        </Grids>
      </Contents>
    </Bases>
  );
}

export default function TimeCards() {
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  return (
    <Suspense
      fallback={
        <Bases>
          <Contents>
            <Grids
              rows={"7"}
              gap={"5"}
              className={
                ios
                  ? "h-full bg-white rounded-[10px] pt-12"
                  : android
                  ? "h-full bg-white rounded-[10px] pt-4"
                  : " h-full bg-white rounded-[10px]"
              }
            >
              <Holds className="row-span-1 h-full">
                <TitleBoxes>
                  <Holds className="h-full justify-end">
                    <Titles size={"h2"}>Loading...</Titles>
                  </Holds>
                </TitleBoxes>
              </Holds>
              <Holds className="row-start-2 row-end-8 h-full w-full">
                <Spinner />
              </Holds>
            </Grids>
          </Contents>
        </Bases>
      }
    >
      <TimeCardsContent />
    </Suspense>
  );
}
