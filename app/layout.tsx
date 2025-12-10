import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientIntlProvider from "./lib/client/ClientIntlProvider";
import AppProviders from "./v1/providers";
import StatusBarSetup from "./lib/client/statusBar";
import { Button } from "./v1/components/ui/button";
import { Anton } from "next/font/google";

import Link from "next/link";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

// import BugLogPage from "./lib/utils/buglog";
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
            {/* <BugLogPage /> debugging component - provider disabled too */}
          </AppProviders>
        </ClientIntlProvider>
      </body>
    </html>
  );
}
