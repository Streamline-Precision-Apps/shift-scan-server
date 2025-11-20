
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cab1c3b3-9bd0-5f60-88cf-d6d98caec58b")}catch(e){}}();
import { Router } from "express";
import { getCostCodesController, archiveCostCodeController, createCostCodeController, deleteCostCodeController, getCostCodeByIdController, restoreCostCodeController, updateCostCodeController, getCostCodeSummaryController, } from "../controllers/adminCostCodeController.js";
const router = Router();
// /api/v1/admins/cost-codes - get all cost codes
router.get("/", getCostCodesController);
// /api/v1/admins/cost-codes/summary - get cost code summary (must come before /:id)
router.get("/summary", getCostCodeSummaryController);
// /api/v1/admins/cost-codes/:id - get cost code by id
router.get("/:id", getCostCodeByIdController);
// /api/v1/admins/cost-codes/ - create cost code
router.post("/", createCostCodeController);
// /api/v1/admins/cost-codes/:id - update cost code
router.put("/:id", updateCostCodeController);
// /api/v1/admins/cost-codes/:id/archive - archive cost code
router.put("/:id/archive", archiveCostCodeController);
// /api/v1/admins/cost-codes/:id/restore - restore cost code
router.put("/:id/restore", restoreCostCodeController);
// /api/v1/admins/cost-codes/:id - delete cost code
router.delete("/:id", deleteCostCodeController);
export default router;
//# sourceMappingURL=adminsCostCodesRoutes.js.map
//# debugId=cab1c3b3-9bd0-5f60-88cf-d6d98caec58b
