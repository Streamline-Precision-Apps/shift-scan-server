/**
 * Mark a single notification as read for the user in the request.
 */
export declare function updateNotificationReadStatusService(notificationId: number, userId: string): Promise<{
    notificationId: number;
}>;
/**
 * Mark all notifications as read for the user in the request.
 */
export declare function markAllNotificationsAsReadService(userId: string): Promise<{
    markedCount: number;
}>;
/**
 * Mark broken equipment notification as read and create response if needed.
 */
export declare function markBrokenEquipmentNotificationsAsReadService(notificationId: number, userId: string): Promise<{
    success: boolean;
    message: string;
    notificationId?: never;
} | {
    notificationId: number;
    success?: never;
    message?: never;
}>;
//# sourceMappingURL=pushNotificationServices.d.ts.map