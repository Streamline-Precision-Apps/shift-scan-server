"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/app/v1/components/ui/hover-card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/v1/components/ui/table";

// Define F-Load detail interface
export interface FLoadDetail {
    id: number;
    weight: number | null;
    screenType: "SCREENED" | "UNSCREENED" | null;
}

// Define the TascoReportRow interface (matches the original)
export interface TascoReportRow {
    id: string;
    timeSheetId: number;
    shiftType: string;
    submittedDate: string;
    employee: string;
    employeeId: string;
    dateWorked: string;
    laborType: string;
    equipment: string;
    equipmentId: string;
    profitId: string; // Jobsite name (Profit ID)
    jobsiteId: string;
    loadsABCDE: number;
    loadsF: number;
    fLoadDetails: FLoadDetail[]; // Array of individual F-Load records
    materials: string;
    startTime: string;
    endTime: string;
    LoadType: string;
}

// Create the columns for the TanStack table
export const tascoReportColumns: ColumnDef<TascoReportRow>[] = [
    {
        accessorKey: "shiftType",
        header: () => <div className="text-center">Shift Type</div>,
        cell: ({ row }) => {
            const shiftType = row.getValue("shiftType") as string;
            return (
                <div className="text-xs text-center">
                    {shiftType === "ABCD Shift"
                        ? "TASCO - A, B, C, D Shift"
                        : shiftType === "E shift"
                        ? "TASCO - E Shift Mud Conditioning"
                        : shiftType}
                </div>
            );
        },
    },
    {
        accessorKey: "timeSheetId",
        header: () => <div className="text-center">Timesheet ID</div>,
        cell: ({ row }) => (
            <div className="text-xs text-center">
                {row.getValue("timeSheetId")}
            </div>
        ),
    },
    {
        accessorKey: "submittedDate",
        header: () => <div className="text-center">Submitted Date</div>,
        cell: ({ row }) => {
            const submittedDate = row.getValue("submittedDate") as string;
            return (
                <div className="text-xs text-center">
                    {format(new Date(submittedDate), "yyyy/MM/dd")}
                </div>
            );
        },
    },
    {
        accessorKey: "employee",
        header: () => <div className="text-center">Employee</div>,
        cell: ({ row }) => (
            <div className="text-xs text-center">
                {row.getValue("employee")}
            </div>
        ),
    },
    {
        accessorKey: "profitId",
        header: () => <div className="text-center">Profit ID</div>,
        cell: ({ row }) => {
            const profitId = row.getValue("profitId") as string;
            return <div className="text-xs text-center">{profitId || "-"}</div>;
        },
    },
    {
        accessorKey: "dateWorked",
        header: () => <div className="text-center">Date Worked</div>,
        cell: ({ row }) => {
            const dateWorked = row.getValue("dateWorked") as string;
            return (
                <div className="text-xs text-center">
                    {format(new Date(dateWorked), "yyyy/MM/dd")}
                </div>
            );
        },
    },
    {
        accessorKey: "laborType",
        header: () => <div className="text-center">Labor Type</div>,
        cell: ({ row }) => {
            const laborType = row.getValue("laborType") as string;
            return (
                <div className="text-xs text-center">
                    {laborType === "tascoAbcdEquipment"
                        ? "Equipment Operator"
                        : laborType === "tascoEEquipment"
                        ? "Equipment Operator" // Changed from "-" to "Equipment Operator"
                        : laborType === "tascoAbcdLabor"
                        ? "Manual Labor" // Changed from "Equipment Operator" to "Manual Labor" for clarity
                        : laborType || "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "equipment",
        header: () => <div className="text-center">Equipment</div>,
        cell: ({ row }) => {
            const equipment = row.getValue("equipment") as string;
            return (
                <div className="text-xs text-center">{equipment || "-"}</div>
            );
        },
    },
    {
        accessorKey: "loadsABCDE",
        header: () => <div className="text-center">Loads - ABCDE</div>,
        cell: ({ row }) => {
            const loadsABCDE = row.getValue("loadsABCDE") as number;
            // Show 0 as "0" instead of "-", and handle null/undefined properly
            return (
                <div className="text-xs text-center">
                    {loadsABCDE !== null && loadsABCDE !== undefined
                        ? loadsABCDE
                        : "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "loadsF",
        header: () => <div className="text-center">Loads - F</div>,
        cell: ({ row }) => {
            const loadsF = row.getValue("loadsF") as number;
            const fLoadDetails = row.original.fLoadDetails || [];

            return (
                <div className="text-xs text-center">
                    {Array.isArray(fLoadDetails) && fLoadDetails.length > 0 ? (
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <span className="cursor-pointer underline text-blue-600">
                                    {fLoadDetails.length}
                                </span>
                            </HoverCardTrigger>
                            <HoverCardContent className="p-2 w-[300px]">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                                    Load #
                                                </TableHead>
                                                <TableHead className="text-sm text-center border-r border-gray-200 bg-gray-100">
                                                    Weight (tons)
                                                </TableHead>
                                                <TableHead className="text-sm text-center bg-gray-100">
                                                    Screen Type
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fLoadDetails.map(
                                                (
                                                    load: FLoadDetail,
                                                    rowIdx: number
                                                ) => (
                                                    <TableRow
                                                        key={load.id}
                                                        className={
                                                            rowIdx % 2 === 0
                                                                ? "bg-white"
                                                                : "bg-gray-100"
                                                        }
                                                    >
                                                        <TableCell className="px-2 py-1 border-b text-center">
                                                            {rowIdx + 1}
                                                        </TableCell>
                                                        <TableCell className="px-2 py-1 border-b text-center">
                                                            {load.weight !==
                                                                null &&
                                                            load.weight !==
                                                                undefined
                                                                ? load.weight
                                                                : "-"}
                                                        </TableCell>
                                                        <TableCell className="px-2 py-1 border-b text-center">
                                                            {load.screenType ||
                                                                "-"}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    ) : loadsF !== null && loadsF !== undefined ? (
                        loadsF
                    ) : (
                        "-"
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "materials",
        header: () => <div className="text-center">Materials</div>,
        cell: ({ row }) => {
            const materials = row.getValue("materials") as string;
            return (
                <div className="text-xs text-center">{materials || "-"}</div>
            );
        },
    },
    {
        accessorKey: "startTime",
        header: () => <div className="text-center">Start Time</div>,
        cell: ({ row }) => {
            const startTime = row.getValue("startTime") as string;
            return (
                <div className="text-xs text-center">
                    {format(new Date(startTime), "HH:mm") || "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "endTime",
        header: () => <div className="text-center">End Time</div>,
        cell: ({ row }) => {
            const endTime = row.getValue("endTime") as string;
            return (
                <div className="text-xs text-center">
                    {format(new Date(endTime), "HH:mm") || "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "LoadType",
        header: () => <div className="text-center">Screened or Unscreened</div>,
        cell: ({ row }) => {
            const loadType = row.getValue("LoadType") as string;
            return (
                <div className="text-xs text-center">
                    {loadType === "SCREENED"
                        ? "Screened"
                        : loadType === "UNSCREENED"
                        ? "Unscreened"
                        : "-"}
                </div>
            );
        },
    },
];
