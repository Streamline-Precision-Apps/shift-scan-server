"use client";

import { useState, useEffect } from "react";
import { TascoReportRow } from "./_tascoReport/tascoReportTableColumns";
import { ExportReportModal } from "./ExportModal";
import { format } from "date-fns";
import { TascoDataTable } from "./_tascoReport/TascoDataTable";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { TascoFilterOptions } from "./TascoFilterModal";

interface TascoReportProps {
    showExportModal: boolean;
    setShowExportModal: (show: boolean) => void;
    dateRange?: { from: Date | undefined; to: Date | undefined };
    registerReload?: (reloadFn: () => Promise<void>) => void;
    isRefreshing?: boolean;
    externalFilters?: TascoFilterOptions;
}

type DateRange = { from: Date | undefined; to: Date | undefined };

export default function TascoReport({
    showExportModal,
    setShowExportModal,
    dateRange: externalDateRange,
    registerReload,
    isRefreshing,
    externalFilters,
}: TascoReportProps) {
    const [allData, setAllData] = useState<TascoReportRow[]>([]);
    const [filteredData, setFilteredData] = useState<TascoReportRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [dateRange, setDateRange] = useState<DateRange>({
        from: undefined,
        to: undefined,
    });

    // Build query string from filters
    const buildQueryString = () => {
        const params = new URLSearchParams();

        if (externalFilters?.jobsiteId?.length) {
            params.append("jobsiteIds", externalFilters.jobsiteId.join(","));
        }
        if (externalFilters?.shiftType?.length) {
            params.append("shiftTypes", externalFilters.shiftType.join(","));
        }
        if (externalFilters?.employeeId?.length) {
            params.append("employeeIds", externalFilters.employeeId.join(","));
        }
        if (externalFilters?.laborType?.length) {
            params.append("laborTypes", externalFilters.laborType.join(","));
        }
        if (externalFilters?.equipmentId?.length) {
            params.append(
                "equipmentIds",
                externalFilters.equipmentId.join(",")
            );
        }
        if (externalFilters?.materialType?.length) {
            params.append(
                "materialTypes",
                externalFilters.materialType.join(",")
            );
        }

        return params.toString();
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const queryString = buildQueryString();
            const url = queryString
                ? `/api/v1/admins/report/tasco?${queryString}`
                : "/api/v1/admins/report/tasco";

            const result = await apiRequest(url, "GET");

            setAllData(result.data || []);
        } catch (error) {
            console.error("Error fetching Tasco report data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter data based on external date range
    useEffect(() => {
        if (!allData.length) {
            setFilteredData([]);
            return;
        }

        let filtered = allData;

        if (externalDateRange?.from && externalDateRange?.to) {
            // If from and to are the same day, filter by the full day
            const isSameDay =
                externalDateRange.from.toDateString() ===
                externalDateRange.to.toDateString();
            if (isSameDay) {
                const startOfDay = new Date(externalDateRange.from);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(externalDateRange.from);
                endOfDay.setHours(23, 59, 59, 999);
                filtered = allData.filter((row) => {
                    const date = new Date(row.dateWorked);
                    return date >= startOfDay && date <= endOfDay;
                });
            } else {
                filtered = allData.filter((row) => {
                    const date = new Date(row.dateWorked);
                    return (
                        date >= externalDateRange.from! &&
                        date <= externalDateRange.to!
                    );
                });
            }
        } else if (externalDateRange?.from) {
            // Only start date provided
            filtered = allData.filter((row) => {
                const date = new Date(row.dateWorked);
                return date >= externalDateRange.from!;
            });
        } else if (externalDateRange?.to) {
            // Only end date provided
            filtered = allData.filter((row) => {
                const date = new Date(row.dateWorked);
                return date <= externalDateRange.to!;
            });
        }

        setFilteredData(filtered);
    }, [allData, externalDateRange]);

    // Register reload function on mount
    useEffect(() => {
        if (registerReload) {
            registerReload(fetchData);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerReload, externalFilters]);

    const onExport = (
        exportFormat: "csv" | "xlsx",
        _dateRange?: { from?: Date; to?: Date },
        selectedFields?: string[]
    ) => {
        if (!filteredData.length) return;
        // Use the already filtered data for export
        const exportData = filteredData;

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
                        row.loadsF !== null && row.loadsF !== undefined
                            ? row.loadsF
                            : "-",
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
                        .join(",")
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
                        "Submitted Date": format(
                            new Date(row.submittedDate),
                            "yyyy/MM/dd"
                        ),
                        Employee: row.employee,
                        "Profit ID": row.profitId || "-",
                        "Date Worked": format(
                            new Date(row.dateWorked),
                            "yyyy/MM/dd"
                        ),
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
                            row.loadsABCDE !== null &&
                            row.loadsABCDE !== undefined
                                ? row.loadsABCDE
                                : "-",
                        "Loads - F":
                            row.loadsF !== null && row.loadsF !== undefined
                                ? row.loadsF
                                : "-",
                        Materials: row.materials || "-",
                        "Start Time":
                            format(new Date(row.startTime), "HH:mm") || "-",
                        "End Time":
                            format(new Date(row.endTime), "HH:mm") || "-",
                        "Screened or Unscreened":
                            row.LoadType === "SCREENED"
                                ? "Screened"
                                : row.LoadType === "UNSCREENED"
                                ? "Unscreened"
                                : "-",
                    }))
                );
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Tasco Report");
                XLSX.writeFile(wb, "tasco-report.xlsx");
            });
        }
    };

    return (
        <>
            <TascoDataTable data={filteredData} loading={loading} />

            {showExportModal && (
                <ExportReportModal
                    onClose={() => setShowExportModal(false)}
                    onExport={onExport}
                />
            )}
        </>
    );
}
