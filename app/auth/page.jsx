"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supaBaseClient";
import { toast } from "sonner";
import { Loader2, Sparkles, Shield, Compass, BrainCircuit } from "lucide-react";

function Login() {
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      setLoading(false);
      console.error("Authentication failed:", err);
      toast.error("Auth failed: " + (err.message || String(err)));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Dynamic Animated Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[140px] animate-pulse duration-[10000ms]" />
        <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 z-0" />

      {/* Main Container */}
      <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-2xl border border-slate-800/80 p-8 md:p-12 rounded-3xl shadow-2xl relative z-10 text-center space-y-8 animate-fade-in transition-all hover:border-slate-700/60">
        
        {/* Floating Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 tracking-wide mb-2 animate-bounce">
          <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Recruiting Suite
        </div>

        {/* Logo and Brand */}
        <div className="space-y-4">
          <div className="relative inline-block">
            {/* Soft Glowing Ring behind the logo */}
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl animate-pulse" />
            <Image
              src="/logo.png"
              alt="AI Recruiter Logo"
              height={140}
              width={140}
              className="w-[100px] h-[100px] relative z-10 rounded-2xl border border-slate-800 shadow-xl"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-gray-400 bg-clip-text text-transparent">
              Welcome to AI Recruiter
            </h1>
            <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
              Step into the future of automated talent sourcing, smart scorecards, and AI-powered interviewing.
            </p>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/80 border border-slate-800/60 rounded-2xl text-left">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-indigo-400 font-bold text-xs uppercase">
              <BrainCircuit className="h-3.5 w-3.5 shrink-0" /> Smart AI
            </div>
            <p className="text-[10px] text-gray-500">Autonomous Screening</p>
          </div>
          <div className="space-y-1 text-center sm:text-left border-l border-slate-800/80 pl-2">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-emerald-400 font-bold text-xs uppercase">
              <Shield className="h-3.5 w-3.5 shrink-0" /> Enterprise
            </div>
            <p className="text-[10px] text-gray-500">Role-based Isolation</p>
          </div>
          <div className="space-y-1 text-center sm:text-left border-l border-slate-800/80 pl-2">
            <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 font-bold text-xs uppercase">
              <Compass className="h-3.5 w-3.5 shrink-0" /> Tenant Flow
            </div>
            <p className="text-[10px] text-gray-500">Multi-tenant Metering</p>
          </div>
        </div>

        {/* Login Action Area */}
        <div className="space-y-4 pt-2">
          <Button
            onClick={signUp}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold h-12 rounded-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-lg shadow-white/5 disabled:opacity-85"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 text-indigo-600" />
                <span className="text-slate-700 font-medium">Connecting to Google...</span>
              </>
            ) : (
              <>
                {/* Google High-Quality Vector SVG Logo */}
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}

            {/* Premium Button Hover Overlay */}
            <div className="absolute inset-0 w-full h-full bg-slate-950/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </Button>

          <p className="text-[11px] text-gray-500 tracking-wide font-medium uppercase">
            Secured B2B SaaS Gate. Authorized Users Only.
          </p>
        </div>

        {/* Footer Brand Details */}
        <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-gray-600">
          <span>Powered by Antigravity Core</span>
          <span className="font-semibold text-gray-500">© 2026 AI Recruiting Suite</span>
        </div>

      </div>
    </div>
  );
}

export default Login;
