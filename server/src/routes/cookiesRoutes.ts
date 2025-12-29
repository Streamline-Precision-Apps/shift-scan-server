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

/**
 * @swagger
 * /api/cookies:
 *   get:
 *     summary: Get a cookie
 *     description: Retrieve a cookie by name.
 *     tags:
 *       - Cookies
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Cookie name
 *     responses:
 *       200:
 *         description: Cookie value
 *       400:
 *         description: Invalid input
 */
router.get("/", validateQuery(getCookieSchema), getCookie);
/**
 * @swagger
 * /api/cookies/list:
 *   get:
 *     summary: Get multiple cookies
 *     description: Retrieve a list of cookies by names.
 *     tags:
 *       - Cookies
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Cookie names (repeat for each)
 *     responses:
 *       200:
 *         description: List of cookie values
 *       400:
 *         description: Invalid input
 */
router.get("/list", validateQuery(getCookieListSchema), getCookieList);
/**
 * @swagger
 * /api/cookies:
 *   post:
 *     summary: Set a cookie
 *     description: Set a cookie by name and value.
 *     tags:
 *       - Cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetCookieInput'
 *     responses:
 *       200:
 *         description: Cookie set successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", validateRequest(setCookieSchema), setCookie);
/**
 * @swagger
 * /api/cookies:
 *   put:
 *     summary: Update a cookie
 *     description: Update a cookie by name and value.
 *     tags:
 *       - Cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetCookieInput'
 *     responses:
 *       200:
 *         description: Cookie updated successfully
 *       400:
 *         description: Invalid input
 */
router.put("/", validateRequest(setCookieSchema), setCookie);
/**
 * @swagger
 * /api/cookies:
 *   delete:
 *     summary: Delete a cookie
 *     description: Delete a cookie by name.
 *     tags:
 *       - Cookies
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Cookie name
 *     responses:
 *       200:
 *         description: Cookie deleted successfully
 *       400:
 *         description: Invalid input
 */
router.delete("/", validateQuery(getCookieSchema), deleteCookie);
/**
 * @swagger
 * /api/cookies/clear-all:
 *   delete:
 *     summary: Delete all cookies
 *     description: Delete all cookies for the current user/session.
 *     tags:
 *       - Cookies
 *     responses:
 *       200:
 *         description: All cookies deleted
 */
router.delete("/clear-all", deleteAllCookie);
/**
 * @swagger
 * /api/cookies/list:
 *   delete:
 *     summary: Delete multiple cookies
 *     description: Delete multiple cookies by names.
 *     tags:
 *       - Cookies
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Cookie names (repeat for each)
 *     responses:
 *       200:
 *         description: Cookies deleted successfully
 *       400:
 *         description: Invalid input
 */
router.delete("/list", validateQuery(deleteCookieListSchema), deleteCookieList);
export default router;
