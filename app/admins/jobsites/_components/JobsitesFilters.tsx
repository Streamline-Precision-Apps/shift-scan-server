"use client";

import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Combobox } from "@/app/v1/components/ui/combobox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/v1/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/app/v1/components/ui/tooltip";
import { Button } from "@/app/v1/components/ui/button";
import { Badge } from "@/app/v1/components/ui/badge";

export interface FilterOptions {
    status: string[];
    approvalStatus: string[];
    hasTimesheets: string[]; // "true" or "false"
}
interface FilterPopoverProps {
    onUseFiltersChange?: (useFilters: boolean) => void;
    filters: FilterOptions;
    handleClearFilters: () => Promise<void>;
    setFilters: Dispatch<SetStateAction<FilterOptions>>;
}

const JobsitesFilters: React.FC<FilterPopoverProps> = ({
    onUseFiltersChange,
    filters,
    setFilters,
    handleClearFilters,
}) => {
    const [open, setOpen] = useState(false);
    // Local state for draft filters (only applied on "Apply" button click)
    const [draftFilters, setDraftFilters] = useState<FilterOptions>(filters);

    const handleApplyFilters = () => {
        // Apply the draft filters to the actual filters
        setFilters(draftFilters);

        // Trigger the refilter
        if (onUseFiltersChange) {
            onUseFiltersChange(true);
        }

        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen) {
            // When opening, sync draft filters with current filters
            setDraftFilters(filters);
        }
        setOpen(newOpen);
    };

    const getActiveFilterCount = () => {
        return (
            filters.status.length +
            filters.approvalStatus.length +
            filters.hasTimesheets.length
        );
    };

    // Set useFilters based on initial filter state
    useEffect(() => {
        const hasActiveFilters = getActiveFilterCount() > 0;
        if (hasActiveFilters && onUseFiltersChange) {
            onUseFiltersChange(true);
        }
    }, []);

    return (
        <div className="bg-white rounded-lg w-10 justify-center h-full flex items-center">
            <Popover open={open} onOpenChange={handleOpenChange}>
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
                                <img
                                    src="/filterFunnel.svg"
                                    alt="Filter"
                                    className="h-4 w-4"
                                />
                                {getActiveFilterCount() > 0 && (
                                    <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 h-5 min-w-5 flex items-center justify-center bg-blue-500 text-white text-xs rounded-full">
                                        {getActiveFilterCount()}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">Filter Jobsites</TooltipContent>
                </Tooltip>
                <PopoverContent
                    className="w-[400px] p-4"
                    align="start"
                    side="bottom"
                    sideOffset={5}
                >
                    <div className="space-t-4">
                        <div className="flex flex-row gap-8 pb-8">
                            <div className="flex flex-col space-y-4 w-full">
                                <div>
                                    <h3 className="font-medium mb-2 text-sm">
                                        Jobsite Status
                                    </h3>
                                    <Combobox
                                        options={[
                                            {
                                                value: "ACTIVE",
                                                label: "Active",
                                            },
                                            { value: "DRAFT", label: "Draft" },
                                            {
                                                value: "ARCHIVED",
                                                label: "Archived",
                                            },
                                        ]}
                                        value={draftFilters.status}
                                        onChange={(vals: string[]) =>
                                            setDraftFilters((f) => ({
                                                ...f,
                                                status: vals,
                                            }))
                                        }
                                        placeholder="Select status"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2 text-sm">
                                        Approval Status
                                    </h3>
                                    <Combobox
                                        options={[
                                            {
                                                value: "APPROVED",
                                                label: "Approved",
                                            },
                                            { value: "DRAFT", label: "Draft" },
                                            {
                                                value: "PENDING",
                                                label: "Pending",
                                            },
                                            {
                                                value: "REJECTED",
                                                label: "Rejected",
                                            },
                                        ]}
                                        value={draftFilters.approvalStatus}
                                        onChange={(vals: string[]) =>
                                            setDraftFilters((f) => ({
                                                ...f,
                                                approvalStatus: vals,
                                            }))
                                        }
                                        placeholder="Select approval status"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2 text-sm">
                                        Linked Timesheets
                                    </h3>
                                    <Combobox
                                        options={[
                                            {
                                                value: "true",
                                                label: "Has Timesheets",
                                            },
                                            {
                                                value: "false",
                                                label: "No Timesheets",
                                            },
                                        ]}
                                        value={draftFilters.hasTimesheets}
                                        onChange={(vals: string[]) =>
                                            setDraftFilters((f) => ({
                                                ...f,
                                                hasTimesheets: vals,
                                            }))
                                        }
                                        placeholder="Select timesheet status"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between pt-2 border-t border-slate-200">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    await handleClearFilters();
                                    setDraftFilters({
                                        status: [],
                                        approvalStatus: [],
                                        hasTimesheets: [],
                                    });
                                    if (onUseFiltersChange) {
                                        onUseFiltersChange(true);
                                    }
                                }}
                                className="text-xs"
                            >
                                {getActiveFilterCount() > 1
                                    ? "Remove Filters"
                                    : "Remove Filter"}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleApplyFilters}
                                className="text-xs"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default JobsitesFilters;
