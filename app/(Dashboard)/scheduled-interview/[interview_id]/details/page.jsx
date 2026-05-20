"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supaBaseClient";
import { useUser } from "@/app/Provider";
import {
  ArrowLeft,
  Search,
  Filter,
  Upload,
  Mail,
  CheckCircle,
  Clock,
  Send,
  Loader2,
  Lock,
  UserPlus,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Phone,
  Briefcase,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

export default function PipelineDetailPage() {
  const router = useRouter();
  const { interview_id } = useParams();
  const { user, activeOrgPlan, activeOrgName } = useUser();

  const isBasic = activeOrgPlan === "basic" || !activeOrgPlan;

  // DB States
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [activeTab, setActiveTab] = useState("cv"); // "cv", "interview", "hr"
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // "All", "Passed", "Failed"
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  
  // Upload Dialog States
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  // Manual Upload Form
  const [manualForm, setManualForm] = useState({ name: "", email: "", phone: "", jobDescription: "", file: null });
  const [manualLoading, setManualLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Bulk Upload state
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const bulkInputRef = useRef(null);

  useEffect(() => {
    if (user && interview_id) {
      fetchJobDetails();
    }
  }, [user, interview_id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch Interview details
      const { data: jobData, error: jobError } = await supabase
        .from("Interviews")
        .select("*")
        .eq("interview_id", interview_id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // Prepopulate job description in manual form
      setManualForm(prev => ({ ...prev, jobDescription: jobData?.jobDescription || "" }));

      // 2. Fetch candidates uploaded
      const { data: candData, error: candError } = await supabase
        .from("candidates")
        .select("*")
        .eq("interview_id", interview_id)
        .order("created_at", { ascending: false });

      if (candError) throw candError;

      // 3. Fetch completed interview feedbacks
      const { data: fbData, error: fbError } = await supabase
        .from("interview-feedback")
        .select("*")
        .eq("interview_id", interview_id);

      if (fbError) throw fbError;

      setCandidates(candData || []);
      setFeedbacks(fbData || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pipeline details");
    } finally {
      setLoading(false);
    }
  };

  // Handle Manual Upload Submission
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.email || !manualForm.file) {
      toast.error("Please fill in Name, Email, and select a resume PDF.");
      return;
    }

    setManualLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", manualForm.file);
      formData.append("jobDescription", manualForm.jobDescription || job?.jobDescription || "");
      formData.append("isManual", "true");
      formData.append("name", manualForm.name);
      formData.append("email", manualForm.email);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      // Save to Supabase candidates table
      const { error } = await supabase.from("candidates").insert([
        {
          interview_id,
          name: manualForm.name,
          email: manualForm.email,
          phone: manualForm.phone || "",
          jd_match_score: data.jd_match_score || 50,
          status: "Ready for Invite",
          resume_text: data.text || "",
          skills: data.skills || []
        }
      ]);

      if (error) throw error;

      toast.success("Resume uploaded and matched successfully!");
      setIsManualModalOpen(false);
      setManualForm({ name: "", email: "", phone: "", jobDescription: job?.jobDescription || "", file: null });
      fetchJobDetails();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload candidate resume");
    } finally {
      setManualLoading(false);
    }
  };

  // Handle Bulk Upload Select
  const handleBulkSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(f => ({
      id: Math.random().toString(),
      file: f,
      name: f.name,
      status: "queued",
      progress: 0,
      error: null
    }));
    setBulkFiles(prev => [...prev, ...newFiles]);
  };

  // Run Bulk OCR / Parser
  const startBulkProcessing = async () => {
    if (bulkProcessing) return;
    setBulkProcessing(true);

    try {
      for (let i = 0; i < bulkFiles.length; i++) {
        const item = bulkFiles[i];
        if (item.status !== "queued") continue;

        // Update status to processing
        setBulkFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "processing" } : f));

        try {
          const formData = new FormData();
          formData.append("file", item.file);
          formData.append("jobDescription", job?.jobDescription || "");

          const res = await fetch("/api/parse-resume", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.error || "OCR Parsing Failed");
          }

          // Insert into database
          const { error } = await supabase.from("candidates").insert([
            {
              interview_id,
              name: data.name || item.name.split(".")[0],
              email: data.email || "no-email@detected.com",
              jd_match_score: data.jd_match_score || 50,
              status: "Ready for Invite",
              resume_text: data.text || "",
              skills: data.skills || []
            }
          ]);

          if (error) throw error;

          setBulkFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "done" } : f));
        } catch (err) {
          console.error(err);
          setBulkFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: "error", error: err.message } : f));
        }
      }
      toast.success("Bulk resume processing complete!");
      fetchJobDetails();
    } finally {
      setBulkProcessing(false);
    }
  };

  // Invite Selected Candidates via Windows Native Mail Client
  const inviteCandidates = async () => {
    if (selectedCandidates.length === 0) return;
    
    // Fetch selected candidates details
    const selectedList = candidates.filter(c => selectedCandidates.includes(c.id));
    if (selectedList.length === 0) return;

    const emails = selectedList.map(c => c.email).join(";");
    const jobTitle = job?.jobPosition || "Technical Role";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://aihrm.com";
    const interviewLink = `${origin}/interview/${interview_id}`;

    // Update state to Invite Sent in database
    try {
      const { error } = await supabase
        .from("candidates")
        .update({ status: "Invite Sent" })
        .in("id", selectedCandidates);

      if (error) throw error;

      // Construct dynamic mail template
      const subject = encodeURIComponent(`Interview Invitation - ${jobTitle}`);
      
      let bodyText = "";
      if (selectedList.length === 1) {
        const c = selectedList[0];
        bodyText = `Hi ${c.name},

Thank you for your application for the ${jobTitle} position. We would like to invite you to complete your technical voice screening interview with our AI assistant.

You can join and start the interview using the link below:
${interviewLink}

Best regards,
The Recruitment Team`;
      } else {
        bodyText = `Hi,

Thank you for your application for the ${jobTitle} position. You are invited to complete your technical voice screening interview with our AI assistant.

Please use the link below to begin your interview:
${interviewLink}

Best regards,
The Recruitment Team`;
      }

      const body = encodeURIComponent(bodyText);

      // Trigger native mail client
      window.location.href = `mailto:${emails}?subject=${subject}&body=${body}`;

      toast.success("Opening system mail client & dispatched invites!");
      setSelectedCandidates([]);
      fetchJobDetails();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update invite status.");
    }
  };

  // Toggle selection
  const toggleSelect = (id) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(prev => prev.filter(cId => cId !== id));
    } else {
      setSelectedCandidates(prev => [...prev, id]);
    }
  };

  const toggleSelectAll = (visibleIds) => {
    const passingVisibleIds = candidates.filter(c => visibleIds.includes(c.id) && c.jd_match_score >= 75).map(c => c.id);
    if (selectedCandidates.length === passingVisibleIds.length && passingVisibleIds.length > 0) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(passingVisibleIds);
    }
  };

  // Filter candidates displayed in list
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "Passed") {
      return matchesSearch && c.jd_match_score >= 75;
    }
    if (statusFilter === "Failed") {
      return matchesSearch && c.jd_match_score < 75;
    }
    return matchesSearch;
  });

  const visibleIds = filteredCandidates.map(c => c.id);

  // Statistics for workflow steps
  const totalCVCount = candidates.length;
  const totalInterviewCount = feedbacks.length;
  const totalOfferCount = feedbacks.filter(fb => fb.recommended === true).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8 space-y-8 animate-fade-in">
      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => router.push("/reports/pipeline")}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {job?.jobPosition || "Loading"} Pipeline
            </h1>
            <span className="flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase bg-violet-500/15 border border-violet-500/30 text-violet-400 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Active Req
            </span>
          </div>
        </div>

        {/* Search & Filter applicants */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 bg-slate-900 border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder:text-slate-600 h-10 w-60"
            />
          </div>
          <button className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Workflow Steps Header (Tabs) */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-850 backdrop-blur-md">
        <button
          onClick={() => setActiveTab("cv")}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-extrabold transition-all ${
            activeTab === "cv"
              ? "bg-slate-950 border border-slate-800 text-white shadow-xl"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Upload className="h-4 w-4" />
          <span>1. CV Screening ({totalCVCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("interview")}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-extrabold transition-all ${
            activeTab === "interview"
              ? "bg-slate-950 border border-slate-800 text-white shadow-xl"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Mail className="h-4 w-4" />
          <span>2. AI Interviews ({totalInterviewCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("hr")}
          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-extrabold transition-all ${
            activeTab === "hr"
              ? "bg-slate-950 border border-slate-800 text-white shadow-xl"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          <span>3. HR & Offers ({totalOfferCount})</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading workflow step details...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {activeTab === "cv" && (
            <>
              {/* Premium Bright Visual Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Card: Manual & Bulk CV Uploads (Highly visible, bright gradients) */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-purple-900/40 border border-indigo-500/25 p-8 rounded-2xl flex flex-col justify-between shadow-2xl hover:border-indigo-400/40 transition-all duration-300">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-500/20 border border-indigo-500/35 rounded-xl text-indigo-300">
                        <Upload className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-black text-white">Upload Candidate Resumes</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                      Upload resumes and match candidates against the job description using advanced AI analysis.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-900/80">
                    <Button
                      onClick={() => setIsManualModalOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-5 font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Manual Upload</span>
                    </Button>

                    <Button
                      onClick={() => {
                        if (isBasic) {
                          toast.error("Bulk AI OCR analysis is restricted to Pro / Enterprise tier. Please upgrade.");
                        } else {
                          setIsBulkModalOpen(true);
                        }
                      }}
                      className={`rounded-xl h-10 px-5 font-bold flex items-center gap-1.5 border transition-all ${
                        isBasic
                          ? "bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-100 hover:text-white"
                      }`}
                    >
                      {isBasic && <Lock className="h-3.5 w-3.5 text-amber-500" />}
                      <span>Bulk AI OCR</span>
                    </Button>
                  </div>
                </div>

                {/* Right Card: Automated Mail Fetch (Highly visible, bright gradients) */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/30 via-slate-900/60 to-teal-900/30 border border-emerald-500/20 p-8 rounded-2xl flex flex-col justify-between shadow-2xl hover:border-emerald-400/35 transition-all duration-300">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-black text-white">Automated Mail Fetch</h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                      Configure your inbox listener to scan incoming emails and automatically extract resume attachments.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-900/80">
                    <div className="flex items-center gap-2">
                      {isBasic ? (
                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                          <Lock className="h-3 w-3" /> Gated PRO
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/15 px-3 py-1.5 rounded-xl">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>Connected & Active</span>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isBasic ? "Gated Feature" : `Listening on HR@${activeOrgName?.toLowerCase().replace(/\s+/g, "") || "aihrm"}.com`}
                    </span>
                  </div>
                </div>

              </div>

              {/* Candidates List Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Table Sub-Filters */}
                  <div className="flex gap-2">
                    {["All", "Passed", "Failed"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`text-xs font-extrabold px-4.5 py-2.5 rounded-xl transition-all ${
                          statusFilter === filter
                            ? "bg-slate-900 border border-slate-800 text-white"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {filter === "Passed" ? "Passed (>=75%)" : filter === "Failed" ? "Failed (<75%)" : "All"}
                      </button>
                    ))}
                  </div>

                  {/* Send AI Invites */}
                  <Button
                    onClick={inviteCandidates}
                    disabled={selectedCandidates.length === 0}
                    className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-xl h-11 px-6 font-bold flex items-center gap-2 shadow-lg shadow-violet-600/25 transition-all w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send AI Invites ({selectedCandidates.length})</span>
                  </Button>
                </div>

                {/* Table Layout */}
                <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                  {filteredCandidates.length === 0 ? (
                    <div className="text-center p-16 text-slate-500 text-sm italic">
                      No candidates listed in CV screening step.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                          <th className="py-4 px-6 w-12 text-center">
                            <input
                              type="checkbox"
                              checked={selectedCandidates.length > 0 && selectedCandidates.length === candidates.filter(c => visibleIds.includes(c.id) && c.jd_match_score >= 75).length}
                              onChange={() => toggleSelectAll(visibleIds)}
                              className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-slate-950 bg-slate-950 h-3.5 w-3.5 cursor-pointer"
                            />
                          </th>
                          <th className="py-4 px-4">Candidate Details</th>
                          <th className="py-4 px-4">JD Match Score</th>
                          <th className="py-4 px-4 text-right">Action Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60">
                        {filteredCandidates.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-900/20 transition-colors group">
                            {/* Checkbox */}
                            <td className="py-4 px-6 text-center">
                              <input
                                type="checkbox"
                                checked={selectedCandidates.includes(c.id)}
                                disabled={c.jd_match_score < 75}
                                onChange={() => c.jd_match_score >= 75 && toggleSelect(c.id)}
                                className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-slate-950 bg-slate-950 h-3.5 w-3.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </td>

                            {/* Details */}
                            <td className="py-4 px-4 flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                                <UserIcon className="h-4.5 w-4.5" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-100 group-hover:text-white transition-colors">{c.name}</p>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500 mt-0.5">
                                  <span>{c.email}</span>
                                  {c.phone && (
                                    <>
                                      <span className="h-1 w-1 rounded-full bg-slate-700" />
                                      <span className="flex items-center gap-0.5">
                                        <Phone className="h-2.5 w-2.5" /> {c.phone}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Match Score */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <span className={`font-mono font-bold text-sm ${c.jd_match_score >= 75 ? "text-indigo-400" : "text-rose-400"}`}>
                                  {c.jd_match_score}%
                                </span>
                                <div className="h-1.5 w-24 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                                  <div
                                    className={`h-full rounded-full ${c.jd_match_score >= 75 ? "bg-indigo-500" : "bg-rose-500"}`}
                                    style={{ width: `${c.jd_match_score}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4 text-right">
                              {c.jd_match_score < 75 ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/10 border border-rose-500/20 text-rose-400 font-bold text-[10px]">
                                  <AlertCircle className="h-3 w-3" /> Rejected (Low Score)
                                </span>
                              ) : c.status === "Invite Sent" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 font-bold text-[10px]">
                                  <Mail className="h-3 w-3" /> Invite Sent
                                </span>
                              ) : c.status === "Completed" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                                  <CheckCircle className="h-3 w-3" /> Interview Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-[10px]">
                                  <Clock className="h-3 w-3" /> Ready for Invite
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "interview" && (
            <div className="bg-slate-900/10 border border-slate-900 p-16 rounded-3xl text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Step 2: AI Interviews</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Monitor active candidates undergoing telephone voice screening or check feedback logs.
                </p>
              </div>
            </div>
          )}

          {activeTab === "hr" && (
            <div className="bg-slate-900/10 border border-slate-900 p-16 rounded-3xl text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-500">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Step 3: HR & Offers</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Evaluate final scores and release offer details for verified applicants.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Upload Modal */}
      <AnimatePresence>
        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-indigo-400" />
                  <span>Manual Candidate Upload</span>
                </h3>
                <p className="text-xs text-slate-400">Fill in details manually and attach their resume PDF.</p>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Name</label>
                    <Input
                      required
                      placeholder="e.g. John Doe"
                      value={manualForm.name}
                      onChange={e => setManualForm(p => ({ ...p, name: e.target.value }))}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder:text-slate-600 h-11"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <Input
                      placeholder="e.g. +1 555-0199"
                      value={manualForm.phone}
                      onChange={e => setManualForm(p => ({ ...p, phone: e.target.value }))}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder:text-slate-600 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={manualForm.email}
                    onChange={e => setManualForm(p => ({ ...p, email: e.target.value }))}
                    className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder:text-slate-600 h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Description</label>
                  <Textarea
                    placeholder="Provide details about the job requirements..."
                    value={manualForm.jobDescription}
                    onChange={e => setManualForm(p => ({ ...p, jobDescription: e.target.value }))}
                    className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder:text-slate-600 min-h-[100px] text-xs leading-normal"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resume (PDF)</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-xl p-4 text-center cursor-pointer space-y-1 transition-all"
                  >
                    <Upload className="h-5 w-5 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-300 font-medium">
                      {manualForm.file ? manualForm.file.name : "Click to select resume PDF"}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={e => setManualForm(p => ({ ...p, file: e.target.files?.[0] || null }))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => setIsManualModalOpen(false)}
                    variant="outline"
                    className="bg-transparent border-slate-850 text-slate-400 hover:bg-slate-800 rounded-xl text-xs font-bold"
                    disabled={manualLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold h-10 px-5 flex items-center gap-1.5"
                    disabled={manualLoading}
                  >
                    {manualLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Matching Resume...</span>
                      </>
                    ) : (
                      "Upload & Analyze"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Upload Modal */}
      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5 shadow-2xl"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-400" />
                  <span>Bulk Resume AI Parsing (OCR)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select multiple resume files. The system will extract Name, Email, Skills and JD Match Score automatically.
                </p>
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => bulkInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-xl p-8 text-center cursor-pointer space-y-2"
              >
                <Upload className="h-7 w-7 text-indigo-400 mx-auto" />
                <p className="text-xs text-slate-200 font-bold">Click to choose multiple resume PDFs</p>
                <p className="text-[10px] text-slate-500">Max size 10MB per file</p>
                <input
                  ref={bulkInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  className="hidden"
                  onChange={handleBulkSelect}
                />
              </div>

              {/* Files List */}
              {bulkFiles.length > 0 && (
                <div className="max-h-52 overflow-y-auto space-y-2 border border-slate-950 bg-slate-950/40 p-3 rounded-xl">
                  {bulkFiles.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-[11px]">
                      <span className="font-medium text-slate-300 truncate max-w-xs">{file.name}</span>
                      
                      <div className="flex items-center gap-2">
                        {file.status === "queued" && (
                          <span className="text-slate-500 font-bold">Queued</span>
                        )}
                        {file.status === "processing" && (
                          <span className="text-indigo-400 font-bold flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" /> Processing...
                          </span>
                        )}
                        {file.status === "done" && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5" /> Analyzed
                          </span>
                        )}
                        {file.status === "error" && (
                          <span className="text-rose-400 font-bold flex items-center gap-1" title={file.error}>
                            <AlertCircle className="h-3.5 w-3.5" /> Error
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                <Button
                  onClick={() => setBulkFiles([])}
                  variant="outline"
                  className="bg-transparent border-slate-850 text-slate-400 hover:bg-slate-800 rounded-xl text-xs font-bold"
                  disabled={bulkProcessing}
                >
                  Clear Files
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsBulkModalOpen(false)}
                    variant="outline"
                    className="bg-transparent border-slate-850 text-slate-400 hover:bg-slate-800 rounded-xl text-xs font-bold"
                    disabled={bulkProcessing}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={startBulkProcessing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold h-10 px-5 flex items-center gap-1.5"
                    disabled={bulkProcessing || bulkFiles.filter(f => f.status === "queued").length === 0}
                  >
                    {bulkProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing Resumes...</span>
                      </>
                    ) : (
                      "Start AI Analysis"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
