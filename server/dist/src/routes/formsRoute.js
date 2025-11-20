
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a84ccbf3-f5ab-5e12-97c6-a6188c35a246")}catch(e){}}();
import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createFormApproval, createFormSubmission, deleteFormSubmission, getEmployeeRequests, getForms, getUserSubmissions, saveDraft, saveDraftToPending, savePending, updateFormApproval, getFormDraft, getTeamSubmission, getFormSubmission, getManagerFormApproval, getFormTemplate, updateFormSubmission, } from "../controllers/formsController.js";
const router = Router();
// Submission type-specific GET routes
router.get("/formDraft/:id", verifyToken, getFormDraft);
router.get("/teamSubmission/:id", verifyToken, getTeamSubmission);
router.get("/formSubmission/:id", verifyToken, getFormSubmission);
router.get("/managerFormApproval/:id", verifyToken, getManagerFormApproval);
router.get("/form/:id", verifyToken, getFormTemplate);
// Form submission
router.get("/", getForms);
router.post("/submission", verifyToken, createFormSubmission);
router.put("/submission/:id", verifyToken, updateFormSubmission);
router.delete("/submission/:id", verifyToken, deleteFormSubmission);
router.get("/:filter", verifyToken, getUserSubmissions);
// Drafts
router.post("/draft", verifyToken, saveDraft);
router.post("/draft-to-pending", verifyToken, saveDraftToPending);
router.post("/pending", verifyToken, savePending);
// Approvals
router.get("/employeeRequests/:filter", verifyToken, getEmployeeRequests);
router.post("/approval", verifyToken, createFormApproval);
router.put("/approval/update", verifyToken, updateFormApproval);
export default router;
//# sourceMappingURL=formsRoute.js.map
//# debugId=a84ccbf3-f5ab-5e12-97c6-a6188c35a246
