import { Router } from "express";
import {
  getCostCodesController,
  archiveCostCodeController,
  createCostCodeController,
  deleteCostCodeController,
  getCostCodeByIdController,
  restoreCostCodeController,
  updateCostCodeController,
  getCostCodeSummaryController,
} from "../controllers/adminCostCodeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createCostCodeSchema,
  updateCostCodeSchema,
  archiveCostCodeSchema,
  restoreCostCodeSchema,
} from "../lib/validation/dashboard/costcode.js";

const router = Router();

// /api/v1/admins/cost-codes - get all cost codes
router.get("/", verifyToken, getCostCodesController);

// /api/v1/admins/cost-codes/summary - get cost code summary (must come before /:id)
router.get("/summary", verifyToken, getCostCodeSummaryController);

// /api/v1/admins/cost-codes/:id - get cost code by id
router.get("/:id", verifyToken, getCostCodeByIdController);

// /api/v1/admins/cost-codes/ - create cost code
router.post(
  "/",
  verifyToken,
  validateRequest(createCostCodeSchema),
  createCostCodeController
);

// /api/v1/admins/cost-codes/:id - update cost code
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateCostCodeSchema),
  updateCostCodeController
);

// /api/v1/admins/cost-codes/:id/archive - archive cost code
router.put(
  "/:id/archive",
  verifyToken,
  validateRequest(archiveCostCodeSchema),
  archiveCostCodeController
);

// /api/v1/admins/cost-codes/:id/restore - restore cost code
router.put(
  "/:id/restore",
  verifyToken,
  validateRequest(restoreCostCodeSchema),
  restoreCostCodeController
);

// /api/v1/admins/cost-codes/:id - delete cost code
router.delete("/:id", verifyToken, deleteCostCodeController);

export default router;
