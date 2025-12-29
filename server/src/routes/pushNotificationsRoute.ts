import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  pushReminderController,
  upsertFCMToken,
} from "../controllers/pushNotificationController.js";

const router = Router();

/**
 * @swagger
 * /api/v1/push/user/{userId}/fcm-tokens:
 *   post:
 *     summary: Register or update FCM token for a user
 *     description: Register or update a Firebase Cloud Messaging (FCM) token for a specific user.
 *     tags:
 *       - Push Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fcmToken:
 *                 type: string
 *                 description: FCM token to register
 *     responses:
 *       200:
 *         description: Token registered or updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/user/:userId/fcm-tokens", verifyToken, upsertFCMToken);

/**
 * @swagger
 * /api/v1/push/user/{userId}/device/{deviceId}/send-notification:
 *   post:
 *     summary: Send push notification to a user device
 *     description: Send a push notification to a specific device for a user (e.g., clock-out reminder).
 *     tags:
 *       - Push Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Notification sent
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/user/:userId/device/:deviceId/send-notification",
  verifyToken,
  pushReminderController
);

// send push notification to all users

export default router;
