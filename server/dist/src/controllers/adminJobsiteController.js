
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="5e5043bc-27ba-541e-a8b7-168002f8cfe0")}catch(e){}}();
import { getAllJobsites, getJobsiteById, createJobsite, updateJobsite, archiveJobsite, restoreJobsite, deleteJobsite, } from "../services/adminJobsiteService.js";
// GET /api/v1/admins/jobsite
export async function getAllJobsitesController(req, res) {
    try {
        const status = typeof req.query.status === "string" ? req.query.status : "";
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageSize = req.query.pageSize
            ? parseInt(req.query.pageSize, 10)
            : 25;
        let skip = (page - 1) * pageSize;
        let totalPages = 1;
        let total = 0;
        const result = await getAllJobsites(status, page, pageSize, skip, totalPages, total);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobsites",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
// GET /api/v1/admins/jobsite/:id
export async function getJobsiteByIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Jobsite ID is required",
            });
        }
        const jobsite = await getJobsiteById(id);
        if (!jobsite) {
            return res.status(404).json({
                success: false,
                message: "Jobsite not found",
            });
        }
        res.status(200).json(jobsite);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobsite",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
// POST /api/v1/admins/jobsite
export async function createJobsiteController(req, res) {
    try {
        const payload = req.body;
        await createJobsite(payload);
        res.status(201).json({
            success: true,
            message: "Jobsite created successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create jobsite",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
// PUT /api/v1/admins/jobsite/:id
export async function updateJobsiteController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Jobsite ID is required",
            });
        }
        const updateData = req.body;
        // You may want to get userId from auth middleware/session
        const updated = await updateJobsite(id, updateData);
        res.status(200).json({
            success: true,
            message: "Jobsite updated successfully",
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update jobsite",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
// PUT /api/v1/admins/jobsite/:id/archive
export async function archiveJobsiteController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Jobsite ID is required",
            });
        }
        await archiveJobsite(id);
        res.status(200).json({
            success: true,
            message: "Jobsite archived successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to archive jobsite",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
// PUT /api/v1/admins/jobsite/:id/restore
export async function restoreJobsiteController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Jobsite ID is required",
            });
        }
        await restoreJobsite(id);
        res.status(200).json({
            success: true,
            message: "Jobsite restored successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to restore jobsite",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
// DELETE /api/v1/admins/jobsite/:id
export async function deleteJobsiteController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Jobsite ID is required",
            });
        }
        await deleteJobsite(id);
        res.status(200).json({
            success: true,
            message: "Jobsite deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete jobsite",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
//# sourceMappingURL=adminJobsiteController.js.map
//# debugId=5e5043bc-27ba-541e-a8b7-168002f8cfe0
