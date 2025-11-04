import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { getAuth } from "firebase/auth";
import { BackgroundGeolocation } from "@capgo/background-geolocation";

export interface LocationLog {
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

// add a variable to track the last time a write to FireStore occurred
let lastFirestoreWriteTime: number = 0;
const WRITE_INTERVAL_MS = 5 * 60 * 1000; // e.g., 5 mins

// Start foreground or background location tracking
export async function startLocationWatch({ background = false } = {}) {
  if (background) {
    startBackgroundLocationWatch();
    return;
  }
  if (watchId) return; // already watching
  watchId = await Geolocation.watchPosition({}, async (pos, err) => {
    if (err) {
      console.error("Geolocation watch error:", err);
      return;
    }
    if (!pos) {
      console.error("Geolocation watch: position is null");
      return;
    }
    const currentTime = Date.now();
    if (currentTime - lastFirestoreWriteTime < WRITE_INTERVAL_MS) {
      return;
    }
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      const payload: LocationLog = {
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

      await fetch("/api/location/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optionally add auth token if needed
        },
        body: JSON.stringify(payload),
      });
      lastFirestoreWriteTime = currentTime;
    } catch (err) {
      console.error("Failed to send watched location to backend:", err);
    }
  });
}

// Start background location tracking using Capacitor BackgroundGeolocation plugin
export async function startBackgroundLocationWatch() {
  if (!BackgroundGeolocation) {
    console.error("BackgroundGeolocation plugin not available");
    return;
  }

  try {
    await BackgroundGeolocation.start(
      {
        backgroundMessage: "Location tracking in progress",
        backgroundTitle: "Shift Scan",
        requestPermissions: true,
        stale: false,
        distanceFilter: 50, // Only update when moved 50+ meters
      },
      async (location, error) => {
        if (error) {
          if (error.code === "NOT_AUTHORIZED") {
            console.error("Location permission not granted");
            if (
              typeof window !== "undefined" &&
              window.confirm(
                "This app needs your location permission. Open settings now?"
              )
            ) {
              await BackgroundGeolocation.openSettings();
            }
          }
          console.error("BackgroundGeolocation error:", error);
          return;
        }

        if (!location) {
          console.error("Location is null");
          return;
        }

        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (!user) throw new Error("No authenticated user");

          const payload: LocationLog = {
            coords: {
              lat: location.latitude,
              lng: location.longitude,
              accuracy: location.accuracy,
              speed: location.speed ?? null,
              heading: location.bearing ?? null,
            },
            device: {
              platform:
                typeof navigator !== "undefined" ? navigator.userAgent : null,
            },
          };

          await fetch("/api/location/user", {
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
  } catch (err) {
    console.error("Failed to start background geolocation:", err);
  }
}

// Stop Tracking location (foreground and background)
export async function stopLocationWatch() {
  if (watchId) {
    Geolocation.clearWatch({ id: watchId });
    watchId = null;
    lastFirestoreWriteTime = 0; // reset for next session
  }
  if (BackgroundGeolocation) {
    try {
      await BackgroundGeolocation.stop();
    } catch (err) {
      console.error("Failed to stop background geolocation:", err);
    }
  }
}

// Get the current coordinates of the user (for clock in/out)
export async function getStoredCoordinates() {
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
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            console.error("Browser geolocation error:", err);
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

// Send location to backend API for one-time updates
export async function sendLocationToBackend() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const pos = await Geolocation.getCurrentPosition();
    if (!pos) throw new Error("Geolocation position is null");

    const payload: LocationLog = {
      coords: {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        speed: pos.coords.speed ?? null,
        heading: pos.coords.heading ?? null,
      },
      device: {
        platform: typeof navigator !== "undefined" ? navigator.userAgent : null,
      },
    };

    await fetch("/api/location/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Optionally add auth token if needed
      },
      body: JSON.stringify(payload),
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to send location to backend:", err);
    return { success: false, error: err };
  }
}

//when the admin wants to look up the latest location of a user
export async function fetchLatestUserLocation(userId: string) {
  const res = await fetch(`/api/location/${userId}`);
  if (!res.ok) return null;
  return await res.json();
}
