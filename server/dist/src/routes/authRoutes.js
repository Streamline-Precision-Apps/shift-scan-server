
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c5d4a435-8d93-565b-a086-0df082754dd5")}catch(e){}}();
import express from "express";
import { loginUser, signOutUser } from "../controllers/authController.js";
import { sign } from "crypto";
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
 */
router.post("/login", loginUser);
router.post("/signout", signOutUser);
export default router;
//# sourceMappingURL=authRoutes.js.map
//# debugId=c5d4a435-8d93-565b-a086-0df082754dd5
