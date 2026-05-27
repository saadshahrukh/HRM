"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Download, 
  MapPin, 
  Phone, 
  Calendar, 
  Briefcase, 
  Building2,
  Clock, 
  TrendingUp,
  ShieldCheck,
  Target,
  FileText,
  Activity,
  Award,
  ChevronLeft,
  Plus,
  Grid,
  List
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  LineChart,
  Line
} from "recharts";

// Mock Data
const EMPLOYEES = [
  {
    id: "EMP-2041",
    name: "Alex Mercer",
    role: "Senior UX Designer",
    department: "Design Dept.",
    location: "New York (Hybrid)",
    phone: "+1 (555) 019-2831",
    joined: "Oct 12, 2025",
    status: "ACTIVE",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    productivity: 94,
    attendance: 98,
    tasks: 142,
    manager: { name: "James Sullivan", title: "VP of Design", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026703d" },
    hoursData: [
      { day: "Mon", hours: 8.5 },
      { day: "Tue", hours: 7.2 },
      { day: "Wed", hours: 9.1 },
      { day: "Thu", hours: 8.0 },
      { day: "Fri", hours: 6.5 }
    ],
    radarData: [
      { subject: "Productivity", A: 95, fullMark: 100 },
      { subject: "Quality", A: 90, fullMark: 100 },
      { subject: "Communication", A: 85, fullMark: 100 },
      { subject: "Leadership", A: 70, fullMark: 100 },
      { subject: "Punctuality", A: 98, fullMark: 100 }
    ]
  },
  {
    id: "EMP-2042",
    name: "Sarah Jenkins",
    role: "Frontend Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    phone: "+1 (555) 012-3921",
    joined: "Nov 01, 2025",
    status: "ACTIVE",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    productivity: 91,
    attendance: 100,
    tasks: 115,
    manager: { name: "Sarah Connor", title: "CTO", avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d" },
    hoursData: [
      { day: "Mon", hours: 8.0 },
      { day: "Tue", hours: 8.2 },
      { day: "Wed", hours: 7.9 },
      { day: "Thu", hours: 8.5 },
      { day: "Fri", hours: 8.1 }
    ],
    radarData: [
      { subject: "Productivity", A: 92, fullMark: 100 },
      { subject: "Quality", A: 95, fullMark: 100 },
      { subject: "Communication", A: 80, fullMark: 100 },
      { subject: "Leadership", A: 60, fullMark: 100 },
      { subject: "Punctuality", A: 100, fullMark: 100 }
    ]
  }
];

const TABS = ["Overview", "Attendance & GPS", "Performance & Activity", "Payroll", "Documents", "Benefits"];

export default function EmployeeProfileDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  const filteredEmployees = EMPLOYEES.filter(emp => emp.name.toLowerCase().includes(search.toLowerCase()) || emp.role.toLowerCase().includes(search.toLowerCase()));

  // ---------------------------------------------------------------------------
  // RENDER: DIRECTORY GRID / LIST
  // ---------------------------------------------------------------------------
  if (!selectedEmployee) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_bottom,#0A0E1A,#05070F)] p-6 md:p-8 font-sans space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Employees Directory</h1>
            <p className="text-sm text-[#94A3B8] mt-1">Manage active workforce and view analytical profiles.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="pl-9 bg-[#070A12] border-slate-800 text-white focus:border-cyan-500 h-10 w-64 rounded-xl"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-[#0B111E] border border-slate-800 rounded-xl p-0.5 h-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`h-9 w-9 rounded-lg transition-all ${viewMode === "grid" ? "bg-cyan-600/20 text-cyan-400" : "text-slate-400 hover:text-white"}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={`h-9 w-9 rounded-lg transition-all ${viewMode === "list" ? "bg-cyan-600/20 text-cyan-400" : "text-slate-400 hover:text-white"}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" className="bg-[#0B111E] border-slate-800 text-slate-300 hover:text-white rounded-xl h-10 px-4">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl h-10 px-4 shadow-lg shadow-cyan-600/20" onClick={() => router.push('/onboarding')}>
              <Plus className="h-4 w-4 mr-2" /> Add Employee Manually
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((emp) => {
              const perfTrend = [
                { val: Math.max(30, emp.productivity - 15) },
                { val: Math.max(30, emp.productivity - 8) },
                { val: Math.max(30, emp.productivity - 12) },
                { val: Math.max(30, emp.productivity - 3) },
                { val: emp.productivity }
              ];
              const attTrend = [
                { val: Math.max(50, emp.attendance - 10) },
                { val: Math.max(50, emp.attendance - 4) },
                { val: Math.max(50, emp.attendance - 6) },
                { val: Math.max(50, emp.attendance - 2) },
                { val: emp.attendance }
              ];

              return (
                <div 
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="bg-[#0B111E] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,210,255,0.1)] transition-all group relative overflow-hidden flex flex-col justify-between min-h-[340px]"
                >
                  <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <img src={emp.avatar} alt={emp.name} className="h-20 w-20 rounded-full object-cover border-2 border-slate-800 group-hover:border-cyan-500 transition-colors" />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-[#0B111E] h-4 w-4 rounded-full" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{emp.name}</h3>
                      <p className="text-xs text-cyan-400 font-medium">{emp.role}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded-md border border-slate-800">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{emp.id}</span>
                    </div>
                  </div>

                  {/* Sparkline Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/60 w-full mt-4">
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">AI Performance</span>
                        <span className="text-xs font-black text-emerald-400">{emp.productivity}%</span>
                      </div>
                      <div className="h-7 w-full bg-slate-950/60 border border-white/5 rounded-lg p-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={perfTrend}>
                            <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Attendance</span>
                        <span className="text-xs font-black text-cyan-400">{emp.attendance}%</span>
                      </div>
                      <div className="h-7 w-full bg-slate-950/60 border border-white/5 rounded-lg p-1">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={attTrend}>
                            <Line type="monotone" dataKey="val" stroke="#00D2FF" strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 flex items-center justify-center gap-4 text-xs text-slate-500 w-full border-t border-slate-800/40">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {emp.location.split(' ')[0]}</span>
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {emp.department.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#0B111E] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/60 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950/40">
                    <th className="p-4 pl-6">Employee</th>
                    <th className="p-4">Department & Location</th>
                    <th className="p-4">AI Performance</th>
                    <th className="p-4">Attendance</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredEmployees.map((emp) => {
                    const perfTrend = [
                      { val: Math.max(30, emp.productivity - 15) },
                      { val: Math.max(30, emp.productivity - 8) },
                      { val: Math.max(30, emp.productivity - 12) },
                      { val: Math.max(30, emp.productivity - 3) },
                      { val: emp.productivity }
                    ];
                    const attTrend = [
                      { val: Math.max(50, emp.attendance - 10) },
                      { val: Math.max(50, emp.attendance - 4) },
                      { val: Math.max(50, emp.attendance - 6) },
                      { val: Math.max(50, emp.attendance - 2) },
                      { val: emp.attendance }
                    ];

                    return (
                      <tr 
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp)}
                        className="hover:bg-slate-900/30 transition-colors cursor-pointer group"
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img src={emp.avatar} alt={emp.name} className="h-11 w-11 rounded-full object-cover border border-slate-800 group-hover:border-cyan-500 transition-colors" />
                              <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 border border-[#0B111E] h-3 w-3 rounded-full" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{emp.name}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-400 font-medium">{emp.role}</span>
                                <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-900 px-1 py-0.25 rounded border border-slate-850">{emp.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-xs text-slate-300 font-medium">
                          <div className="space-y-0.5">
                            <p className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-slate-500" /> {emp.department}</p>
                            <p className="flex items-center gap-1.5 text-slate-400"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {emp.location}</p>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="space-y-0.5 min-w-[50px]">
                              <p className="text-sm font-black text-emerald-400">{emp.productivity}%</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Productivity</p>
                            </div>
                            <div className="h-6 w-20 shrink-0 bg-slate-950/60 border border-white/5 rounded-md p-0.5">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={perfTrend}>
                                  <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={1.5} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="space-y-0.5 min-w-[50px]">
                              <p className="text-sm font-black text-cyan-400">{emp.attendance}%</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Attendance</p>
                            </div>
                            <div className="h-6 w-20 shrink-0 bg-slate-950/60 border border-white/5 rounded-md p-0.5">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={attTrend}>
                                  <Line type="monotone" dataKey="val" stroke="#00D2FF" strokeWidth={1.5} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: PREMIUM DASHBOARD PROFILE
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#0A0E1A,#05070F)] p-6 md:p-8 font-sans space-y-6">
      
      {/* Back Button */}
      <button 
        onClick={() => setSelectedEmployee(null)}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Directory
      </button>

      {/* Header Profile Card */}
      <div className="bg-[#0B111E] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8">
        
        {/* Left: Avatar & Badge */}
        <div className="flex flex-col items-center space-y-4 z-10">
          <div className="h-32 w-32 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <img src={selectedEmployee.avatar} alt="Profile" className="h-full w-full object-cover" />
          </div>
          <div className="bg-[#10B981] px-4 py-1 rounded shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            <span className="text-[10px] font-black text-white tracking-widest uppercase">{selectedEmployee.status}</span>
          </div>
        </div>

        {/* Center: Info Workspace */}
        <div className="flex-1 space-y-4 z-10 text-center md:text-left">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tight">{selectedEmployee.name}</h1>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold px-2 py-1 rounded-md">
                {selectedEmployee.id}
              </span>
            </div>
            <p className="text-cyan-400 font-bold text-lg mt-1">{selectedEmployee.role}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-[#94A3B8]">
            <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {selectedEmployee.department}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {selectedEmployee.location}</span>
            <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {selectedEmployee.phone}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Joined {selectedEmployee.joined}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 z-10 w-full md:w-auto mt-4 md:mt-0">
          <Button className="bg-[#070A12] hover:bg-slate-900 text-white border border-slate-800 rounded-xl flex-1 md:flex-none">
            <Mail className="h-4 w-4 mr-2" /> Email
          </Button>
          <Button variant="outline" size="icon" className="bg-[#070A12] border-slate-800 text-slate-300 hover:text-white rounded-xl">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-cyan-900/10 to-transparent pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex overflow-x-auto hide-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab 
                ? "border-cyan-500 text-cyan-400" 
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Content */}
      <AnimatePresence mode="wait">
        {activeTab === "Overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Top 5%</span>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white">{selectedEmployee.productivity}%</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">AI Productivity</p>
                </div>
              </div>

              <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Excellent</span>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white">{selectedEmployee.attendance}%</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Attendance Rate</p>
                </div>
              </div>

              <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Target className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white">{selectedEmployee.tasks}</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Tasks Completed This Month</p>
                </div>
              </div>
            </div>

            {/* Graphs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Weekly Work Hours Chart */}
              <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-6 lg:col-span-2 flex flex-col h-[350px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weekly Work Hours</h3>
                  <span className="text-xs text-slate-500">Current Week</span>
                </div>
                <div className="flex-1 w-full min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedEmployee.hoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <Tooltip 
                        cursor={{ fill: '#0F172A' }} 
                        contentStyle={{ backgroundColor: '#0B111E', border: '1px solid #1E293B', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#00D2FF', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="hours" fill="#00D2FF" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sidebar Group (Radar + Manager Widget) */}
              <div className="flex flex-col gap-6">
                
                {/* AI Performance Radar */}
                <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Performance Indices</h3>
                  <div className="flex-1 min-h-[200px] -ml-2 -mr-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={selectedEmployee.radarData}>
                        <PolarGrid stroke="#1E293B" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Performance" dataKey="A" stroke="#00D2FF" fill="#00D2FF" fillOpacity={0.3} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0B111E', border: '1px solid #1E293B', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Reporting Vector Widget */}
                <div className="bg-[#070A12] border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Reporting Superior</h3>
                  <div className="flex items-center gap-3">
                    <img src={selectedEmployee.manager.avatar} alt={selectedEmployee.manager.name} className="h-10 w-10 rounded-full border border-slate-700" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{selectedEmployee.manager.name}</h4>
                      <p className="text-xs text-cyan-500">{selectedEmployee.manager.title}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
        
        {/* Empty state for other tabs */}
        {activeTab !== "Overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0B111E] border border-white/5 rounded-2xl p-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-4"
          >
            <ShieldCheck className="h-12 w-12 text-slate-800" />
            <p>The <span className="text-slate-300 font-bold">{activeTab}</span> module is currently locked or under maintenance.</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
