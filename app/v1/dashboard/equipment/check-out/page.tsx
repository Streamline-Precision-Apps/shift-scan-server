"use client";

import { useSearchParams } from "next/navigation";
import EquipmentIdClientPage from "./_components/EquipmentIdClientPage";
import { Bases } from "@/app/v1/components/(reusable)/bases";
import { Contents } from "@/app/v1/components/(reusable)/contents";
import { Grids } from "@/app/v1/components/(reusable)/grids";

const EquipmentLogPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No equipment ID provided. Please use ?id=your-id-here</p>
      </div>
    );
  }

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"}>
          <EquipmentIdClientPage id={id} />
        </Grids>
      </Contents>
    </Bases>
  );
};

export default EquipmentLogPage;
