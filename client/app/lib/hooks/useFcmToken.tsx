"use client";

import { useEffect, useRef, useState } from "react";
import { onMessage, Unsubscribe } from "firebase/messaging";
import { fetchToken, messaging } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function getNotificationPermissionAndToken() {
  // Step 1: Check if Notifications are supported in the browser.
  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notification");
    return null;
  }

  // Step 2: Check if permission is already granted.
  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  // Step 3: If permission is not denied, request permission from the user.
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  return null;
}

const useFcmToken = () => {
  const router = useRouter(); // Initialize the router for navigation.
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null); // State to store the notification permission status.
  const [token, setToken] = useState<string | null>(null); // State to store the FCM token.
  const retryLoadToken = useRef(0); // Ref to keep track of retry attempts.
  const isLoading = useRef(false); // Ref to keep track if a token fetch is currently in progress.

  const loadToken = async () => {
    // Step 4: Prevent multiple fetches if already fetched or in progress.
    if (isLoading.current) return;
    isLoading.current = true;

    const Token = await getNotificationPermissionAndToken();
    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      console.info(
        "%cPush Notifications issue - permission denied",
        "color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
      );
      isLoading.current = false;
      return;
    }
    if (!Token) {
      if (retryLoadToken.current >= 3) {
        alert("Unable to load token, refresh the browser");
        console.info(
          "%cPush Notifications issue - unable to load token after 3 retries",
          "color: green; background: #c7c7c7; padding: 8px; font-size: 20px"
        );
        isLoading.current = false;
        return;
      }
      retryLoadToken.current += 1;
      console.error("An error occurred while retrieving token. Retrying...");
      isLoading.current = false;
      await loadToken();
      return;
    }
    setNotificationPermissionStatus(Notification.permission);
    setToken(Token);
    isLoading.current = false;
  };

  useEffect(() => {
    if ("Notification" in window) {
      loadToken();
    }
  }, []);

  useEffect(() => {
    const setupListener = async () => {
      if (!token) return; // Exit if no token is available.

      const m = await messaging();
      if (!m) return;

      // Step 9: Register a listener for incoming FCM messages.
      const unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== "granted") return;

        const link = payload.fcmOptions?.link || payload.data?.link;

        if (link) {
          toast.info(
            `${payload.notification?.title}: ${payload.notification?.body}`,
            {
              action: {
                label: "Visit",
                onClick: () => {
                  const link = payload.fcmOptions?.link || payload.data?.link;
                  if (link) {
                    router.push(link);
                  }
                },
              },
              duration: 10000,
            }
          );
        } else {
          toast.info(
            `${payload.notification?.title}: ${payload.notification?.body}`,
            {
              duration: 10000,
            }
          );
        }

        // --------------------------------------------
        // Disable this if you only want toast notifications.
        const n = new Notification(
          payload.notification?.title || "New message",
          {
            body: payload.notification?.body || "This is a new message",
            data: link ? { url: link } : undefined,
          }
        );

        // Step 10: Handle notification click event to navigate to a link if present.
        n.onclick = (event) => {
          event.preventDefault();
          const notification = event.target as Notification;
          const link = (notification.data as { url?: string } | undefined)?.url;
          if (link) {
            router.push(link);
          }
        };
        // --------------------------------------------
      });

      return unsubscribe;
    };

    let unsubscribe: Unsubscribe | null = null;

    setupListener().then((unsub) => {
      if (unsub) {
        unsubscribe = unsub;
      }
    });

    // Step 11: Cleanup the listener when the component unmounts.
    return () => unsubscribe?.();
  }, [token, router, toast]);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;
