import { Router } from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createFormSubmissionSchema,
  updateFormSubmissionSchema,
  saveDraftSchema,
  saveDraftToPendingSchema,
  savePendingSchema,
  createFormApprovalSchema,
  updateFormApprovalSchema,
} from "../lib/validation/app/forms.js";

import { verifyToken } from "../middleware/authMiddleware.js";

import {
  createFormApproval,
  createFormSubmission,
  deleteFormSubmission,
  getEmployeeRequests,
  getForms,
  getUserSubmissions,
  saveDraft,
  saveDraftToPending,
  savePending,
  updateFormApproval,
  getFormDraft,
  getTeamSubmission,
  getFormSubmission,
  getManagerFormApproval,
  getFormTemplate,
  updateFormSubmission,
  getFormsSubmissions,
} from "../controllers/formsController.js";

const router = Router();

/**
 * @swagger
 * /api/v1/forms/:
 *   get:
 *     tags:
 *       - App - Forms
 *     summary: Get all form templates
 *     responses:
 *       200:
 *         description: List of form templates
 *       400:
 *         description: Failed to retrieve forms
 */
router.get("/", getForms);

/**
 * @swagger
 * /api/v1/forms/{filter}:
 *   get:
 *     tags:
 *       - App - Forms
 *     summary: Get user submissions by filter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filter
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, pending, approved, denied, draft]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: week
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of user submissions
 *       401:
 *         description: Unauthorized User
 */
router.get("/:filter", verifyToken, getUserSubmissions);

/**
 * @swagger
 * /api/v1/forms/formDraft/{id}:
 *   get:
 *     tags:
 *       - App - Forms
 *     summary: Get a draft form submission by ID
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
 *         description: Draft form submission
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draft not found
 */
router.get("/formDraft/:id", verifyToken, getFormDraft);

/**
 * @swagger
 * /api/v1/forms/teamSubmission/{id}:
 *   get:
 *     tags:
 *       - App - Forms
 *     summary: Get a team submission by ID
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
 *         description: Team submission
 *       404:
 *         description: Team submission not found
 */
router.get("/teamSubmission/:id", verifyToken, getTeamSubmission);

/**
 * @swagger
 * /api/v1/forms/formSubmission/{id}:
 *   get:
 *     tags:
 *       - App - Forms
 *     summary: Get a form submission by ID
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
 *         description: Form submission
 *       404:
 *         description: Form submission not found
 */
router.get("/formSubmission/:id", verifyToken, getFormSubmission);

/**
 * @swagger
 * /api/v1/forms/managerFormApproval/{id}:
 *   get:
 *     tags:
 *       - App - Forms
 *     summary: Get manager form approval by ID
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
 *         description: Manager form approval
 *       404:
 *         description: Manager form approval not found
 */
router.get("/managerFormApproval/:id", verifyToken, getManagerFormApproval);

/**
 * @swagger
 * /api/v1/forms/form/{id}:
 *   get:
 *     tags:
 *       - App - Forms
 *     summary: Get a form template by ID
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
 *         description: Form template
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Form template not found
 */
router.get("/form/:id", verifyToken, getFormTemplate);

/**
 * @swagger
 * /api/v1/forms/submissions:
 *   get:
 *     tags:
 *       - App - Forms
 *     summary: Get all form submissions
 *     responses:
 *       200:
 *         description: List of form submissions
 *       400:
 *         description: Failed to retrieve form submissions
 */
router.get("/submissions", getFormsSubmissions);

/**
 * @swagger
 * /api/v1/forms/submission:
 *   post:
 *     tags:
 *       - App - Forms
 *     summary: Create a new form submission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formTemplateId
 *               - userId
 *             properties:
 *               formTemplateId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Form submission created
 *       400:
 *         description: Failed to create form submission
 */
router.post(
  "/submission",
  verifyToken,
  validateRequest(createFormSubmissionSchema),
  createFormSubmission
);

/**
 * @swagger
 * /api/v1/forms/submission/{id}:
 *   put:
 *     tags:
 *       - App - Forms
 *     summary: Update a form submission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formData:
 *                 type: object
 *               status:
 *                 type: string
 *               title:
 *                 type: string
 *               formType:
 *                 type: string
 *               isApprovalRequired:
 *                 type: boolean
 *               userId:
 *                 type: string
 *               submittedAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Form submission updated
 *       400:
 *         description: Failed to update form submission
 *   delete:
 *     tags:
 *       - App - Forms
 *     summary: Delete a form submission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Form submission deleted
 *       400:
 *         description: Failed to delete form submission
 */

router.put(
  "/submission/:id",
  verifyToken,
  validateRequest(updateFormSubmissionSchema),
  updateFormSubmission
);

router.delete("/submission/:id", verifyToken, deleteFormSubmission);

/**
 * @swagger
 * /api/v1/forms/draft:
 *   post:
 *     tags:
 *       - App - Forms
 *     summary: Save a draft form submission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formData
 *               - formTemplateId
 *               - userId
 *             properties:
 *               formData:
 *                 type: object
 *               formTemplateId:
 *                 type: string
 *               userId:
 *                 type: string
 *               formType:
 *                 type: string
 *               submissionId:
 *                 type: integer
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Draft saved
 *       400:
 *         description: Failed to save draft
 */

router.post("/draft", verifyToken, validateRequest(saveDraftSchema), saveDraft);

/**
 * @swagger
 * /api/v1/forms/draft-to-pending:
 *   post:
 *     tags:
 *       - App - Forms
 *     summary: Save a draft and move to pending/approved
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formData
 *               - isApprovalRequired
 *               - formTemplateId
 *               - userId
 *             properties:
 *               formData:
 *                 type: object
 *               isApprovalRequired:
 *                 type: boolean
 *               formTemplateId:
 *                 type: string
 *               userId:
 *                 type: string
 *               formType:
 *                 type: string
 *               submissionId:
 *                 type: integer
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Draft moved to pending/approved
 *       400:
 *         description: Failed to save draft to pending
 */
router.post(
  "/draft-to-pending",
  verifyToken,
  validateRequest(saveDraftToPendingSchema),
  saveDraftToPending
);

/**
 * @swagger
 * /api/v1/forms/pending:
 *   post:
 *     tags:
 *       - App - Forms
 *     summary: Save a pending form submission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formData
 *               - formTemplateId
 *               - userId
 *             properties:
 *               formData:
 *                 type: object
 *               formTemplateId:
 *                 type: string
 *               userId:
 *                 type: string
 *               formType:
 *                 type: string
 *               submissionId:
 *                 type: integer
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pending submission saved
 *       400:
 *         description: Failed to save pending submission
 */
router.post(
  "/pending",
  verifyToken,
  validateRequest(savePendingSchema),
  savePending
);

/**
 * @swagger
 * /api/v1/forms/employeeRequests/{filter}:
 *   get:
 *     tags:
 *       - App - Forms
 *     summary: Get employee requests for a manager
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filter
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, approved, <userId>]
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of employee requests
 *       401:
 *         description: Unauthorized User
 */
router.get("/employeeRequests/:filter", verifyToken, getEmployeeRequests);

/**
 * @swagger
 * /api/v1/forms/approval:
 *   post:
 *     tags:
 *       - App - Forms
 *     summary: Create a form approval
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formSubmissionId
 *               - signedBy
 *               - signature
 *               - comment
 *               - approval
 *             properties:
 *               formSubmissionId:
 *                 type: integer
 *               signedBy:
 *                 type: string
 *               signature:
 *                 type: string
 *               comment:
 *                 type: string
 *               approval:
 *                 type: string
 *     responses:
 *       201:
 *         description: Form approval created
 *       400:
 *         description: Failed to create form approval
 */
router.post(
  "/approval",
  verifyToken,
  validateRequest(createFormApprovalSchema),
  createFormApproval
);

/**
 * @swagger
 * /api/v1/forms/approval/update:
 *   put:
 *     tags:
 *       - App - Forms
 *     summary: Update a form approval
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - formSubmissionId
 *               - comment
 *               - managerId
 *               - isApproved
 *             properties:
 *               id:
 *                 type: string
 *               formSubmissionId:
 *                 type: integer
 *               comment:
 *                 type: string
 *               managerId:
 *                 type: string
 *               isApproved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Form approval updated
 *       400:
 *         description: Failed to update form approval
 */
router.put(
  "/approval/update",
  verifyToken,
  validateRequest(updateFormApprovalSchema),
  updateFormApproval
);

export default router;
