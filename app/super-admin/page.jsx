"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/Provider";
import { supabase } from "@/services/supaBaseClient";
import { 
  ShieldAlert, 
  Building, 
  Users, 
  Coins, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeftRight, 
  LogOut,
  ExternalLink,
  Globe,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";

const ADMIN_EMAILS = [
  'saad122sharukh@gmail.com',
  'admin@myapp.com'
];

const SuperAdminDashboard = () => {
  const router = useRouter();
  const { user, setActiveOrgId } = useUser();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newCeoEmail, setNewCeoEmail] = useState("");
  const [initialCredits, setInitialCredits] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  // Credit adjustment state
  const [adjustingTenant, setAdjustingTenant] = useState(null);
  const [creditAmount, setCreditAmount] = useState(10);

  // Plan level state
  const [newTenantPlan, setNewTenantPlan] = useState("basic");
  const [adjustingTenantPlan, setAdjustingTenantPlan] = useState(null);
  const [tenantPlanValue, setTenantPlanValue] = useState("basic");

  useEffect(() => {
    if (user === null) {
      router.push("/super-admin/login");
    } else if (user) {
      if (ADMIN_EMAILS.includes(user.email)) {
        setAuthorized(true);
        fetchTenants();
      } else {
        toast.error("Not Authorized.");
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/tenants");
      if (response.data.success) {
        setTenants(response.data.tenants || []);
      } else {
        toast.error(response.data.message || "Failed to fetch tenants.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error fetching tenants list.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    if (!newTenantName || !newCeoEmail) {
      toast.error("All fields are required.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post("/api/admin/tenants", {
        name: newTenantName,
        ceoEmail: newCeoEmail,
        initialCredits,
        plan: newTenantPlan
      });

      if (response.data.success) {
        toast.success(`Tenant ${newTenantName} successfully registered!`);
        setShowCreateModal(false);
        setNewTenantName("");
        setNewCeoEmail("");
        setInitialCredits(10);
        fetchTenants();
      } else {
        toast.error(response.data.message || "Failed to create tenant.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create tenant organization.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdjustCredits = async (e) => {
    e.preventDefault();
    if (!adjustingTenant) return;
    setSubmitting(true);
    try {
      const response = await axios.put(`/api/admin/tenants/${adjustingTenant.id}/credits`, {
        amount: Number(creditAmount)
      });

      if (response.data.success) {
        toast.success(`Credits successfully updated for ${adjustingTenant.name}!`);
        setAdjustingTenant(null);
        setCreditAmount(10);
        fetchTenants();
      } else {
        toast.error(response.data.message || "Failed to adjust credits.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update tenant credits.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    if (!adjustingTenantPlan) return;
    setSubmitting(true);
    try {
      const response = await axios.put(`/api/admin/tenants/${adjustingTenantPlan.id}`, {
        plan: tenantPlanValue
      });

      if (response.data.success) {
        toast.success(`Plan successfully updated for ${adjustingTenantPlan.name}!`);
        setAdjustingTenantPlan(null);
        fetchTenants();
      } else {
        toast.error(response.data.message || "Failed to update tenant plan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update tenant plan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTenant = async (id, name) => {
    const confirm = window.confirm(`Are you absolutely sure you want to deactivate and soft-delete tenant "${name}"?`);
    if (!confirm) return;

    try {
      const response = await axios.delete(`/api/admin/tenants/${id}`);
      if (response.data.success) {
        toast.success(`Tenant ${name} soft-deleted.`);
        fetchTenants();
      } else {
        toast.error("Failed to delete tenant.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting tenant.");
    }
  };

  const handleImpersonateTenant = (tenantId, tenantName) => {
    setActiveOrgId(tenantId);
    toast.success(`Active Session set to tenant: ${tenantName}. Opening dashboard...`);
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
    document.cookie = "sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
    router.push("/super-admin/login");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-500 mb-4" />
        <p className="text-gray-400">Verifying authorization protocols...</p>
      </div>
    );
  }

  const activeTenants = tenants.filter(t => t.status === "active");
  const totalCredits = tenants.reduce((acc, t) => acc + (t.credits_remaining || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-12 relative overflow-hidden">
      {/* Dynamic Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <h1 className="text-3xl font-black flex items-center gap-3 tracking-tight">
              <ShieldAlert className="h-8 w-8 text-indigo-500 animate-pulse" /> 
              Super Admin Multi-Tenant Hub
            </h1>
            <p className="text-sm text-gray-400">
              Provision isolated SaaS tenants, adjust quotas, manage permissions, and impersonate workspaces.
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => router.push("/dashboard")}
              className="bg-slate-900 border border-slate-800 text-gray-300 hover:bg-slate-800 flex items-center gap-2 h-11 px-5 rounded-xl"
            >
              <Globe className="h-4 w-4" /> Client Dashboard
            </Button>
            <Button 
              onClick={handleLogout}
              className="bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 flex items-center gap-2 h-11 px-5 rounded-xl"
            >
              <LogOut className="h-4 w-4" /> Exit Console
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center gap-5">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <Building className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Tenants</p>
              <h2 className="text-3xl font-black text-white mt-1">{activeTenants.length} <span className="text-xs font-normal text-gray-500">/ {tenants.length} total</span></h2>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center gap-5">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Coins className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Credits Out</p>
              <h2 className="text-3xl font-black text-white mt-1">{totalCredits} <span className="text-xs font-normal text-gray-500">credits</span></h2>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center gap-5">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Global User Accounts</p>
              <h2 className="text-3xl font-black text-white mt-1">{tenants.reduce((acc, t) => acc + (t.user_count || 0), 0)} <span className="text-xs font-normal text-gray-500">users</span></h2>
            </div>
          </div>
        </div>

        {/* Tenant Registry Section */}
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 lg:p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Active Tenant Registry</h2>
              <p className="text-xs text-gray-400 mt-1">Directly control Multi-Tenant billing thresholds and credit access.</p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/10"
            >
              <Plus className="h-4 w-4" /> Provision New Tenant
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-slate-950 text-gray-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Tenant Company</th>
                    <th className="px-6 py-4">CEO Contact</th>
                    <th className="px-6 py-4">Plan Tier</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Active Members</th>
                    <th className="px-6 py-4 text-center">Remaining Credits</th>
                    <th className="px-6 py-4 text-right">Administrative Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tenants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        No B2B SaaS tenants provisioned in the system yet.
                      </td>
                    </tr>
                  ) : (
                    tenants.map(t => (
                      <tr key={t.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-5 font-semibold text-white">
                          <div className="flex flex-col">
                            <span>{t.name}</span>
                            <span className="text-[10px] font-mono text-gray-500 mt-1">{t.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">{t.ceo_email}</td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            t.plan === "enterprise" 
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                              : t.plan === "pro" 
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                              : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                          }`}>
                            {t.plan || "basic"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            t.status === "active" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center font-bold text-indigo-400">{t.user_count}</td>
                        <td className="px-6 py-5 text-center">
                          <span className={`font-black text-base ${t.credits_remaining <= 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                            {t.credits_remaining}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-3">
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setAdjustingTenant(t);
                                setCreditAmount(10);
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-xs border border-slate-800 h-8 flex items-center gap-1.5"
                            >
                              <Edit3 className="h-3.5 w-3.5" /> Adjust Credits
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setAdjustingTenantPlan(t);
                                setTenantPlanValue(t.plan || "basic");
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-xs border border-slate-800 h-8 flex items-center gap-1.5"
                            >
                              <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" /> Adjust Plan
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleImpersonateTenant(t.id, t.name)}
                              className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs border border-indigo-500/20 h-8 flex items-center gap-1.5"
                            >
                              <ArrowLeftRight className="h-3.5 w-3.5" /> Act as Tenant
                            </Button>
                            <Button 
                              size="sm" 
                              disabled={t.status === "deleted"}
                              onClick={() => handleDeleteTenant(t.id, t.name)}
                              className="bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs border border-red-500/20 h-8 flex items-center gap-1.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Suspend
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Provision New Tenant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-400" /> Provision isolated SaaS Tenant
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              This creates a dedicated organization and assigns the CEO user. CEO will login via Google.
            </p>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Tenant / Company Name</label>
                <Input 
                  placeholder="e.g. Acme Corp" 
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">CEO Contact Email</label>
                <Input 
                  type="email"
                  placeholder="ceo@company.com" 
                  value={newCeoEmail}
                  onChange={(e) => setNewCeoEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Initial Metred Credits</label>
                <Input 
                  type="number" 
                  value={initialCredits}
                  onChange={(e) => setInitialCredits(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white focus:border-indigo-500"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Subscription Plan Tier</label>
                <select
                  value={newTenantPlan}
                  onChange={(e) => setNewTenantPlan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg h-10 px-3 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="basic">Basic (Auto-Send link only)</option>
                  <option value="pro">Pro (All features: Gmail + OCR + Auto-Send)</option>
                  <option value="enterprise">Enterprise (All features + Custom limits)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <Button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-gray-400 h-10 px-4 rounded-lg"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-5 rounded-lg flex items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin h-4 w-4" />}
                  Register & Provision
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Credits Modal */}
      {adjustingTenant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-400" /> Adjust Credit Allocation
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Add or subtract credits allocated to <span className="font-bold text-white">{adjustingTenant.name}</span>. Use negative values to subtract.
            </p>

            <form onSubmit={handleAdjustCredits} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Adjustment Amount (e.g. +10, -5)</label>
                <Input 
                  type="number" 
                  placeholder="Amount" 
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <Button 
                  type="button" 
                  onClick={() => setAdjustingTenant(null)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-gray-400 h-10 px-4 rounded-lg"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-5 rounded-lg flex items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin h-4 w-4" />}
                  Confirm Allocation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Plan Modal */}
      {adjustingTenantPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-indigo-400 animate-pulse" /> Adjust Subscription Tier
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Modify the subscription plan for <span className="font-bold text-white">{adjustingTenantPlan.name}</span>. This affects feature gating.
            </p>

            <form onSubmit={handleUpdatePlan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Subscription Plan Tier</label>
                <select
                  value={tenantPlanValue}
                  onChange={(e) => setTenantPlanValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg h-10 px-3 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="basic">Basic (Auto-Send link only)</option>
                  <option value="pro">Pro (All features: Gmail + OCR + Auto-Send)</option>
                  <option value="enterprise">Enterprise (All features + Custom limits)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <Button 
                  type="button" 
                  onClick={() => setAdjustingTenantPlan(null)}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-900 text-gray-400 h-10 px-4 rounded-lg"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-5 rounded-lg flex items-center gap-2"
                >
                  {submitting && <Loader2 className="animate-spin h-4 w-4" />}
                  Confirm Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
