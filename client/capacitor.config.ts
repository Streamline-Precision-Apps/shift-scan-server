/// <reference types="@capacitor/splash-screen" />
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.shiftscanapp",
  appName: "Shift Scan",
  webDir: "out",
  server: {
    url: "http://192.168.1.102:3001",
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
