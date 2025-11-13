
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="4d462603-7354-5f14-99ca-4a2acc158104")}catch(e){}}();
import prisma from "../lib/prisma.js";
export async function fetchNotificationServiceByUserId(userId) {
    // fetch subscribed notifications
    const subscribedNotifications = await prisma.topicSubscription.findMany({
        where: {
            userId: userId,
        },
    });
    const subscribedTopics = subscribedNotifications.map((subscription) => subscription.topic);
    // Handle case where user has no subscriptions
    if (subscribedTopics.length === 0) {
        return {
            notifications: [],
            count: 0,
            resolved: [],
            unreadCount: 0,
        };
    }
    // Unresolved notifications with full data
    const notifications = await prisma.notification.findMany({
        where: {
            Response: {
                is: null,
            },
            topic: {
                in: subscribedTopics,
            },
        },
        include: {
            Response: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
            Reads: {
                select: { userId: true },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    const count = await prisma.notification.count({
        where: {
            Response: {
                isNot: null,
            },
            topic: {
                in: subscribedTopics,
            },
        },
    });
    // Resolved notifications with full data
    const resolved = await prisma.notification.findMany({
        where: {
            Response: {
                isNot: null,
            },
            topic: {
                in: subscribedTopics,
            },
        },
        include: {
            Response: {
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
            Reads: {
                select: { userId: true },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    // Unread count filtered by subscribed topics
    const unreadCount = await prisma.notification.count({
        where: {
            topic: {
                in: subscribedTopics,
            },
            Reads: {
                none: {
                    userId: userId,
                },
            },
        },
    });
    return {
        notifications,
        count,
        resolved,
        unreadCount,
    };
}
export async function getDashboardData(userId) {
    const clockedInUsers = await prisma.user.count({
        where: {
            clockedIn: true,
        },
    });
    const totalPendingTimesheets = await prisma.timeSheet.count({
        where: {
            status: "PENDING",
        },
    });
    const pendingForms = await prisma.formSubmission.count({
        where: {
            status: "PENDING",
        },
    });
    const equipmentAwaitingApproval = await prisma.equipment.count({
        where: {
            approvalStatus: "PENDING",
        },
    });
    const jobsitesAwaitingApproval = await prisma.jobsite.count({
        where: {
            approvalStatus: "PENDING",
        },
    });
    return {
        clockedInUsers,
        totalPendingTimesheets,
        pendingForms,
        equipmentAwaitingApproval,
        jobsitesAwaitingApproval,
    };
}
export async function getUserTopicPreferences(userId) {
    const preferences = await prisma.topicSubscription.findMany({
        where: { userId: userId },
        select: {
            topic: true,
        },
    });
    return preferences;
}
//# sourceMappingURL=adminBaseService.js.map
//# debugId=4d462603-7354-5f14-99ca-4a2acc158104
