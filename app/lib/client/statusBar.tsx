"use client";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function StatusBarSetup() {
  useEffect(() => {
    // Only run on native platforms (iOS/Android), skip on web
    if (Capacitor.isNativePlatform()) {
      // Set status bar style to dark (light text for dark backgrounds)
      StatusBar.setStyle({ style: Style.Dark });
      // Optionally set background color (only works if overlaysWebView is false)
      StatusBar.setBackgroundColor({ color: "#0a2342" }); // match your dark blue
      // Optionally overlay webview (default is true)
      StatusBar.setOverlaysWebView({ overlay: true });
      // Optionally show the status bar
      StatusBar.show();
    }
  }, []);

  return null;
}
