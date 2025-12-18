import { Router } from "express";
import {
  getAllFormTemplatesController,
  getFormTemplateByIdController,
  getFormSubmissionsController,
  getFormSubmissionByTemplateIdController,
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
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createFormTemplateSchema,
  updateFormTemplateSchema,
  createFormSubmissionSchema,
  updateFormSubmissionSchema,
  approveFormSubmissionSchema,
  archiveFormTemplateSchema,
  publishFormTemplateSchema,
  restoreFormTemplateSchema,
} from "../lib/validation/dashboard/form.js";

const router = Router();
// --- Form Template Routes ---

// GET /api/v1/admins/forms/template
// Returns all form templates (supports filtering, pagination, search)
router.get("/template", verifyToken, getAllFormTemplatesController);

// POST /api/v1/admins/forms/template
// Creates a new form template
router.post(
  "/template",
  verifyToken,
  validateRequest(createFormTemplateSchema),
  createFormTemplateController
);
// GET /api/v1/admins/forms/template/:id
// Returns a single form template by ID
router.get("/template/:id", verifyToken, getFormTemplateByIdController);

// PUT /api/v1/admins/forms/template/:id
// Updates a form template by ID
router.put(
  "/template/:id",
  verifyToken,
  validateRequest(updateFormTemplateSchema),
  updateFormTemplateController
);
// PUT /api/v1/admins/forms/template/:id/draft
// Sets a form template to DRAFT status
router.put("/template/:id/draft", verifyToken, draftFormTemplateController);

// PUT /api/v1/admins/forms/template/:id/archive
// Archives a form template by ID
router.put(
  "/template/:id/archive",
  verifyToken,
  validateRequest(archiveFormTemplateSchema),
  archiveFormTemplateController
);
// PUT /api/v1/admins/forms/template/:id/publish
// Publishes a form template by ID
router.put(
  "/template/:id/publish",
  verifyToken,
  validateRequest(publishFormTemplateSchema),
  publishFormTemplateController
);

// DELETE /api/v1/admins/forms/template/:id
// Deletes a form template by ID
router.delete("/template/:id", verifyToken, deleteFormTemplateController);
// --- Form Submission Routes ---

// GET /api/v1/admins/forms/template/:id/submissions
// Returns all submissions for a given form template (supports date range)
router.get(
  "/template/:id/submissions/export",
  verifyToken,
  getFormSubmissionsController
);

// GET /api/v1/admins/forms/template/:id/submissions-detailed
// Returns all submissions for a given form template with full details (supports pagination, status filter, date range)
router.get(
  "/template/:id/submissions",
  verifyToken,
  getFormSubmissionByTemplateIdController
);

// POST /api/v1/admins/forms/template/:id/submissions
// Creates a new form submission for a given template
router.post(
  "/template/:id/submissions",
  verifyToken,
  validateRequest(createFormSubmissionSchema),
  createFormSubmissionController
);

// GET /api/v1/admins/forms/submissions/:submissionId
// Returns a single form submission by submission ID
router.get(
  "/submissions/:submissionId",
  verifyToken,
  getFormSubmissionByIdController
);
// PUT /api/v1/admins/forms/submissions/:submissionId
// Updates a form submission by submission ID
router.put(
  "/submissions/:submissionId",
  verifyToken,
  validateRequest(updateFormSubmissionSchema),
  updateFormSubmissionController
);

// PUT /api/v1/admins/forms/submissions/:submissionId/approve
// Approves or rejects a form submission by submission ID
router.put(
  "/submissions/:submissionId/approve",
  verifyToken,
  validateRequest(approveFormSubmissionSchema),
  approveFormSubmissionController
);

// DELETE /api/v1/admins/forms/submissions/:submissionId
// Deletes a form submission by submission ID
router.delete(
  "/submissions/:submissionId",
  verifyToken,
  deleteFormSubmissionController
);

export default router;
