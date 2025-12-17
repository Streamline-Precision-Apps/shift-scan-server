import express from "express";
import {
  getCookie,
  setCookie,
  deleteCookie,
  deleteAllCookie,
  getCookieList,
  deleteCookieList,
} from "../controllers/cookiesController.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  getCookieSchema,
  getCookieListSchema,
  setCookieSchema,
  deleteCookieListSchema,
} from "../lib/validation/app/cookies.js";

const router = express.Router();

router.get("/", validateQuery(getCookieSchema), getCookie);
router.get("/list", validateQuery(getCookieListSchema), getCookieList);
router.post("/", validateRequest(setCookieSchema), setCookie);
router.put("/", validateRequest(setCookieSchema), setCookie);
router.delete("/", validateQuery(getCookieSchema), deleteCookie);
router.delete("/clear-all", deleteAllCookie);
// DELETE /api/cookies/list?name=key1&name=key2
router.delete("/list", validateQuery(deleteCookieListSchema), deleteCookieList);
export default router;
