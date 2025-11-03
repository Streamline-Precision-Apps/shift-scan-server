"use client";
import { useUserStore } from "@/app/lib/store/userStore";
import NewClockProcess from "@/app/v1/components/(clock)/newclockProcess";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";

export default function Clock() {
  const { user } = useUserStore();

  // Get the current language from cookies
  const lang = user?.UserSettings?.language as string;

  const locale = lang || "en";

  return (
    <Bases>
      <Contents>
        <NewClockProcess
          type={"jobsite"}
          scannerType={"jobsite"}
          option={"break"}
          locale={locale}
          returnpath="/"
          mechanicView={user?.mechanicView ?? false}
          tascoView={user?.tascoView ?? false}
          truckView={user?.truckView ?? false}
          laborView={user?.laborView ?? false}
        />
      </Contents>
    </Bases>
  );
}
