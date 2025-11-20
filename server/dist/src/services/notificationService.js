
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2ab62c78-a24f-51b0-a5c9-b713b4457400")}catch(e){}}();
import { createNotification, updateNotificationUrl, findTopicSubscription, createTopicSubscription, deleteTopicSubscription, } from "../models/notificationModel.js";
import { getFirebaseAdmin } from "../lib/firebase.js";
import prisma from "../lib/prisma.js";
export class NotificationService {
    // Create a notification and update its URL
    static async createAndLinkNotification(data) {
        const notification = await createNotification({
            ...data,
            pushedAt: new Date(),
            pushAttempts: 1,
        });
        // Generate URL with notificationId
        const urlWithId = `${notification.url ? notification.url : "/admins"}${notification.url?.includes("?") ? "&" : "?"}notificationId=${notification.id}`;
        return await updateNotificationUrl(notification.id, urlWithId);
    }
    // Create a notification only
    static async createNotification(data) {
        return await createNotification({
            ...data,
            pushedAt: new Date(),
            pushAttempts: 1,
        });
    }
    // Find topic subscription
    static async findTopicSubscription(userId, topic) {
        return await findTopicSubscription(userId, topic);
    }
    // Create topic subscription
    static async createTopicSubscription(userId, topic) {
        return await createTopicSubscription(userId, topic);
    }
    // Delete topic subscription
    static async deleteTopicSubscription(userId, topic) {
        return await deleteTopicSubscription(userId, topic);
    }
    /**
     * Save FCM device token for a user
     * Called when user registers or gets a new token
     */
    static async saveFCMToken(userId, token, platform) {
        try {
            // Check if token already exists for this user
            const existingToken = await prisma.fCMToken.findUnique({
                where: { token },
            });
            if (existingToken && existingToken.userId === userId) {
                // Update last used timestamp
                return await prisma.fCMToken.update({
                    where: { token },
                    data: { lastUsedAt: new Date() },
                });
            }
            // If token exists for a different user, remove old association
            if (existingToken) {
                await prisma.fCMToken.delete({ where: { token } });
            }
            // Create new token record
            return await prisma.fCMToken.create({
                data: {
                    token,
                    userId,
                    platform: platform || "web",
                },
            });
        }
        catch (error) {
            console.error("Error saving FCM token:", error);
            throw error;
        }
    }
    /**
     * Get all device tokens for a user
     */
    static async getUserTokens(userId) {
        try {
            return await prisma.fCMToken.findMany({
                where: { userId, isValid: true },
            });
        }
        catch (error) {
            console.error("Error getting user tokens:", error);
            throw error;
        }
    }
    /**
     * Invalidate a specific token
     */
    static async invalidateToken(token) {
        try {
            return await prisma.fCMToken.update({
                where: { token },
                data: { isValid: false },
            });
        }
        catch (error) {
            console.error("Error invalidating token:", error);
            throw error;
        }
    }
    /**
     * Delete a specific token
     */
    static async deleteToken(token) {
        try {
            return await prisma.fCMToken.delete({
                where: { token },
            });
        }
        catch (error) {
            console.error("Error deleting token:", error);
            throw error;
        }
    }
    /**
     * Subscribe user to a topic and save subscription in database
     */
    static async subscribeUserToTopic(userId, topic) {
        try {
            const admin = getFirebaseAdmin();
            // Get user's device tokens
            const tokens = await this.getUserTokens(userId);
            if (tokens.length === 0) {
                console.warn(`No valid tokens found for user ${userId}`);
            }
            // Subscribe each token to the topic via Firebase
            for (const tokenRecord of tokens) {
                try {
                    await admin.messaging().subscribeToTopic(tokenRecord.token, topic);
                    // console.log(`✅ Token subscribed to topic ${topic}: ${tokenRecord.token}`);
                }
                catch (error) {
                    console.error(`Error subscribing token to topic ${topic}:`, error);
                }
            }
            // Save subscription record in database
            await this.createTopicSubscription(userId, topic);
            // console.log(`✅ User ${userId} subscribed to topic: ${topic}`);
        }
        catch (error) {
            console.error("Error subscribing user to topic:", error);
            throw error;
        }
    }
    /**
     * Unsubscribe user from a topic
     */
    static async unsubscribeUserFromTopic(userId, topic) {
        try {
            const admin = getFirebaseAdmin();
            // Get user's device tokens
            const tokens = await this.getUserTokens(userId);
            // Unsubscribe each token from the topic via Firebase
            for (const tokenRecord of tokens) {
                try {
                    await admin
                        .messaging()
                        .unsubscribeFromTopic(tokenRecord.token, topic);
                    // console.log(`✅ Token unsubscribed from topic ${topic}: ${tokenRecord.token}`);
                }
                catch (error) {
                    console.error(`Error unsubscribing token from topic ${topic}:`, error);
                }
            }
            // Delete subscription record from database
            await this.deleteTopicSubscription(userId, topic);
            // console.log(`✅ User ${userId} unsubscribed from topic: ${topic}`);
        }
        catch (error) {
            console.error("Error unsubscribing user from topic:", error);
            throw error;
        }
    }
    /**
     * Send notification to a specific user's all devices
     */
    static async sendNotificationToUser(userId, notification, data) {
        try {
            const admin = getFirebaseAdmin();
            const tokens = await this.getUserTokens(userId);
            if (tokens.length === 0) {
                throw new Error(`No valid tokens found for user ${userId}`);
            }
            const results = await Promise.all(tokens.map((tokenRecord) => {
                const message = {
                    token: tokenRecord.token,
                    notification,
                };
                if (data)
                    message.data = data;
                return admin
                    .messaging()
                    .send(message)
                    .catch((err) => ({ error: err }));
            }));
            const successCount = results.filter((r) => !("error" in r)).length;
            // console.log(
            //   `✅ Sent notification to ${successCount} of ${tokens.length} devices for user ${userId}`
            // );
            return results;
        }
        catch (error) {
            console.error("Error sending notification to user:", error);
            throw error;
        }
    }
    /**
     * Send notification to all users in a topic
     */
    static async sendNotificationToTopic(topic, notification, data) {
        try {
            const admin = getFirebaseAdmin();
            const message = {
                topic,
                notification,
            };
            if (data)
                message.data = data;
            const messageId = await admin.messaging().send(message);
            // console.log(
            //   `✅ Sent notification to topic ${topic}. Message ID: ${messageId}`
            // );
            return messageId;
        }
        catch (error) {
            console.error("Error sending notification to topic:", error);
            throw error;
        }
    }
    /**
     * Get user's subscribed topics
     */
    static async getUserTopics(userId) {
        try {
            return await prisma.topicSubscription.findMany({
                where: { userId },
            });
        }
        catch (error) {
            console.error("Error getting user topics:", error);
            throw error;
        }
    }
    /**
     * Mark notification as read for a user
     */
    static async markNotificationAsRead(notificationId, userId) {
        try {
            return await prisma.notificationRead.upsert({
                where: {
                    notificationId_userId: {
                        notificationId,
                        userId,
                    },
                },
                update: { readAt: new Date() },
                create: { notificationId, userId },
            });
        }
        catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    }
    /**
     * Get unread notifications for a user
     */
    static async getUnreadNotifications(userId) {
        try {
            return await prisma.notification.findMany({
                where: {
                    Reads: {
                        none: {
                            userId,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        catch (error) {
            console.error("Error getting unread notifications:", error);
            throw error;
        }
    }
}
export default NotificationService;
//# sourceMappingURL=notificationService.js.map
//# debugId=2ab62c78-a24f-51b0-a5c9-b713b4457400
