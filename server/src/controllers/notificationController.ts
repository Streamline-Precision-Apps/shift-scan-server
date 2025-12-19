import type { Request, Response } from "express";
import {
  createNotification,
  updateNotificationUrl,
  findTopicSubscription,
  createTopicSubscription,
  deleteTopicSubscription,
  updateNotificationReadStatusService,
  markAllNotificationsAsReadService,
  markBrokenEquipmentNotificationsAsReadService,
} from "../services/notificationServices.js";
import { getFirebaseAdmin } from "../lib/firebase.js";
import type { Message } from "firebase-admin/messaging";
import type { FirebaseError } from "firebase-admin";

export async function sendNotificationMulticast(req: Request, res: Response) {
  const admin = getFirebaseAdmin();
  const { topic, title, message, link, referenceId } = req.body;

  if (!topic) {
    return res
      .status(400)
      .json({ error: "Topic is required for sending notifications" });
  }
  if (!title || !message) {
    return res
      .status(400)
      .json({ error: "Title and message body are required" });
  }

  try {
    // Store the notification in the database

    const notification = await createNotification({
      topic,
      title,
      body: message,
      url: link ?? null,
      pushedAt: new Date(),
      pushAttempts: 1,
      referenceId: referenceId?.toString() ?? null,
    });

    const urlWithId = `${notification.url ? notification.url : "/admins"}${
      notification.url?.includes("?") ? "&" : "?"
    }notificationId=${notification.id}`;
    const notificationLink = await updateNotificationUrl(
      notification.id,
      urlWithId
    );

    // Create the FCM message payload
    let payload: Message;
    if (notificationLink.url) {
      payload = {
        notification: { title, body: message },
        topic,
        webpush: { fcmOptions: { link: notificationLink.url } },
      };
    } else {
      payload = {
        notification: { title, body: message },
        topic,
      };
    }

    // Send the message to Firebase
    const response = await admin.messaging().send(payload);

    return res.status(200).json({
      messageId: response,
      success: true,
      sentToTopic: topic,
    });
  } catch (error) {
    console.error(
      "[send-notification] ❌ Error in notification process:",
      error
    );
    return res.status(500).json({
      error: "Failed to send notification",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function topics(req: Request, res: Response) {
  const admin = getFirebaseAdmin();
  const { action, topics, token, userId } = req.body;

  // Validation
  if (!action || !Array.isArray(topics) || !token) {
    return res.status(400).json({
      success: false,
      error:
        "Missing required fields: action, topics (array), and token are required",
    });
  }
  if (action !== "subscribe" && action !== "unsubscribe") {
    return res.status(400).json({
      success: false,
      error: "Invalid action. Must be 'subscribe' or 'unsubscribe'",
    });
  }

  // Format topics to ensure they start with /topics/
  const formattedTopics = topics.map((topic: string) =>
    topic.startsWith("/topics/") ? topic : `/topics/${topic}`
  );

  const results = [];
  const batchSize = 1000;
  for (let i = 0; i < formattedTopics.length; i += batchSize) {
    const batch = formattedTopics.slice(i, i + batchSize);
    for (const topic of batch) {
      let response;
      if (action === "subscribe") {
        response = await admin.messaging().subscribeToTopic(token, topic);
        // Optionally record in DB if userId is provided and successful
        if (response.successCount > 0 && userId) {
          const topicName = topic.replace("/topics/", "");
          const existing = await findTopicSubscription(userId, topicName);
          if (!existing) {
            await createTopicSubscription(userId, topicName);
          }
        }
      } else {
        response = await admin.messaging().unsubscribeFromTopic(token, topic);
        if (response.successCount > 0 && userId) {
          const topicName = topic.replace("/topics/", "");
          await deleteTopicSubscription(userId, topicName);
        }
      }
      results.push({
        topic,
        success: response.successCount > 0,
        failureCount: response.failureCount,
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: `Successfully processed ${action} for ${
      results.filter((r) => r.success).length
    } out of ${topics.length} topics`,
    results,
  });
}

export async function subscribeToTopicController(req: Request, res: Response) {
  try {
    const admin = getFirebaseAdmin();
    const { topic, deviceToken } = req.body;

    if (!topic || !deviceToken) {
      return res.status(400).json({ error: "Topic is required" });
    }
    // Subscribe the device to the topic via Firebase Admin SDK
    await admin.messaging().subscribeToTopic(deviceToken, topic);
    res.status(200).json({
      success: true,
      message: `Successfully subscribed to topic: ${topic}`,
    });
  } catch (error) {
    const firebaseError = error as FirebaseError;
    res.status(500).json({
      error: "Failed to subscribe to topic",
      message: firebaseError.message || String(error),
    });
  }
}

export async function unsubscribeFromTopicController(
  req: Request,
  res: Response
) {
  try {
    const admin = getFirebaseAdmin();
    const { topic, deviceToken } = req.body;

    if (!topic || !deviceToken) {
      return res.status(400).json({ error: "Topic is required" });
    }
    // Unsubscribe the device to the topic via Firebase Admin SDK
    await admin.messaging().unsubscribeFromTopic(deviceToken, topic);
    res.status(200).json({
      success: true,
      message: `Successfully subscribed to topic: ${topic}`,
    });
  } catch (error) {
    const firebaseError = error as FirebaseError;
    res.status(500).json({
      error: "Failed to unsubscribe",
      message: firebaseError.message || String(error),
    });
  }
}

export async function markReadController(req: Request, res: Response) {
  try {
    const { notificationId, markAll, brokenEquipment, userId } = req.body;
    let result;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (markAll) {
      result = await markAllNotificationsAsReadService(userId);
      return res.status(200).json({ success: true, ...result });
    }

    if (brokenEquipment && notificationId) {
      result = await markBrokenEquipmentNotificationsAsReadService(
        notificationId,
        userId
      );
      return res.status(200).json({ success: true, ...result });
    }

    if (notificationId) {
      result = await updateNotificationReadStatusService(
        notificationId,
        userId
      );
      return res.status(200).json({ success: true, ...result });
    }

    return res.status(400).json({ error: "Invalid parameters" });
  } catch (error) {
    console.error("Error in markReadController:", error);
    return res
      .status(500)
      .json({ error: "Failed to mark notification(s) as read" });
  }
}
