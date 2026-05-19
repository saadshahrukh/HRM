"use client";

import React, { useState } from "react";
import { useUser } from "@/app/Provider";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Plus,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function TeamRolesSettingsPage() {
  const { user, activeOrgName } = useUser();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("recruiter");
  const [submitting, setSubmitting] = useState(false);

  // Default seed team members (mocked)
  const [teamMembers, setTeamMembers] = useState([
    {
      id: "1",
      name: user?.name || "Saad Shahrukh",
      email: user?.email || "saadshahrukh141@gmail.com",
      role: "owner",
      status: "active"
    },
    {
      id: "2",
      name: "John Doe",
      email: "john.doe@recruitment.com",
      role: "recruiter",
      status: "active"
    },
    {
      id: "3",
      name: "Alice Smith",
      email: "alice.smith@recruitment.com",
      role: "hiring_manager",
      status: "pending"
    }
  ]);

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newMember = {
        id: (teamMembers.length + 1).toString(),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        status: "pending"
      };

      setTeamMembers([...teamMembers, newMember]);
      toast.success(`Invitation successfully sent to ${inviteEmail}!`);
      setInviteEmail("");
      setInviteRole("recruiter");
      setShowInviteModal(false);
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-6xl mx-auto text-white">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-3 tracking-tight">
            <Users className="h-6 w-6 text-indigo-500" />
            Team & Roles
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage recruiter access, invite hiring managers, and assign roles for <span className="font-bold text-indigo-400">{activeOrgName || "your organization"}</span>.
          </p>
        </div>
        <Button 
          onClick={() => setShowInviteModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/10"
        >
          <UserPlus className="h-4 w-4" /> Invite Team Member
        </Button>
      </div>

      {/* Team Members List */}
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 lg:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold">Workspace Members</h3>
          <p className="text-xs text-gray-400 mt-0.5">Currently active and invited users in this workspace.</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-slate-950 text-gray-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 uppercase">
                        {member.name.charAt(0)}
                      </div>
                      <span className="capitalize">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{member.email}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 capitalize text-xs font-medium">
                      <Shield className="h-3.5 w-3.5 text-indigo-400" />
                      {member.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      member.status === "active" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {member.status === "active" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toast.info("Role updates are managed by the System Super Admin.")}
                      className="text-xs text-gray-500 hover:text-indigo-400 font-semibold flex items-center gap-1 ml-auto"
                    >
                      Configure <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-indigo-400" /> Invite Team Recruiter
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Enter details below to send an invitation link to your hiring manager or recruiter.
            </p>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Recruiter Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    type="email"
                    placeholder="name@company.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-slate-950 border-slate-800 pl-10 text-white focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Workspace Role</label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg h-10 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="recruiter">Recruiter (Can create & manage jobs)</option>
                  <option value="hiring_manager">Hiring Manager (Can view results & scorecard)</option>
                  <option value="admin">Workspace Admin (Full organization access)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <Button 
                  type="button" 
                  onClick={() => setShowInviteModal(false)}
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
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
