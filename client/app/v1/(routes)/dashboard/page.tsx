"use client";

import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import DbWidgetSection from "./dbWidgetSection";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import BannerRotating from "@/app/v1/components/(reusable)/bannerRotating";
import BannerRotatingSkeleton from "@/app/v1/components/(reusable)/BannerRotatingSkeleton";
import { Suspense, useEffect, useState } from "react";
import HamburgerMenuNew from "@/app/v1/components/(animations)/hamburgerMenuNew";
import ActiveTimesheetCheck from "@/app/v1/components/ActiveTimesheetCheck";
import DashboardLoadingView from "./UI/_dashboards/dashboardLoadingView";
import LoadingHamburgerMenuNew from "@/app/v1/components/(animations)/loadingHamburgerMenuNew";
import { useUserStore } from "@/app/lib/store/userStore";
import { getCookies } from "@/app/lib/actions/cookieActions";
import { useCookieStore } from "@/app/lib/store/cookieStore";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUserStore();
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";

  // Zustand cookie store values
  const currentPageView = useCookieStore((state) => state.currentPageView);
  const workRole = useCookieStore((state) => state.workRole) || "general";
  const laborType = useCookieStore((state) => state.laborType) || "";
  const [mechanicProjectID, setMechanicProjectID] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMechanicProjectID() {
      const id = await getCookies({ cookieName: "mechanicProjectID" });
      setMechanicProjectID(id || "");
      setLoading(false);
    }
    fetchMechanicProjectID();
  }, []);

  useEffect(() => {
    if (!loading && currentPageView !== "dashboard") {
      router.push("/v1");
    }
  }, [loading, currentPageView, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (currentPageView !== "dashboard") {
    return <div>Redirecting...</div>;
  }

  if (!user)
    return (
      <Bases>
        <Contents>
          <Holds
            className={
              ios ? "pt-12 h-full" : android ? "pt-4 h-full" : "h-full"
            }
          >
            <div className="flex justify-center items-center h-full">
              <p className="text-red-500">User not found. Please log in.</p>
            </div>
          </Holds>
        </Contents>
      </Bases>
    );

  // Main return component (unchanged)
  return (
    <Bases>
      <Contents>
        <Grids
          rows={"8"}
          gap={"5"}
          className={ios ? "pt-12" : android ? "pt-4" : ""}
        >
          {/* Active timesheet check component - runs on dashboard load */}

          <ActiveTimesheetCheck userId={user.id} />

          <Suspense fallback={<LoadingHamburgerMenuNew />}>
            <HamburgerMenuNew isHome={false} />
          </Suspense>
          <div className="row-start-2 row-end-4 bg-app-blue/10 w-full h-full justify-center items-center rounded-[10px]">
            <Suspense fallback={<BannerRotatingSkeleton />}>
              <BannerRotating />
            </Suspense>
          </div>
          <Holds background={"white"} className="row-start-4 row-end-9 h-full">
            <Suspense fallback={<DashboardLoadingView />}>
              <DbWidgetSection
                view={workRole}
                mechanicProjectID={mechanicProjectID}
                laborType={laborType}
              />
            </Suspense>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
