
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="46c7e22c-16fc-5394-ab08-c907e1c57a01")}catch(e){}}();
import { Router } from "express";
import { getCostCodeController } from "../controllers/costCodeController.js";
const router = Router();
// get all cost codes
router.get("/", getCostCodeController);
export default router;
//# sourceMappingURL=costCodesRoute.js.map
//# debugId=46c7e22c-16fc-5394-ab08-c907e1c57a01
