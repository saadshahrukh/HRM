"use client";
import { useUser } from "@/app/Provider";
import React from "react";
import { motion } from "framer-motion";
import { Zap, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const WelcomeContainer = () => {
  const { user } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-[linear-gradient(135deg,#130B2A_0%,#090E1A_100%)] rounded-2xl p-8 md:p-10 shadow-2xl border border-white/5"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="w-full flex ">
          {/* Active Badge */}
          <div>
          <div className="inline-flex items-center gap-1.5 bg-[#00D2FF]/10 border border-[#00D2FF]/20 px-3 py-1 rounded-full mb-6">
            <Zap className="h-3.5 w-3.5 text-[#00D2FF] fill-[#00D2FF]/20" />
            <span className="text-[11px] font-bold text-[#00D2FF] tracking-wide uppercase">
              AI Engine v5.0 Active
            </span>
          </div>

          <h1 className="text-3xl md:text-[2.5rem] leading-tight font-bold text-white tracking-tight mb-4">
            Your Intelligent Workforce Command Center
          </h1>
          <p className="text-[#94A3B8] text-base md:text-lg mb-8  leading-relaxed">
            Manage employees, payroll, attendance, onboarding, performance, and company operations with AI automation.
          </p>
          </div>

         
        </div>
         <div className="flex flex-col sm:flex-row items-center gap-4 mt-15">
            <Link href="/employees" className="w-full sm:w-auto">
              <Button className="w-full bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700/50 rounded-xl h-12 px-6 font-semibold gap-2 shadow-sm transition-all">
                <Users className="h-4 w-4" /> Employee Directory
              </Button>
            </Link>
            <Link href="/dashboard/create-interview" className="w-full sm:w-auto">
              <Button className="w-full bg-white hover:bg-slate-100 text-slate-900 rounded-xl h-12 px-6 font-bold gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all">
                <Zap className="h-4 w-4" /> Start Onboarding
              </Button>
            </Link>
          </div>
      </div>
    </motion.div>
  );
};

export default WelcomeContainer;
