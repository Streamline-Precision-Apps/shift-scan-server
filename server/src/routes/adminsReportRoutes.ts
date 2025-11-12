import { Router } from "express";
import {
  getMechanicReport,
  getTascoReport,
  getTruckingReport,
} from "../controllers/adminReportController.js";
const router = Router();

router.get("/tasco", getTascoReport);
router.get("/trucking", getTruckingReport);
router.get("/mechanic", getMechanicReport);

export default router;
