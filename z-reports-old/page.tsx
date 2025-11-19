"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageHeaderContainer } from "../_pages/PageHeaderContainer";
import TascoReport from "./_components/tascoReport";
import TruckingReport from "./_components/truckingReport";
import MechanicReport from "./_components/mechanicReport";
import TascoFilterModal, {
  TascoFilterOptions,
} from "./_components/TascoFilterModal";

type DateRange = { from: Date | undefined; to: Date | undefined };

interface Employee {
  id: string;
  name: string;
}

interface FilterOptionsData {
  jobsites: Array<{ id: string; name: string }>;
  employees: Employee[];
  equipment: Array<{ id: string; name: string }>;
  materialTypes: Array<{ name: string }>;
}

export default function AdminReports() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined,
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  // For reload button state
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Filter state for Tasco report
  const [tascoFilters, setTascoFilters] = useState<TascoFilterOptions>({
    jobsiteId: [],
    shiftType: [],
    employeeId: [],
    laborType: [],
    equipmentId: [],
    materialType: [],
  });
  const [filterOptions, setFilterOptions] = useState<{
    jobsites: { id: string; name: string }[];
    employees: { id: string; name: string }[];
    equipment: { id: string; name: string }[];
    materialTypes: { name: string }[];
  }>({
    jobsites: [],
    employees: [],
    equipment: [],
    materialTypes: [],
  });
  // Ref to hold reload functions for each report
  const reportReloaders = useRef<{
    [key: string]: (() => Promise<void>) | undefined;
  }>({});

  // Called by ReloadBtnSpinner
  const fetchData = async () => {
    if (selectedReportId && reportReloaders.current[selectedReportId]) {
      setIsRefreshing(true);
      try {
        await reportReloaders.current[selectedReportId]!();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // Fetch filter options on component mount (like timesheet page)
  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const res = await fetch("/api/getJobsiteSummary");
        const data = await res.json();
        const filteredJobsites = data
          .filter(
            (jobsite: { id: string; name: string; approvalStatus: string }) =>
              jobsite.approvalStatus !== "REJECTED",
          )
          .map((jobsite: { id: string; name: string }) => ({
            id: jobsite.id,
            name: jobsite.name,
          }));
        setFilterOptions((prev) => ({
          ...prev,
          jobsites: filteredJobsites || [],
        }));
      } catch (error) {
        console.error("Error fetching jobsites:", error);
      }
    };

    const fetchEquipment = async () => {
      try {
        const res = await fetch("/api/equipmentIdNameQrIdAndCode");
        const data = await res.json();
        const filteredEquipment = data.map(
          (equipment: { id: string; name: string }) => ({
            id: equipment.id,
            name: equipment.name,
          }),
        );
        setFilterOptions((prev) => ({
          ...prev,
          equipment: filteredEquipment || [],
        }));
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };

    const fetchEmployeesAndMaterials = async () => {
      try {
        // Get employees who have Tasco logs from the existing API
        const response = await fetch("/api/reports/tasco", {
          method: "POST",
        });
        if (response.ok) {
          const options = await response.json();
          // Transform employees data to match expected format
          const formattedEmployees =
            options.employees?.map(
              (emp: Employee): Employee => ({
                id: emp.id,
                name: emp.name,
              }),
            ) || [];

          setFilterOptions((prev) => ({
            ...prev,
            employees: formattedEmployees,
            materialTypes: options.materialTypes || [],
          }));
        }
      } catch (error) {
        console.error("Error fetching employees and materials:", error);
      }
    };

    // Fetch all filter data on mount
    fetchJobsites();
    fetchEquipment();
    fetchEmployeesAndMaterials();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: TascoFilterOptions) => {
    setTascoFilters(newFilters);
    setShowFilterModal(false);
    // Trigger data refetch if there's a Tasco report reloader
    if (reportReloaders.current["tasco-report"]) {
      reportReloaders.current["tasco-report"]();
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    const clearedFilters: TascoFilterOptions = {
      jobsiteId: [],
      shiftType: [],
      employeeId: [],
      laborType: [],
      equipmentId: [],
      materialType: [],
    };
    setTascoFilters(clearedFilters);
    setShowFilterModal(false);
    // Trigger data refetch
    if (reportReloaders.current["tasco-report"]) {
      reportReloaders.current["tasco-report"]();
    }
  };
  const reports = [
    {
      id: "tasco-report",
      label: "Tasco Report",
      description:
        "Sorts all Tasco data by date and shows: Shift Type, Submitted Date, Employee, Date worked, Labor Type, Equipment, Loads-ABCDE (for ABCD & E shifts), Loads-F (for F shifts), Materials, Start Time, End Time, Screened or Unscreened",
      render: () => (
        <TascoReport
          showExportModal={showExportModal}
          setShowExportModal={setShowExportModal}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          dateRange={dateRange}
          registerReload={(fn: () => Promise<void>) => {
            reportReloaders.current["tasco-report"] = fn;
          }}
          isRefreshing={isRefreshing}
          externalFilters={tascoFilters}
        />
      ),
    },
    {
      id: "trucking-mileage-report",
      label: "Trucking Reports",
      description:
        "An exportable table of Trucking #, Trailer #, Date, Job #, Equipment Number if MOB, and start and end odometer for overweight loads",
      render: () => (
        <TruckingReport
          showExportModal={showExportModal}
          setShowExportModal={setShowExportModal}
          dateRange={dateRange}
          registerReload={(fn: () => Promise<void>) => {
            reportReloaders.current["trucking-mileage-report"] = fn;
          }}
          isRefreshing={isRefreshing}
        />
      ),
    },
    {
      id: "mechanic-report",
      label: "Mechanic Report",
      description:
        "Shows mechanic project data including employee name, equipment worked on, hours, and comments for each mechanic project",
      render: () => (
        <MechanicReport
          showExportModal={showExportModal}
          setShowExportModal={setShowExportModal}
          dateRange={dateRange}
          registerReload={(fn: () => Promise<void>) => {
            reportReloaders.current["mechanic-report"] = fn;
          }}
          isRefreshing={isRefreshing}
        />
      ),
    },
  ];
  const selectedReport = reports.find((r) => r.id === selectedReportId);
  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-5">
      <PageHeaderContainer
        loading={isRefreshing}
        headerText=" Reports"
        descriptionText="Run select reports and download them in CSV or Excel reports"
        refetch={() => {
          fetchData();
        }}
        reportPage={true}
        selectedReportId={selectedReportId}
      />

      <div className="h-10 w-full flex flex-row justify-between gap-4">
        <div className="flex flex-row gap-4">
          <Select
            name="report"
            onValueChange={setSelectedReportId}
            value={selectedReportId}
          >
            <SelectTrigger className="w-[350px] bg-white">
              <SelectValue placeholder="Select a report" />
            </SelectTrigger>
            <SelectContent>
              {reports.map((report) => (
                <SelectItem key={report.id} value={report.id}>
                  {report.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[300px] justify-between font-normal bg-white"
                disabled={!selectedReportId}
              >
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                  : dateRange.from
                    ? format(dateRange.from, "PPP")
                    : "Select date range"}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <div className="p-4 justify-center flex flex-col items-center">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(value) =>
                    setDateRange({ from: value?.from, to: value?.to })
                  }
                  autoFocus
                />
                {(dateRange.from || dateRange.to) && (
                  <Button
                    variant="outline"
                    className="w-1/2 text-xs text-blue-600 hover:underline mt-2"
                    onClick={() =>
                      setDateRange({ from: undefined, to: undefined })
                    }
                    type="button"
                  >
                    Clear date range
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter button - only show for Tasco report */}
          {selectedReportId === "tasco-report" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowFilterModal(true)}
                  variant={"outline"}
                  size={"icon"}
                  className="rounded-lg min-w-12 h-full bg-white hover:bg-gray-50"
                >
                  <img
                    src="/filterFunnel.svg"
                    alt="Filter"
                    className="h-4 w-4"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center" side="top">
                Filter Tasco Report
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setShowExportModal(true);
                }}
                variant={"default"}
                size={"icon"}
                disabled={!selectedReportId}
                className="rounded-lg min-w-12 h-full hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src="/export-white.svg"
                  alt="Export Form"
                  className="h-4 w-4 "
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center" side="top">
              {selectedReportId ? "Export" : "Select a report to export"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {selectedReport ? (
        selectedReport.render()
      ) : (
        <div className="h-[85vh] rounded-lg w-full relative bg-white overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <p className="text-base text-slate-400 ">
              Select a report to view its details.
            </p>
          </div>
        </div>
      )}

      {/* Tasco Filter Modal */}
      {showFilterModal && selectedReportId === "tasco-report" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-[700px] max-h-[80vh] overflow-y-auto no-scrollbar">
            <div className="px-6 py-4">
              <TascoFilterModal
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilterModal(false)}
                jobsites={filterOptions.jobsites}
                employees={filterOptions.employees}
                equipment={filterOptions.equipment}
                materialTypes={filterOptions.materialTypes}
                filters={tascoFilters}
                handleClearFilters={handleClearFilters}
                setFilters={setTascoFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
