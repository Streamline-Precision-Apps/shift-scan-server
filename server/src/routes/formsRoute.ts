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

// Submission type-specific GET routes
router.get("/formDraft/:id", verifyToken, getFormDraft);
router.get("/teamSubmission/:id", verifyToken, getTeamSubmission);
router.get("/formSubmission/:id", verifyToken, getFormSubmission);
router.get("/managerFormApproval/:id", verifyToken, getManagerFormApproval);
router.get("/form/:id", verifyToken, getFormTemplate);

// Form submission
router.get("/", getForms);
router.get("/submissions", getFormsSubmissions);
router.post(
  "/submission",
  verifyToken,
  validateRequest(createFormSubmissionSchema),
  createFormSubmission
);
router.put(
  "/submission/:id",
  verifyToken,
  validateRequest(updateFormSubmissionSchema),
  updateFormSubmission
);
router.delete("/submission/:id", verifyToken, deleteFormSubmission);
router.get("/:filter", verifyToken, getUserSubmissions);

// Drafts
router.post("/draft", verifyToken, validateRequest(saveDraftSchema), saveDraft);
router.post(
  "/draft-to-pending",
  verifyToken,
  validateRequest(saveDraftToPendingSchema),
  saveDraftToPending
);
router.post(
  "/pending",
  verifyToken,
  validateRequest(savePendingSchema),
  savePending
);

// Approvals
router.get("/employeeRequests/:filter", verifyToken, getEmployeeRequests);
router.post(
  "/approval",
  verifyToken,
  validateRequest(createFormApprovalSchema),
  createFormApproval
);
router.put(
  "/approval/update",
  verifyToken,
  validateRequest(updateFormApprovalSchema),
  updateFormApproval
);

export default router;
