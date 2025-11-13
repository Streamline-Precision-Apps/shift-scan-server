import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { BackgroundGeolocation } from "@capgo/background-geolocation";
import { getApiUrl } from "../utils/api-Utils";

export interface LocationLog {
  userId: string;
  sessionId: number;
  coords: {
    lat: number;
    lng: number;
    accuracy?: number;
    speed?: number | null;
    heading?: number | null;
  };
  device?: {
    platform?: string | null;
  };
}

const isNative = Capacitor.isNativePlatform();

// Store the watch ID globally (module scope)
let watchId: string | null = null;

// Track whether background location is active
let isBackgroundTrackingActive = false;

// Track whether user is clocked in
let isUserClockedIn = false;

// Store the current user ID for use in callbacks
let currentUserId: string | null = null;

// Store the current session ID for use in callbacks
let currentSessionId: number | null = null;

// add a variable to track the last time a write to FireStore occurred
let lastFirestoreWriteTime: number = 0;
// WRITE_INTERVAL_MS: how often we actually POST location to your backend.
// Set to 5 * 60 * 1000 for 5 minutes in production.
const WRITE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// LOCAL STORAGE KEY for permissions and queue
const LOCATION_PERMISSION_REQUESTED_KEY = "location_permission_requested";
const LOCATION_QUEUE_KEY = "location_request_queue_v1";

// Max backoff settings
const MAX_RETRY_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 1000; // 1 second base
const MAX_BACKOFF_MS = 30 * 1000; // 30s cap

//=============================================================================
// UTIL: Queue persistence for failed requests (localStorage-based)
//=============================================================================

type QueuedRequest = {
  id: string; // unique id for the queued item
  url: string;
  options: RequestInit;
  attempts: number;
  createdAt: number;
};

function readQueue(): QueuedRequest[] {
  try {
    const raw = localStorage.getItem(LOCATION_QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedRequest[];
  } catch (err) {
    console.warn("Failed to read location queue:", err);
    return [];
  }
}

function writeQueue(queue: QueuedRequest[]) {
  try {
    localStorage.setItem(LOCATION_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn("Failed to write location queue:", err);
  }
}

function enqueueRequest(req: Omit<QueuedRequest, "id" | "createdAt">) {
  const queue = readQueue();
  const item: QueuedRequest = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    url: req.url,
    options: req.options,
    attempts: req.attempts,
    createdAt: Date.now(),
  };
  queue.push(item);
  writeQueue(queue);
  return item.id;
}

function removeQueuedRequestById(id: string) {
  const queue = readQueue();
  const filtered = queue.filter((q) => q.id !== id);
  writeQueue(filtered);
}

//=============================================================================
// EXPONENTIAL BACKOFF + SEND HELPER
//=============================================================================

async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function getBackoffDelay(attempt: number) {
  // exponential backoff with jitter
  const exp = Math.min(BASE_BACKOFF_MS * 2 ** (attempt - 1), MAX_BACKOFF_MS);
  const jitter = Math.random() * 300; // 0-300ms jitter
  return exp + jitter;
}

/**
 * sendLocation - tries to POST the location to the same API endpoint you had,
 * uses retries with exponential backoff, and if all fails it enqueues the request
 * to localStorage for later retries.
 *
 * @param url - the full url (already including query string)
 * @param payload - LocationLog or clockOut payload
 */
async function sendLocation(
  url: string,
  payload: unknown,
  attempts = 0
): Promise<{ success: boolean; enqueued?: boolean }> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      // Treat non-2xx as error so we can retry / enqueue
      throw new Error(`Non-OK response: ${res.status}`);
    }

    // Successfully sent - try to process any queued items afterwards
    if (
      typeof window !== "undefined" &&
      "navigator" in window &&
      navigator.onLine
    ) {
      // best-effort flush
      processLocationQueue().catch((e) =>
        console.warn("processLocationQueue failed after send:", e)
      );
    }

    return { success: true };
  } catch (err) {
    console.warn("sendLocation failed attempt", attempts, err);

    // If we've already tried less than MAX_RETRY_ATTEMPTS, retry with backoff
    if (attempts < MAX_RETRY_ATTEMPTS) {
      const nextAttempt = attempts + 1;
      const delay = getBackoffDelay(nextAttempt);
      await sleep(delay);
      return sendLocation(url, payload, nextAttempt);
    }

    // Exhausted retries -> enqueue for later processing
    try {
      enqueueRequest({
        url,
        options,
        attempts: attempts,
      });
      console.info("Enqueued location request for later delivery");
      return { success: false, enqueued: true };
    } catch (enqueueErr) {
      console.error("Failed to enqueue location request:", enqueueErr);
      return { success: false, enqueued: false };
    }
  }
}

//=============================================================================
// PROCESS QUEUE
//=============================================================================

export async function processLocationQueue() {
  // Only run in environments with localStorage and fetch
  if (typeof localStorage === "undefined") return;

  let queue = readQueue();
  if (!queue.length) return;

  // iterate over a copy to allow mutation
  for (const item of [...queue]) {
    // If navigator exists and offline, stop trying
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      console.info("Offline - stopping queue processing");
      return;
    }

    try {
      const res = await fetch(item.url, item.options);
      if (res.ok) {
        removeQueuedRequestById(item.id);
        console.info("Flushed queued location item:", item.id);
      } else {
        // Increase attempts and update queue item
        const q = readQueue();
        const idx = q.findIndex((qq) => qq.id === item.id);
        if (idx >= 0) {
          q[idx].attempts = (q[idx].attempts || 0) + 1;
          writeQueue(q);
        }
        console.warn(
          "Queued item failed to send (non-OK). Will retry later:",
          item.id,
          res.status
        );
      }
    } catch (err) {
      console.warn(
        "Error flushing queued location item, will retry later:",
        err
      );
      // If fetch throws (network), stop processing and wait for next online event
      return;
    }
  }
}

// Auto flush when we come back online (browser only)
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  window.addEventListener("online", () => {
    processLocationQueue().catch((e) =>
      console.warn("processLocationQueue (online) failed:", e)
    );
  });
}

//=============================================================================
// PERMISSION MANAGEMENT - Request once at registration/onboarding
//=============================================================================

/**
 * Request location permission ONCE at app registration/onboarding.
 * This should only be called during the registration process, not every time the app opens.
 * Stores a flag in localStorage so it's only requested once.
 */
export async function requestLocationPermissionOnce() {
  try {
    // Check if we've already requested permission
    const alreadyRequested = localStorage.getItem(
      LOCATION_PERMISSION_REQUESTED_KEY
    );
    if (alreadyRequested) {
      console.log("Location permission already requested previously");
      return { success: true, alreadyRequested: true };
    }

    // Request permissions using Capacitor Geolocation
    const permissions = await Geolocation.requestPermissions();

    if (
      permissions.location === "granted" ||
      permissions.location === "prompt"
    ) {
      // Mark that we've requested permission
      localStorage.setItem(LOCATION_PERMISSION_REQUESTED_KEY, "true");
      console.log("Location permission granted or prompted");
      return { success: true, alreadyRequested: false };
    } else if (permissions.location === "denied") {
      console.error("Location permission denied by user");
      return { success: false, reason: "denied" };
    }
  } catch (err) {
    console.error("Failed to request location permission:", err);
    return { success: false, reason: "error", error: err };
  }
}

/**
 * Check if location permissions have already been requested
 */
export function hasLocationPermissionBeenRequested(): boolean {
  return !!localStorage.getItem(LOCATION_PERMISSION_REQUESTED_KEY);
}

//=============================================================================
// FOREGROUND TRACKING - Uses Capacitor Geolocation API (watchPosition)
//=============================================================================

/**
 * Start FOREGROUND location tracking (when app is open)
 * Uses Capacitor Geolocation's watchPosition for continuous updates
 */
async function startForegroundLocationWatch() {
  if (!isUserClockedIn) {
    console.log("User not clocked in, skipping foreground tracking");
    return;
  }

  if (watchId) {
    console.log("Foreground tracking already active");
    return; // already watching
  }

  try {
    watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      async (pos, err) => {
        if (err) {
          console.error("Geolocation watch error (foreground):", err);
          return;
        }
        if (!pos) {
          console.error("Geolocation watch: position is null");
          return;
        }

        // Only send if user is still clocked in
        if (!isUserClockedIn) {
          return;
        }

        const currentTime = Date.now();
        // Throttle writes - only send every WRITE_INTERVAL_MS
        if (currentTime - lastFirestoreWriteTime < WRITE_INTERVAL_MS) {
          return;
        }

        try {
          // Use stored user ID and session ID
          if (!currentUserId || !currentSessionId) {
            console.error(
              "User ID or Session ID not available for location tracking"
            );
            return;
          }

          const payload: LocationLog = {
            userId: currentUserId,
            sessionId: currentSessionId,
            coords: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              speed: pos.coords.speed ?? null,
              heading: pos.coords.heading ?? null,
            },
            device: {
              platform:
                typeof navigator !== "undefined" ? navigator.userAgent : null,
            },
          };

          const url = getApiUrl();
          // Keep your endpoint exactly as it was
          await sendLocation(`${url}/api/location?clockType=clockIn`, payload);

          lastFirestoreWriteTime = currentTime;
        } catch (err) {
          console.error("Failed to handle foreground location:", err);
        }
      }
    );
    console.log("Foreground location tracking started");
  } catch (err) {
    console.error("Failed to start foreground geolocation watch:", err);
  }
}

//=============================================================================
// BACKGROUND TRACKING - Uses @capgo/background-geolocation
//=============================================================================

export async function startBackgroundLocationWatch() {
  if (!isUserClockedIn) {
    console.log("User not clocked in, skipping background tracking");
    return;
  }

  if (isBackgroundTrackingActive) {
    console.log("Background tracking already active");
    return;
  }

  if (!BackgroundGeolocation) {
    console.error("BackgroundGeolocation plugin not available");
    return;
  }

  try {
    await BackgroundGeolocation.start(
      {
        backgroundMessage: "Location tracking in progress",
        backgroundTitle: "Shift Scan",
        requestPermissions: false, // Permission already requested at registration
        stale: false, // Don't deliver stale locations
        distanceFilter: 50, // Only update when moved 50+ meters
      },
      async (location, error) => {
        if (error) {
          if (error.code === "NOT_AUTHORIZED") {
            console.error("Location permission not granted");
          }
          console.error("BackgroundGeolocation error:", error);
          return;
        }

        if (!location) {
          console.error("Background location is null");
          return;
        }

        // Only send if user is still clocked in
        if (!isUserClockedIn) {
          return;
        }

        // Validate location freshness when stale: false
        if (location.time && Date.now() - location.time > 60000) {
          console.warn("Location is older than 60 seconds, potentially stale");
        }

        // Check if location is simulated (useful for detecting mock locations in testing)
        if ((location as any).simulated) {
          console.log("Using simulated location (testing environment)");
        }

        try {
          if (!currentUserId || !currentSessionId) {
            console.error(
              "User ID or Session ID not available for background location tracking"
            );
            return;
          }

          const payload: LocationLog = {
            userId: currentUserId,
            sessionId: currentSessionId,
            coords: {
              lat: location.latitude,
              lng: location.longitude,
              accuracy: location.accuracy,
              speed: location.speed ?? null,
              heading: (location as any).bearing ?? null,
            },
            device: {
              platform:
                typeof navigator !== "undefined" ? navigator.userAgent : null,
            },
          };

          const url = getApiUrl();
          await sendLocation(`${url}/api/location?clockType=clockIn`, payload);
        } catch (err) {
          console.error("Failed to send background location to backend:", err);
        }
      }
    );

    isBackgroundTrackingActive = true;
    console.log("Background location tracking started successfully");
  } catch (err) {
    console.error("Failed to start background geolocation:", err);
  }
}

//=============================================================================
// CLOCK IN/OUT TRACKING - Called when user clocks in/out
//=============================================================================

/**
 * START TRACKING when user clocks in
 * Starts BOTH foreground (Geolocation) and background (BackgroundGeolocation) tracking simultaneously
 * Only tracks if user is clocked in
 * @param userId - The authenticated user's ID (pass from the component that has access to the user)
 * @param sessionId - The current session ID (from the shift)
 */
export async function startClockInTracking(userId: string, sessionId: number) {
  try {
    if (!userId || !sessionId) {
      throw new Error("User ID and Session ID are required to start tracking");
    }

    // Store the user ID and session ID for use in callbacks
    currentUserId = userId;
    currentSessionId = sessionId;

    // Mark user as clocked in
    isUserClockedIn = true;
    console.log("User clocked in - starting location tracking");

    // Start BOTH foreground and background tracking simultaneously
    // Foreground: Active when app is open
    await startForegroundLocationWatch();

    // Background: Active when app is closed or device is locked
    await startBackgroundLocationWatch();

    console.log("Location tracking started (foreground + background)");

    // Try to flush any queued items immediately if online
    if (typeof navigator !== "undefined" && navigator.onLine) {
      processLocationQueue().catch((e) =>
        console.warn("processLocationQueue failed on start:", e)
      );
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to start tracking on clock in:", err);
    isUserClockedIn = false;
    currentUserId = null;
    currentSessionId = null;
    return { success: false, error: err };
  }
}

/**
 * STOP TRACKING when user clocks out
 * Stops BOTH foreground and background tracking and posts final location
 */
export async function stopClockOutTracking() {
  try {
    console.log("User clocked out - stopping location tracking");

    // Only close the session, do not fetch or send location
    if (currentUserId && currentSessionId) {
      const url = getApiUrl();
      try {
        // Keep your endpoint exactly as you used previously
        await sendLocation(`${url}/api/location?clockType=clockOut`, {
          userId: currentUserId,
          sessionId: currentSessionId,
          coords: null,
          device: {
            platform:
              typeof navigator !== "undefined" ? navigator.userAgent : null,
          },
        });
      } catch (err) {
        console.warn(
          "Failed to post clock out session (will be enqueued):",
          err
        );
      }
    }

    isUserClockedIn = false;
    currentUserId = null;
    currentSessionId = null;

    // Stop both tracking methods
    if (watchId) {
      try {
        await Geolocation.clearWatch({ id: watchId });
      } catch (err) {
        console.warn("clearWatch threw:", err);
      }
      watchId = null;
    }

    if (isBackgroundTrackingActive && BackgroundGeolocation) {
      try {
        await BackgroundGeolocation.stop();
      } catch (err) {
        console.warn("BackgroundGeolocation.stop threw:", err);
      }
      isBackgroundTrackingActive = false;
    }

    lastFirestoreWriteTime = 0; // reset for next session
    console.log("Location tracking stopped");
    return { success: true };
  } catch (err) {
    console.error("Failed to stop tracking on clock out:", err);
    return { success: false, error: err };
  }
}

/**
 * Check if user is currently being tracked (clocked in)
 */
export function isTrackingActive(): boolean {
  return isUserClockedIn;
}

//=============================================================================
// Get current coordinates (for immediate clock-in snapshot)
//=============================================================================

export async function getStoredCoordinates(): Promise<{
  lat: number;
  lng: number;
} | null> {
  try {
    if (isNative) {
      const pos = await Geolocation.getCurrentPosition();
      if (!pos) throw new Error("Geolocation position is null");
      return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
    } else if (typeof navigator !== "undefined" && navigator.geolocation) {
      // Fallback to browser geolocation API
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            if (
              err &&
              typeof err === "object" &&
              "code" in err &&
              "message" in err
            ) {
              console.error("Browser geolocation error:", err);
            } else {
              console.error(
                "Browser geolocation error: Unknown or empty error",
                err
              );
            }
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      });
    } else {
      throw new Error("No geolocation API available");
    }
  } catch (err) {
    console.error("Failed to get current coordinates:", err);
    return null;
  }
}

//=============================================================================
// Admin helper - fetch latest user location from your backend
//=============================================================================

export async function fetchLatestUserLocation(userId: string) {
  const res = await fetch(`/api/location/${userId}`);
  if (!res.ok) return null;
  return await res.json();
}
