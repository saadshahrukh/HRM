"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supaBaseClient";
import { useUser } from "@/app/Provider";
import {
  MoreVertical,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Clock,
  TrendingUp,
  FolderOpen,
  Users,
  CheckCircle,
  Briefcase,
  SlidersHorizontal,
  ChevronDown,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

export default function HiringPipelineReportPage() {
  const router = useRouter();
  const { user, activeOrgId } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedLoc, setSelectedLoc] = useState("All");
  
  // UI states
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user, activeOrgId]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("Interviews")
        .select(`
          *,
          interview-feedback(id, feedback, recommended, userName, userEmail)
        `)
        .order("created_at", { ascending: false });

      if (activeOrgId) {
        query = query.eq("organization_id", activeOrgId);
      } else {
        query = query.eq("userEmail", user?.email);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to load pipeline jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    setDeleting(true);
    try {
      // 1. Delete associated feedback
      await supabase
        .from("interview-feedback")
        .delete()
        .eq("interview_id", id);

      // 2. Delete the interview record itself
      const { error } = await supabase
        .from("Interviews")
        .delete()
        .eq("interview_id", id);

      if (error) throw error;

      toast.success("Job deleted successfully");
      setDeleteConfirmId(null);
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job:", err);
      toast.error("Failed to delete job posting");
    } finally {
      setDeleting(false);
    }
  };

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Compute departments list
  const departments = ["All", ...new Set(jobs.map((j) => j.department).filter(Boolean))];
  const locations = ["All", ...new Set(jobs.map((j) => j.location).filter(Boolean))];

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobPosition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesLoc = selectedLoc === "All" || job.location === selectedLoc;
    return matchesSearch && matchesDept && matchesLoc;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Job Pipelines
          </h1>
          <p className="text-sm text-gray-400">
            Manage active requisitions and track candidate funnels.
          </p>
        </div>

        <Button
          onClick={() => router.push("/dashboard/create-interview")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-5 font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Job</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-900 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-950 border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder:text-slate-600 h-11"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Select */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold uppercase tracking-wider">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="pl-14 pr-8 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 min-w-[120px] h-11"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Location Select */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold uppercase tracking-wider">Loc:</span>
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="pl-12 pr-8 py-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 min-w-[120px] h-11"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading hiring pipelines...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center p-16 bg-slate-900/20 border border-slate-900 rounded-3xl space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-850 flex items-center justify-center text-slate-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">No active jobs found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Get started by posting your first hiring pipeline job with AI questions.
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/create-interview")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          >
            Create Job Post
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const feedbacks = job["interview-feedback"] || [];
            
            // Calculate stats
            const totalApplicants = feedbacks.length;
            
            const passedApplicants = feedbacks.filter((fb) => {
              const score = fb.feedback?.overallScore || 0;
              return fb.recommended === true || score >= 7;
            }).length;

            const interviewedApplicants = feedbacks.filter((fb) => {
              // Assume finished VAPI/interview is considered interviewed
              return fb.feedback !== null;
            }).length;

            const offeredApplicants = feedbacks.filter((fb) => fb.recommended === true).length;

            // Calculate average match
            const totalScores = feedbacks.reduce((acc, curr) => {
              const score = curr.feedback?.overallScore || 0;
              return acc + score;
            }, 0);
            const avgMatch = totalApplicants > 0 ? Math.round((totalScores / totalApplicants) * 10) : null;

            return (
              <motion.div
                key={job.interview_id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={() => router.push(`/scheduled-interview/${job.interview_id}/details`)}
                className="group relative bg-slate-900/30 hover:bg-slate-900/50 border border-slate-900 hover:border-slate-800/80 rounded-2xl p-6 transition-all duration-350 shadow-xl cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-slate-100 group-hover:text-white transition-colors line-clamp-1">
                      {job.jobPosition}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">
                        {job.department || "General"}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                      <span className="text-xs text-slate-400 font-semibold bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                        {job.location || "Remote"}
                      </span>
                    </div>
                  </div>

                  {/* Settings / Actions */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === job.interview_id ? null : job.interview_id);
                      }}
                      className="p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* Action Dropdown Menu */}
                    <AnimatePresence>
                      {activeMenuId === job.interview_id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                          className="absolute right-0 mt-1.5 w-44 bg-slate-950 border border-slate-850 rounded-xl shadow-2xl p-1 z-50 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              router.push(`/dashboard/create-interview?edit=${job.interview_id}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-indigo-600/10 rounded-lg transition-colors text-left"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-indigo-400" />
                            <span>Edit Job</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              router.push(`/scheduled-interview/${job.interview_id}/details`);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-colors text-left"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Open Pipeline</span>
                          </button>

                          <div className="h-px bg-slate-900 my-1" />

                          <button
                            onClick={() => {
                              setDeleteConfirmId(job.interview_id);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            <span>Delete Job</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Stats Dashboard Grid */}
                <div className="grid grid-cols-4 gap-2 mt-6 p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</p>
                    <p className="text-lg font-bold text-white mt-0.5">{totalApplicants}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Passed</p>
                    <p className="text-lg font-bold text-violet-400 mt-0.5">{passedApplicants}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">InTV</p>
                    <p className="text-lg font-bold text-pink-400 mt-0.5">{interviewedApplicants}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Offer</p>
                    <p className="text-lg font-bold text-emerald-400 mt-0.5">{offeredApplicants}</p>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-900/80 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{moment(job.created_at).fromNow()}</span>
                  </div>

                  {avgMatch !== null ? (
                    <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>{avgMatch}% Match</span>
                    </div>
                  ) : (
                    <span className="text-slate-600 font-semibold italic bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                      No candidates
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-6 shadow-2xl"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Delete Job Post</h3>
                <p className="text-sm text-slate-400">
                  Are you sure you want to delete this job posting? This action will permanently remove all candidate reports and pipelines.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  onClick={() => setDeleteConfirmId(null)}
                  variant="outline"
                  className="bg-transparent border-slate-800 text-slate-300 hover:bg-slate-800 rounded-xl"
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteJob(deleteConfirmId)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete Posting"
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
