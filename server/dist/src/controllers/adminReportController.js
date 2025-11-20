
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="19e61296-0b8d-51c9-ad94-e6fed8b70138")}catch(e){}}();
import { getTascoReport as getTascoReportService, getTruckingReport as getTruckingReportService, getMechanicReport as getMechanicReportService, getTascoFilterOptions as getTascoFilterOptionsService, } from "../services/adminsReportService.js";
export async function getTascoReport(req, res) {
    try {
        // Parse query parameters
        const filters = {};
        if (req.query.jobsiteIds) {
            filters.jobsiteIds = req.query.jobsiteIds.split(",");
        }
        if (req.query.shiftTypes) {
            filters.shiftTypes = req.query.shiftTypes.split(",");
        }
        if (req.query.employeeIds) {
            filters.employeeIds = req.query.employeeIds.split(",");
        }
        if (req.query.laborTypes) {
            filters.laborTypes = req.query.laborTypes.split(",");
        }
        if (req.query.equipmentIds) {
            filters.equipmentIds = req.query.equipmentIds.split(",");
        }
        if (req.query.materialTypes) {
            filters.materialTypes = req.query.materialTypes.split(",");
        }
        const data = await getTascoReportService(filters);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Tasco report",
            error: error instanceof Error ? error.message : error,
        });
    }
}
export async function getTruckingReport(req, res) {
    try {
        const data = await getTruckingReportService();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Trucking report",
            error: error instanceof Error ? error.message : error,
        });
    }
}
export async function getMechanicReport(req, res) {
    try {
        const data = await getMechanicReportService();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Mechanic report",
            error: error instanceof Error ? error.message : error,
        });
    }
}
export async function getTascoFilterOptions(req, res) {
    try {
        const data = await getTascoFilterOptionsService();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Tasco filter options",
            error: error instanceof Error ? error.message : error,
        });
    }
}
//# sourceMappingURL=adminReportController.js.map
//# debugId=19e61296-0b8d-51c9-ad94-e6fed8b70138
