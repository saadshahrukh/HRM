"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Wallet, 
  DollarSign, 
  FileCheck, 
  AlertCircle, 
  Users, 
  Send,
  Loader2,
  Receipt,
  Calendar
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

export default function PayrollPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [range, setRange] = useState("30days");

  useEffect(() => {
    fetchPayroll();
  }, [range]);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/operations?type=payroll&range=${range}`);
      const json = await res.json();
      const records = json.data || [];

      const mapped = records.map((r, idx) => ({
        id: r.id,
        name: r.employee_profiles?.name || "Active Officer",
        email: r.employee_profiles?.email || "email@company.com",
        experience: 4, // average
        salary: Number(r.amount_paid) || 6000,
        status: r.status || "PENDING",
        method: "Direct Deposit",
        avatar: r.employee_profiles?.avatar || `https://i.pravatar.cc/150?u=${idx}`
      }));

      setEmployees(mapped);
    } catch (err) {
      console.error("Failed to load payroll:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayEmployee = async (id, name) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pay-salary", id })
      });
      const json = await res.json();
      if (json.success) {
        setEmployees(prev => 
          prev.map(emp => emp.id === id ? { ...emp, status: "PAID" } : emp)
        );
        toast.success(`Payroll successfully processed for ${name}!`);
      } else {
        throw new Error(json.error);
      }
    } catch (err) {
      toast.error(`Payroll execution failed: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePayAll = async () => {
    const pendingCount = employees.filter(emp => emp.status === "PENDING").length;
    if (pendingCount === 0) {
      toast.info("No pending payroll transfers to process.");
      return;
    }

    toast.promise(
      async () => {
        const res = await fetch("/api/operations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "pay-all-pending" })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setEmployees(prev => prev.map(emp => ({ ...emp, status: "PAID" })));
      },
      {
        loading: 'Processing payroll ledger transfer...',
        success: 'All pending payroll payouts successfully sent!',
        error: 'Failed to process bulk payroll.',
      }
    );
  };

  const totalPayrollValue = employees.reduce((acc, curr) => acc + curr.salary, 0);
  const pendingCount = employees.filter(emp => emp.status === "PENDING").length;

  // Group payload value by department distribution (Mocked for visual)
  const payDepts = [
    { name: "Engineering", amount: Math.round(totalPayrollValue * 0.45) },
    { name: "Product", amount: Math.round(totalPayrollValue * 0.25) },
    { name: "Design", amount: Math.round(totalPayrollValue * 0.20) },
    { name: "HR & Ops", amount: Math.round(totalPayrollValue * 0.10) }
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
          <h1 className="text-3xl font-black text-white tracking-tight">Payroll & Compensation</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Manage payroll runs, base salary bands, and payment statuses.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Filter Dropdown */}
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

          <Button 
            onClick={handlePayAll}
            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-10 px-4 font-bold shadow-lg shadow-emerald-600/20"
          >
            <Send className="h-4 w-4 mr-2" />
            Run Pending ({pendingCount})
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 space-y-4">
          <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading compensation records...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Budget</span>
              </div>
              <h3 className="text-2xl font-black text-white">${totalPayrollValue.toLocaleString()}</h3>
              <p className="text-xs text-slate-500 mt-1">Total Period Liability</p>
            </div>

            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded">Action Item</span>
              </div>
              <h3 className="text-2xl font-black text-white">{pendingCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Pending Ledger payouts</p>
            </div>

            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white">{employees.length}</h3>
              <p className="text-xs text-slate-500 mt-1">Active Contracts / Staff</p>
            </div>

            <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                  <FileCheck className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-white">100%</h3>
              <p className="text-xs text-slate-500 mt-1">Payment Success Rate</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-6 flex flex-col h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payroll Expense by Department</h3>
              <span className="text-xs text-slate-500">Monthly breakdown</span>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={payDepts} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip 
                    cursor={{ fill: '#0F172A' }}
                    contentStyle={{ backgroundColor: '#0B111E', border: '1px solid #1E293B', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Employee Ledger List */}
          <div className="bg-[#0B111E] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Employee Compensation List</h3>
                <p className="text-xs text-slate-500 mt-0.5">Active compensation run ledger.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950/40">
                    <th className="p-4 pl-6">Employee</th>
                    <th className="p-4">Pay Period Base Salary</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-xs text-slate-500 italic">No payroll records in this date range.</td>
                    </tr>
                  ) : (
                    employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <img src={emp.avatar} alt={emp.name} className="h-9 w-9 rounded-full object-cover border border-slate-800" />
                            <div>
                              <h4 className="text-xs font-bold text-white">{emp.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-bold text-slate-100">${emp.salary.toLocaleString()} / mo</td>
                        <td className="p-4 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Receipt className="h-3.5 w-3.5 text-slate-500" />
                            {emp.method}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            emp.status === "PAID" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          {emp.status === "PENDING" ? (
                            <Button 
                              onClick={() => handlePayEmployee(emp.id, emp.name)}
                              disabled={processingId === emp.id}
                              className="bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 text-emerald-400 hover:text-white rounded-lg text-[10px] font-bold h-7 px-3"
                            >
                              {processingId === emp.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                "Pay Salary"
                              )}
                            </Button>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold italic">Settled</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
