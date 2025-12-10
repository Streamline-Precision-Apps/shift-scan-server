
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="41418cd9-ea86-50a8-ade0-bac63d76270b")}catch(e){}}();
import { Router } from "express";
const router = Router();
import { getAllFormTemplatesController, getFormTemplateByIdController, getFormSubmissionsController, getFormSubmissionByTemplateIdController, createFormTemplateController, updateFormTemplateController, deleteFormTemplateController, archiveFormTemplateController, publishFormTemplateController, draftFormTemplateController, createFormSubmissionController, updateFormSubmissionController, deleteFormSubmissionController, getFormSubmissionByIdController, approveFormSubmissionController, } from "../controllers/adminFormController.js";
// --- Form Template Routes ---
// GET /api/v1/admins/forms/template
// Returns all form templates (supports filtering, pagination, search)
router.get("/template", getAllFormTemplatesController);
// POST /api/v1/admins/forms/template
// Creates a new form template
router.post("/template", createFormTemplateController);
// GET /api/v1/admins/forms/template/:id
// Returns a single form template by ID
router.get("/template/:id", getFormTemplateByIdController);
// PUT /api/v1/admins/forms/template/:id
// Updates a form template by ID
router.put("/template/:id", updateFormTemplateController);
// PUT /api/v1/admins/forms/template/:id/draft
// Sets a form template to DRAFT status
router.put("/template/:id/draft", draftFormTemplateController);
// PUT /api/v1/admins/forms/template/:id/archive
// Archives a form template by ID
router.put("/template/:id/archive", archiveFormTemplateController);
// PUT /api/v1/admins/forms/template/:id/publish
// Publishes a form template by ID
router.put("/template/:id/publish", publishFormTemplateController);
// DELETE /api/v1/admins/forms/template/:id
// Deletes a form template by ID
router.delete("/template/:id", deleteFormTemplateController);
// --- Form Submission Routes ---
// GET /api/v1/admins/forms/template/:id/submissions
// Returns all submissions for a given form template (supports date range)
router.get("/template/:id/submissions/export", getFormSubmissionsController);
// GET /api/v1/admins/forms/template/:id/submissions-detailed
// Returns all submissions for a given form template with full details (supports pagination, status filter, date range)
router.get("/template/:id/submissions", getFormSubmissionByTemplateIdController);
// POST /api/v1/admins/forms/template/:id/submissions
// Creates a new form submission for a given template
router.post("/template/:id/submissions", createFormSubmissionController);
// GET /api/v1/admins/forms/submissions/:submissionId
// Returns a single form submission by submission ID
router.get("/submissions/:submissionId", getFormSubmissionByIdController);
// PUT /api/v1/admins/forms/submissions/:submissionId
// Updates a form submission by submission ID
router.put("/submissions/:submissionId", updateFormSubmissionController);
// PUT /api/v1/admins/forms/submissions/:submissionId/approve
// Approves or rejects a form submission by submission ID
router.put("/submissions/:submissionId/approve", approveFormSubmissionController);
// DELETE /api/v1/admins/forms/submissions/:submissionId
// Deletes a form submission by submission ID
router.delete("/submissions/:submissionId", deleteFormSubmissionController);
export default router;
//# sourceMappingURL=adminsFormRoutes.js.map
//# debugId=41418cd9-ea86-50a8-ade0-bac63d76270b
