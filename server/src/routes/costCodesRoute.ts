import { Router } from "express";
import { getCostCodeController } from "../controllers/costCodeController.js";

const router = Router();

// get all cost codes
router.get("/", getCostCodeController);

export default router;
