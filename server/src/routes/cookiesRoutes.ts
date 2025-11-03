import express from "express";
import {
  getCookie,
  setCookie,
  deleteCookie,
  deleteAllCookie,
  getCookieList,
  deleteCookieList,
} from "../controllers/cookiesController.js";

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
