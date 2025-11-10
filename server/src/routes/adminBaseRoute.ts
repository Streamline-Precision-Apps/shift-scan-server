import { Router } from "express";
import { baseController } from "../controllers/adminBaseController.js";

const router = Router();

router.get("/notification-center", baseController);

export default router;
