
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c11f2def-722a-5589-a59c-0c0bcd037eae")}catch(e){}}();
import { Router } from "express";
import { getMechanicLogsController, createMechanicProjectController, updateMechanicProjectController, deleteMechanicProjectController, getMechanicLogController, } from "../controllers/mechanicLogsController.js";
const router = Router();
router.get("/timesheet/:timesheetId", getMechanicLogsController);
router.get("/:id", getMechanicLogController);
router.post("/", createMechanicProjectController);
router.put("/:id", updateMechanicProjectController);
router.delete("/:id", deleteMechanicProjectController);
export default router;
//# sourceMappingURL=mechanicLogsRoutes.js.map
//# debugId=c11f2def-722a-5589-a59c-0c0bcd037eae
