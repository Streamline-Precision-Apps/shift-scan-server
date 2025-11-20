"use client";

import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Combobox } from "@/components/ui/combobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TascoFilterOptions {
  jobsiteId: string[];
  shiftType: string[];
  employeeId: string[];
  laborType: string[];
  equipmentId: string[];
  materialType: string[];
}

interface TascoFilterProps {
  onFilterChange: (filters: TascoFilterOptions) => void;
  jobsites?: { id: string; name: string }[];
  employees?: { id: string; name: string }[];
  equipment?: { id: string; name: string }[];
  materialTypes?: { name: string }[];
  filters: TascoFilterOptions;
  handleClearFilters: () => void;
  setFilters: Dispatch<SetStateAction<TascoFilterOptions>>;
}

const TascoFilters: React.FC<TascoFilterProps> = ({
  onFilterChange,
  jobsites = [],
  employees = [],
  equipment = [],
  materialTypes = [],
  filters,
  setFilters,
  handleClearFilters,
}) => {
  const [open, setOpen] = useState(false);

  const [jobsiteOptions, setJobsiteOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [employeeOptions, setEmployeeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [equipmentOptions, setEquipmentOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [materialTypeOptions, setMaterialTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const formattedJobsites = jobsites.map((js) => ({
      value: js.id,
      label: js.name,
    }));
    setJobsiteOptions(formattedJobsites);

    const formattedEmployees = employees.map((emp) => ({
      value: emp.id,
      label: emp.name,
    }));
    setEmployeeOptions(formattedEmployees);

    const formattedEquipment = equipment.map((eq) => ({
      value: eq.id,
      label: eq.name,
    }));
    setEquipmentOptions(formattedEquipment);

    const formattedMaterialTypes = materialTypes.map((mt) => ({
      value: mt.name,
      label: mt.name,
    }));
    setMaterialTypeOptions(formattedMaterialTypes);
  }, [jobsites, employees, equipment, materialTypes]);

  const handleApplyFilters = () => {
    onFilterChange({ ...filters });
    setOpen(false);
  };

  const getActiveFilterCount = () => {
    return (
      filters.jobsiteId.length +
      filters.shiftType.length +
      filters.employeeId.length +
      filters.laborType.length +
      filters.equipmentId.length +
      filters.materialType.length
    );
  };

  const shiftTypeOptions = [
    { value: "ABCD Shift", label: "ABCD Shift" },
    { value: "E Shift", label: "E Shift" },
    { value: "F Shift", label: "F Shift" },
  ];

  const laborTypeOptions = [
    { value: "Operator", label: "Operator" },
    { value: "Manual Labor", label: "Manual Labor" },
    { value: "EShift", label: "E Shift" },
    { value: "FShift", label: "F Shift" },
  ];

  return (
    <div className="bg-white rounded-lg w-10 justify-center h-full flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`relative h-full flex items-center justify-center px-3 ${
                  open
                    ? "border-slate-400"
                    : getActiveFilterCount() > 0
                      ? "bg-blue-50 border-blue-300"
                      : ""
                }`}
              >
                <img src="/filterFunnel.svg" alt="Filter" className="h-4 w-4" />
                {getActiveFilterCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 h-5 min-w-5 flex items-center justify-center bg-blue-500 text-white text-xs rounded-full">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Filter Tasco Reports</TooltipContent>
        </Tooltip>
        <PopoverContent
          className="w-[700px] p-4"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <div className="space-t-4">
            <div className="flex flex-row gap-6">
              <div className="flex flex-col space-y-3 w-1/2">
                <div>
                  <h3 className="font-medium mb-1 text-xs">Jobsite</h3>
                  <Combobox
                    options={jobsiteOptions}
                    value={filters.jobsiteId}
                    onChange={(vals: string[]) =>
                      setFilters((f) => ({ ...f, jobsiteId: vals }))
                    }
                    placeholder="Select jobsite"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-1 text-xs">Shift Type</h3>
                  <Combobox
                    options={shiftTypeOptions}
                    value={filters.shiftType}
                    onChange={(vals: string[]) =>
                      setFilters((f) => ({ ...f, shiftType: vals }))
                    }
                    placeholder="Select shift type"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-1 text-xs">Employee</h3>
                  <Combobox
                    options={employeeOptions}
                    value={filters.employeeId}
                    onChange={(vals: string[]) =>
                      setFilters((f) => ({ ...f, employeeId: vals }))
                    }
                    placeholder="Select employee"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-1 text-xs">Labor Type</h3>
                  <Combobox
                    options={laborTypeOptions}
                    value={filters.laborType}
                    onChange={(vals: string[]) =>
                      setFilters((f) => ({ ...f, laborType: vals }))
                    }
                    placeholder="Select labor type"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-3 w-1/2">
                <div>
                  <h3 className="font-medium mb-1 text-xs">Equipment</h3>
                  <Combobox
                    options={equipmentOptions}
                    value={filters.equipmentId}
                    onChange={(vals: string[]) =>
                      setFilters((f) => ({ ...f, equipmentId: vals }))
                    }
                    placeholder="Select equipment"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-1 text-xs">Material</h3>
                  <Combobox
                    options={materialTypeOptions}
                    value={filters.materialType}
                    onChange={(vals: string[]) =>
                      setFilters((f) => ({ ...f, materialType: vals }))
                    }
                    placeholder="Select material type"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs"
              >
                {getActiveFilterCount() > 1
                  ? "Remove Filters"
                  : getActiveFilterCount() === 1
                    ? "Remove Filter"
                    : "Clear"}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleApplyFilters}
                className="text-xs"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TascoFilters;
