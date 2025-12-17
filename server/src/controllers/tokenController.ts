import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import type { Request, Response } from "express";
import {
  saveUserFCMToken,
  requestPasswordResetService,
  resetPasswordService,
  verifyResetTokenService,
  deleteResetTokenService,
} from "../services/tokenService.js";

export async function saveFCMToken(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const { token } = req.body;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized request." });
  }
  if (!token) {
    return res.status(400).json({ success: false, error: "Invalid request." });
  }
  try {
    await saveUserFCMToken({ userId, token });
    return res.json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}

/**
 * POST /api/tokens/password-reset
 * Request password reset email by providing an email address
 */
export async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Invalid request." });
    }
    const result = await requestPasswordResetService(email);
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * POST /api/tokens/reset-password
 * Reset user password using the reset token
 */
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Invalid request" });
    }
    const result = await resetPasswordService(token, password);
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/tokens/verify-reset-token/:token
 * Verify if a reset token is valid
 */
export async function verifyResetToken(req: Request, res: Response) {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: "Invalid request" });
    }
    const result = await verifyResetTokenService(token);
    if (result.error) {
      return res.status(result.status || 400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * DELETE /api/tokens/reset/:token
 * Delete a password reset token by token
 */
export async function deleteResetToken(req: Request, res: Response) {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ error: "Invalid request" });
    }
    const result = await deleteResetTokenService(token);
    if (result.error) {
      return res.status(result.status || 404).json({ error: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
