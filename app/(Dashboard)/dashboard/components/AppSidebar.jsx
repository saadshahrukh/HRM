"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Options";
import { Plus, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/Provider";
import { motion } from "framer-motion";


function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sidebar className="border-r border-gray-800/50 bg-[#0B0F1A] text-gray-300">
      {/* Header Section */}
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-indigo-500 rounded-lg blur opacity-25"></div>
            <Image
              src={"/logo.png"}
              width={32}
              height={32}
              alt="logo"
              className="relative w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-white tracking-tight text-base leading-none mb-1">AI HRM</h2>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Pro Platform</p>
            </div>
          </div>
        </div>

        {/* Create Interview Button - More "App" styled */}
        <Link href="/dashboard/create-interview" className="w-full block group">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl h-11 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)] group-hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] border-t border-indigo-400/20">
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            New Interview
          </Button>
        </Link>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-3">
        <SidebarGroup>
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 mb-4">Main Menu</p>
          <SidebarMenu className="space-y-1.5">
            {SideBarOptions.map((option, index) => {
              const Icon = option.icon;
              const isActive = pathname === option.path;

              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`relative w-full justify-start gap-3 px-4 py-6 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-100"
                    }`}
                  >
                    <Link href={option.path}>
                      {/* Active Indicator Line */}
                      {isActive && (
                        <motion.div 
                          layoutId="active-pill"
                          className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full"
                        />
                      )}
                      
                      <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-indigo-400" : "group-hover:text-white"}`} />
                      <span className="font-medium text-sm">{option.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="p-4 bg-gray-900/20 border-t border-gray-800/50">
        <div className="space-y-4">
          {/* Status Badge */}
          <div className="mx-2 bg-[#1A1F2E] border border-gray-700/50 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <AlertCircle className="w-4 h-4 text-amber-500" />
               <span className="text-[11px] text-gray-400 font-medium">System Status</span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">Stable</span>
          </div>

          {/* User Profile - Standardized with the Card Theme */}
          <div className="flex items-center gap-3 p-2 group cursor-pointer hover:bg-gray-800/30 rounded-xl transition-colors">
            <div className="relative">
                {user?.picture ? (
                <Image
                    src={user.picture}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="rounded-full ring-2 ring-gray-800 group-hover:ring-indigo-500/50 transition-all"
                />
                ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                </div>
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B0F1A] rounded-full"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate leading-none mb-1">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-gray-500 truncate font-medium">
                {user?.email || "No email"}
              </p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;