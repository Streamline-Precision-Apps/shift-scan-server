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
/**
 * @swagger
 * /api/v1/admins/forms/template:
 *   get:
 *     tags:
 *       - Admins - Forms
 *     summary: Get all form templates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of form templates
 *       401:
 *         description: Unauthorized
 */
router.get("/template", verifyToken, getAllFormTemplatesController);

/**
 * @swagger
 * /api/v1/admins/forms/template:
 *   post:
 *     tags:
 *       - Admins - Forms
 *     summary: Create a new form template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFormTemplateRequest'
 *     responses:
 *       201:
 *         description: Form template created
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/template",
  verifyToken,
  validateRequest(createFormTemplateSchema),
  createFormTemplateController
);

/**
 * @swagger
 * /api/v1/admins/forms/template/{id}:
 *   get:
 *     tags:
 *       - Admins - Forms
 *     summary: Get form template by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form template retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.get("/template/:id", verifyToken, getFormTemplateByIdController);

/**
 * @swagger
 * /api/v1/admins/forms/template/{id}:
 *   put:
 *     tags:
 *       - Admins - Forms
 *     summary: Update form template by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFormTemplateRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form template updated
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.put(
  "/template/:id",
  verifyToken,
  validateRequest(updateFormTemplateSchema),
  updateFormTemplateController
);

/**
 * @swagger
 * /api/v1/admins/forms/template/{id}/draft:
 *   put:
 *     tags:
 *       - Admins - Forms
 *     summary: Set form template to draft status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form template set to draft
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.put("/template/:id/draft", verifyToken, draftFormTemplateController);

/**
 * @swagger
 * /api/v1/admins/forms/template/{id}/archive:
 *   put:
 *     tags:
 *       - Admins - Forms
 *     summary: Archive form template by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArchiveFormTemplateRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form template archived
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.put(
  "/template/:id/archive",
  verifyToken,
  validateRequest(archiveFormTemplateSchema),
  archiveFormTemplateController
);

/**
 * @swagger
 * /api/v1/admins/forms/template/{id}/publish:
 *   put:
 *     tags:
 *       - Admins - Forms
 *     summary: Publish form template by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PublishFormTemplateRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form template published
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.put(
  "/template/:id/publish",
  verifyToken,
  validateRequest(publishFormTemplateSchema),
  publishFormTemplateController
);

/**
 * @swagger
 * /api/v1/admins/forms/template/{id}:
 *   delete:
 *     tags:
 *       - Admins - Forms
 *     summary: Delete form template by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form template deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.delete("/template/:id", verifyToken, deleteFormTemplateController);
// --- Form Submission Routes ---

/**
 * @swagger
 * /api/v1/admins/forms/template/{id}/submissions/export:
 *   get:
 *     tags:
 *       - Admins - Forms
 *     summary: Export all submissions for a form template
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submissions exported
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.get(
  "/template/:id/submissions/export",
  verifyToken,
  getFormSubmissionsController
);

/**
 * @swagger
 * /api/v1/admins/forms/template/{id}/submissions:
 *   get:
 *     tags:
 *       - Admins - Forms
 *     summary: Get all submissions for a form template (detailed)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submissions retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.get(
  "/template/:id/submissions",
  verifyToken,
  getFormSubmissionByTemplateIdController
);

/**
 * @swagger
 * /api/v1/admins/forms/template/{id}/submissions:
 *   post:
 *     tags:
 *       - Admins - Forms
 *     summary: Create a new form submission for a template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFormSubmissionRequest'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Form submission created
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.post(
  "/template/:id/submissions",
  verifyToken,
  validateRequest(createFormSubmissionSchema),
  createFormSubmissionController
);

/**
 * @swagger
 * /api/v1/admins/forms/submissions/{submissionId}:
 *   get:
 *     tags:
 *       - Admins - Forms
 *     summary: Get form submission by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form submission retrieved
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form submission not found
 */
router.get(
  "/submissions/:submissionId",
  verifyToken,
  getFormSubmissionByIdController
);

/**
 * @swagger
 * /api/v1/admins/forms/submissions/{submissionId}:
 *   put:
 *     tags:
 *       - Admins - Forms
 *     summary: Update form submission by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFormSubmissionRequest'
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form submission updated
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form submission not found
 */
router.put(
  "/submissions/:submissionId",
  verifyToken,
  validateRequest(updateFormSubmissionSchema),
  updateFormSubmissionController
);

/**
 * @swagger
 * /api/v1/admins/forms/submissions/{submissionId}/approve:
 *   put:
 *     tags:
 *       - Admins - Forms
 *     summary: Approve or reject a form submission by ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveFormSubmissionRequest'
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form submission approval updated
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form submission not found
 */
router.put(
  "/submissions/:submissionId/approve",
  verifyToken,
  validateRequest(approveFormSubmissionSchema),
  approveFormSubmissionController
);

/**
 * @swagger
 * /api/v1/admins/forms/submissions/{submissionId}:
 *   delete:
 *     tags:
 *       - Admins - Forms
 *     summary: Delete form submission by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form submission deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form submission not found
 */
router.delete(
  "/submissions/:submissionId",
  verifyToken,
  deleteFormSubmissionController
);

export default router;
