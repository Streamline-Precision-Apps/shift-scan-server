"use client";
import { Toaster } from "@/app/v1/components/ui/sonner";
import LeftSidebar from "./_pages/sidebar/leftSide";
import { Sidebar, SidebarProvider, SidebarInset } from "@/app/v1/components/ui/sidebar";
import { FcmProvider } from "./_pages/sidebar/FcmContext";
import { DashboardDataProvider } from "./_pages/sidebar/DashboardDataContext";
import { UserProfileProvider } from "./_pages/sidebar/UserImageContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardDataProvider>
      <UserProfileProvider>
        <FcmProvider>
          <Toaster position="top-right" richColors closeButton />
          <SidebarProvider>
            <Sidebar variant={"sidebar"} collapsible="offcanvas">
              <LeftSidebar />
            </Sidebar>

            <SidebarInset
              style={{
                background: "var(--color-app-gradient)"
              }}
            >
              {children}
            </SidebarInset>
          </SidebarProvider>
        </FcmProvider>
      </UserProfileProvider>
    </DashboardDataProvider>
  );
}
