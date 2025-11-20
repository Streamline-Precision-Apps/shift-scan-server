
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2923d2ec-6db8-53b6-bc21-fc54bb3eb08a")}catch(e){}}();
import { Router } from "express";
import { getTagSummaryController, getTagByIdController, createTagController, updateTagController, deleteTagController, } from "../controllers/adminTagsController.js";
const router = Router();
// /api/v1/admins/tags - gets all tags for admin -- summary
router.get("/", getTagSummaryController);
// /api/v1/admins/tags/:id - get tag by id
router.get("/:id", getTagByIdController);
// /api/v1/admins/tags/ - create tag
router.post("/", createTagController);
// /api/v1/admins/tags/:id - update tag
router.put("/:id", updateTagController);
// /api/v1/admins/tags/:id - delete tag
router.delete("/:id", deleteTagController);
export default router;
//# sourceMappingURL=adminsTagsRoutes.js.map
//# debugId=2923d2ec-6db8-53b6-bc21-fc54bb3eb08a
