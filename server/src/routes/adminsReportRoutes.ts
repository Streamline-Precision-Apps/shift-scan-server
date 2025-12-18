import { Router } from "express";
import {
  getMechanicReport,
  getTascoReport,
  getTruckingReport,
  getTascoFilterOptions,
} from "../controllers/adminReportController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/tasco", verifyToken, getTascoReport);
router.get("/tasco/filters", verifyToken, getTascoFilterOptions);
router.get("/trucking", verifyToken, getTruckingReport);
router.get("/mechanic", verifyToken, getMechanicReport);

export default router;
