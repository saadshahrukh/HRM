"use client";
import { ChevronDown, Target } from "lucide-react";
import React, { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdvancedAnalytics = () => {
  // Mock data for Hiring Velocity
  const hiringVelocityData = [
    { month: "Jan", value: 400 },
    { month: "Feb", value: 300 },
    { month: "Mar", value: 550 },
    { month: "Apr", value: 450 },
    { month: "May", value: 700 },
    { month: "Jun", value: 650 },
  ];

  // Mock data for AI Sourcing Funnel
  const funnelData = [
    { stage: "Applied", count: 1200 },
    { stage: "AI Screened", count: 850 },
    { stage: "Interviewed", count: 420 },
    { stage: "Offered", count: 85 },
    { stage: "Hired", count: 64 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hiring Velocity Graph */}
      <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-purple-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-white">Hiring Velocity</h3>
          </div>
          <button className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700/50 transition-colors">
            Last 6 Months <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hiringVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B111E', border: '1px solid #1E293B', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#A855F7', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#colorVelocity)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Sourcing Funnel */}
      <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-8">
          <Target className="h-5 w-5 text-pink-500" />
          <h3 className="text-lg font-bold text-white">AI Sourcing Funnel</h3>
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1E293B" />
              <XAxis type="number" hide />
              <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: '#E2E8F0', fontSize: 12, fontWeight: 500 }} />
              <Tooltip 
                cursor={{ fill: '#1E293B' }}
                contentStyle={{ backgroundColor: '#0B111E', border: '1px solid #1E293B', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#EC4899', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" fill="#EC4899" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;

