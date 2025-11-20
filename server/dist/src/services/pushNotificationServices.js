
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f31b69d4-97e4-56d6-842f-1614782bf172")}catch(e){}}();
import prisma from "../lib/prisma.js";
/**
 * Mark a single notification as read for the user in the request.
 */
export async function updateNotificationReadStatusService(notificationId, userId) {
    if (!userId)
        throw new Error("Unauthorized");
    if (!notificationId)
        throw new Error("Missing notificationId");
    // Check if the read record already exists
    const existingRead = await prisma.notificationRead.findFirst({
        where: { notificationId, userId },
    });
    if (!existingRead) {
        await prisma.notificationRead.create({
            data: { notificationId, userId },
        });
    }
    else {
        await prisma.notificationRead.update({
            where: { id: existingRead.id },
            data: { readAt: new Date() },
        });
    }
    return { notificationId };
}
/**
 * Mark all notifications as read for the user in the request.
 */
export async function markAllNotificationsAsReadService(userId) {
    if (!userId)
        throw new Error("Unauthorized");
    // Fetch all unread notifications for the user
    const unreadNotifications = await prisma.notification.findMany({
        where: { Reads: { none: { userId } } },
        select: { id: true },
    });
    const readRecords = unreadNotifications.map((n) => ({
        notificationId: n.id,
        userId,
        readAt: new Date(),
    }));
    if (readRecords.length > 0) {
        await prisma.notificationRead.createMany({
            data: readRecords,
            skipDuplicates: true,
        });
    }
    return { markedCount: readRecords.length };
}
/**
 * Mark broken equipment notification as read and create response if needed.
 */
export async function markBrokenEquipmentNotificationsAsReadService(notificationId, userId) {
    if (!userId)
        throw new Error("Unauthorized");
    if (!notificationId)
        throw new Error("Missing notificationId");
    const notification = await prisma.notification.findFirst({
        where: {
            id: notificationId,
            topic: "equipment-break",
            Response: { is: null },
        },
    });
    if (notification) {
        return { success: false, message: "Notification action done" };
    }
    if (!notification) {
        await prisma.$transaction(async (tx) => {
            await tx.notificationResponse.create({
                data: {
                    notificationId,
                    userId,
                    response: "Repaired",
                    respondedAt: new Date(),
                },
            });
            await tx.notificationRead.create({
                data: {
                    notificationId,
                    userId,
                    readAt: new Date(),
                },
            });
        });
    }
    return { notificationId };
}
//# sourceMappingURL=pushNotificationServices.js.map
//# debugId=f31b69d4-97e4-56d6-842f-1614782bf172
