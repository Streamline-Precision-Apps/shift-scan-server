"use client";
import "@/app/globals.css";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { useTranslations } from "next-intl";
import { Contents } from "../../components/(reusable)/contents";
import { Grids } from "../../components/(reusable)/grids";
import { Holds } from "../../components/(reusable)/holds";
import { Images } from "../../components/(reusable)/images";
import { TitleBoxes } from "../../components/(reusable)/titleBoxes";
import { Titles } from "../../components/(reusable)/titles";
import { Capacitor } from "@capacitor/core";
import PrivacyPolicy from "@/app/privacy-policy/privacy-policy";
import { useRouter, useSearchParams } from "next/navigation";

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  const router = useRouter();
  const searchParams = useSearchParams();
  const rUrl = searchParams.get("returnUrl");

  return (
    <Bases>
      <Contents>
        <Grids
          rows={"7"}
          cols={"1"}
          gap={"5"}
          className={
            ios
              ? "pt-12 h-full w-full"
              : android
              ? "pt-4 h-full w-full"
              : "h-full w-full"
          }
        >
          <Holds
            background={"white"}
            size={"full"}
            className="row-start-1 row-end-2 h-full "
          >
            <TitleBoxes
              onClick={() =>
                router.push(`/v1/hamburger/profile?returnUrl=${rUrl}`)
              }
            >
              <Holds
                position={"row"}
                className="w-full flex flex-col justify-center gap-x-2 "
              >
                <Titles size={"lg"}>{t("title")}</Titles>
                <p className="text-app-dark-blue text-xs ">
                  {t("lastUpdated")}
                </p>
              </Holds>
            </TitleBoxes>
          </Holds>
          <Holds
            background={"white"}
            className=" row-start-2 row-end-8 h-full "
          >
            <PrivacyPolicy isMobile={true} />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
