import { Router } from "express";
import {
  getMechanicLogsController,
  createMechanicProjectController,
  updateMechanicProjectController,
  deleteMechanicProjectController,
  getMechanicLogController,
} from "../controllers/mechanicLogsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createMechanicLogSchema,
  updateMechanicLogSchema,
} from "../lib/validation/app/mechanicLogs.js";

const router = Router();

router.get("/timesheet/:timesheetId", verifyToken, getMechanicLogsController);
router.get("/:id", verifyToken, getMechanicLogController);
router.post(
  "/",
  verifyToken,
  validateRequest(createMechanicLogSchema),
  createMechanicProjectController
);
router.put(
  "/:id",
  verifyToken,
  validateRequest(updateMechanicLogSchema),
  updateMechanicProjectController
);
router.delete("/:id", verifyToken, deleteMechanicProjectController);

export default router;
