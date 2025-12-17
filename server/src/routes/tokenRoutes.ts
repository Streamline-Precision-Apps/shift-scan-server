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

// FCM token management (requires authentication)
router.post(
  "/fcm",
  verifyToken,
  apiLimiter,
  validateRequest(saveFCMTokenSchema),
  saveFCMToken
);

// Password reset endpoints (no authentication required)
router.post(
  "/password-reset",
  passwordResetLimiter,
  validateRequest(requestPasswordResetSchema),
  requestPasswordReset
);

router.post(
  "/reset-password",
  passwordResetLimiter,
  validateRequest(resetPasswordSchema),
  resetPassword
);

/**
 * GET /api/tokens/verify-reset-token/:token
 * Verify if a reset token is valid
 */
router.get("/verify-reset-token/:token", apiLimiter, verifyResetToken);

/**
 * DELETE /api/tokens/reset/:token
 * Delete a password reset token
 */
router.delete("/reset/:token", apiLimiter, deleteResetToken);

export default router;
