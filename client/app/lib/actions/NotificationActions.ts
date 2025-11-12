"use server";
import { apiRequest } from "@/app/lib/utils/api-Utils";

/**
 * Save FCM token via API endpoint (POST /api/v1/tokens/fcm)
 * - Deletes any existing tokens for the user
 * - Creates a new FCM token record
 * - Platform: web, lastUsedAt: now, isValid: true
 * - Requires authentication (token is sent in Authorization header)
 */
export async function setFCMToken({ token }: { token: string }) {
  if (!token) {
    console.error("Cannot save FCM token: No token provided");
    return false;
  }

  try {
    const response = await apiRequest("/api/v1/tokens/fcm", "POST", { token });

    if (response.success) {
      return true;
    } else {
      console.error("Failed to save FCM token:", response.error);
      return false;
    }
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return false;
  }
}

export async function getUserTopicPreferences(
  userId: string
): Promise<{ topic: string }[]> {
  // You must provide userId from your session or context when calling this function
  // For now, try to get it from localStorage or another client-side method if needed

  if (!userId) {
    console.warn(
      "Attempted to fetch topic preferences for unauthenticated user."
    );
    return [];
  }

  try {
    const response = await apiRequest(
      `/api/v1/admins/notification-preferences?userId=${userId}`,
      "GET"
    );
    if (response && Array.isArray(response.preferences)) {
      return response.preferences;
    }
    // fallback if response is array itself
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error) {
    console.error("Error fetching user topic preferences:", error);
    return [];
  }
}

export async function updateNotificationReadStatus({
  notificationId,
  userId,
}: {
  notificationId: number;
  userId: string;
}) {
  try {
    const response = await apiRequest(
      "/api/push-notifications/mark-read",
      "POST",
      {
        notificationId,
        userId,
      }
    );
    if (response && response.success) {
      return true;
    } else {
      throw new Error(response?.error || "Failed to update read status");
    }
  } catch (error) {
    console.error("Error updating notification read status:", error);
    throw new Error("Failed to update read status");
  }
}

export async function markAllNotificationsAsRead({
  userId,
}: {
  userId: string;
}) {
  try {
    const response = await apiRequest(
      "/api/push-notifications/mark-read",
      "POST",
      {
        markAll: true,
        userId,
      }
    );
    if (response && response.success) {
      return true;
    } else {
      throw new Error(response?.error || "Failed to mark all as read");
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Failed to mark all as read");
  }
}

export async function markBrokenEquipmentNotificationsAsRead({
  notificationId,
  userId,
}: {
  notificationId: number;
  userId: string;
}) {
  try {
    const response = await apiRequest(
      "/api/push-notifications/mark-read",
      "POST",
      {
        notificationId,
        brokenEquipment: true,
        userId,
      }
    );
    if (response && response.success) {
      return response;
    } else {
      throw new Error(
        response?.error ||
          "Failed to mark broken equipment notifications as read"
      );
    }
  } catch (error) {
    console.error(
      "Error marking broken equipment notifications as read:",
      error
    );
    throw new Error("Failed to mark broken equipment notifications as read");
  }
}
