import { getFirebaseAdmin } from "../lib/firebase.js";
import prisma from "../lib/prisma.js";
import admin from "firebase-admin";

export async function upsertFCMTokenForUser({
  userId,
  token,
  platform,
  identifier,
}: {
  userId: string;
  token: string;
  platform: string;
  identifier: string;
}) {
  try {
    const existingToken = await prisma.fCMToken.findFirst({
      where: { userId, platform }, // add identifier to find mobile device
      select: { id: true },
    });

    if (!existingToken) {
      await prisma.fCMToken.create({
        data: {
          token,
          userId,
          platform,
          lastUsedAt: new Date(),
          isValid: true,
        },
      });
    } else {
      await prisma.fCMToken.update({
        where: { id: existingToken.id },
        data: {
          token,
          lastUsedAt: new Date(),
          isValid: true,
        },
      });
    }
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
export async function findFCMTokensByUserIdDeviceId(
  userId: string,
  deviceId: string
) {
  const token = await prisma.fCMToken.findFirst({
    where: { userId, isValid: true }, // add identifier : deviceId to find mobile device
    select: { token: true, platform: true },
  });
  return { token: token?.token, platform: token?.platform };
}

/**
 * Sends a push notification to a specific device using its FCM token.
 * @param token - The device's FCM registration token.
 * @param title - The notification title.
 * @param body - The notification body.
 * @param data - Optional data payload.
 * @returns The message ID string if successful.
 */
export async function sendPushNotificationByToken(
  token: string,
  title: string,
  body: string,
  url?: string,
  platform?: string,
  data?: { [key: string]: string }
): Promise<string> {
  try {
    // Initialize Firebase Admin SDK and messaging payload
    const admin = getFirebaseAdmin();
    let payload: admin.messaging.Message;

    if (platform === "web" && url) {
      payload = {
        token,
        notification: {
          title,
          body,
        },
        ...(data && { data }),
        webpush: {
          fcmOptions: { link: url },
        },
      };
    } else {
      payload = {
        token,
        notification: {
          title,
          body,
        },
        ...(data && { ...data }),
      };
    }

    const response = await admin.messaging().send(payload);

    return response;
  } catch (error) {
    // Handle/log error as needed
    throw error;
  }
}

export async function sendPushNotificationByTopic(
  topic: string,
  title: string,
  body: string,
  url?: string,
  platform?: string,
  data?: { [key: string]: string }
): Promise<string> {
  // Initialize Firebase Admin SDK and messaging payload
  const admin = getFirebaseAdmin();
  let payload: admin.messaging.Message;

  if (platform === "web" && url) {
    payload = {
      topic,
      notification: {
        title,
        body,
      },
      ...(data && { data }),
      webpush: {
        fcmOptions: { link: url },
      },
    };
  } else {
    payload = {
      topic,
      notification: {
        title,
        body,
      },
      ...(data && { ...data }),
    };
  }

  try {
    const response = await admin.messaging().send(payload);
    return response; // message ID
  } catch (error) {
    // Handle/log error as needed
    throw error;
  }
}
