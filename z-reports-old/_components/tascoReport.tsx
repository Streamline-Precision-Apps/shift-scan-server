"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { TascoReportRow } from "./_tascoReport/tascoReportTableColumns";
import { ExportReportModal } from "./ExportModal";
import { format } from "date-fns";
import { TascoDataTable } from "./_tascoReport/TascoDataTable";
import { TascoFilterOptions } from "./TascoFilterModal";

interface TascoReportProps {
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  showFilterModal?: boolean;
  setShowFilterModal?: (show: boolean) => void;
  dateRange?: { from: Date | undefined; to: Date | undefined };
  registerReload?: (reloadFn: () => Promise<void>) => void;
  isRefreshing?: boolean;
  externalFilters?: TascoFilterOptions;
}

type DateRange = { from: Date | undefined; to: Date | undefined };

interface FilterOptionsData {
  jobsites: { id: string; name: string }[];
  employees: { id: string; name: string }[];
  equipment: { id: string; name: string }[];
  materialTypes: { name: string }[];
}

export default function TascoReport({
  showExportModal,
  setShowExportModal,
  showFilterModal,
  setShowFilterModal,
  dateRange: externalDateRange,
  registerReload,
  isRefreshing,
  externalFilters,
}: TascoReportProps) {
  const [data, setData] = useState<TascoReportRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter state
  const [filters, setFilters] = useState<TascoFilterOptions>({
    jobsiteId: [],
    shiftType: [],
    employeeId: [],
    laborType: [],
    equipmentId: [],
    materialType: [],
  });

  // Filter options state
  const [filterOptions, setFilterOptions] = useState<FilterOptionsData>({
    jobsites: [],
    employees: [],
    equipment: [],
    materialTypes: [],
  });

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  // Build query string from filters
  const buildQueryString = useCallback(
    (activeFilters: TascoFilterOptions) => {
      const params = new URLSearchParams();

      // Add external date range if provided
      if (externalDateRange?.from) {
        params.set("dateFrom", externalDateRange.from.toISOString());
      }
      if (externalDateRange?.to) {
        params.set("dateTo", externalDateRange.to.toISOString());
      }

      if (activeFilters.jobsiteId.length > 0) {
        params.set("jobsiteIds", activeFilters.jobsiteId.join(","));
      }
      if (activeFilters.shiftType.length > 0) {
        params.set("shiftTypes", activeFilters.shiftType.join(","));
      }
      if (activeFilters.employeeId.length > 0) {
        params.set("employeeIds", activeFilters.employeeId.join(","));
      }
      if (activeFilters.laborType.length > 0) {
        params.set("laborTypes", activeFilters.laborType.join(","));
      }
      if (activeFilters.equipmentId.length > 0) {
        params.set("equipmentIds", activeFilters.equipmentId.join(","));
      }
      if (activeFilters.materialType.length > 0) {
        params.set("materialTypes", activeFilters.materialType.join(","));
      }

      return params.toString();
    },
    [externalDateRange],
  );

  // Memoized fetch data function with proper dependencies
  const fetchData = useCallback(
    async (useFilters = true) => {
      try {
        setLoading(true);
        // Use external filters if available, otherwise use internal filters
        const activeFilters = externalFilters || filters;
        const queryString = useFilters ? buildQueryString(activeFilters) : "";
        const url = `/api/reports/tasco${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url);
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.message || "Failed to fetch Tasco report data");
        }

        setData(json);
      } catch (error) {
        console.error("Error fetching Tasco report data:", error);
      } finally {
        setLoading(false);
      }
    },
    [externalFilters, filters, buildQueryString],
  );

  // Debounced fetch data function with proper dependencies
  const debouncedFetchData = useCallback(
    (useFilters = true, delay = 300) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchData(useFilters);
        debounceTimerRef.current = null;
      }, delay);
    },
    [fetchData],
  );

  // Consolidated effect for all data-affecting changes
  useEffect(() => {
    // Skip initial mount as it's handled by the registerReload effect
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Debounce subsequent fetches to prevent duplicate calls
    debouncedFetchData();

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debouncedFetchData]);

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await fetch("/api/reports/tasco", {
        method: "POST",
      });
      if (response.ok) {
        const options = await response.json();
        setFilterOptions(options);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Initial load and register reload function
  useEffect(() => {
    if (registerReload) {
      registerReload(() => fetchData(true));
    }
    fetchFilterOptions();

    // Initial load - don't debounce the first fetch
    fetchData();
  }, [registerReload]);

  const onExport = (
    exportFormat: "csv" | "xlsx",
    _dateRange?: { from?: Date; to?: Date },
    selectedFields?: string[],
  ) => {
    if (!data.length) return;
    // Use the current filtered data for export
    const exportData = data;

    const tableHeaders = [
      "Shift Type",
      "Submitted Date",
      "Employee",
      "Profit ID",
      "Date Worked",
      "Labor Type",
      "Equipment Details [equipment moved: starting location -> ending location (mileage)]",
      "Loads - ABCDE",
      "Loads - F",
      "Material Hauled Details [Material: Quantity - Location]",
      "Start Time",
      "End Time",
      "Screened or Unscreened",
    ];

    if (exportFormat === "csv") {
      const csvRows = [
        tableHeaders.join(","),
        ...exportData.map((row) =>
          [
            row.shiftType === "ABCD Shift"
              ? "TASCO - A, B, C, D Shift"
              : row.shiftType === "E Shift"
                ? "TASCO - E Shift Mud Conditioning"
                : row.shiftType,
            format(new Date(row.submittedDate), "yyyy-MM-dd"),
            row.employee,
            row.profitId || "-",
            format(new Date(row.dateWorked), "yyyy-MM-dd"),
            row.laborType === "tascoAbcdEquipment"
              ? "Equipment Operator"
              : row.laborType === "tascoEEquipment"
                ? "Equipment Operator"
                : row.laborType === "tascoAbcdLabor"
                  ? "Manual Labor"
                  : row.laborType || "-",
            row.equipment || "-",
            row.loadsABCDE !== null && row.loadsABCDE !== undefined
              ? row.loadsABCDE
              : "-",
            row.loadsF !== null && row.loadsF !== undefined ? row.loadsF : "-",
            row.materials || "-",
            format(new Date(row.startTime), "HH:mm") || "-",
            format(new Date(row.endTime), "HH:mm") || "-",
            row.LoadType === "SCREENED"
              ? "Screened"
              : row.LoadType === "UNSCREENED"
                ? "Unscreened"
                : "-",
          ]
            .map((cell) => {
              if (cell === null || cell === undefined) return "";
              const str = String(cell);
              // Always quote, and escape quotes inside
              return '"' + str.replace(/"/g, '""') + '"';
            })
            .join(","),
        ),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tasco-report.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (exportFormat === "xlsx") {
      import("xlsx").then((XLSX) => {
        const ws = XLSX.utils.json_to_sheet(
          exportData.map((row) => ({
            "Shift Type":
              row.shiftType === "ABCD Shift"
                ? "TASCO - A, B, C, D Shift"
                : row.shiftType === "E Shift"
                  ? "TASCO - E Shift Mud Conditioning"
                  : row.shiftType,
            "Submitted Date": format(new Date(row.submittedDate), "yyyy/MM/dd"),
            Employee: row.employee,
            "Profit ID": row.profitId || "-",
            "Date Worked": format(new Date(row.dateWorked), "yyyy/MM/dd"),
            "Labor Type":
              row.laborType === "tascoAbcdEquipment"
                ? "Equipment Operator"
                : row.laborType === "tascoEEquipment"
                  ? "Equipment Operator"
                  : row.laborType === "tascoAbcdLabor"
                    ? "Manual Labor"
                    : row.laborType || "-",
            Equipment: row.equipment || "-",
            "Loads - ABCDE":
              row.loadsABCDE !== null && row.loadsABCDE !== undefined
                ? row.loadsABCDE
                : "-",
            "Loads - F":
              row.loadsF !== null && row.loadsF !== undefined
                ? row.loadsF
                : "-",
            Materials: row.materials || "-",
            "Start Time": format(new Date(row.startTime), "HH:mm") || "-",
            "End Time": format(new Date(row.endTime), "HH:mm") || "-",
            "Screened or Unscreened":
              row.LoadType === "SCREENED"
                ? "Screened"
                : row.LoadType === "UNSCREENED"
                  ? "Unscreened"
                  : "-",
          })),
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Tasco Report");
        XLSX.writeFile(wb, "tasco-report.xlsx");
      });
    }
  };

  return (
    <>
      <TascoDataTable data={data} loading={loading} />

      {showExportModal && (
        <ExportReportModal
          onClose={() => setShowExportModal(false)}
          onExport={onExport}
        />
      )}
    </>
  );
}
