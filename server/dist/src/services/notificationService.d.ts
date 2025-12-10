export declare class NotificationService {
    static createAndLinkNotification(data: any): Promise<any>;
    static createNotification(data: any): Promise<any>;
    static findTopicSubscription(userId: string, topic: string): Promise<{
        id: string;
        createdAt: Date;
        topic: string;
        userId: string;
    } | null>;
    static createTopicSubscription(userId: string, topic: string): Promise<{
        id: string;
        createdAt: Date;
        topic: string;
        userId: string;
    }>;
    static deleteTopicSubscription(userId: string, topic: string): Promise<import("../../generated/prisma/index.js").Prisma.BatchPayload>;
    /**
     * Save FCM device token for a user
     * Called when user registers or gets a new token
     */
    static saveFCMToken(userId: string, token: string, platform?: string): Promise<any>;
    /**
     * Get all device tokens for a user
     */
    static getUserTokens(userId: string): Promise<any[]>;
    /**
     * Invalidate a specific token
     */
    static invalidateToken(token: string): Promise<any>;
    /**
     * Delete a specific token
     */
    static deleteToken(token: string): Promise<any>;
    /**
     * Subscribe user to a topic and save subscription in database
     */
    static subscribeUserToTopic(userId: string, topic: string): Promise<void>;
    /**
     * Unsubscribe user from a topic
     */
    static unsubscribeUserFromTopic(userId: string, topic: string): Promise<void>;
    /**
     * Send notification to a specific user's all devices
     */
    static sendNotificationToUser(userId: string, notification: {
        title: string;
        body: string;
    }, data?: Record<string, string>): Promise<any[]>;
    /**
     * Send notification to all users in a topic
     */
    static sendNotificationToTopic(topic: string, notification: {
        title: string;
        body: string;
    }, data?: Record<string, string>): Promise<string>;
    /**
     * Get user's subscribed topics
     */
    static getUserTopics(userId: string): Promise<any[]>;
    /**
     * Mark notification as read for a user
     */
    static markNotificationAsRead(notificationId: number, userId: string): Promise<any>;
    /**
     * Get unread notifications for a user
     */
    static getUnreadNotifications(userId: string): Promise<any[]>;
}
export default NotificationService;
//# sourceMappingURL=notificationService.d.ts.map