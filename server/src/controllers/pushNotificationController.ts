import type { Request, Response } from "express";
import {
  findFCMTokensByUserIdDeviceId,
  sendPushNotificationByToken,
  sendPushNotificationByTopic,
  upsertFCMTokenForUser,
} from "../services/pushNotificationService.js";

export async function upsertFCMToken(req: Request, res: Response) {
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
    await upsertFCMTokenForUser({ userId, token, platform, identifier });
    return res.json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}

export async function pushReminderController(req: Request, res: Response) {
  const userId = req.params.userId;
  const identifier = req.params.deviceId;
  const { title, message, url, type, topic } = req.body;

  if (!userId || !identifier || !type) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized request." });
  }
  if (!title || !message) {
    return res.status(400).json({ success: false, error: "Invalid request." });
  }
  try {
    // get FCM token for user and device
    if (type === "token") {
      const { token, platform } = await findFCMTokensByUserIdDeviceId(
        userId,
        identifier
      );
      if (!token || !platform) {
        return res
          .status(404)
          .json({ success: false, error: "Resources not found." });
      }
      // Here you would call a service to send the push notification
      await sendPushNotificationByToken(token, title, message, url, platform);
      return res.json({ success: true });
    } else if (type === "topic") {
      // send to people subscribed to topic
      const { platform } = await findFCMTokensByUserIdDeviceId(
        userId,
        identifier
      );
      if (!topic || !platform) {
        return res
          .status(404)
          .json({ success: false, error: "Resources not found." });
      }
      await sendPushNotificationByTopic(topic, title, message, url, platform);
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: "Invalid type." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}
