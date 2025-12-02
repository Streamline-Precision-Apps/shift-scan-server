import { apiRequest } from "@/app/lib/utils/api-Utils";
import { format } from "date-fns/format";
import { useState, useEffect, useCallback, useMemo } from "react";

export interface TimesheetEntry {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  workType: string;
  Jobsite?: { name: string };
  CostCode?: { name: string };
}

export interface TimesheetDataResponse {
  timesheetData: TimesheetEntry[];
}

interface UseTimesheetDataReturn {
  data: TimesheetDataResponse | null;
  setData: (data: TimesheetDataResponse | null) => void;
  loading: boolean;
  error: string | null;
  updateDate: (newDate: string) => void;
  reset: () => Promise<void>;
  date: string | undefined;
}

export const useTimesheetDataSimple = (
  employeeId: string | null
): UseTimesheetDataReturn => {
  const [data, setData] = useState<TimesheetDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set currentDate to today by default
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [currentDate, setCurrentDate] = useState<string | undefined>(today);

  const fetchTimesheets = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    setError(null);
    setData(null); // Clear previous data when fetching new data

    try {
      // Use the new backend endpoint and apiRequest util
      const result = await apiRequest(
        `/api/v1/timesheet/user/${employeeId}?date=${currentDate}`,
        "GET"
      );
      // The backend returns { success, data }, so wrap in TimesheetDataResponse shape
      setData({ timesheetData: result.data });
    } catch (err) {
      setError(`Failed to fetch timesheets`);
    } finally {
      setLoading(false);
    }
  }, [employeeId, currentDate]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets, currentDate]);

  const reload = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    fetchTimesheets();
  };

  return {
    data,
    setData,
    loading,
    error,
    date: currentDate,
    updateDate: setCurrentDate,
    reset: reload,
  };
};
