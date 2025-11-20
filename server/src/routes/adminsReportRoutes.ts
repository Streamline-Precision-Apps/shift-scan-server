import { Router } from "express";
import {
  getMechanicReport,
  getTascoReport,
  getTruckingReport,
  getTascoFilterOptions,
} from "../controllers/adminReportController.js";
const router = Router();

router.get("/tasco", getTascoReport);
router.get("/tasco/filters", getTascoFilterOptions);
router.get("/trucking", getTruckingReport);
router.get("/mechanic", getMechanicReport);

export default router;
