
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f2fccda4-0608-5902-a709-30ae52a68a2c")}catch(e){}}();
import { getAllFormTemplates, getFormTemplateById, getFormSubmissions, getFormSubmissionByTemplateId, createFormTemplate, updateFormTemplate, deleteFormTemplate, archiveFormTemplate, publishFormTemplate, draftFormTemplate, createFormSubmission, updateFormSubmission, deleteFormSubmission, getFormSubmissionById, approveFormSubmission, } from "../services/adminFormService.js";
// GET /api/v1/admins/forms/template
export async function getAllFormTemplatesController(req, res) {
    try {
        const status = Array.isArray(req.query.status)
            ? req.query.status
            : req.query.status
                ? [req.query.status]
                : [];
        const formType = Array.isArray(req.query.formType)
            ? req.query.formType
            : req.query.formType
                ? [req.query.formType]
                : [];
        const search = typeof req.query.search === "string" ? req.query.search : "";
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageSize = req.query.pageSize
            ? parseInt(req.query.pageSize, 10)
            : 10;
        const skip = (page - 1) * pageSize;
        const result = await getAllFormTemplates(search, page, pageSize, skip, status, formType);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch form templates",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function getFormTemplateByIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required parameter: id" });
        }
        const result = await getFormTemplateById(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch form template",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function getFormSubmissionsController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required parameter: id" });
        }
        const { from, to } = req.query;
        if (!from && !to) {
            return res.status(400).json({
                success: false,
                message: "Missing required date range: from or to must be provided",
            });
        }
        const dateRange = {};
        if (from) {
            dateRange.from = new Date(from);
        }
        if (to) {
            dateRange.to = new Date(to);
        }
        const result = await getFormSubmissions(id, dateRange);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch form submissions",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function getFormSubmissionByTemplateIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required parameter: id" });
        }
        // Parse query parameters
        const page = req.query.page ? parseInt(req.query.page, 10) : 1;
        const pageSize = req.query.pageSize
            ? parseInt(req.query.pageSize, 10)
            : 25;
        const search = req.query.search;
        const pendingOnly = req.query.pendingOnly === "true";
        const statusFilter = req.query.statusFilter || "ALL";
        const dateRangeStart = req.query.startDate;
        const dateRangeEnd = req.query.endDate;
        const result = await getFormSubmissionByTemplateId(id, search, page, pageSize, pendingOnly, statusFilter, dateRangeStart || null, dateRangeEnd || null);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch form submissions by template",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function createFormTemplateController(req, res) {
    try {
        const data = req.body;
        const result = await createFormTemplate(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create form template",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function updateFormTemplateController(req, res) {
    try {
        const data = req.body;
        data.formId = req.params.id;
        const result = await updateFormTemplate(data);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update form template",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function deleteFormTemplateController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required parameter: id" });
        }
        const result = await deleteFormTemplate(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete form template",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function archiveFormTemplateController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required parameter: id" });
        }
        const result = await archiveFormTemplate(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to archive form template",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function publishFormTemplateController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required parameter: id" });
        }
        const result = await publishFormTemplate(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to publish form template",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function draftFormTemplateController(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required parameter: id" });
        }
        const result = await draftFormTemplate(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to draft form template",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function createFormSubmissionController(req, res) {
    try {
        const data = req.body;
        const result = await createFormSubmission(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create form submission",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function updateFormSubmissionController(req, res) {
    try {
        const data = req.body;
        if (!req.params.submissionId) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameter: submissionId",
            });
        }
        data.submissionId = Number(req.params.submissionId);
        const result = await updateFormSubmission(data);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update form submission",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function deleteFormSubmissionController(req, res) {
    try {
        if (!req.params.submissionId) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameter: submissionId",
            });
        }
        const submissionId = Number(req.params.submissionId);
        const result = await deleteFormSubmission(submissionId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete form submission",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function getFormSubmissionByIdController(req, res) {
    try {
        if (!req.params.submissionId) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameter: submissionId",
            });
        }
        const submissionId = Number(req.params.submissionId);
        const result = await getFormSubmissionById(submissionId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch form submission",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
export async function approveFormSubmissionController(req, res) {
    try {
        if (!req.params.submissionId) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameter: submissionId",
            });
        }
        const submissionId = Number(req.params.submissionId);
        const { action } = req.body;
        const formData = req.body;
        const result = await approveFormSubmission(submissionId, action, formData);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to approve/reject form submission",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
//# sourceMappingURL=adminFormController.js.map
//# debugId=f2fccda4-0608-5902-a709-30ae52a68a2c
