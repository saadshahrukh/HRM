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
import {
  getInitiallyOpenGroups,
  isGroupActive,
  isPathActive,
  SideBarOptions,
} from "@/services/navigation";
import { AlertCircle, ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/Provider";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AppSidebar() {
  const pathname = usePathname();
  const { user, activeOrgName } = useUser();
  const [openGroups, setOpenGroups] = useState(() => getInitiallyOpenGroups(pathname));

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      SideBarOptions.forEach((group) => {
        if (group.children?.length && isGroupActive(pathname, group)) {
          next[group.id] = true;
        }
      });
      return next;
    });
  }, [pathname]);

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-6">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-primary/50 opacity-25 blur" />
            <Image
              src="/logo.png"
              width={32}
              height={32}
              alt="logo"
              className="relative h-10 w-10 object-contain"
            />
          </div>
          <div>
            <h2 className="text-base font-bold leading-none tracking-tight text-sidebar-foreground">
              AI HRM
            </h2>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {activeOrgName || "Hiring OS"}
              </p>
            </div>
          </div>
        </div>

        <Link href="/jobs/new" className="group block w-full">
          <Button className="h-11 w-full rounded-xl bg-primary font-medium text-primary-foreground shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all duration-300 hover:bg-primary/90 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.35)]">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            Post New Job
          </Button>
        </Link>

        <Link
          href="/dashboard/create-interview"
          className="mt-2 block text-center text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          or create AI interview
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <p className="mb-4 px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <SidebarMenu className="space-y-1">
            {SideBarOptions.map((group) => {
              const Icon = group.icon;
              const groupActive = isGroupActive(pathname, group);

              if (group.children?.length) {
                const isOpen = openGroups[group.id];

                return (
                  <SidebarMenuItem key={group.id}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
                      className={`relative flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 transition-all duration-200 ${
                        groupActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{group.name}</span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="ml-5 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                        {group.children.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isPathActive(pathname, child.path);

                          return (
                            <Link
                              key={child.path}
                              href={child.path}
                              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                                childActive
                                  ? "bg-primary/10 font-medium text-primary"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              <ChildIcon className="h-4 w-4 shrink-0" />
                              <span className="flex-1">{child.name}</span>
                              {child.pulse && (
                                <span className="relative flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton
                    asChild
                    className={`relative w-full justify-start gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                      groupActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Link href={group.path}>
                      {groupActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
                        />
                      )}
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{group.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-muted/20 p-4">
        <div className="space-y-4">
          <div className="mx-2 flex items-center justify-between rounded-xl border border-border bg-muted p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-[11px] font-medium text-muted-foreground">System Status</span>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
              Stable
            </span>
          </div>

          <div className="group flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted">
            <div className="relative">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="rounded-full ring-2 ring-border transition-all group-hover:ring-primary/50"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg">
                  <span className="text-xs font-bold text-primary-foreground">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-none text-sidebar-foreground">
                {user?.name || "User"}
              </p>
              <p className="mt-1 truncate text-[11px] font-medium text-muted-foreground">
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
