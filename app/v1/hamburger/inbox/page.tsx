"use client";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { NewTab } from "@/app/v1/components/(reusable)/newTabs";
import { useState } from "react";
import { useFormAndDocumentUiStateManagement } from "@/app/lib/store/FormAndDocumentUiStateManagement";
import { Capacitor } from "@capacitor/core";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { useUserStore } from "@/app/lib/store/userStore";
import FormSelection from "./_components/formSelection";
import RTab from "./_components/recieved";

export default function InboxContent() {
  const activeTab = useFormAndDocumentUiStateManagement((s) =>
    s.selectedTab === "received" ? 1 : 3
  );
  const setSelectedTab = useFormAndDocumentUiStateManagement(
    (s) => s.setSelectedTab
  );
  const setActiveTab = (tab: number) => {
    setSelectedTab(tab === 1 ? "received" : "team");
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("returnUrl") || "/v1/dashboard";
  const t = useTranslations("Hamburger-Inbox");
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  const { user } = useUserStore();
  const isManager = user?.permission !== "USER";
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Bases>
      <Contents>
        <div
          className={ios ? "pt-12 h-full" : android ? "pt-4 h-full" : "h-full"}
        >
          <div className={`h-full w-full rounded-lg bg-white `}>
            {/* Static content - header */}
            <TitleBoxes
              className="h-[8%] shrink-0 rounded-lg sticky top-0 z-10 bg-white"
              position={"row"}
              onClick={() => router.push(url)}
            >
              <Holds
                position={"row"}
                className="w-full justify-center items-center gap-x-2 "
              >
                <Titles size={"md"}>{t("FormsDocuments")}</Titles>
              </Holds>
            </TitleBoxes>

            {/* Static content - tabs */}
            {isManager && (
              <div className="h-[7%] items-center flex flex-row gap-2 border-2 border-neutral-100 bg-neutral-100">
                <NewTab
                  onClick={() => setActiveTab(1)}
                  isActive={activeTab === 1}
                  isComplete={true}
                  titleImage={"/formInspect.svg"}
                  titleImageAlt={""}
                  animatePulse={false}
                  className="border-gray-200 border-2"
                >
                  <Titles size={"sm"}>{t("Forms")}</Titles>
                </NewTab>

                <NewTab
                  onClick={() => setActiveTab(3)}
                  isActive={activeTab === 3}
                  isComplete={true}
                  titleImage={"/formApproval.svg"}
                  titleImageAlt={""}
                  animatePulse={false}
                >
                  <Titles size={"sm"}>{t("TeamSubmissions")}</Titles>
                </NewTab>
              </div>
            )}

            <div
              className={isManager ? `h-[calc(100%-8%)]` : `h-[calc(100%-15%)]`}
            >
              {activeTab === 1 ? (
                <FormSelection
                  loading={loading}
                  setLoading={setLoading}
                  isManager={isManager}
                />
              ) : activeTab === 3 ? (
                <RTab isManager={isManager} />
              ) : null}
            </div>
          </div>
        </div>
      </Contents>
    </Bases>
  );
}
