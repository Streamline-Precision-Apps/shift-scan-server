import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  apiLimiter,
  passwordResetLimiter,
} from "../middleware/rateLimitMiddleware.js";
import {
  saveFCMToken,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
  deleteResetToken,
} from "../controllers/tokenController.js";

import {
  saveFCMTokenSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../lib/validation/tokens.js";

const router = Router();

/**
 * @swagger
 * /api/tokens/fcm:
 *   post:
 *     summary: Save FCM token
 *     description: Save a Firebase Cloud Messaging (FCM) token for the authenticated user.
 *     tags:
 *       - Tokens
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveFCMTokenInput'
 *     responses:
 *       200:
 *         description: Token saved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/fcm",
  verifyToken,
  apiLimiter,
  validateRequest(saveFCMTokenSchema),
  saveFCMToken
);

/**
 * @swagger
 * /api/tokens/password-reset:
 *   post:
 *     summary: Request password reset
 *     description: Request a password reset email for a user.
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestPasswordResetInput'
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Invalid input
 */
router.post(
  "/password-reset",
  passwordResetLimiter,
  validateRequest(requestPasswordResetSchema),
  requestPasswordReset
);

/**
 * @swagger
 * /api/tokens/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset a user's password using a valid reset token.
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized or invalid token
 */
router.post(
  "/reset-password",
  passwordResetLimiter,
  validateRequest(resetPasswordSchema),
  resetPassword
);

/**
 * @swagger
 * /api/tokens/verify-reset-token/{token}:
 *   get:
 *     summary: Verify reset token
 *     description: Verify if a password reset token is valid.
 *     tags:
 *       - Tokens
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Invalid token
 */
router.get("/verify-reset-token/:token", apiLimiter, verifyResetToken);

/**
 * @swagger
 * /api/tokens/reset/{token}:
 *   delete:
 *     summary: Delete password reset token
 *     description: Delete a password reset token after use or expiration.
 *     tags:
 *       - Tokens
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     responses:
 *       200:
 *         description: Token deleted successfully
 *       400:
 *         description: Invalid token
 */
router.delete("/reset/:token", apiLimiter, deleteResetToken);

export default router;
