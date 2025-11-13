"use client";
import { useTranslations } from "next-intl";
import { useCookieStore } from "@/app/lib/store/cookieStore";
import { useRouter } from "next/navigation";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { TextAreas } from "@/app/v1/components/(reusable)/textareas";
import { Texts } from "@/app/v1/components/(reusable)/texts";
import { CheckBox } from "@/app/v1/components/(inputs)/checkBox";
import { Buttons } from "@/app/v1/components/(reusable)/buttons";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Images } from "@/app/v1/components/(reusable)/images";
import { useTimeSheetData } from "@/app/lib/context/TimeSheetIdContext";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { usePermissions } from "@/app/lib/context/permissionContext";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { useUserStore } from "@/app/lib/store/userStore";
import { Capacitor } from "@capacitor/core";
import {
  stopClockOutTracking,
  getStoredCoordinates,
} from "@/app/lib/client/locationTracking";

export default function Comment({
  handleClick,
  setCommentsValue,
  commentsValue,
  checked,
  handleCheckboxChange,
  setLoading,
  loading = false,
  currentTimesheetId,
  coordinates,
}: {
  commentsValue: string;
  handleClick: () => void;
  clockInRole: string | undefined;
  setCommentsValue: React.Dispatch<React.SetStateAction<string>>;
  checked: boolean;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  currentTimesheetId: number | undefined;
  coordinates?: { lat: number; lng: number } | null;
}) {
  const { user } = useUserStore();

  const c = useTranslations("Clock");
  const { permissionStatus: permissions } = usePermissions();
  const { refetchTimesheet, savedTimeSheetData, setTimeSheetData } =
    useTimeSheetData();
  const router = useRouter();
  const returnRoute = () => {
    window.history.back();
  };

  const setCurrentPageView = useCookieStore(
    (state) => state.setCurrentPageView
  );

  const processOne = async () => {
    try {
      let timeSheetId = currentTimesheetId;

      if (!timeSheetId) {
        await refetchTimesheet();
        const ts = savedTimeSheetData?.id;
        if (!ts) {
          console.error("No active timesheet found for job switch.");
        }
        return (timeSheetId = ts);
      }
      if (!permissions.location) {
        console.error("Location permissions are required to clock in.");
        return;
      }

      // Use prefetched coordinates if available, else fallback to fetching now
      let coords = coordinates;
      if (!coords) {
        coords = await getStoredCoordinates();
      }

      const body = {
        userId: user?.id,
        endTime: new Date().toISOString(),
        timeSheetComments: commentsValue,
        wasInjured: false,
        clockOutLat: coords ? coords.lat : null,
        clockOutLng: coords ? coords.lng : null,
      };

      // Use apiRequest to call the backend update route
      const isUpdated = await apiRequest(
        `/api/v1/timesheet/${timeSheetId}/clock-out`,
        "PUT",
        body
      );

      if (isUpdated) {
        // Stop location tracking only after successful clock-out
        await stopClockOutTracking();
        setCurrentPageView("break");
        setTimeSheetData(null);
        router.push("/v1");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  return (
    <Bases>
      <Contents>
        <Holds
          className={ios ? "pt-12 h-full" : android ? "pt-4 h-full" : "h-full"}
        >
          <Holds
            background={"white"}
            className="h-full w-full flex flex-col items-center"
          >
            <TitleBoxes onClick={returnRoute} className="h-24">
              <Holds className="h-full justify-end">
                <Titles size={"md"}>{c("PreviousJobComments")}</Titles>
              </Holds>
            </TitleBoxes>
            <div className="w-[90%] grow flex flex-col">
              <Holds className="h-fit w-full relative mt-5">
                <TextAreas
                  value={commentsValue}
                  onChange={(e) => {
                    setCommentsValue(e.target.value);
                  }}
                  placeholder={c("TodayIDidTheFollowing")}
                  className="w-full h-full text-sm"
                  maxLength={40}
                  rows={6}
                  style={{ resize: "none" }}
                  disabled={loading}
                />

                <Texts
                  size={"p5"}
                  className={`${
                    commentsValue.length >= 40
                      ? "text-red-500 absolute bottom-5 right-2"
                      : "absolute bottom-5 right-2"
                  }`}
                >
                  {commentsValue.length}/40
                </Texts>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                    <span className="text-gray-500 text-lg">Loading...</span>
                  </div>
                )}
              </Holds>

              <Holds position={"row"} className="pt-5">
                <Holds className="w-fit pr-5">
                  <CheckBox
                    checked={checked}
                    id="end-day"
                    name="end-day"
                    size={2.5}
                    onChange={handleCheckboxChange}
                    disabled={loading}
                  />
                </Holds>
                <Texts size={"md"}>{c("EndWorkForTheDay")}</Texts>
              </Holds>
            </div>

            <div className="w-[90%] flex justify-end h-[70px] pb-4 ">
              <Buttons
                background={commentsValue.length < 3 ? "darkGray" : "orange"}
                onClick={checked ? handleClick : processOne}
                disabled={commentsValue.length < 3 || loading}
                className="h-[60px] w-full"
              >
                <Holds
                  position={"row"}
                  className="w-full h-full justify-center gap-x-2"
                >
                  <Titles size={"md"}>
                    {checked ? c("Continue") : c("StartBreak")}
                  </Titles>
                  {!checked && (
                    <Images
                      titleImg="/clockBreak.svg"
                      titleImgAlt="clock Break"
                      className="max-w-8 h-auto"
                    />
                  )}
                </Holds>
              </Buttons>
            </div>
          </Holds>
        </Holds>
      </Contents>
    </Bases>
  );
}
