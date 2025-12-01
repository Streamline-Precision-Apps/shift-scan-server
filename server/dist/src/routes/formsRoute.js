<<<<<<< HEAD

<<<<<<< HEAD
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="aa6d4fda-2ba7-5359-b476-0405e8d8ed33")}catch(e){}}();
=======
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ef943d14-eb81-50de-a55d-2e48392b8bb5")}catch(e){}}();
>>>>>>> 3a0b6b0f (rebuilding server  to be updated after add some routes to solve static rendering)
import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createFormApproval, createFormSubmission, deleteFormSubmission, getEmployeeRequests, getForms, getUserSubmissions, saveDraft, saveDraftToPending, savePending, updateFormApproval, getFormDraft, getTeamSubmission, getFormSubmission, getManagerFormApproval, getFormTemplate, updateFormSubmission, getFormsSubmissions, } from "../controllers/formsController.js";
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
<<<<<<< HEAD
//# debugId=aa6d4fda-2ba7-5359-b476-0405e8d8ed33
=======
//# debugId=ef943d14-eb81-50de-a55d-2e48392b8bb5
>>>>>>> 3a0b6b0f (rebuilding server  to be updated after add some routes to solve static rendering)
=======
>>>>>>> 4a3a7255 (After build with finished date polish.)
