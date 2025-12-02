"use client";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { Grids } from "@/app/v1/components/(reusable)/grids";
import ScanEquipment from "./_components/scanEquipmentSteps";
import { Capacitor } from "@capacitor/core";

export default function LogNewEquipment() {
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  return (
    <Bases>
      <Contents>
        <Grids
          rows={"1"}
          className={`${ios ? "pt-12" : android ? "pt-4" : ""} h-full`}
        >
          <Holds background={"white"} className="h-full row-span-1">
            <ScanEquipment />
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
