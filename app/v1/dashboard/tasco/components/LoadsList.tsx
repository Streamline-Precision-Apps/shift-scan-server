import { useEffect, useState } from "react";
import {
  deleteTascoFLoad,
  updateTascoFLoad,
} from "@/app/lib/actions/tascoActions";
import SlidingDiv from "@/app/v1/components/(animations)/slideDelete";
import { Inputs } from "@/app/v1/components/(reusable)/inputs";
import { LoadType, TascoFLoad } from "./tascoClientPage";

const SCREEN_TYPE_OPTIONS = [
  { value: "", label: "Select Type" },
  { value: "UNSCREENED", label: "Unscreened" },
  { value: "SCREENED", label: "Screened" },
];

export default function LoadsList({
  fLoads,
  setFLoads,
  setLoadCount,
}: {
  fLoads: TascoFLoad[] | undefined;
  setFLoads: React.Dispatch<React.SetStateAction<TascoFLoad[] | undefined>>;
  setLoadCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [editedLoads, setEditedLoads] = useState<TascoFLoad[]>(fLoads || []);

  const handleDelete = async (id: number) => {
    try {
      await deleteTascoFLoad({ id });
      const newLoads = editedLoads.filter((load) => load.id !== id);
      setEditedLoads(newLoads);
      setFLoads(newLoads);
      setLoadCount((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to delete load:", error);
    }
  };

  const handleWeightChange = (index: number, value: string | number) => {
    const newLoads = [...editedLoads];
    newLoads[index].weight = value === "" ? null : Number(value);
    setEditedLoads(newLoads);
    setFLoads(newLoads);
  };

  const handleScreenTypeChange = (index: number, value: string) => {
    const newLoads = [...editedLoads];
    newLoads[index].screenType = value === "" ? null : (value as LoadType);
    setEditedLoads(newLoads);
    setFLoads(newLoads);
  };

  const handleUpdateLoad = async (load: TascoFLoad) => {
    try {
      await updateTascoFLoad({
        id: load.id,
        weight: load.weight ?? undefined,
        screenType: load.screenType ?? undefined,
      });
    } catch (error) {
      console.error("Failed to update load:", error);
    }
  };

  useEffect(() => {
    setEditedLoads(fLoads || []);
  }, [fLoads]);

  return (
    <div className="w-full">
      {editedLoads.map((load, index) => (
        <SlidingDiv key={load.id} onSwipeLeft={() => handleDelete(load.id)}>
          <div className="flex flex-row items-center border-[3px] border-black rounded-[10px] bg-white mb-1 last:mb-0 w-full relative">
            {/* Weight Input - Left Side (Narrower) */}
            <div className="flex-1 p-1">
              <Inputs
                type="number"
                name="weight"
                placeholder="Weight (tons)"
                value={load.weight || ""}
                onChange={(e) => handleWeightChange(index, e.target.value)}
                onBlur={() => handleUpdateLoad(load)}
                className={`text-center text-sm focus:outline-none focus:ring-0 focus:border-none border-none rounded-none h-full bg-transparent p-0 mb-0 ${
                  load.weight === null || load.weight === 0
                    ? "placeholder:text-app-red"
                    : ""
                }`}
                step="0.1"
                min="0"
                variant="empty"
              />
            </div>

            {/* Screen Type Select - Right Side (Wider) */}
            <div className="flex-1 p-1 border-l-[3px] border-black">
              <select
                value={load.screenType || ""}
                onChange={(e) => handleScreenTypeChange(index, e.target.value)}
                onBlur={() => handleUpdateLoad(load)}
                className="w-full h-full text-center text-sm border-none rounded-none focus:outline-none focus:ring-0 bg-transparent"
              >
                {SCREEN_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </SlidingDiv>
      ))}
      {editedLoads.length === 0 && (
        <div className="flex flex-col justify-center items-center p-4 text-gray-500">
          <p className="text-sm italic text-center">No loads added yet</p>
          <p className="text-sm italic text-center">Click + to add a load</p>
        </div>
      )}
    </div>
  );
}
