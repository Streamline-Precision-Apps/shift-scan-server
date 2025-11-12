import { Router } from "express";
const router = Router();

import {
  getAllFormTemplatesController,
  getFormTemplateByIdController,
  getFormSubmissionsController,
  createFormTemplateController,
  updateFormTemplateController,
  deleteFormTemplateController,
  archiveFormTemplateController,
  publishFormTemplateController,
  draftFormTemplateController,
  createFormSubmissionController,
  updateFormSubmissionController,
  deleteFormSubmissionController,
  getFormSubmissionByIdController,
  approveFormSubmissionController,
} from "../controllers/adminFormController.js";

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
router.get("/template/:id/submissions", getFormSubmissionsController);

// POST /api/v1/admins/forms/template/:id/submissions
// Creates a new form submission for a given template
router.post("/template/:id/submissions", createFormSubmissionController);

// GET /api/v1/admins/forms/template/:id/submission/:submissionId
// Returns a single form submission by submission ID
router.get(
  "/template/:id/submission/:submissionId",
  getFormSubmissionByIdController
);

// PUT /api/v1/admins/forms/template/:id/submission/:submissionId
// Updates a form submission by submission ID
router.put(
  "/template/:id/submission/:submissionId",
  updateFormSubmissionController
);

// PUT /api/v1/admins/forms/template/:id/submission/:submissionId/approve
// Approves or rejects a form submission by submission ID
router.put(
  "/template/:id/submission/:submissionId/approve",
  approveFormSubmissionController
);

// DELETE /api/v1/admins/forms/template/:id/submission/:submissionId
// Deletes a form submission by submission ID
router.delete(
  "/template/:id/submission/:submissionId",
  deleteFormSubmissionController
);

export default router;
