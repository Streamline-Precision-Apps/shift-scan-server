"use client";

import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface TascoFilterOptions {
  jobsiteId: string[];
  shiftType: string[];
  employeeId: string[];
  laborType: string[];
  equipmentId: string[];
  materialType: string[];
}

interface TascoFilterModalProps {
  onFilterChange: (filters: TascoFilterOptions) => void;
  onClose: () => void;
  jobsites?: { id: string; name: string }[];
  employees?: { id: string; name: string }[];
  equipment?: { id: string; name: string }[];
  materialTypes?: { name: string }[];
  filters: TascoFilterOptions;
  handleClearFilters: () => void;
  setFilters: Dispatch<SetStateAction<TascoFilterOptions>>;
}

const TascoFilterModal: React.FC<TascoFilterModalProps> = ({
  onFilterChange,
  onClose,
  jobsites = [],
  employees = [],
  equipment = [],
  materialTypes = [],
  filters,
  setFilters,
  handleClearFilters,
}) => {
  // Local state for filters - only applied when "Apply Filters" is clicked
  const [localFilters, setLocalFilters] = useState<TascoFilterOptions>(filters);
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
    onFilterChange({ ...localFilters });
    onClose();
  };

  const handleClearFiltersLocal = () => {
    const clearedFilters: TascoFilterOptions = {
      jobsiteId: [],
      shiftType: [],
      employeeId: [],
      laborType: [],
      equipmentId: [],
      materialType: [],
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onClose();
  };

  const getActiveFilterCount = () => {
    return (
      localFilters.jobsiteId.length +
      localFilters.shiftType.length +
      localFilters.employeeId.length +
      localFilters.laborType.length +
      localFilters.equipmentId.length +
      localFilters.materialType.length
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
    <div className="flex flex-col gap-4 items-center w-full relative">
      {/* Header Section */}
      <div className="flex flex-col w-full border-b border-gray-200 pb-3">
        <div className="flex flex-row gap-2 items-center">
          <h2 className="text-xl font-bold">Filter Tasco Report</h2>
          <img src="/filterFunnel.svg" alt="Filter" className="h-5 w-5" />
        </div>
        <p className="text-xs text-gray-600 pt-1">
          Apply filters to narrow down the Tasco report data
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-0 right-0 cursor-pointer"
        >
          <X width={20} height={20} />
        </Button>
      </div>

      {/* Filter Content */}
      <div className="flex flex-col gap-6 w-full px-2 py-4">
        <div className="flex flex-row gap-6">
          <div className="flex flex-col space-y-3 w-1/2">
            <div>
              <h3 className="font-medium mb-1 text-xs">Jobsite</h3>
              <Combobox
                options={jobsiteOptions}
                value={localFilters.jobsiteId}
                onChange={(vals: string[]) =>
                  setLocalFilters((f) => ({ ...f, jobsiteId: vals }))
                }
                placeholder="Select jobsite"
              />
            </div>

            <div>
              <h3 className="font-medium mb-1 text-xs">Shift Type</h3>
              <Combobox
                options={shiftTypeOptions}
                value={localFilters.shiftType}
                onChange={(vals: string[]) =>
                  setLocalFilters((f) => ({ ...f, shiftType: vals }))
                }
                placeholder="Select shift type"
              />
            </div>

            <div>
              <h3 className="font-medium mb-1 text-xs">Employee</h3>
              <Combobox
                options={employeeOptions}
                value={localFilters.employeeId}
                onChange={(vals: string[]) =>
                  setLocalFilters((f) => ({ ...f, employeeId: vals }))
                }
                placeholder="Select employee"
              />
            </div>

            <div>
              <h3 className="font-medium mb-1 text-xs">Labor Type</h3>
              <Combobox
                options={laborTypeOptions}
                value={localFilters.laborType}
                onChange={(vals: string[]) =>
                  setLocalFilters((f) => ({ ...f, laborType: vals }))
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
      </div>

      {/* Action buttons */}
      <div className="flex flex-row gap-3 w-full justify-end border-t border-gray-200 pt-4">
        <Button
          variant="outline"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          onClick={handleClearFiltersLocal}
        >
          {getActiveFilterCount() > 1
            ? "Clear Filters"
            : getActiveFilterCount() === 1
              ? "Clear Filter"
              : "Clear"}
        </Button>
        <Button
          className="bg-sky-500 hover:bg-sky-400 text-white"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default TascoFilterModal;
