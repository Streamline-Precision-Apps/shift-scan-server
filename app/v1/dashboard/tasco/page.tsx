"use client";

import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import TascoClientPage from "./components/tascoClientPage";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { Images } from "@/app/v1/components/(reusable)/images";
import { Capacitor } from "@capacitor/core";
import { useCookieStore } from "@/app/lib/store/cookieStore";

export default function TascoPage() {
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  const { laborType } = useCookieStore();

  return (
    <Bases>
      <Contents>
        <Grids
          rows={"7"}
          gap={"5"}
          className={ios ? "pt-12" : android ? "pt-4" : ""}
        >
          <Holds
            background={"white"}
            className="row-span-1 h-full justify-center"
          >
            <TitleBoxes>
              <Holds
                position={"row"}
                className="w-full justify-center space-x-2"
              >
                <Titles>Tasco</Titles>
                <Images
                  className="w-8 h-8"
                  titleImg={"/tasco.svg"}
                  titleImgAlt={"Tasco"}
                />
              </Holds>
            </TitleBoxes>
          </Holds>
          <Holds className="row-span-6 h-full">
            <TascoClientPage laborType={laborType} />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
