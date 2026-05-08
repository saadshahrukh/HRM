import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./dashboard/components/AppSidebar";
import WelcomeContainer from "./dashboard/components/WelcomeContainer";

function Dashboardprovider({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />

        <main className="w-full p-6 lg:p-8">
          <div className="mb-6">
            <SidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground border border-border" />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}

export default Dashboardprovider;
