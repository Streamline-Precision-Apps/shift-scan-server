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
const WRITE_INTERVAL_MS = 5 * 60 * 1000; // 30 seconds for testing (change back to 5 * 60 * 1000 for production)
// 5 * 60 * 1000; // e.g., 5 mins
// LOCAL STORAGE KEY for permissions
const LOCATION_PERMISSION_REQUESTED_KEY = "location_permission_requested";

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
        await fetch(`${url}/api/location?clockType=clockOut`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUserId,
            sessionId: currentSessionId,
            coords: null,
            device: {
              platform:
                typeof navigator !== "undefined" ? navigator.userAgent : null,
            },
          }),
        });
      } catch (err) {
        console.warn("Failed to post clock out session:", err);
      }
    }

    isUserClockedIn = false;
    currentUserId = null;
    currentSessionId = null;

    // Stop both tracking methods
    if (watchId) {
      Geolocation.clearWatch({ id: watchId });
      watchId = null;
    }

    if (isBackgroundTrackingActive && BackgroundGeolocation) {
      await BackgroundGeolocation.stop();
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
// FOREGROUND TRACKING - Uses Capacitor Geolocation API
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
    watchId = await Geolocation.watchPosition({}, async (pos, err) => {
      if (err) {
        console.error("Geolocation watch error:", err);
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
      // Throttle writes - only send every 5 minutes
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
        await fetch(`${url}/api/location?clockType=clockIn`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        lastFirestoreWriteTime = currentTime;
      } catch (err) {
        console.error("Failed to send foreground location to backend:", err);
      }
    });
    console.log("Foreground location tracking started");
  } catch (err) {
    console.error("Failed to start foreground geolocation watch:", err);
  }
}

// Start background location tracking using Capacitor BackgroundGeolocation plugin
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
    // Start listening for location changes using the StartOptions interface
    // Returns a Promise that indicates the start call completed
    // The callback will be invoked every time a new location is available or an error occurs
    await BackgroundGeolocation.start(
      {
        backgroundMessage: "Location tracking in progress",
        backgroundTitle: "Shift Scan",
        requestPermissions: false, // Permission already requested at registration
        stale: false, // Don't deliver stale locations
        distanceFilter: 50, // Only update when moved 50+ meters
      },
      // Callback signature: (location?: Location | undefined, error?: CallbackError | undefined) => void
      async (location, error) => {
        // Handle errors from the callback
        // Don't rely on promise rejection - errors come through the callback
        if (error) {
          if (error.code === "NOT_AUTHORIZED") {
            console.error("Location permission not granted");
          }
          console.error("BackgroundGeolocation error:", error);
          return;
        }

        if (!location) {
          console.error("Location is null");
          return;
        }

        // Only send if user is still clocked in
        if (!isUserClockedIn) {
          return;
        }

        // Validate location freshness when stale: false
        // Use location.time to check if location is up to date
        if (location.time && Date.now() - location.time > 60000) {
          console.warn("Location is older than 60 seconds, potentially stale");
        }

        // Check if location is simulated (useful for detecting mock locations in testing)
        if (location.simulated) {
          console.log("Using simulated location (testing environment)");
        }

        try {
          // Use stored user ID and session ID
          if (!currentUserId || !currentSessionId) {
            console.error(
              "User ID or Session ID not available for location tracking"
            );
            return;
          }

          // Use Location interface properties
          const payload: LocationLog = {
            userId: currentUserId,
            sessionId: currentSessionId,
            coords: {
              lat: location.latitude, // Range: -90.0 to +90.0
              lng: location.longitude, // Range: -180.0 to +180.0
              accuracy: location.accuracy, // Radius of horizontal uncertainty in metres (68% confidence)
              speed: location.speed ?? null, // Speed in metres per second
              heading: location.bearing ?? null, // Deviation from true north in degrees (0.0 to 360.0)
            },
            device: {
              platform:
                typeof navigator !== "undefined" ? navigator.userAgent : null,
            },
          };
          const url = getApiUrl();
          await fetch(`${url}/api/location?clockType=clockIn`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
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

// Get the current coordinates of the user (for clock in/out)
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
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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

//when the admin wants to look up the latest location of a user
export async function fetchLatestUserLocation(userId: string) {
  const res = await fetch(`/api/location/${userId}`);
  if (!res.ok) return null;
  return await res.json();
}
