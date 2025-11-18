"use client";
import "../globals.css";
import StatusBarSetup from "../lib/client/statusBar";
import { AppProviders } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-auto bg-linear-to-b from-app-dark-blue to-app-blue">
      <StatusBarSetup />
      <AppProviders>{children}</AppProviders>
    </main>
  );
}
