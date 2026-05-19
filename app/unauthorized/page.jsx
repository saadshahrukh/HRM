"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supaBaseClient";
import { ShieldAlert, LogOut, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
      document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
      toast.success("Logged out successfully.");
      router.push("/auth");
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl text-center relative z-10 space-y-6">
        <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20 mb-2 shadow-inner">
          <ShieldAlert className="h-12 w-12 text-red-500 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight">Workspace Restricted</h1>
          <p className="text-sm text-gray-400">
            Your account is not currently associated with any active business workspace.
          </p>
        </div>

        <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl text-left text-xs text-gray-400 leading-relaxed space-y-2">
          <p className="font-bold text-gray-300">Why am I seeing this?</p>
          <p>This software operates on a strict B2B SaaS invitation-only model. Self-registration is disabled for this organization. You must be added by a system administrator or CEO before accessing workspace features.</p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button 
            onClick={() => window.location.href = "mailto:saad122sharukh@gmail.com"}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-11 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/10"
          >
            <Mail className="h-4 w-4" />
            Contact System Admin
          </Button>

          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-gray-300 hover:text-white h-11 rounded-xl flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out & Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
