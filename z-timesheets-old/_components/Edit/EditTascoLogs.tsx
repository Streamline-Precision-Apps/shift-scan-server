import React from "react";
import { Button } from "@/components/ui/button";
import {
  TascoLog,
  TruckingNestedTypeMap,
  TimesheetData,
  TruckingNestedType,
  TascoNestedType,
  TascoNestedTypeMap,
} from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { X, Plus } from "lucide-react";

interface EditTascoLogsProps {
  logs: TascoLog[];
  onLogChange: (
    idx: number,
    field: keyof TascoLog,
    value: string | number | null | { id: string; name: string },
  ) => void;
  handleNestedLogChange: <T extends TascoNestedType>(
    logType: keyof TimesheetData,
    logIndex: number,
    nestedType: T,
    nestedIndex: number,
    field: keyof TascoNestedTypeMap[T],
    value: string | number | null,
  ) => void;
  originalLogs?: TascoLog[];
  onUndoLogField?: (idx: number, field: keyof TascoLog) => void;
  materialTypeOptions: {
    value: string;
    label: string;
  }[];
  equipmentOptions: {
    value: string;
    label: string;
  }[];
  addTascoRefuelLog: (logIdx: number) => void;
  deleteTascoRefuelLog: (logIdx: number, refIdx: number) => void;
  addTascoFLoad: (logIdx: number) => void;
  deleteTascoFLoad: (logIdx: number, fLoadIdx: number) => void;
}

export const EditTascoLogs: React.FC<EditTascoLogsProps> = ({
  logs,
  onLogChange,
  originalLogs = [],
  onUndoLogField,
  materialTypeOptions,
  equipmentOptions,
  handleNestedLogChange,
  addTascoRefuelLog,
  deleteTascoRefuelLog,
  addTascoFLoad,
  deleteTascoFLoad,
}) => {
  // Helper function to check completeness of a Tasco RefuelLog
  const isTascoRefuelLogComplete = (
    ref: TimesheetData["TascoLogs"][number]["RefuelLogs"][number],
  ) => !!(ref.gallonsRefueled && ref.gallonsRefueled > 0);

  // Helper function to check completeness of a TascoFLoad
  const isTascoFLoadComplete = (
    load: TimesheetData["TascoLogs"][number]["TascoFLoads"][number],
  ) => !!(load.weight && load.weight > 0 && load.screenType);

  // Helper function to check if this is an F-shift
  const isFShift = (log: TascoLog) => log.shiftType === "F Shift";

  return (
    <div className="col-span-2 ">
      <div className="flex flex-col border-t border-gray-100 ">
        <h3 className="font-semibold text-base py-2">Tasco Summary</h3>
      </div>

      {logs.map((log, idx) => (
        <div
          key={log.id}
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
                  <Select
                    name="equipmentId"
                    value={log.Equipment?.id || ""}
                    onValueChange={(val) => {
                      const selected = equipmentOptions.find(
                        (eq) => eq.value === val,
                      );
                      onLogChange(
                        idx,
                        "Equipment",
                        selected
                          ? { id: selected.value, name: selected.label }
                          : null,
                      );
                    }}
                  >
                    <SelectTrigger className="bg-white w-[350px] text-xs">
                      <SelectValue placeholder="Select Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentOptions.map((eq) => (
                        <SelectItem key={eq.value} value={eq.value}>
                          {eq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {originalLogs[idx] &&
                  originalLogs[idx].Equipment !== undefined &&
                  (log.Equipment?.id !== originalLogs[idx].Equipment?.id ||
                    log.Equipment?.name !==
                      originalLogs[idx].Equipment?.name) &&
                  onUndoLogField && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        size="default"
                        className="w-fit"
                        onClick={() => {
                          onUndoLogField(idx, "Equipment");
                        }}
                      >
                        <p className="text-xs">Undo</p>
                      </Button>
                    </div>
                  )}
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-[350px]">
                  <label htmlFor="shiftType" className="block text-xs">
                    Shift Type
                  </label>
                  <Select
                    name="shiftType"
                    value={log.shiftType || ""}
                    onValueChange={(val) => onLogChange(idx, "shiftType", val)}
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
                {originalLogs[idx] &&
                  log.shiftType !== originalLogs[idx].shiftType &&
                  onUndoLogField && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        size="default"
                        className="w-fit"
                        onClick={() => onUndoLogField(idx, "shiftType")}
                      >
                        <p className="text-xs">Undo</p>
                      </Button>
                    </div>
                  )}
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
                      value={log.laborType || ""}
                      onValueChange={(val) =>
                        onLogChange(idx, "laborType", val)
                      }
                    >
                      <SelectTrigger className="bg-white w-[350px] text-xs">
                        <SelectValue placeholder="Select Labor Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Operator">Operator</SelectItem>
                        <SelectItem value="Manual Labor">
                          Manual Labor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {originalLogs[idx] &&
                    log.laborType !== originalLogs[idx].laborType &&
                    onUndoLogField && (
                      <div className="flex items-end">
                        <Button
                          type="button"
                          size="default"
                          className="w-fit"
                          onClick={() => onUndoLogField(idx, "laborType")}
                        >
                          <p className="text-xs">Undo</p>
                        </Button>
                      </div>
                    )}
                </div>
              )}
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-[350px]">
                <label htmlFor="materialType" className="block text-xs">
                  Material Type
                </label>
                <Select
                  name="materialType"
                  value={log.materialType || ""}
                  onValueChange={(val) => onLogChange(idx, "materialType", val)}
                >
                  <SelectTrigger className="bg-white w-[350px] text-xs">
                    <SelectValue placeholder="Select Material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypeOptions.map((type, index) => (
                      <SelectItem key={index} value={type.label}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {originalLogs[idx] &&
                log.materialType !== originalLogs[idx].materialType &&
                onUndoLogField && (
                  <div className="flex items-end">
                    <Button
                      type="button"
                      size="default"
                      className="w-fit"
                      onClick={() => onUndoLogField(idx, "materialType")}
                    >
                      <p className="text-xs">Undo</p>
                    </Button>
                  </div>
                )}
            </div>
            {/* Load Count - Only show for non-F-shift */}
            {!isFShift(log) && (
              <div className="flex flex-row gap-4">
                <div className="w-[350px]">
                  <label className="block text-xs">Number of Loads</label>
                  <Input
                    type="number"
                    placeholder={"Enter number of loads"}
                    value={log.LoadQuantity ? log.LoadQuantity : ""}
                    onChange={(e) =>
                      onLogChange(idx, "LoadQuantity", Number(e.target.value))
                    }
                    className="bg-white border rounded px-2 py-1 w-full text-xs"
                  />
                </div>
                {originalLogs[idx] &&
                  log.LoadQuantity !== originalLogs[idx].LoadQuantity &&
                  onUndoLogField && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        size="default"
                        className="w-fit"
                        onClick={() => onUndoLogField(idx, "LoadQuantity")}
                      >
                        <p className="text-xs">Undo</p>
                      </Button>
                    </div>
                  )}
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
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                  title={
                    log.TascoFLoads &&
                    log.TascoFLoads.length > 0 &&
                    !isTascoFLoadComplete(
                      log.TascoFLoads[log.TascoFLoads.length - 1],
                    )
                      ? "Please complete the previous F-Load entry before adding another."
                      : ""
                  }
                >
                  <Plus className="h-8 w-8" color="white" />
                </Button>
              </div>
              {log.TascoFLoads && log.TascoFLoads.length > 0
                ? log.TascoFLoads.map((fLoad, fLoadIdx) => {
                    // Find the original value for this F-load (by index)
                    const originalFLoad =
                      originalLogs[idx]?.TascoFLoads &&
                      originalLogs[idx].TascoFLoads[fLoadIdx];
                    const showUndo =
                      originalFLoad &&
                      (fLoad.weight !== originalFLoad.weight ||
                        fLoad.screenType !== originalFLoad.screenType) &&
                      onUndoLogField;
                    return (
                      <div
                        key={
                          fLoad.id
                            ? fLoad.id.toString()
                            : `fload-${idx}-${fLoadIdx}`
                        }
                        className="bg-slate-50 flex gap-2 my-2 items-end border p-2 rounded relative"
                      >
                        <div>
                          <label className="block text-xs">Weight (tons)</label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Enter weight"
                            value={
                              fLoad.weight && fLoad.weight > 0
                                ? fLoad.weight
                                : ""
                            }
                            onChange={(e) =>
                              handleNestedLogChange(
                                "TascoLogs", // logType
                                idx, // logIndex
                                "TascoFLoads", // nestedType
                                fLoadIdx, // nestedIndex
                                "weight", // field
                                Number(e.target.value),
                              )
                            }
                            className="bg-white w-[150px] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs">Screen Type</label>
                          <Select
                            value={fLoad.screenType || ""}
                            onValueChange={(val) =>
                              handleNestedLogChange(
                                "TascoLogs", // logType
                                idx, // logIndex
                                "TascoFLoads", // nestedType
                                fLoadIdx, // nestedIndex
                                "screenType", // field
                                val || null,
                              )
                            }
                          >
                            <SelectTrigger className="bg-white w-[200px] text-xs">
                              <SelectValue placeholder="Select Screen Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UNSCREENED">
                                Unscreened
                              </SelectItem>
                              <SelectItem value="SCREENED">Screened</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {showUndo && (
                          <div className="w-fit ml-2">
                            <Button
                              type="button"
                              size="default"
                              className="w-fit"
                              onClick={() => onUndoLogField(idx, "TascoFLoads")}
                            >
                              <p className="text-xs">Undo</p>
                            </Button>
                          </div>
                        )}
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTascoFLoad(idx, fLoadIdx)}
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
              <p className="text-base font-semibold">Refuel Logs</p>
              <Button
                type="button"
                size="icon"
                onClick={() => addTascoRefuelLog(idx)}
                disabled={
                  log.RefuelLogs &&
                  log.RefuelLogs.length > 0 &&
                  !isTascoRefuelLogComplete(
                    log.RefuelLogs[log.RefuelLogs.length - 1],
                  )
                }
                className={
                  log.RefuelLogs &&
                  log.RefuelLogs.length > 0 &&
                  !isTascoRefuelLogComplete(
                    log.RefuelLogs[log.RefuelLogs.length - 1],
                  )
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
                title={
                  log.RefuelLogs &&
                  log.RefuelLogs.length > 0 &&
                  !isTascoRefuelLogComplete(
                    log.RefuelLogs[log.RefuelLogs.length - 1],
                  )
                    ? "Please complete the previous Refuel Log entry before adding another."
                    : ""
                }
              >
                <Plus className="h-8 w-8" color="white" />
              </Button>
            </div>
            {log.RefuelLogs && log.RefuelLogs.length > 0
              ? log.RefuelLogs.map((ref, refIdx) => {
                  // Find the original value for this refuel log (by index)
                  const originalRef =
                    originalLogs[idx]?.RefuelLogs &&
                    originalLogs[idx].RefuelLogs[refIdx];
                  const showUndo =
                    typeof originalRef?.gallonsRefueled === "number" &&
                    ref.gallonsRefueled !== originalRef.gallonsRefueled &&
                    onUndoLogField;
                  return (
                    <div
                      key={
                        ref.id ? ref.id.toString() : `refuel-${idx}-${refIdx}`
                      }
                      className="bg-slate-50 flex gap-2 my-2 items-end border p-2 rounded relative"
                    >
                      <div>
                        <label className="block text-xs ">
                          Gallons Refueled
                        </label>
                        <Input
                          type="number"
                          placeholder="Enter total gallons"
                          value={
                            ref.gallonsRefueled > 0 ? ref.gallonsRefueled : ""
                          }
                          onChange={(e) =>
                            handleNestedLogChange(
                              "TascoLogs", // logType
                              idx, // logIndex
                              "RefuelLogs", // nestedType
                              refIdx, // nestedIndex
                              "gallonsRefueled", // field
                              Number(e.target.value),
                            )
                          }
                          className="bg-white w-[350px] text-xs"
                        />
                      </div>
                      {showUndo && (
                        <div className="w-fit ml-2">
                          <Button
                            type="button"
                            size="default"
                            className="w-fit"
                            onClick={() => onUndoLogField(idx, "RefuelLogs")}
                          >
                            <p className="text-xs">Undo</p>
                          </Button>
                        </div>
                      )}
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteTascoRefuelLog(idx, refIdx)}
                        className="absolute top-0 right-0"
                      >
                        <X className="w-4 h-4" color="red" />
                      </Button>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      ))}
    </div>
  );
};
