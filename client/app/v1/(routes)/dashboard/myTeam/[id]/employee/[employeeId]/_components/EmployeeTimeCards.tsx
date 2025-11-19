"use client";
import { Inputs } from "@/app/v1/components/(reusable)/inputs";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { Grids } from "@/app/v1/components/(reusable)/grids";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { Images } from "@/app/v1/components/(reusable)/images";
import AppManagerEditTimesheetModal from "./TimesheetEditModal";
import { Button } from "@/app/v1/components/ui/button";
import { useTimesheetDataSimple } from "./_hooks/useTimesheetDataSimple";
import { PullToRefresh } from "@/app/v1/components/(animations)/pullToRefresh";

export default function EmployeeTimeCards() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const t = useTranslations("MyTeam");
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const params = useParams();
  const employeeId = Array.isArray(params.employeeId)
    ? params.employeeId[0]
    : params.employeeId;

  const { data, loading, error, updateDate, date, reset } =
    useTimesheetDataSimple(employeeId);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    updateDate(newDate);
    console.log("Date changed to:", newDate);
  };

  // Use the new API response structure
  const timesheets =
    data && Array.isArray(data.timesheetData) ? data.timesheetData : [];

  return (
    <div className="h-full w-full bg-white rounded-b-2xl">
      <div className="h-full w-full grid grid-rows-10">
        <div className="row-start-1 row-end-2  bg-app-dark-blue h-full w-full p-2 px-4 flex flex-row  gap-4 justify-center items-center">
          <label htmlFor="date" className="text-base text-white">
            {t("SelectDate")}
          </label>
          <Inputs
            type="date"
            name="date"
            id="date"
            value={date}
            className="text-xs bg-white text-center w-full max-w-[170px] border-[3px] py-2 border-black"
            onChange={handleDateChange}
          />
        </div>
        {/* PullToRefresh wraps the timesheet content */}
        <div className="h-full row-start-2 row-end-11 rounded-b-xl overflow-y-auto no-scrollbar p-2 border-4 border-app-dark-blue">
          <PullToRefresh
            onRefresh={reset}
            refreshingText=""
            pullText="Pull to refresh"
            releaseText="Release to refresh"
            textColor="text-app-dark-blue"
          >
            {error && (
              <div className="text-center text-xs text-red-500">{error}</div>
            )}
            {!loading && !error && timesheets.length === 0 && (
              <div className="text-center text-xs text-gray-400">
                No timesheets found for this date.
              </div>
            )}
            {!loading && !error && timesheets.length > 0 && (
              <>
                {timesheets.map((ts, idx) => (
                  <div
                    className="border-black border-[3px] rounded-[10px] mb-2 relative hover:bg-gray-50 transition p-3 flex flex-col gap-2"
                    key={ts.id}
                  >
                    {/* Role icon in top right corner */}
                    <div className="absolute top-2 right-2 z-20 p-2 border border-gray-300 bg-white shadow rounded-full">
                      <img
                        src={
                          ts.workType === "TASCO"
                            ? "/tasco.svg"
                            : ts.workType === "TRUCK_DRIVER"
                            ? "/trucking.svg"
                            : ts.workType === "MECHANIC"
                            ? "/mechanic.svg"
                            : ts.workType === "LABOR"
                            ? "/equipment.svg"
                            : "/profileEmpty.svg"
                        }
                        alt={`${ts.workType} Icon`}
                        className="w-8 h-8 "
                      />
                    </div>
                    <div className="flex flex-col items-start gap-0">
                      <span className="text-xs font-semibold text-gray-500  ">
                        {format(new Date(ts.startTime), "EEEE")}
                      </span>
                      <span className="text-sm font-bold text-app-dark-blue min-w-[90px] text-center">
                        {format(new Date(ts.startTime), "hh:mm a")} -{" "}
                        {ts.endTime
                          ? format(new Date(ts.endTime), "hh:mm a")
                          : "--"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-1">
                      <div className="flex-1">
                        <span className="block text-xs text-gray-500 font-medium">
                          Jobsite
                        </span>
                        <span className="block text-xs text-gray-900 font-semibold">
                          {ts.Jobsite?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="block text-xs text-gray-500 font-medium">
                          Cost Code
                        </span>
                        <span className="block text-xs text-gray-900 font-semibold">
                          {ts.CostCode?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                    {/* Edit button in bottom right corner */}
                    <Button
                      onClick={() => {
                        setEditingId(ts.id);
                        setShowEditModal(true);
                      }}
                      className="absolute bottom-2 right-2 z-20 bg-app-dark-blue text-white rounded-full px-4 py-2 shadow hover:bg-app-dark-blue/90 transition"
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </>
            )}
          </PullToRefresh>
        </div>
      </div>
      {/* Modal rendered outside of PullToRefresh */}
      {showEditModal && editingId && (
        <AppManagerEditTimesheetModal
          timesheetId={editingId}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            reset();
          }}
        />
      )}
    </div>
  );
}
