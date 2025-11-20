
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="0753897a-9f40-5611-914d-519b5a1e1484")}catch(e){}}();
import express from "express";
import { getCookie, setCookie, deleteCookie, deleteAllCookie, getCookieList, deleteCookieList, } from "../controllers/cookiesController.js";
const router = express.Router();
router.get("/", getCookie);
router.get("/list", getCookieList);
router.post("/", setCookie);
router.put("/", setCookie);
router.delete("/", deleteCookie);
router.delete("/clear-all", deleteAllCookie);
// DELETE /api/cookies/list?name=key1&name=key2
router.delete("/list", deleteCookieList);
export default router;
//# sourceMappingURL=cookiesRoutes.js.map
//# debugId=0753897a-9f40-5611-914d-519b5a1e1484
