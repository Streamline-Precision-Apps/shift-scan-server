import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { Texts } from "@/app/v1/components/(reusable)/texts";
import LoadsList from "./LoadsList";
import { createTascoFLoad } from "@/app/lib/actions/tascoActions";
import { Button } from "@/app/v1/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import Spinner from "@/app/v1/components/(animations)/spinner";
import { TascoFLoad } from "./tascoClientPage";

export default function LoadsLayout({
  tascoLog,
  fLoads,
  setFLoads,
  setLoadCount,
}: {
  tascoLog: string | undefined;
  fLoads: TascoFLoad[] | undefined;
  setFLoads: React.Dispatch<React.SetStateAction<TascoFLoad[] | undefined>>;
  setLoadCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const AddFLoad = async () => {
    if (!tascoLog) return;

    try {
      const newFLoad = await createTascoFLoad({
        tascoLogId: tascoLog,
      });

      const newLoad: TascoFLoad = {
        id: newFLoad.id,
        tascoLogId: newFLoad.tascoLogId,
        weight: newFLoad.weight,
        screenType: newFLoad.screenType,
      };

      setFLoads((prev) => [...(prev ?? []), newLoad]);
      setLoadCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding F load:", error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      <Grids rows={"8"} className="h-full w-full">
        <Holds
          background={"white"}
          className={
            "w-full h-full rounded-none row-start-1 row-end-2 border-b-2 border-neutral-200"
          }
        >
          <div className="h-full w-full flex items-center justify-between px-2">
            <Texts size={"sm"} className="">
              Add a load?
            </Texts>

            <Button
              size={"icon"}
              className="bg-app-green hover:bg-app-green w-10 text-black py-1.5 px-3 border-[3px] border-black rounded-[10px] shadow-none"
              onClick={AddFLoad}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Holds>
        <Suspense
          fallback={
            <div className="w-[90%] mx-auto flex-1 row-start-2 row-end-9 overflow-hidden">
              <div className="flex flex-col overflow-y-auto h-full no-scrollbar pt-5 pb-5">
                <div className="w-full">
                  <div className="flex flex-col justify-center items-center p-4 text-gray-500">
                    <Spinner size={40} />
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <div className="w-[90%] mx-auto flex-1 row-start-2 row-end-9 overflow-hidden">
            <div className="flex flex-col overflow-y-auto h-full no-scrollbar pt-3 pb-5">
              <LoadsList
                fLoads={fLoads}
                setFLoads={setFLoads}
                setLoadCount={setLoadCount}
              />
            </div>
          </div>
        </Suspense>
      </Grids>
    </div>
  );
}
