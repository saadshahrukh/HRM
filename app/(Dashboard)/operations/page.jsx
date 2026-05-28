"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Clock, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  Eye, 
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  DollarSign,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

const OPERATIONS = [
  {
    id: "live-attendance",
    title: "Live Attendance",
    description: "Monitor real-time employee check-ins, check-outs, active shifts, and live GPS mappings.",
    path: "/operations/live-attendance",
    icon: Clock,
    color: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/10",
    badge: "Real-time Tracker",
    metrics: "98% Present today",
    graphic: (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/0 opacity-60 flex items-center justify-center">
        {/* Animated radar/waves */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute w-full h-full rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute w-3/4 h-3/4 rounded-full border border-cyan-500/30 animate-pulse" />
          <div className="absolute w-1/2 h-1/2 rounded-full bg-cyan-900/20 flex items-center justify-center border border-cyan-500/40">
            <Clock className="h-6 w-6 text-cyan-400" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "payroll",
    title: "Payroll & Compensation",
    description: "Manage employee base salaries, automated bonuses, tax deductions, and process payments instantly.",
    path: "/operations/payroll",
    icon: Wallet,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/10",
    badge: "Smart Ledger",
    metrics: "Next payout: June 1",
    graphic: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/0 opacity-60 flex items-center justify-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Glowing bar chart visual */}
          <div className="flex items-end gap-1.5 h-12">
            <div className="w-2.5 h-6 bg-emerald-500/30 rounded-t" />
            <div className="w-2.5 h-9 bg-emerald-500/50 rounded-t" />
            <div className="w-2.5 h-12 bg-emerald-400 rounded-t animate-pulse" />
            <div className="w-2.5 h-8 bg-emerald-500/65 rounded-t" />
          </div>
          <div className="absolute -top-1 -right-1 bg-emerald-500/20 p-1.5 rounded-full border border-emerald-500/30">
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "performance",
    title: "Performance & Activity",
    description: "Track average team productivity levels, technical indices, active KPIs, and monthly milestones.",
    path: "/operations/performance",
    icon: TrendingUp,
    color: "from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/10",
    badge: "AI Evaluator",
    metrics: "Average index: 92.4%",
    graphic: (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/0 opacity-60 flex items-center justify-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Sparkline curve effect */}
          <svg className="w-20 h-10 overflow-visible" viewBox="0 0 100 50">
            <path d="M 0,45 Q 25,10 50,30 T 100,5" fill="none" stroke="#818cf8" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
            <circle cx="100" cy="5" r="4" fill="#818cf8" className="animate-pulse" />
          </svg>
          <div className="absolute -top-1 -left-1 bg-indigo-500/20 p-1.5 rounded-full border border-indigo-500/30">
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "leaves",
    title: "Leaves Management",
    description: "Manage upcoming vacations, pending request queues, active approvals, and team calendar sync.",
    path: "/operations/leaves",
    icon: Calendar,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/10",
    badge: "Scheduler",
    metrics: "3 Pending Requests",
    graphic: (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/0 opacity-60 flex items-center justify-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-1 w-14 h-14 bg-pink-950/20 border border-pink-500/20 rounded-lg p-1.5">
            <div className="bg-pink-500/20 rounded-sm" />
            <div className="bg-pink-500/20 rounded-sm" />
            <div className="bg-pink-400 rounded-sm animate-pulse" />
            <div className="bg-pink-500/20 rounded-sm" />
            <div className="bg-pink-500/20 rounded-sm" />
            <div className="bg-pink-500/20 rounded-sm" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "active-monitoring",
    title: "Active Monitoring",
    description: "Actively monitor online status, idle trackers, active tasks, and team screenshots logs.",
    path: "/operations/active-monitoring",
    icon: Eye,
    color: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/10",
    badge: "Live Monitor",
    metrics: "12 Online, 2 Idle",
    graphic: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/0 opacity-60 flex items-center justify-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="w-16 h-12 bg-amber-950/20 border border-amber-500/20 rounded-lg flex items-center justify-center relative">
            <div className="h-6 w-10 bg-amber-500/10 rounded flex items-center justify-center border border-amber-500/30">
              <span className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-ping" />
            </div>
            <div className="absolute -bottom-1.5 h-1.5 w-5 bg-amber-500/40 rounded-t" />
          </div>
        </div>
      </div>
    )
  }
];

export default function OperationsDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#0A0E1A,#05070F)] p-6 md:p-8 font-sans space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-cyan-500/20">
              System Operations
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-2">Workspace Operations</h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Real-time management dashboard for tracking attendance, running payroll, performance scoring, and leaves.
          </p>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {OPERATIONS.map((op, idx) => {
          const Icon = op.icon;
          return (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              onClick={() => router.push(op.path)}
              className="group bg-[#0B111E] border border-white/5 rounded-3xl overflow-hidden cursor-pointer hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,210,255,0.04)] transition-all duration-300 relative flex flex-col justify-between"
            >
              
              {/* Card visual illustration top header */}
              <div className="h-32 bg-slate-950/60 border-b border-white/5 relative overflow-hidden flex items-center justify-center shrink-0">
                {op.graphic}
                {/* Visual glow overlay */}
                <div className={`absolute -inset-10 bg-gradient-to-tr ${op.color} opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500`} />
              </div>

              {/* Card Contents */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5 z-10">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{op.badge}</span>
                    <div className="text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                      {op.metrics}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    {op.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {op.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span>Access Module</span>
                  <div className="h-7 w-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-cyan-600 group-hover:border-cyan-500 group-hover:text-white transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
