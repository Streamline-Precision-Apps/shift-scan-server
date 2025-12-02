"use client";
import { useUserStore } from "@/app/lib/store/userStore";
import NewClockProcess from "@/app/v1/components/(clock)/newclockProcess";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Holds } from "../components/(reusable)/holds";
import { Capacitor } from "@capacitor/core";

export default function Clock() {
  const { user } = useUserStore();

  // Get the current language from cookies
  const lang = user?.UserSettings?.language as string;

  const locale = lang || "en";
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  return (
    <Bases>
      <Contents>
        <Holds
          className={ios ? "pt-12 h-full" : android ? "pt-4 h-full" : "h-full"}
        >
          <NewClockProcess
            type={"jobsite"}
            scannerType={"jobsite"}
            option={"break"}
            locale={locale}
            returnpath="/v1"
            mechanicView={user?.mechanicView ?? false}
            tascoView={user?.tascoView ?? false}
            truckView={user?.truckView ?? false}
            laborView={user?.laborView ?? false}
          />
        </Holds>
      </Contents>
    </Bases>
  );
}
