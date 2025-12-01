
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c50b156e-4bd2-5921-a9e8-ffcdd0a1d2fb")}catch(e){}}();
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
//# debugId=c50b156e-4bd2-5921-a9e8-ffcdd0a1d2fb
