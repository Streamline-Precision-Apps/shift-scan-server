import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientIntlProvider from "./lib/client/ClientIntlProvider";
import AppProviders from "./v1/providers";
import StatusBarSetup from "./lib/client/statusBar";
import { Button } from "./v1/components/ui/button";

import Link from "next/link";
export const viewport: Viewport = {
  themeColor: "#57BDE9",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { default: "Shift Scan", template: "%s | Shift Scan" },
    description: "Time Cards made easier",
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Shift Scan",
    },
    formatDetection: {
      telephone: false,
      date: false,
      email: false,
      address: false,
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "mobile-web-app-capable": "yes",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientIntlProvider>
          <AppProviders>
            <StatusBarSetup />

            {children}
            {/* Floating debug button bottom right */}
            <Link passHref href="/debuglog">
              <Button
                style={{
                  position: "fixed",
                  right: 24,
                  bottom: 24,
                  zIndex: 1000,
                  background: "#222",
                  color: "#0f0",
                  borderRadius: 999,
                  padding: "14px 22px",
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                  textDecoration: "none",
                  opacity: 0.85,
                  transition: "opacity 0.2s",
                }}
              >
                Debug Log
              </Button>
            </Link>
            <Link passHref href="/v1/dashboard">
              <Button
                style={{
                  position: "fixed",
                  left: 24,
                  bottom: 24,
                  zIndex: 1000,
                  background: "#222",
                  color: "#0f0",
                  borderRadius: 999,
                  padding: "14px 22px",
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                  textDecoration: "none",
                  opacity: 0.85,
                  transition: "opacity 0.2s",
                }}
              >
                DashBoard
              </Button>
            </Link>
          </AppProviders>
        </ClientIntlProvider>
      </body>
    </html>
  );
}
