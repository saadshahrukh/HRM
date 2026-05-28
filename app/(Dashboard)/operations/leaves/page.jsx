"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Check, 
  X, 
  AlertCircle, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function LeavesPage() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30days");
  const [counts, setCounts] = useState({ approved: 0, rejected: 0, pending: 0 });

  useEffect(() => {
    fetchLeaves();
  }, [range]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/operations?type=leaves&range=${range}`);
      const json = await res.json();
      const data = json.data || [];

      // Map leave items
      const mapped = data.map((item, idx) => ({
        id: item.id,
        name: item.employee_profiles?.name || "Active Employee",
        role: item.employee_profiles?.role || "Staff Member",
        type: item.type || "Vacation Leave",
        duration: `${new Date(item.start_date).toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${new Date(item.end_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
        reason: item.reason || "Personal requirements",
        status: item.status || "PENDING",
        avatar: item.employee_profiles?.avatar || `https://i.pravatar.cc/150?u=${idx}`
      }));

      setRequests(mapped.filter(r => r.status === "PENDING"));

      const approvedCount = data.filter(item => item.status === "APPROVED").length;
      const rejectedCount = data.filter(item => item.status === "REJECTED").length;
      const pendingCount = data.filter(item => item.status === "PENDING").length;

      setCounts({
        approved: approvedCount,
        rejected: rejectedCount,
        pending: pendingCount
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, name, action) => {
    const statusVal = action === "approved" ? "APPROVED" : "REJECTED";
    toast.promise(
      async () => {
        const res = await fetch("/api/operations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update-leave", id, status: statusVal })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        
        setRequests(prev => prev.filter(r => r.id !== id));
        setCounts(prev => ({
          ...prev,
          pending: prev.pending - 1,
          [action]: prev[action] + 1
        }));
      },
      {
        loading: `${action === "approved" ? "Approving" : "Rejecting"} leave request...`,
        success: `Leave request for ${name} has been ${action}!`,
        error: 'Failed to update leave request.',
      }
    );
  };

  const leaveTypesData = [
    { type: "Vacation", days: counts.approved * 5 || 10 },
    { type: "Sick", days: 4 },
    { type: "Casual", days: 2 }
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#0A0E1A,#05070F)] p-6 md:p-8 font-sans space-y-6">
      
      {/* Back to operations */}
      <button 
        onClick={() => router.push("/operations")}
        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Operations
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Leaves Management</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Review active leave schedules, approve time-off requests, and sync schedules.</p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold uppercase tracking-wider">Period:</span>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="pl-16 pr-8 py-2.5 bg-[#0B111E] border border-slate-800 text-white rounded-xl text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-cyan-500 h-10 min-w-[140px]"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 font-bold text-slate-400 h-10">
            <Calendar className="h-4 w-4 text-pink-400" />
            <span>Sync Active</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 space-y-4">
          <Loader2 className="h-10 w-10 text-pink-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading leave requests...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-pink-400 uppercase bg-pink-500/10 px-2 py-0.5 rounded">Pending</span>
              </div>
              <h3 className="text-2xl font-black text-white">{counts.pending}</h3>
              <p className="text-xs text-slate-500 mt-1">Leave Requests Pending</p>
            </div>

            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Approved</span>
              </div>
              <h3 className="text-2xl font-black text-white">{counts.approved}</h3>
              <p className="text-xs text-slate-500 mt-1">Granted Leaves This Period</p>
            </div>

            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white">{counts.approved}</h3>
              <p className="text-xs text-slate-500 mt-1">Employees Out</p>
            </div>

            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                  <X className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white">{counts.rejected}</h3>
              <p className="text-xs text-slate-500 mt-1">Rejected Requests</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Bar chart */}
            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-6 lg:col-span-2 flex flex-col h-[300px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Leave Days Granted by Category</h3>
                <span className="text-xs text-slate-500">Period stats</span>
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveTypesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                    <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                    <Tooltip 
                      cursor={{ fill: '#0F172A' }}
                      contentStyle={{ backgroundColor: '#0B111E', border: '1px solid #1E293B', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="days" fill="#EC4899" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Policy Guide */}
            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-[300px]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Leave Policy Guidelines</h3>
                <p className="text-xs text-slate-450 leading-relaxed mb-4">
                  All employees receive 20 days of paid vacation leave and 10 days of sick leave annually. Special leaves are evaluated case-by-case by workspace administrators.
                </p>
              </div>
              <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-400">
                  <span className="font-bold text-slate-200">System Sync:</span> Vacation calendar logs are automatically updated in Google Workspace upon marking as APPROVED.
                </div>
              </div>
            </div>

          </div>

          {/* Leave Request Queue */}
          <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Pending Leave Requests</h3>
              <p className="text-xs text-slate-500 mt-0.5">Approve or Reject pending leave requests.</p>
            </div>

            {requests.length === 0 ? (
              <div className="text-center p-12 bg-slate-950/20 border border-slate-900 rounded-xl">
                <p className="text-xs text-slate-500 italic">No pending leave requests found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((r) => (
                  <div key={r.id} className="bg-[#070A12] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover border border-slate-700" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{r.name}</h4>
                        <p className="text-[9px] text-slate-500 mt-0.5">{r.role}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-800/60 pt-3">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-550 font-bold uppercase">Leave Category:</span>
                        <span className="text-pink-400 font-bold">{r.type}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-550 font-bold uppercase">Duration:</span>
                        <span className="text-slate-300 font-mono font-medium">{r.duration}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-850 mt-2">
                        <span className="font-bold text-slate-300">Reason:</span> "{r.reason}"
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/40">
                      <Button 
                        onClick={() => handleAction(r.id, r.name, "approved")}
                        className="flex-1 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 text-emerald-400 hover:text-white rounded-lg text-[10px] font-bold h-8 flex items-center justify-center gap-1"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </Button>
                      <Button 
                        onClick={() => handleAction(r.id, r.name, "rejected")}
                        className="flex-1 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white rounded-lg text-[10px] font-bold h-8 flex items-center justify-center gap-1"
                      >
                        <X className="h-3 w-3" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
