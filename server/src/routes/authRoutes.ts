import express from "express";

import { loginUser, signOutUser } from "../controllers/AuthController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginLimiter, apiLimiter } from "../middleware/rateLimitMiddleware.js";
import { loginSchema } from "../lib/validation/auth.js";
import { requireOnlyCookies } from "../middleware/requireOnlyCookies.js";

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in to get a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts, rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Too many login attempts. Please try again later.
 */
//  loginLimiter,
router.post("/login", loginUser);

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     summary: Sign out and clear authentication cookies
 *     description: |
 *       Signs out the user by clearing all authentication cookies. This endpoint does not accept any body or query parameters—only cookies are allowed. If any body or query parameters are present, a 400 error is returned.
 *     responses:
 *       200:
 *         description: Sign out successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sign out successful
 *       400:
 *         description: Request contained body or query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid request format.
 *       429:
 *         description: Rate limit exceeded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You have made too many requests. Please try again later.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post("/signout", requireOnlyCookies, apiLimiter, signOutUser);

export default router;
