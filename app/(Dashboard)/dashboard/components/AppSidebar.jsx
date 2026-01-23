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
import { Plus, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/Provider";
import { supabase } from "@/services/supaBaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/auth");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <Sidebar className="border-r border-gray-800 bg-gray-900">
      <SidebarHeader className="border-b border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Image
              src={"/logo.png"}
              width={24}
              height={24}
              alt="logo"
              className="w-6 h-6"
            />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">AI HRM</h2>
            <p className="text-xs text-gray-400">Recruiting Platform</p>
          </div>
        </div>
        <Link href="/dashboard/create-interview" className="w-full">
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Create Interview
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {SideBarOptions.map((option, index) => {
              const Icon = option.icon;
              const isActive = pathname === option.path;
              
              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`w-full justify-start gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <Link href={option.path}>
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{option.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-800 p-4">
        <div className="space-y-2">
          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
            {user?.picture ? (
              <Image
                src={user.picture}
                width={40}
                height={40}
                alt="Avatar"
                className="rounded-full w-10 h-10 border-2 border-indigo-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
