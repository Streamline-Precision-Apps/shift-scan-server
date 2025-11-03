"use client";
import { Buttons } from "../(reusable)/buttons";
import { Grids } from "../(reusable)/grids";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";
import { Labels } from "../(reusable)/labels";
import { TextAreas } from "../(reusable)/textareas";
import { Texts } from "../(reusable)/texts";
import { useTranslations } from "next-intl";
import { Titles } from "../(reusable)/titles";
// import { breakOutTimeSheet } from "@/app/lib/actions/timeSheetActions";
import { setCurrentPageView } from "@/app/lib/actions/cookieActions";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { useUserStore } from "@/app/lib/store/userStore";

export default function Comment({
  handleClick,
  setCommentsValue,
  commentsValue,
}: {
  commentsValue: string;
  handleClick: () => void;
  clockInRole: string | undefined;
  setCommentsValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { user } = useUserStore();
  const userId = user?.id;

  const c = useTranslations("Clock");
  const router = useRouter();
  const returnRoute = () => {
    window.history.back();
  };

  const setBreakout = async () => {
    try {
      //1.) get timesheet Id
      const timeSheetId = await apiRequest(
        `/api/v1/timesheet/user/${userId}/return`,
        "GET"
      );
      // 2.) call clock out route pass body
      const body = {
        userId: user?.id,
        endTime: new Date().toISOString(),
        timeSheetComments: commentsValue,
        wasInjured: false,
        clockOutLat: null,
        clockOutLng: null,
      };

      // Use apiRequest to call the backend update route
      const isUpdated = await apiRequest(
        `/api/v1/timesheet/${timeSheetId}/clock-out`,
        "PUT",
        body
      );

      if (isUpdated.success === true) {
        setCurrentPageView("break");
        router.push("/v1");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Holds background={"white"} className="h-full w-full">
      <Grids rows={"8"} gap={"5"}>
        <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
          <Grids rows={"1"} cols={"5"} gap={"3"} className=" h-full w-full">
            <Holds
              className="row-start-1 row-end-2 col-start-1 col-end-2 h-full w-full justify-center"
              onClick={returnRoute}
            >
              <Images
                titleImg="/arrowBack.svg"
                titleImgAlt="back"
                position={"left"}
              />
            </Holds>
          </Grids>
        </Holds>

        <Holds className="row-start-2 row-end-4 h-full w-full justify-center relative">
          <Holds className="h-full w-[90%] relative">
            <Labels size={"p4"} htmlFor="comment">
              {c("PreviousJobComment")}
            </Labels>
            <TextAreas
              value={commentsValue}
              onChange={(e) => {
                setCommentsValue(e.target.value);
              }}
              placeholder={c("TodayIDidTheFollowing")}
              className="w-full h-full"
              maxLength={40}
              style={{ resize: "none" }}
            />

            <Texts
              size={"p2"}
              className={`${
                commentsValue.length >= 40
                  ? "text-red-500 absolute bottom-5 right-2"
                  : "absolute bottom-5 right-2"
              }`}
            >
              {commentsValue.length}/40
            </Texts>
          </Holds>
        </Holds>

        <Holds position={"row"} className="row-start-8 row-end-9 h-full ">
          <Buttons
            background={commentsValue.length < 3 ? "darkGray" : "orange"}
            onClick={() => handleClick()}
            disabled={commentsValue.length < 3}
            className="w-full h-full py-3"
          >
            <Titles size={"h2"}>{c("Continue")}</Titles>
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
