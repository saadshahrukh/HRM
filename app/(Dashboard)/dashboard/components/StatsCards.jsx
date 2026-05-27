"use client";
import React from "react";
import { Users, Briefcase, Calendar, CheckCircle2, Clock, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCards = () => {
  const cards = [
    {
      title: "Total Employees",
      value: "842",
      change: "+12",
      isPositive: true,
      icon: Users,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Active Jobs",
      value: "24",
      change: "+3",
      isPositive: true,
      icon: Briefcase,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "On Leave Today",
      value: "15",
      change: "-2",
      isPositive: true, // actually a decrease in leave is positive
      icon: Calendar,
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-500",
    },
    {
      title: "Hired (This Month)",
      value: "64",
      change: "+18%",
      isPositive: true,
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      title: "Avg. Hiring Time",
      value: "12 days",
      change: "-3 days",
      isPositive: true,
      icon: Clock,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      title: "AI Productivity Score",
      value: "92%",
      change: "+4%",
      isPositive: true,
      icon: Activity,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-[#0B111E] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${
                card.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {card.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {card.change}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 tracking-wider mb-1">{card.title}</p>
              <h3 className="text-3xl font-black text-white">{card.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

