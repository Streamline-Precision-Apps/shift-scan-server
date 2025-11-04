"use client";

import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { TitleBoxes } from "@/app/v1/components/(reusable)/titleBoxes";
import TascoClientPage from "./components/tascoClientPage";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { Images } from "@/app/v1/components/(reusable)/images";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/utils/api-Utils";

export default function TascoPage() {
  const [laborType, setLaborType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLaborType = async () => {
      setLoading(true);
      try {
        const res = await apiRequest(`/api/cookies?name=laborType`, "GET");
        setLaborType(res.laborType);
      } catch (error) {
        console.error("Failed to fetch labor type:", error);
        setLaborType(null);
      } finally {
        setLoading(false);
      }
    };
    getLaborType();
  }, []);

  if (loading) {
    return (
      <Bases>
        <Contents>
          <Grids rows={"7"} gap={"5"} className="h-full">
            <Holds background={"white"} className="row-span-1 h-full">
              <TitleBoxes>
                <Titles>Tasco</Titles>
                <Images
                  className="w-8 h-8"
                  titleImg={"/tasco.svg"}
                  titleImgAlt={"Tasco"}
                />
              </TitleBoxes>
            </Holds>
            <Holds background={"white"} className="row-span-6 h-full"></Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  if (laborType === "equipmentOperator") {
    return (
      <Bases>
        <Contents>
          <Grids rows={"7"} gap={"5"} className="h-full">
            <Holds background={"white"} className="row-span-1 h-full">
              <TitleBoxes>
                <Titles>Tasco</Titles>
                <Images
                  className="w-8 h-8"
                  titleImg={"/tasco.svg"}
                  titleImgAlt={"Tasco"}
                />
              </TitleBoxes>
            </Holds>
            <Holds background={"white"} className="row-span-6 h-full">
              <TascoClientPage laborType={"equipmentOperator"} />
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  } else {
    return (
      <Bases>
        <Contents>
          <Grids rows={"7"} gap={"5"}>
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
              <TascoClientPage laborType={""} />
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }
}
