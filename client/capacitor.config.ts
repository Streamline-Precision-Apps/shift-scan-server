/// <reference types="@capacitor/splash-screen" />
import type { CapacitorConfig } from "@capacitor/cli";

// Determine the server URL based on the platform
const serverUrl =
  process.env.CAPACITOR_PLATFORM === "android"
    ? "http://10.0.2.2:3000" // Android emulator
    : "http://localhost:3000"; // Physical device or web

const config: CapacitorConfig = {
  appId: "com.shiftscanapp",
  appName: "Shift Scan",
  webDir: "out",
  server: {
    url: serverUrl,
    cleartext: true,
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    geolocation: {
      background: true,
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: false,
    },
  },
};

export default config;
