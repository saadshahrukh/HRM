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
import { Plus, AlertCircle, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/Provider";
import { motion } from "framer-motion";
import { useState } from "react";


function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [interviewsOpen, setInterviewsOpen] = useState(
    pathname.includes("/all-interview") || pathname.includes("/scheduled-interview")
  );

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="relative">
            <div className="absolute -inset-1 bg-primary/50 rounded-lg blur opacity-25"></div>
            <Image
              src={"/logo.png"}
              width={32}
              height={32}
              alt="logo"
              className="relative w-10 h-10 object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground tracking-tight text-base leading-none mb-1">AI HRM</h2>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Pro Platform</p>
            </div>
          </div>
        </div>

        <Link href="/dashboard/create-interview" className="w-full block group">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl h-11 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.2)] group-hover:shadow-[0_0_20px_rgba(79,70,229,0.35)]">
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            New Interview
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-4">Main Menu</p>
          <SidebarMenu className="space-y-1.5">
            {SideBarOptions.map((option, index) => {
              const Icon = option.icon;
              const isActive = pathname === option.path || option.children?.some((item) => item.path === pathname);

              if (option.children?.length) {
                return (
                  <SidebarMenuItem key={index}>
                    <button
                      onClick={() => setInterviewsOpen((prev) => !prev)}
                      className={`relative w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-current"}`} />
                        <span className="font-medium text-sm">{option.name}</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${interviewsOpen ? "rotate-180" : ""}`} />
                    </button>

                    {interviewsOpen && (
                      <div className="ml-5 mt-2 space-y-1 border-l border-sidebar-border pl-3">
                        {option.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = pathname === child.path;
                          return (
                            <Link
                              key={child.path}
                              href={child.path}
                              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                                isChildActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              <ChildIcon className="h-4 w-4" />
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`relative w-full justify-start gap-3 px-4 py-6 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Link href={option.path}>
                      {isActive && (
                        <motion.div 
                          layoutId="active-pill"
                          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                        />
                      )}
                      
                      <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "group-hover:text-foreground"}`} />
                      <span className="font-medium text-sm">{option.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-muted/20 border-t border-sidebar-border">
        <div className="space-y-4">
          <div className="mx-2 bg-muted border border-border rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <AlertCircle className="w-4 h-4 text-amber-500" />
               <span className="text-[11px] text-muted-foreground font-medium">System Status</span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">Stable</span>
          </div>

          <div className="flex items-center gap-3 p-2 group cursor-pointer hover:bg-muted rounded-xl transition-colors">
            <div className="relative">
                {user?.picture ? (
                <Image
                    src={user.picture}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="rounded-full ring-2 ring-border group-hover:ring-primary/50 transition-all"
                />
                ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                </div>
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-sidebar rounded-full"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-sidebar-foreground truncate leading-none mb-1">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate font-medium">
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