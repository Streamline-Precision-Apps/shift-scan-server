
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0291f64d-94f7-5d80-a4c8-1017d855216d")}catch(e){}}();
import { Router } from "express";
import { getCostCodeController } from "../controllers/costCodeController.js";
const router = Router();
// get all cost codes
router.get("/", getCostCodeController);
export default router;
//# sourceMappingURL=costCodesRoute.js.map
//# debugId=0291f64d-94f7-5d80-a4c8-1017d855216d
