"use client";
import { Toaster } from "@/app/v1/components/ui/sonner";
import LeftSidebar from "./_pages/sidebar/leftSide";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from "@/app/v1/components/ui/sidebar";
import { FcmProvider } from "./_pages/sidebar/FcmContext";
import { DashboardDataProvider } from "./_pages/sidebar/DashboardDataContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full  bg-linear-to-b from-app-dark-blue via-app-blue to-app-blue ">
      <DashboardDataProvider>
        <FcmProvider>
          <Toaster position="top-right" richColors closeButton />
          <SidebarProvider>
            <Sidebar variant={"sidebar"} className="">
              <LeftSidebar />
            </Sidebar>
            <main className="bg-sidebar flex-1  bg-linear-to-b from-app-dark-blue to-app-blue ">
              {children}
            </main>
          </SidebarProvider>
        </FcmProvider>
      </DashboardDataProvider>
    </div>
  );
}
