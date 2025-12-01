
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="215f7981-d9ba-5c77-a081-103727db81ec")}catch(e){}}();
import { Router } from "express";
import { getFirebaseAdmin } from "../lib/firebase.js";
import NotificationService from "../services/notificationService.js";
import { markReadController } from "../controllers/pushNotifcationController.js";
const router = Router();
const admin = getFirebaseAdmin();
/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send a push notification to a user or topic
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *                 description: Notification title
 *               body:
 *                 type: string
 *                 description: Notification body
 *               deviceToken:
 *                 type: string
 *                 description: Device token for sending to specific device (optional)
 *               topic:
 *                 type: string
 *                 description: Topic name for sending to all subscribed devices (optional)
 *               data:
 *                 type: object
 *                 description: Custom data to send with notification
 *     responses:
 *       200:
 *         description: Notification sent successfully
 *       400:
 *         description: Either deviceToken or topic must be provided
 *       500:
 *         description: Failed to send notification
 */
router.post("/send", async (req, res) => {
    try {
        const { title, body, deviceToken, topic, data, url } = req.body;
        if (!title || !body) {
            return res.status(400).json({ error: "Title and body are required" });
        }
        if (!deviceToken && !topic) {
            return res.status(400).json({
                error: "Either deviceToken or topic must be provided",
            });
        }
        const message = {
            notification: { title, body },
            ...(data && { data }),
        };
        let result;
        if (deviceToken) {
            // Send to specific device
            message.token = deviceToken;
            result = await admin.messaging().send(message);
            console.log("✅ Notification sent to device:", deviceToken, "Message ID:", result);
        }
        else if (topic) {
            // Send to topic
            message.topic = topic;
            result = await admin.messaging().send(message);
            console.log("✅ Notification sent to topic:", topic, "Message ID:", result);
        }
        // Create notification record in database
        if (url) {
            await NotificationService.createAndLinkNotification({
                title,
                body,
                url,
                topic: topic || null,
            });
        }
        res.status(200).json({
            success: true,
            messageId: result,
            message: "Notification sent successfully",
        });
    }
    catch (error) {
        console.error("❌ Error sending notification:", error);
        const firebaseError = error;
        res.status(500).json({
            error: "Failed to send notification",
            message: firebaseError.message || String(error),
        });
    }
});
/**
 * Send notification to multiple devices
 */
router.post("/send-multicast", async (req, res) => {
    try {
        const { title, body, deviceTokens, data, url } = req.body;
        if (!title ||
            !body ||
            !Array.isArray(deviceTokens) ||
            deviceTokens.length === 0) {
            return res.status(400).json({
                error: "Title, body, and array of deviceTokens are required",
            });
        }
        const message = {
            notification: { title, body },
            ...(data && { data }),
        };
        // Firebase Admin SDK uses sendAll for multicast (sendMulticast is not available)
        // Send individual messages instead
        const results = await Promise.all(deviceTokens.map((token) => admin
            .messaging()
            .send({
            ...message,
            token,
        })
            .catch((err) => ({ error: err }))));
        const successCount = results.filter((r) => !("error" in r)).length;
        const failureCount = results.filter((r) => "error" in r).length;
        console.log(`✅ Multicast notification sent to ${successCount} devices`);
        console.log(`⚠️ Failed to send to ${failureCount} devices`);
        // Log failed tokens
        if (failureCount > 0) {
            results.forEach((result, index) => {
                if ("error" in result) {
                    console.error(`Failed token ${index}:`, deviceTokens[index], result.error);
                }
            });
        }
        // Create notification record in database
        if (url) {
            await NotificationService.createAndLinkNotification({
                title,
                body,
                url,
            });
        }
        res.status(200).json({
            success: true,
            successCount,
            failureCount,
            message: "Multicast notification sent",
        });
    }
    catch (error) {
        console.error("❌ Error sending multicast notification:", error);
        const firebaseError = error;
        res.status(500).json({
            error: "Failed to send multicast notification",
            message: firebaseError.message || String(error),
        });
    }
});
/**
 * Subscribe device to topic
 */
router.post("/subscribe-to-topic", async (req, res) => {
    try {
        const { topic, deviceToken } = req.body;
        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }
        // If deviceToken is provided, subscribe specific device
        if (deviceToken) {
            await admin.messaging().subscribeToTopic(deviceToken, topic);
            console.log(`✅ Device subscribed to topic: ${topic}`);
        }
        // Create topic subscription record in database
        // Note: This assumes you have userId in the request context
        // Adjust as needed for your auth implementation
        res.status(200).json({
            success: true,
            message: `Successfully subscribed to topic: ${topic}`,
        });
    }
    catch (error) {
        console.error("❌ Error subscribing to topic:", error);
        const firebaseError = error;
        res.status(500).json({
            error: "Failed to subscribe to topic",
            message: firebaseError.message || String(error),
        });
    }
});
/**
 * Unsubscribe device from topic
 */
router.post("/unsubscribe-from-topic", async (req, res) => {
    try {
        const { topic, deviceToken } = req.body;
        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }
        // If deviceToken is provided, unsubscribe specific device
        if (deviceToken) {
            await admin.messaging().unsubscribeFromTopic(deviceToken, topic);
            console.log(`✅ Device unsubscribed from topic: ${topic}`);
        }
        res.status(200).json({
            success: true,
            message: `Successfully unsubscribed from topic: ${topic}`,
        });
    }
    catch (error) {
        console.error("❌ Error unsubscribing from topic:", error);
        const firebaseError = error;
        res.status(500).json({
            error: "Failed to unsubscribe from topic",
            message: firebaseError.message || String(error),
        });
    }
});
/**
 * Subscribe multiple devices to topic
 */
router.post("/subscribe-devices-to-topic", async (req, res) => {
    try {
        const { topic, deviceTokens } = req.body;
        if (!topic || !Array.isArray(deviceTokens) || deviceTokens.length === 0) {
            return res.status(400).json({
                error: "Topic and array of deviceTokens are required",
            });
        }
        await admin.messaging().subscribeToTopic(deviceTokens, topic);
        console.log(`✅ ${deviceTokens.length} devices subscribed to topic: ${topic}`);
        res.status(200).json({
            success: true,
            subscribedCount: deviceTokens.length,
            message: `Successfully subscribed ${deviceTokens.length} devices to topic: ${topic}`,
        });
    }
    catch (error) {
        console.error("❌ Error subscribing devices to topic:", error);
        const firebaseError = error;
        res.status(500).json({
            error: "Failed to subscribe devices to topic",
            message: firebaseError.message || String(error),
        });
    }
});
/**
 * Unsubscribe multiple devices from topic
 */
router.post("/unsubscribe-devices-from-topic", async (req, res) => {
    try {
        const { topic, deviceTokens } = req.body;
        if (!topic || !Array.isArray(deviceTokens) || deviceTokens.length === 0) {
            return res.status(400).json({
                error: "Topic and array of deviceTokens are required",
            });
        }
        await admin.messaging().unsubscribeFromTopic(deviceTokens, topic);
        console.log(`✅ ${deviceTokens.length} devices unsubscribed from topic: ${topic}`);
        res.status(200).json({
            success: true,
            unsubscribedCount: deviceTokens.length,
            message: `Successfully unsubscribed ${deviceTokens.length} devices from topic: ${topic}`,
        });
    }
    catch (error) {
        console.error("❌ Error unsubscribing devices from topic:", error);
        const firebaseError = error;
        res.status(500).json({
            error: "Failed to unsubscribe devices from topic",
            message: firebaseError.message || String(error),
        });
    }
});
router.post("/mark-read", markReadController);
export default router;
//# sourceMappingURL=pushNotificationsRoute.js.map
//# debugId=215f7981-d9ba-5c77-a081-103727db81ec
