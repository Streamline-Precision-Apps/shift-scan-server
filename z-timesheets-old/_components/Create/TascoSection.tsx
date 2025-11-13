"use client";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { SingleCombobox } from "@/components/ui/single-combobox";

export type TascoFLoadDraft = {
  id?: string;
  weight: string;
  screenType: "SCREENED" | "UNSCREENED" | "";
};

export type TascoLogDraft = {
  shiftType: "ABCD Shift" | "E Shift" | "F Shift" | "";
  laborType: "Equipment Operator" | "Labor" | "";
  materialType: string;
  loadQuantity: string;
  screenType: "SCREENED" | "UNSCREENED" | "";
  refuelLogs: { gallonsRefueled: string }[];
  equipment: { id: string; name: string }[];
  TascoFLoads?: TascoFLoadDraft[];
};

type Props = {
  tascoLogs: TascoLogDraft[];
  setTascoLogs: React.Dispatch<React.SetStateAction<TascoLogDraft[]>>;
  materialTypes: { id: string; name: string }[];
  equipmentOptions: { value: string; label: string }[];
};

export function TascoSection({
  tascoLogs,
  setTascoLogs,
  materialTypes,
  equipmentOptions,
}: Props) {
  // Helper function to check if this is an F-shift
  const isFShift = (log: TascoLogDraft) => log.shiftType === "F Shift";

  // Helper function to check completeness of a TascoFLoad
  const isTascoFLoadComplete = (load: TascoFLoadDraft) =>
    !!(load.weight && parseFloat(load.weight) > 0 && load.screenType);

  // Function to add a new TascoFLoad to a specific log
  const addTascoFLoad = (logIndex: number) => {
    const updated = [...tascoLogs];
    if (!updated[logIndex].TascoFLoads) {
      updated[logIndex].TascoFLoads = [];
    }
    updated[logIndex].TascoFLoads!.push({
      weight: "",
      screenType: "",
    });
    setTascoLogs(updated);
  };

  // Function to remove a TascoFLoad from a specific log
  const removeTascoFLoad = (logIndex: number, fLoadIndex: number) => {
    const updated = [...tascoLogs];
    if (updated[logIndex].TascoFLoads) {
      updated[logIndex].TascoFLoads!.splice(fLoadIndex, 1);
      setTascoLogs(updated);
    }
  };

  // Function to update a TascoFLoad field
  const updateTascoFLoad = (
    logIndex: number,
    fLoadIndex: number,
    field: keyof TascoFLoadDraft,
    value: string,
  ) => {
    const updated = [...tascoLogs];
    if (
      updated[logIndex].TascoFLoads &&
      updated[logIndex].TascoFLoads![fLoadIndex]
    ) {
      (updated[logIndex].TascoFLoads![fLoadIndex][field] as string) = value;
      setTascoLogs(updated);
    }
  };
  return (
    <div className="col-span-2 ">
      <div className="flex flex-col border-t border-gray-100 ">
        <h3 className="font-semibold text-base py-2">Tasco Summary</h3>
      </div>
      {tascoLogs.map((log, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-6 relative p-2 mb-2 border-b"
        >
          <div className="flex flex-col gap-4 pb-4 border bg-slate-50 rounded p-2">
            {/* Equipment Combobox */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div className="w-[350px]">
                  <label htmlFor="equipmentId" className="block text-xs">
                    Equipment
                  </label>
                  <SingleCombobox
                    options={equipmentOptions}
                    value={log.equipment[0]?.id || ""}
                    onChange={(val, option) => {
                      const updated = [...tascoLogs];
                      updated[idx].equipment[0] = option
                        ? { id: option.value, name: option.label }
                        : { id: "", name: "" };
                      setTascoLogs(updated);
                    }}
                    placeholder="Select Equipment"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-[350px]">
                  <label htmlFor="shiftType" className="block text-xs">
                    Shift Type
                  </label>
                  <Select
                    name="shiftType"
                    value={log.shiftType}
                    onValueChange={(val) => {
                      const updated = [...tascoLogs];
                      updated[idx].shiftType =
                        val as TascoLogDraft["shiftType"];
                      setTascoLogs(updated);
                    }}
                  >
                    <SelectTrigger className="bg-white w-[350px] text-xs">
                      <SelectValue placeholder="Select Shift Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ABCD Shift">ABCD Shift</SelectItem>
                      <SelectItem value="E Shift">E Shift</SelectItem>
                      <SelectItem value="F Shift">F Shift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Labor Type - Only show for ABCD Shift */}
              {log.shiftType === "ABCD Shift" && (
                <div className="flex flex-row gap-4">
                  <div className="w-[350px]">
                    <label htmlFor="laborType" className="block text-xs">
                      Labor Type
                    </label>
                    <Select
                      name="laborType"
                      value={log.laborType}
                      onValueChange={(val) => {
                        const updated = [...tascoLogs];
                        updated[idx].laborType =
                          val as TascoLogDraft["laborType"];
                        setTascoLogs(updated);
                      }}
                    >
                      <SelectTrigger className="bg-white w-[350px] text-xs">
                        <SelectValue placeholder="Select Labor Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equipment Operator">
                          Equipment Operator
                        </SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-[350px]">
                <label htmlFor="materialType" className="block text-xs">
                  Material Type
                </label>
                <SingleCombobox
                  options={materialTypes.map((m) => ({
                    value: m.name,
                    label: m.name,
                  }))}
                  value={log.materialType}
                  onChange={(val) => {
                    const updated = [...tascoLogs];
                    updated[idx].materialType = val;
                    setTascoLogs(updated);
                  }}
                  placeholder="Select Material"
                />
              </div>
            </div>
            {/* Load Count - Only show for non-F-shift */}
            {!isFShift(log) && (
              <div className="flex flex-row gap-4">
                <div className="w-[350px]">
                  <label className="block text-xs">Number of Loads</label>
                  <Input
                    type="number"
                    placeholder="Enter number of loads"
                    value={log.loadQuantity}
                    onChange={(e) => {
                      const updated = [...tascoLogs];
                      updated[idx].loadQuantity = e.target.value;
                      setTascoLogs(updated);
                    }}
                    className="bg-white border rounded px-2 py-1 w-full text-xs"
                  />
                </div>
              </div>
            )}
            {/* F-Shift Load Count Display - Read Only */}
            {isFShift(log) && (
              <div className="flex flex-row gap-4">
                <div className="w-[350px]">
                  <label className="block text-xs">
                    Number of Loads (F-Shift)
                  </label>
                  <Input
                    type="number"
                    value={log.TascoFLoads?.length || 0}
                    readOnly
                    className="bg-gray-100 border rounded px-2 py-1 w-full text-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Load count is managed by adding/removing individual loads
                    below
                  </p>
                </div>
              </div>
            )}
            {/* <div className="flex flex-row gap-4">
              <div className="w-[350px]">
                <label htmlFor="screenType" className="block text-xs">
                  Screen Type
                </label>
                <Select
                  name="screenType"
                  value={log.screenType}
                  onValueChange={(val) => {
                    const updated = [...tascoLogs];
                    updated[idx].screenType =
                      val as TascoLogDraft["screenType"];
                    setTascoLogs(updated);
                  }}
                >
                  <SelectTrigger className="bg-white w-[350px] text-xs">
                    <SelectValue placeholder="Select Screen Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCREENED">Screened</SelectItem>
                    <SelectItem value="UNSCREENED">Unscreened</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div> */}
          </div>

          {/* F-Shift Loads Section - Only show for F-shift */}
          {isFShift(log) && (
            <div className="mb-2 border-t pt-4">
              <div className="flex flex-row justify-between">
                <p className="text-base font-semibold">F-Shift Loads</p>
                <Button
                  type="button"
                  size="icon"
                  onClick={() => addTascoFLoad(idx)}
                  disabled={
                    log.TascoFLoads &&
                    log.TascoFLoads.length > 0 &&
                    !isTascoFLoadComplete(
                      log.TascoFLoads[log.TascoFLoads.length - 1],
                    )
                  }
                  className={
                    log.TascoFLoads &&
                    log.TascoFLoads.length > 0 &&
                    !isTascoFLoadComplete(
                      log.TascoFLoads[log.TascoFLoads.length - 1],
                    )
                      ? "opacity-50"
                      : ""
                  }
                >
                  <Plus className="h-8 w-8" color="white" />
                </Button>
              </div>
              {log.TascoFLoads && log.TascoFLoads.length > 0
                ? log.TascoFLoads.map((fLoad, fLoadIdx) => {
                    return (
                      <div
                        key={`fload-${idx}-${fLoadIdx}`}
                        className="bg-slate-50 flex gap-2 my-2 items-end border p-2 rounded relative"
                      >
                        <div>
                          <label className="block text-xs">Weight (tons)</label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Enter weight"
                            value={fLoad.weight}
                            onChange={(e) =>
                              updateTascoFLoad(
                                idx,
                                fLoadIdx,
                                "weight",
                                e.target.value,
                              )
                            }
                            className="bg-white w-[150px] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs">Screen Type</label>
                          <Select
                            value={fLoad.screenType}
                            onValueChange={(val) =>
                              updateTascoFLoad(
                                idx,
                                fLoadIdx,
                                "screenType",
                                val as TascoFLoadDraft["screenType"],
                              )
                            }
                          >
                            <SelectTrigger className="bg-white w-[150px] text-xs">
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SCREENED">Screened</SelectItem>
                              <SelectItem value="UNSCREENED">
                                Unscreened
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTascoFLoad(idx, fLoadIdx)}
                          className="absolute top-0 right-0"
                        >
                          <X className="w-4 h-4" color="red" />
                        </Button>
                      </div>
                    );
                  })
                : null}
            </div>
          )}

          {/* Refuel Logs Section */}
          <div className="mb-2 border-t pt-4">
            <div className="flex flex-row justify-between ">
              <p className="text-sm font-semibold">Refuel Logs</p>
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  const updated = [...tascoLogs];
                  updated[idx].refuelLogs.push({ gallonsRefueled: "" });
                  setTascoLogs(updated);
                }}
                className=""
                title="Add Refuel Log"
              >
                <img src="/plus-white.svg" alt="add" className="w-4 h-4" />
              </Button>
            </div>
            {log.refuelLogs && log.refuelLogs.length > 0
              ? log.refuelLogs.map((ref, refIdx) => (
                  <div
                    key={refIdx}
                    className="bg-slate-50 flex gap-2 my-2 items-end border p-2 rounded relative"
                  >
                    <div>
                      <label className="block text-xs ">Gallons Refueled</label>
                      <Input
                        type="number"
                        placeholder="Enter total gallons"
                        value={ref.gallonsRefueled}
                        onChange={(e) => {
                          const updated = [...tascoLogs];
                          updated[idx].refuelLogs[refIdx].gallonsRefueled =
                            e.target.value;
                          setTascoLogs(updated);
                        }}
                        className="bg-white w-[350px] text-xs"
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        const updated = [...tascoLogs];
                        updated[idx].refuelLogs = updated[
                          idx
                        ].refuelLogs.filter((_, i) => i !== refIdx);
                        setTascoLogs(updated);
                      }}
                      className="absolute top-0 right-0"
                    >
                      <X className="h-4 w-4" color="red" />
                    </Button>
                  </div>
                ))
              : null}
          </div>
        </div>
      ))}
    </div>
  );
}
