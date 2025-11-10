import prisma from "../lib/prisma.js";

export async function fetchNotificationServiceByUserId(userId: string) {
  // fetch subscribed notifications
  const subscribedNotifications = await prisma.topicSubscription.findMany({
    where: {
      userId: userId,
    },
  });

  const subscribedTopics = subscribedNotifications.map(
    (subscription) => subscription.topic
  );

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
