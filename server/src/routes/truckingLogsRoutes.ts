import { Router } from "express";
import {
  createTruckingLogsController,
  deleteTruckingLogController,
  getTruckingLogsById,
  getTruckingLogsController,
  updateTruckingLogsController,
} from "../controllers/truckingLogsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createTruckingLogFieldSchema,
  updateTruckingLogFieldSchema,
} from "../lib/validation/app/truckingLogs.js";
const router = Router();

router.get("/user/:userId", verifyToken, getTruckingLogsController);
router.get("/:id", verifyToken, getTruckingLogsById);
router.post(
  "/:id",
  verifyToken,
  validateRequest(createTruckingLogFieldSchema),
  createTruckingLogsController
);

router.put(
  "/:id",
  verifyToken,
  validateRequest(updateTruckingLogFieldSchema),
  updateTruckingLogsController
);

router.delete("/:id", verifyToken, deleteTruckingLogController);

export default router;
