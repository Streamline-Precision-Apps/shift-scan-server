import type { Request, Response } from "express";
import { createFCMTokenForUser } from "../services/pushNotificationService.js";

export async function createFCMToken(req: Request, res: Response) {
  // Extract userId from params and token & platform from body
  const userId = req.params.userId;
  const { token, platform, identifier } = req.body;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized request." });
  }
  if (!token) {
    return res.status(400).json({ success: false, error: "Invalid request." });
  }
  try {
    await createFCMTokenForUser({ userId, token, platform, identifier });
    return res.json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}
