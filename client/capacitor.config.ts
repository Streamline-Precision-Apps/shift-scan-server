/// <reference types="@capacitor/splash-screen" />
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.shiftscanapp",
  appName: "Shift Scan",
  webDir: "out",

  server: {
    url: process.env.NEXT_PUBLIC_CAPACITOR_APP_URL,
    cleartext: true,
  },
  android: {
    useLegacyBridge: true,
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
    CapacitorHttp: {
      enabled: true,
    },
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#ffffffff",
    },
  },
};

export default config;
