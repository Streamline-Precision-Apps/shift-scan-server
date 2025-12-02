import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { BackgroundGeolocation } from "@capgo/background-geolocation";
import { apiRequest } from "../utils/api-Utils";
import { useSessionStore } from "../store/sessionStore";

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

// LocalStorage key for permission request
const LOCATION_PERMISSION_REQUESTED_KEY = "location_permission_requested";

// Minimum interval between location uploads (ms)
const WRITE_INTERVAL_MS = 6 * 60 * 1000; // 6 minutes for testing

// All state is now managed in Zustand session store

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
    await apiRequest(url, "POST", payload);
    //we can check for a response body here if needed
    return { success: true };
  } catch (err) {
    // Only log on failure
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
  const s = useSessionStore.getState();
  if (!s.isUserClockedIn) return;
  if (s.watchId) return;
  try {
    let lastCallbackTime = 0;
    const MIN_CALLBACK_INTERVAL_MS = 2000;
    const watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      async (pos, err) => {
        const now = Date.now();
        // Debug log state
        const s = useSessionStore.getState();
        console.debug("[FG Watch] Callback", {
          isUserClockedIn: s.isUserClockedIn,
          currentUserId: s.currentUserId,
          currentSessionId: s.currentSessionId,
          lastLocationSentAt: s.lastLocationSentAt,
          locationSendInProgress: s.locationSendInProgress,
          pos,
          err,
        });
        if (now - lastCallbackTime < MIN_CALLBACK_INTERVAL_MS) return;
        lastCallbackTime = now;
        if (err || !pos) return;
        if (!s.isUserClockedIn) return;
        if (!s.currentSessionId || s.preWarmActive) {
          s.setLastKnownCoordinates({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });

          return;
        }
        if (s.locationSendInProgress) return;
        if (!s.currentUserId || !s.currentSessionId) return;
        s.setLastKnownCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        // Throttle: Only send if interval has passed
        if (
          s.lastLocationSentAt &&
          now - s.lastLocationSentAt < WRITE_INTERVAL_MS
        )
          return;
        s.setLocationSendInProgress(true);
        try {
          const payload: LocationLog = {
            userId: s.currentUserId,
            sessionId: s.currentSessionId,
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
          const result = await sendLocation(
            `/api/location?clockType=clockIn`,
            payload
          );
          if (result.success) {
            s.setLastLocationSentAt(s.currentSessionId, now);
          }
        } catch (err) {
          console.warn("[FG Watch] sendLocation error", err);
        } finally {
          s.setLocationSendInProgress(false);
        }
      }
    );
    s.setWatchId(watchId);
  } catch (err) {
    // Only log critical errors
    console.error("Failed to start foreground geolocation watch:", err);
  }
}

// Background tracking: uses @capgo/background-geolocation

export async function startBackgroundLocationWatch() {
  const s = useSessionStore.getState();
  if (
    !s.isUserClockedIn ||
    s.isBackgroundTrackingActive ||
    !BackgroundGeolocation
  )
    return;
  try {
    await BackgroundGeolocation.start(
      {
        backgroundMessage: "Location tracking in progress",
        backgroundTitle: "Shift Scan",
        requestPermissions: false,
        stale: false,
        distanceFilter: 50,
      },
      async (location, error) => {
        const s = useSessionStore.getState();
        if (error || !location) return;
        if (!s.isUserClockedIn) return;
        if (!s.currentSessionId || s.preWarmActive) {
          s.setLastKnownCoordinates({
            lat: location.latitude,
            lng: location.longitude,
          });

          return;
        }
        if (s.locationSendInProgress) return;
        if (!s.currentUserId || !s.currentSessionId) return;
        s.setLastKnownCoordinates({
          lat: location.latitude,
          lng: location.longitude,
        });
        // Throttle: Only send if interval has passed
        const now = Date.now();
        if (
          s.lastLocationSentAt &&
          now - s.lastLocationSentAt < WRITE_INTERVAL_MS
        )
          return;
        s.setLocationSendInProgress(true);
        const payload: LocationLog = {
          userId: s.currentUserId,
          sessionId: s.currentSessionId,
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
        const result = await sendLocation(
          `/api/location?clockType=clockIn`,
          payload
        );
        if (result.success) {
          s.setLastLocationSentAt(s.currentSessionId, now);
        }
        s.setLocationSendInProgress(false);
      }
    );
    s.setIsBackgroundTrackingActive(true);
  } catch (err) {
    // Only log critical errors
    console.error("Failed to start background geolocation:", err);
  }
}

// Periodic location sending

async function sendPeriodicLocation() {
  const s = useSessionStore.getState();
  if (!s.isUserClockedIn || !s.currentUserId || !s.currentSessionId) return;
  if (!s.lastKnownCoordinates) return;
  if (s.locationSendInProgress) return;
  const now = Date.now();
  if (s.lastLocationSentAt && now - s.lastLocationSentAt < WRITE_INTERVAL_MS)
    return;
  s.setLocationSendInProgress(true);
  try {
    const payload: LocationLog = {
      userId: s.currentUserId,
      sessionId: s.currentSessionId,
      coords: {
        lat: s.lastKnownCoordinates.lat,
        lng: s.lastKnownCoordinates.lng,
      },
      device: {
        platform: typeof navigator !== "undefined" ? navigator.userAgent : null,
      },
    };
    const result = await sendLocation(
      `/api/location?clockType=clockIn`,
      payload
    );
    if (result.success) {
      s.setLastLocationSentAt(s.currentSessionId, now);
    }
  } catch (err) {
    // Only log critical errors
    console.error("[Periodic] Failed to send location:", err);
  } finally {
    s.setLocationSendInProgress(false);
  }
}

/**
 * Start all tracking when user clocks in (foreground + background)
 * @param userId - Authenticated user ID
 * @param sessionId - Current session ID
 */
export async function startClockInTracking(userId: string, sessionId: number) {
  try {
    const s = useSessionStore.getState();
    if (!userId || !sessionId) {
      throw new Error("User ID and Session ID are required to start tracking");
    }

    // Prevent duplicate tracking initialization
    if (s.isUserClockedIn && s.watchId && s.isBackgroundTrackingActive) {
      console.warn(
        "Tracking already started - ignoring duplicate startClockInTracking call"
      );
      return { success: true };
    }

    // Store user and session IDs for callbacks

    s.setCurrentUserId(userId);
    s.setCurrentSession(s.currentSessionId);
    s.setIsUserClockedIn(true);
    console.log("User clocked in - starting location tracking");

    // Start foreground and background tracking (fire-and-forget)
    startForegroundLocationWatch();
    startBackgroundLocationWatch();

    // Start periodic timer for location upload
    if (!s.periodicSendTimer) {
      const timer = setInterval(() => {
        sendPeriodicLocation();
      }, WRITE_INTERVAL_MS);
      s.setPeriodicSendTimer(timer);
    }

    return { success: true };
  } catch (err) {
    const s = useSessionStore.getState();
    console.error("Failed to start tracking on clock in:", err);
    s.setIsUserClockedIn(false);
    s.setCurrentUserId(null);
    s.setCurrentSession(null);
    return { success: false, error: err };
  }
}

/**
 * Stop all tracking when user clocks out (foreground + background)
 * Posts final location
 */
export async function stopClockOutTracking() {
  try {
    const s = useSessionStore.getState();
    console.debug("[stopClockOutTracking] Called", {
      currentUserId: s.currentUserId,
      currentSessionId: s.currentSessionId,
      isUserClockedIn: s.isUserClockedIn,
      lastLocationSentAt: s.lastLocationSentAt,
      watchId: s.watchId,
      isBackgroundTrackingActive: s.isBackgroundTrackingActive,
      periodicSendTimer: s.periodicSendTimer,
    });
    // Post final clock-out location (do not block cleanup on failure)
    if (s.currentUserId && s.currentSessionId) {
      try {
        await sendLocation(`/api/location?clockType=clockOut`, {
          userId: s.currentUserId,
          sessionId: s.currentSessionId,
          coords: null,
        });
      } catch (err) {
        // Only warn if posting fails
        console.warn("Failed to post clock out session:", err);
      }
    }

    // Reset lastLocationSentAt in both global and session store
    s.setLastLocationSentAt(s.currentSessionId || 0, 0);

    // Stop foreground tracking
    if (s.watchId) {
      try {
        await Geolocation.clearWatch({ id: s.watchId });
      } catch (err) {
        // Only warn if clearWatch fails
        console.warn("clearWatch threw:", err);
      }
      s.setWatchId(null);
    }

    // Stop background tracking
    if (s.isBackgroundTrackingActive && BackgroundGeolocation) {
      try {
        await BackgroundGeolocation.stop();
      } catch (err) {
        // Only warn if stop fails
        console.warn("BackgroundGeolocation.stop threw:", err);
      }
      s.setIsBackgroundTrackingActive(false);
    }

    // Stop periodic timer
    if (s.periodicSendTimer) {
      clearInterval(s.periodicSendTimer);
      s.setPeriodicSendTimer(null);
    }

    // Always clean up all state
    s.setIsUserClockedIn(false);
    s.setCurrentUserId(null);
    s.setCurrentSession(null);
    s.setLocationSendInProgress(false);

    console.debug("[stopClockOutTracking] Cleanup complete", {
      isUserClockedIn: s.isUserClockedIn,
      currentUserId: s.currentUserId,
      currentSessionId: s.currentSessionId,
      lastLocationSentAt: s.lastLocationSentAt,
      watchId: s.watchId,
      isBackgroundTrackingActive: s.isBackgroundTrackingActive,
      periodicSendTimer: s.periodicSendTimer,
    });
    return { success: true };
  } catch (err) {
    const s = useSessionStore.getState();
    // Only log critical errors
    console.error("Failed to stop tracking on clock out:", err);
    // Always clean up all state even on error
    s.setIsUserClockedIn(false);
    s.setCurrentUserId(null);
    s.setCurrentSession(null);
    s.setLocationSendInProgress(false);
    return { success: false, error: err };
  }
}

/**
 * Debug utility to print current tracking state
 */
export function debugLocationTrackingState() {
  // eslint-disable-next-line no-console
  const s = useSessionStore.getState();
  console.debug("[LocationTracking State]", {
    isUserClockedIn: s.isUserClockedIn,
    currentUserId: s.currentUserId,
    currentSessionId: s.currentSessionId,
    lastLocationSentAt: s.lastLocationSentAt,
    watchId: s.watchId,
    isBackgroundTrackingActive: s.isBackgroundTrackingActive,
    periodicSendTimer: s.periodicSendTimer,
    locationSendInProgress: s.locationSendInProgress,
    lastKnownCoordinates: s.lastKnownCoordinates,
  });
}

/**
 * Returns true if user is currently being tracked (clocked in)
 */
export function isTrackingActive(): boolean {
  return useSessionStore.getState().isUserClockedIn;
}

const GEOLOCATION_TIMEOUT = 2000; // ms, quick snapshot for clock ops

/**
 * Get a fresh, current coordinate snapshot (fast timeout)
 * @returns Coordinates or null if unavailable
 */
export async function getStoredCoordinates(): Promise<{
  lat: number;
  lng: number;
} | null> {
  try {
    if (isNative) {
      // Native Capacitor Geolocation - single attempt
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: 0, // No caching
      });

      if (!pos) {
        console.warn("[Geolocation] Position is null");
        return null;
      }
      return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
    }

    // Not on native platform
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

/**
 * Pre-start location tracking to warm up GPS before clock-in
 * Fires foreground tracking in the background without sending to backend yet
 */
export async function preStartLocationTracking(userId: string) {
  const s = useSessionStore.getState();
  s.setCurrentUserId(userId);
  s.setPreWarmActive(true);
  s.setIsUserClockedIn(true);
  startForegroundLocationWatch();
  // Start foreground watch only; skip background to reduce unnecessary writes
  startForegroundLocationWatch();
}
