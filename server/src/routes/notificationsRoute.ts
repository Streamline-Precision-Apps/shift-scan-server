import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  sendNotificationMulticast,
  topics,
  markReadController,
} from "../controllers/notificationController.js";
import { requireFirebaseEnv } from "../middleware/requireFirebaseEnv.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  sendMulticastSchema,
  topicsSchema,
  markReadSchema,
} from "../lib/validation/notification.js";

const router = Router();

/**
 * @swagger
 * /api/notifications/send-multicast:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Send notification to a topic (multicast)
 *     description: Send a notification to all users subscribed to a topic. Stores the notification in the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               link:
 *                 type: string
 *               referenceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messageId:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 sentToTopic:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/send-multicast",
  verifyToken,
  requireFirebaseEnv,
  validateRequest(sendMulticastSchema),
  sendNotificationMulticast
);

router.post(
  "/mark-read",
  verifyToken,
  requireFirebaseEnv,
  validateRequest(markReadSchema),
  markReadController
);

/**
 * @swagger
 * /api/notifications/topics:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Subscribe or unsubscribe device to topics
 *     description: Subscribe or unsubscribe a device token to one or more topics. Optionally records topic subscriptions in the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [subscribe, unsubscribe]
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *               token:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Topics processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       topic:
 *                         type: string
 *                       success:
 *                         type: boolean
 *                       failureCount:
 *                         type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/topics",
  verifyToken,
  requireFirebaseEnv,
  validateRequest(topicsSchema),
  topics
);

// ----------------------------------------------------------------------
//
// Used in the push notification management Lib for
router.post(
  "/subscribe-to-topic",
  verifyToken,
  requireFirebaseEnv,
  validateRequest(topicsSchema),
  topics
);

router.post(
  "/unsubscribe-from-topic",
  verifyToken,
  requireFirebaseEnv,
  validateRequest(topicsSchema),
  topics
);

export default router;
