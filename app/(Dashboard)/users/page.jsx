"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/app/Provider";
import { supabase } from "@/services/supaBaseClient";
import { Users as UsersIcon, Plus, Building, ShieldAlert, CheckCircle, ArrowRightLeft, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ModernSpinner } from "@/components/global_components/ModernSpinner";

const UsersPage = () => {
  const { user, activeOrgId, setActiveOrgId } = useUser();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Super Admin view state
  const isSuperAdmin = user?.role === "super_admin" || user?.email === "saadshahrukh141@gmail.com";
  const [organizations, setOrganizations] = useState([]);
  const [newOrgName, setNewOrgName] = useState("");

  // Assign user state
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      if (isSuperAdmin) {
        // Fetch all users and orgs
        const [{ data: usersData }, { data: orgsData }] = await Promise.all([
          supabase.from("Users").select("*").order("created_at", { ascending: false }),
          supabase.from("organizations").select("*")
        ]);
        setUsersList(usersData || []);
        setOrganizations(orgsData || []);
      } else {
        // Normal tenant flow: fetch users in their organization
        const { data: usersData } = await supabase
          .from("Users")
          .select("*")
          .eq("organization_id", user?.organization_id)
          .order("created_at", { ascending: false });
        setUsersList(usersData || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users data");
    } finally {
      setLoading(false);
    }
  };

  const createTenant = async () => {
    if (!newOrgName) return;
    try {
      const { error } = await supabase.from("organizations").insert([{ name: newOrgName }]);
      if (error) throw error;
      toast.success(`Organization "${newOrgName}" created successfully!`);
      setNewOrgName("");
      fetchData();
    } catch (err) {
      toast.error("Failed to create organization");
    }
  };

  const assignUserToTenant = async () => {
    if (!selectedUserEmail || !selectedOrgId) {
      toast.error("Please select a user and an organization");
      return;
    }
    try {
      const { error } = await supabase
        .from("Users")
        .update({ organization_id: selectedOrgId })
        .eq("email", selectedUserEmail);

      if (error) throw error;
      toast.success("User successfully assigned to tenant!");
      setSelectedUserEmail("");
      setSelectedOrgId("");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign user to organization");
    }
  };

  const switchActiveTenant = (orgId, orgName) => {
    setActiveOrgId(orgId);
    toast.success(orgId ? `Switched session to tenant: ${orgName}` : "Switched session to Global View");
  };

  if (loading) return <ModernSpinner fullScreen text="Loading Tenants Management..." />;

  const activeOrgName = organizations.find(o => o.id === activeOrgId)?.name || "Global View";

  return (
    <div className="space-y-8 text-white">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <UsersIcon className="h-8 w-8 text-indigo-500 animate-pulse" /> Users & Tenants
          </h1>
          <p className="text-gray-400">Manage tenant companies, organizations, and team memberships.</p>
        </div>

        {/* Current Active Tenant Switch Session indicator */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-ping" />
          <div className="text-xs font-semibold text-gray-400">
            Active Session: <span className="text-indigo-400 text-sm font-bold">{activeOrgName}</span>
          </div>
          {activeOrgId && (
            <Button 
              size="sm" 
              onClick={() => switchActiveTenant(null, "Global View")}
              className="bg-slate-800 text-xs px-2.5 hover:bg-slate-700 h-7"
            >
              <Globe className="h-3 w-3 mr-1" /> Reset to Global
            </Button>
          )}
        </div>
      </div>

      {isSuperAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tenant Creation */}
          <div className="p-6 rounded-xl border border-indigo-500/20 bg-slate-900/50 backdrop-blur-md">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-indigo-400">
              <Building className="h-5 w-5" /> Register Tenant Company
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Add a new company profile. This creates an isolated workspace tenant.
            </p>
            <div className="flex gap-4 items-center">
              <Input 
                placeholder="Company Name (e.g. Google, Acme Corp)" 
                value={newOrgName} 
                onChange={(e) => setNewOrgName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
              <Button onClick={createTenant} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" /> Register
              </Button>
            </div>
          </div>

          {/* User Tenant Assignment */}
          <div className="p-6 rounded-xl border border-indigo-500/20 bg-slate-900/50 backdrop-blur-md">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-indigo-400">
              <ShieldAlert className="h-5 w-5" /> Assign User to Tenant
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Place a user email into a specific tenant organization to limit their workspace data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <select 
                value={selectedUserEmail}
                onChange={(e) => setSelectedUserEmail(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 text-sm focus:outline-none"
              >
                <option value="">-- Select User --</option>
                {usersList.map(u => (
                  <option key={u.email} value={u.email}>{u.name || u.email} ({u.email})</option>
                ))}
              </select>

              <select 
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg p-2.5 text-sm focus:outline-none"
              >
                <option value="">-- Select Tenant Company --</option>
                {organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <Button onClick={assignUserToTenant} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="h-4 w-4 mr-2" /> Save Assignment
            </Button>
          </div>
        </div>
      )}

      {/* Tenants Master List (Super Admin View) */}
      {isSuperAdmin && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Building className="h-5 w-5 text-indigo-500" /> Active Tenants ({organizations.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.length === 0 ? (
              <p className="text-gray-400 col-span-3 text-center py-8">No tenant companies registered yet.</p>
            ) : (
              organizations.map(org => {
                const isActive = activeOrgId === org.id;
                const membersCount = usersList.filter(u => u.organization_id === org.id).length;

                return (
                  <div 
                    key={org.id} 
                    className={`p-5 rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(79,70,229,0.15)]" 
                        : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-white">{org.name}</h3>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase font-bold tracking-wider rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-xs text-gray-400 mb-6">
                      <p>Tenant ID: <span className="font-mono text-gray-300">{org.id.substring(0, 8)}...</span></p>
                      <p>Team Members: <span className="text-indigo-400 font-bold">{membersCount}</span></p>
                      <p>Created: <span className="text-gray-300">{new Date(org.created_at).toLocaleDateString()}</span></p>
                    </div>

                    <Button 
                      size="sm"
                      onClick={() => switchActiveTenant(isActive ? null : org.id, org.name)}
                      className={`w-full ${
                        isActive 
                          ? "bg-slate-800 text-white hover:bg-slate-700" 
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      <ArrowRightLeft className="h-3.5 w-3.5 mr-2" />
                      {isActive ? "Reset to Global" : "Act as Tenant"}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-indigo-500" /> 
            {isSuperAdmin ? `All Users (${usersList.length})` : "Our Team Members"}
          </h2>
          <Button className="bg-white text-black hover:bg-gray-200">
            <Plus className="h-4 w-4 mr-2" /> Invite Member
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-slate-950/60 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">System Role</th>
                <th className="px-4 py-3">Assigned Tenant</th>
                <th className="px-4 py-3 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td></tr>
              ) : (
                usersList.map((u) => {
                  const userOrg = organizations.find(o => o.id === u.organization_id)?.name || "Unassigned (Freelance)";
                  return (
                    <tr key={u.id || u.email} className="border-b border-slate-900 hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-4 font-semibold text-white">{u.name || "Pending Account..."}</td>
                      <td className="px-4 py-4">{u.email}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.role === "super_admin" 
                            ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                            : u.role === "admin"
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            : "bg-slate-800 text-gray-300"
                        }`}>
                          {u.role || "recruiter"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          u.organization_id 
                            ? "bg-slate-800 text-gray-200" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {userOrg}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-blue-400 cursor-pointer hover:underline text-xs">Edit settings</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
