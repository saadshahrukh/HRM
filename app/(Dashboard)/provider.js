"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./dashboard/components/AppSidebar";
import { useUser } from "@/app/Provider";
import { Coins, AlertTriangle } from "lucide-react";
import Link from "next/link";

function Dashboardprovider({ children }) {
  const { user, activeOrgCredits } = useUser();

  const isSystemAdmin = user?.role === "super_admin" || user?.email === "saad122sharukh@gmail.com";
  const creditsExhausted = activeOrgCredits !== null && activeOrgCredits <= 0 && !isSystemAdmin;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SidebarProvider>
        <AppSidebar />

        <main className="w-full p-6 lg:p-8 flex flex-col min-h-screen">
          {/* Header Bar */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <SidebarTrigger className="text-muted-foreground hover:bg-muted hover:text-foreground border border-border bg-slate-900" />
            
            {/* Credit Counter Pill */}
            {activeOrgCredits !== null && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${
                creditsExhausted 
                  ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse" 
                  : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
              }`}>
                <Coins className="h-3.5 w-3.5" />
                <span>Credits Left: {activeOrgCredits}</span>
              </div>
            )}
          </div>

          {/* Credits Finished Warning Banner */}
          {creditsExhausted && (
            <div className="mb-8 p-4 bg-red-600/10 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-lg shadow-red-500/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-xl text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Your workspace credits are fully exhausted!</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Job creation and interviews scheduled will be paused until you top up.</p>
                </div>
              </div>
              <Link href="mailto:saad122sharukh@gmail.com" className="w-full sm:w-auto">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold h-9 px-4 rounded-xl transition-all">
                  Request Top Up
                </button>
              </Link>
            </div>
          )}

          {/* Page Contents */}
          <div className="flex-1">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default Dashboardprovider;
