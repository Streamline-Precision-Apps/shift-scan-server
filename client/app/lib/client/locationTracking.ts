import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { BackgroundGeolocation } from "@capgo/background-geolocation";
import { apiRequest, getApiUrl } from "../utils/api-Utils";

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

// Timer for periodic location sending
let periodicSendTimer: ReturnType<typeof setInterval> | null = null;

// Track whether background location is active
let isBackgroundTrackingActive = false;

// Track whether user is clocked in
let isUserClockedIn = false;

// Store the current user ID for use in callbacks
let currentUserId: string | null = null;

// Store the current session ID for use in callbacks
let currentSessionId: number | null = null;

// WRITE_INTERVAL_MS: how often we actually POST location to your backend.
// Set to 5 minutes to prevent excessive API calls during continuous tracking.
const WRITE_INTERVAL_MS = 1 * 60 * 1000; // 1 minute for testing was 5 mins

// Track if a location send is currently in flight to prevent concurrent sends
let locationSendInProgress = false;

let lastKnownCoordinates: { lat: number; lng: number } | null = null;

// LOCAL STORAGE KEY for permissions and queue
const LOCATION_PERMISSION_REQUESTED_KEY = "location_permission_requested";

//=============================================================================
// SEND LOCATION - Only call the function directly, no queue or retry logic
//=============================================================================

async function sendLocation(
  url: string,
  payload: {
    userId: string;
    sessionId: number;
    coords: {
      lat: number;
      lng: number;
      accuracy?: number;
      speed?: number | null;
      heading?: number | null;
    } | null;
  }
): Promise<{ success: boolean }> {
  try {
    const res = await apiRequest(url, "POST", payload);
    if (!res.ok) {
      console.warn(
        "sendLocation: API request failed",
        res.status,
        res.statusText
      );
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.warn("sendLocation: error sending location", err);
    return { success: false };
  }
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
 * NOTE: watchPosition fires frequently; throttling is enforced by WRITE_INTERVAL_MS
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
    let lastCallbackTime = 0;
    const MIN_CALLBACK_INTERVAL_MS = 2000;
    watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      async (pos, err) => {
        const now = Date.now();
        if (now - lastCallbackTime < MIN_CALLBACK_INTERVAL_MS) return;
        lastCallbackTime = now;

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

        // Pre-warming mode: skip sending if sessionId === 0
        if (currentSessionId === 0) {
          lastKnownCoordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          return;
        }

        const currentTime = Date.now();

        // Prevent concurrent location sends
        if (locationSendInProgress) {
          console.debug("Location send already in progress, skipping");
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

          // Update last known coordinates
          lastKnownCoordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          locationSendInProgress = true;

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

          // Keep your endpoint exactly as it was
          await sendLocation(`/api/location?clockType=clockIn`, payload);
        } catch (err) {
          console.error("Failed to handle foreground location:", err);
        } finally {
          locationSendInProgress = false;
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

        // Pre-warming mode: skip sending if sessionId === 0
        if (currentSessionId === 0) {
          lastKnownCoordinates = {
            lat: location.latitude,
            lng: location.longitude,
          };
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

        const currentTime = Date.now();

        // Prevent concurrent location sends
        if (locationSendInProgress) {
          console.debug("Location send already in progress, skipping");
          return;
        }

        try {
          if (!currentUserId || !currentSessionId) {
            console.error(
              "User ID or Session ID not available for background location tracking"
            );
            return;
          }

          // Update last known coordinates
          lastKnownCoordinates = {
            lat: location.latitude,
            lng: location.longitude,
          };

          locationSendInProgress = true;

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

          await sendLocation(`/api/location?clockType=clockIn`, payload);

          console.debug("Background location sent successfully");
        } catch (err) {
          console.error("Failed to send background location to backend:", err);
        } finally {
          locationSendInProgress = false;
        }
      }
    );

    isBackgroundTrackingActive = true;
    console.log("Background location tracking started successfully");
  } catch (err) {
    // Catch "Location Tracking Already Started" error
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes("already") || errorMsg.includes("already started")) {
      console.warn(
        "BackgroundGeolocation already started, marking as active:",
        errorMsg
      );
      isBackgroundTrackingActive = true;
    } else {
      console.error("Failed to start background geolocation:", err);
    }
  }
}

//=============================================================================
// PERIODIC LOCATION SENDING
//=============================================================================

async function sendPeriodicLocation() {
  if (!isUserClockedIn || !currentUserId || !currentSessionId) return;
  if (!lastKnownCoordinates) return;
  if (locationSendInProgress) return;
  try {
    locationSendInProgress = true;
    const payload: LocationLog = {
      userId: currentUserId,
      sessionId: currentSessionId,
      coords: {
        lat: lastKnownCoordinates.lat,
        lng: lastKnownCoordinates.lng,
      },
      device: {
        platform: typeof navigator !== "undefined" ? navigator.userAgent : null,
      },
    };
    await sendLocation(`/api/location?clockType=clockIn`, payload);
    console.debug("[Periodic] Location sent successfully");
  } catch (err) {
    console.error("[Periodic] Failed to send location:", err);
  } finally {
    locationSendInProgress = false;
  }
}

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

    // 🔴 GUARD: Prevent duplicate tracking initialization
    // Check BEFORE setting flags to catch re-entrance
    if (isUserClockedIn && watchId && isBackgroundTrackingActive) {
      console.warn(
        "Tracking already started - ignoring duplicate startClockInTracking call"
      );
      return { success: true };
    }

    // Store the user ID and session ID for use in callbacks
    currentUserId = userId;
    currentSessionId = sessionId;

    // Mark user as clocked in IMMEDIATELY to prevent race conditions
    isUserClockedIn = true;
    console.log("User clocked in - starting location tracking");

    // Start BOTH foreground and background tracking simultaneously (fire-and-forget)
    // Foreground: Active when app is open
    startForegroundLocationWatch(); // fire-and-forget

    // Background: Active when app is closed or device is locked
    startBackgroundLocationWatch(); // fire-and-forget

    // Start periodic timer for sending location every WRITE_INTERVAL_MS
    if (!periodicSendTimer) {
      periodicSendTimer = setInterval(() => {
        sendPeriodicLocation();
      }, WRITE_INTERVAL_MS);
      console.log(
        `Periodic location sending started (every ${
          WRITE_INTERVAL_MS / 60000
        } min)`
      );
    }

    console.log("Location tracking started (foreground + background)");

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
        await sendLocation(`/api/location?clockType=clockOut`, {
          userId: currentUserId,
          sessionId: currentSessionId,
          coords: null,
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

    // Reset the in-flight flag
    locationSendInProgress = false;

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

    // Stop periodic timer
    if (periodicSendTimer) {
      clearInterval(periodicSendTimer);
      periodicSendTimer = null;
      console.log("Periodic location sending stopped");
    }

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

const GEOLOCATION_TIMEOUT = 2000; // 2 seconds - quick snapshot for clock operations

/**
 * Get fresh, current coordinates quickly
 * Single attempt, fast timeout - fail fast for clock-in/out
 * @returns Fresh coordinates or null if unable to obtain
 */
export async function getStoredCoordinates(): Promise<{
  lat: number;
  lng: number;
} | null> {
  try {
    if (isNative) {
      // Native Capacitor Geolocation - single attempt, 2 second timeout
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 0, // No caching - always fresh
      });

      if (!pos) {
        console.warn("[Geolocation] Position is null");
        return null;
      }

      console.log("[Geolocation] Fresh coordinates obtained");
      return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
    }

    // Not on native platform - return null quickly
    console.warn("[Geolocation] Not on native platform");
    return null;
  } catch (err) {
    console.warn(
      "[Geolocation] Failed to get coordinates:",
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }
}

//=============================================================================
// Admin helper - fetch latest user location from your backend
//=============================================================================

export async function fetchLatestUserLocation(userId: string) {
  try {
    const data = await apiRequest(`/api/location/${userId}`, "GET");
    return data;
  } catch (err) {
    console.warn("Failed to fetch latest user location:", err);
    return null;
  }
}

export function getLastKnownCoordinates() {
  return lastKnownCoordinates;
}

/**
 * Pre-start location tracking to warm up GPS before clock-in
 * Fires foreground tracking in the background without sending to backend yet
 */
export async function preStartLocationTracking(userId: string) {
  // Store userId temporarily
  currentUserId = userId;

  // Fake sessionId 0 for pre-warm
  currentSessionId = 0;

  isUserClockedIn = true; // allow watch callbacks to run

  // Start foreground watch only; skip background to reduce unnecessary writes
  startForegroundLocationWatch();

  console.log("GPS pre-warming started (foreground only)");
}
