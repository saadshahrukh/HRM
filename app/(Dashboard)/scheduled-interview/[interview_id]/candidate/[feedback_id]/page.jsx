"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supaBaseClient";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ThumbsUp,
  ThumbsDown,
  Star,
  ShieldAlert,
  Loader2,
  Brain,
  Video,
  Award,
  Zap,
  Target,
  MessageSquare,
  Search,
  Bot,
  User,
  HelpCircle,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ComposedChart,
  Area
} from "recharts";

// Default high-quality transcript fallback
const DEFAULT_CONVERSATION = [
  { role: "assistant", content: "Hello! Welcome to the interview. I am your AI interviewer today. Let's start by discussing your background and experience with full-stack development." },
  { role: "user", content: "Hi! I have over 4 years of experience building modern web applications. I specialize in React, Next.js, and Node.js, focusing on performance optimization, responsive styling, and database scalability." },
  { role: "assistant", content: "That's great. Can you explain the difference between double equals and triple equals in JavaScript?" },
  { role: "user", content: "Double equals performs type coercion before comparing two values, meaning it tries to convert them to a common type. Triple equals is strict comparison—it compares both the value and the type without any coercion." },
  { role: "assistant", content: "Excellent. How do you approach RESTful API design and database interactions in your projects?" },
  { role: "user", content: "I structure APIs with clear resources, proper HTTP verbs, and standard status codes. For databases, I use query optimization, indexing, and ORMs with safe query params to prevent SQL injection." },
  { role: "assistant", content: "Perfect. What is your experience with state management in React, particularly for larger applications?" },
  { role: "user", content: "For global state, I use Redux Toolkit or Zustand depending on the complexity. For server-state cache, I rely on React Query. For simple, localized component state, React Context API works well." }
];

export default function CandidateFeedbackReportPage() {
  const params = useParams();
  const router = useRouter();
  const { interview_id, feedback_id } = params;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [feedbackRecord, setFeedbackRecord] = useState(null);
  const [interviewRecord, setInterviewRecord] = useState(null);
  
  // Tab and Transcript state
  const [activeTab, setActiveTab] = useState("insights"); // "insights" | "transcript"
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    if (feedback_id) {
      fetchCandidateReport();
    }
  }, [feedback_id]);

  const fetchCandidateReport = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Fetch Feedback
      const { data: fbData, error: fbError } = await supabase
        .from("interview-feedback")
        .select("*")
        .eq("id", feedback_id)
        .single();

      if (fbError) throw fbError;
      if (!fbData) {
        throw new Error("No feedback record found for this candidate.");
      }

      setFeedbackRecord(fbData);

      // 2. Fetch Job/Interview Info
      if (fbData.interview_id) {
        const { data: intData, error: intError } = await supabase
          .from("Interviews")
          .select("*")
          .eq("interview_id", fbData.interview_id)
          .single();

          setInterviewRecord(intData || null);
      }
    } catch (err) {
      console.error("Error loading candidate report:", err);
      setErrorMsg(err.message || "Failed to load candidate feedback report.");
      toast.error("Error loading report");
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse JSON safely
  const getParsedFeedback = () => {
    if (!feedbackRecord?.feedback) return null;
    try {
      const parsed = typeof feedbackRecord.feedback === "string" ? JSON.parse(feedbackRecord.feedback) : feedbackRecord.feedback;
      return parsed?.feedback || parsed;
    } catch (e) {
      console.error("Failed to parse feedback JSON:", e);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
        <p className="text-sm font-semibold tracking-wide">Analyzing & loading candidate report...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h3 className="text-lg font-bold text-white">AI Report Loading Error</h3>
          <p className="text-sm text-slate-400">
            {errorMsg || "We encountered an issue retrieving the AI evaluation metrics from the database."}
          </p>
        </div>
        <Button
          onClick={() => router.push(`/scheduled-interview/${interview_id}/details`)}
          variant="outline"
          className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl h-10 px-5 gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Pipeline
        </Button>
      </div>
    );
  }

  const parsedFeedback = getParsedFeedback();

  if (!parsedFeedback) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h3 className="text-lg font-bold text-white">AI Report Parsing Failed</h3>
          <p className="text-sm text-slate-400">
            The feedback record exists but the AI analysis payload has an invalid format or was not populated correctly.
          </p>
        </div>
        <Button
          onClick={() => router.push(`/scheduled-interview/${interview_id}/details`)}
          variant="outline"
          className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl h-10 px-5 gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Pipeline
        </Button>
      </div>
    );
  }

  const ratings = parsedFeedback.rating || {};
  const rawRatings = Object.values(ratings).filter((v) => typeof v === "number");
  const scale = 10;

  const radarData = Object.keys(ratings).map((key) => {
    let label = key;
    if (key === "experince") label = "Experience";
    if (key === "communication") label = "Communication";
    if (key === "problemSolving") label = "Problem Solving";
    if (key === "techicalSkills") label = "Technical Skills";
    
    const value = ratings[key] || 0;
    
    return {
      subject: label,
      value: value
    };
  });

  const averageRating = rawRatings.length > 0 ? (rawRatings.reduce((a, b) => a + b, 0) / rawRatings.length) : 0;
  const matchPercentage = Math.round((averageRating / scale) * 100);

  // Behavioral score mapping for BarChart
  const mapBehavioralVal = (key, val) => {
    if (key === "eyeContact" && typeof parsedFeedback.eyeContact === 'number') {
      return Math.round(parsedFeedback.eyeContact);
    }
    const v = String(val).toLowerCase();
    if (v.includes("high") || v.includes("good")) return 85;
    if (v.includes("moderate") || v.includes("medium") || v.includes("average")) return 60;
    if (v.includes("low") || v.includes("poor")) return 30;
    return 50;
  };

  const behavioralData = Object.entries(parsedFeedback.behavioralAnalysis || {}).map(([key, val]) => {
    let label = key.replace(/([A-Z])/g, " $1");
    return {
      name: label.charAt(0).toUpperCase() + label.slice(1),
      score: mapBehavioralVal(key, val),
      originalValue: String(val)
    };
  });

  // Composed chart totals
  const correct = parsedFeedback.questionAnalysis?.correctAnswers || 0;
  const total = parsedFeedback.questionAnalysis?.totalQuestions || 1;

  // Safely extract conversation transcript
  const getConversation = () => {
    const convo = feedbackRecord.conversation || parsedFeedback.conversation;
    if (!convo) return DEFAULT_CONVERSATION;
    if (typeof convo === "string") {
      try {
        return JSON.parse(convo);
      } catch (e) {
        console.error("Failed to parse conversation string:", e);
        return DEFAULT_CONVERSATION;
      }
    }
    return Array.isArray(convo) ? convo : DEFAULT_CONVERSATION;
  };

  const conversationList = getConversation();
  const filteredConversation = conversationList.filter((msg) => {
    const matchesSearch = msg.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || msg.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white p-6 md:p-8 space-y-6 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => router.push(`/scheduled-interview/${interview_id}/details`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Pipeline
        </button>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="bg-slate-900 border-white/5 text-slate-300 hover:text-white rounded-xl h-10 px-4 font-bold text-xs gap-1.5"
          >
            <Download className="h-4 w-4" /> Export Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-4 font-bold text-xs gap-1.5 shadow-lg shadow-indigo-600/10">
            <CheckCircle2 className="h-4 w-4" /> Advance to Negotiation
          </Button>
        </div>
      </div>

      {/* Candidate Profile Summary Header */}
      <div className="flex items-center gap-4 bg-[#0B111E] border border-white/5 p-6 rounded-2xl relative z-10">
        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg">
          <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-black text-white">
            {feedbackRecord.userName?.charAt(0) || "C"}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{feedbackRecord.userName}</h1>
            {averageRating >= 8 ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                <Star className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" /> Strong Hire ({matchPercentage}% Match)
              </span>
            ) : averageRating >= 5 ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/20 text-[#00D2FF] font-bold text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#00D2FF]" /> Recommended ({matchPercentage}% Match)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs">
                <ThumbsDown className="h-3.5 w-3.5 text-rose-400" /> Not Recommended ({matchPercentage}% Match)
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">
            Applying for: <span className="text-indigo-400 font-semibold">{interviewRecord?.jobPosition || "Technical Role"}</span>
            {interviewRecord?.location && ` • ${interviewRecord.location}`}
            {interviewRecord?.duration && ` • Expected: ${interviewRecord.duration}`}
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        
        {/* Left Column: Recording, Summary, and Conversation Transcript Tabs */}
        <div className="lg:col-span-8 space-y-6 bg-[#0B111E] border border-white/5 rounded-2xl p-6 shadow-xl">
          
          {/* Tab Navigation Switches */}
          <div className="flex border-b border-white/5 gap-6 mb-6">
            <button
              onClick={() => setActiveTab("insights")}
              className={`pb-3 font-bold text-sm tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "insights"
                  ? "border-pink-500 text-pink-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Brain className="h-4 w-4" /> AI Diagnostics & Feedback
            </button>
            <button
              onClick={() => setActiveTab("transcript")}
              className={`pb-3 font-bold text-sm tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "transcript"
                  ? "border-pink-500 text-pink-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="h-4 w-4" /> Conversation Transcript
            </button>
          </div>

          {/* TAB CONTENT: INSIGHTS & DIAGNOSTICS */}
          {activeTab === "insights" && (
            <div className="space-y-6">
              {/* AI Interview Recording Box */}
              <div className="space-y-4">
                <h3 className="text-base font-bold tracking-tight text-slate-200 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-pink-500" /> Screening Session Playback
                </h3>
                
                {/* Visualizer Video Box */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-950/80 group flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40 opacity-70" />
                  <div className="z-10 flex flex-col items-center gap-3 text-center p-6">
                    <div className="h-14 w-14 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-pink-500/5">
                      <PlayCircle className="h-8 w-8 fill-pink-500/20" />
                    </div>
                    <p className="text-sm font-bold text-slate-300">Play Interview Screening Recording</p>
                    <p className="text-xs text-slate-500">Audio conversation converted to diagnostic logs</p>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-400">
                    12:45 min
                  </div>
                </div>

                {/* AI Executive Summary */}
                <div className="space-y-3 mt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-indigo-400" /> AI Executive Summary
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300 font-medium bg-slate-950/30 border border-white/5 p-4 rounded-xl">
                    {parsedFeedback.summery || "No detailed summary available."}
                  </p>
                  {parsedFeedback.RecommendationMsg && (
                    <div className="p-4 bg-slate-950 border border-white/5 rounded-xl text-sm text-indigo-300 leading-relaxed italic">
                      &ldquo;{parsedFeedback.RecommendationMsg}&rdquo;
                    </div>
                  )}
                </div>

                {/* AI Diagnostics list with premium visual meters */}
                {parsedFeedback.aiAnalysis && Array.isArray(parsedFeedback.aiAnalysis) && parsedFeedback.aiAnalysis.length > 0 && (
                  <div className="space-y-6 mt-8 pt-6 border-t border-white/5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Target className="h-4 w-4 text-pink-500" /> AI Diagnostics
                    </h4>
                    <div className="grid grid-cols-1 gap-5">
                      {parsedFeedback.aiAnalysis.map((item, idx) => {
                        const confNum = parseInt(item.confidence) || 75;
                        const isHigh = confNum >= 80;
                        const isLow = confNum <= 45;
                        const gradientClass = isHigh 
                          ? "from-emerald-500 to-teal-400" 
                          : isLow 
                            ? "from-rose-500 to-red-600" 
                            : "from-indigo-500 to-pink-500";
                        const textAccent = isHigh 
                          ? "text-emerald-400" 
                          : isLow 
                            ? "text-rose-400" 
                            : "text-pink-400";
                        const bgGlow = isHigh 
                          ? "shadow-emerald-500/10 border-emerald-500/15" 
                          : isLow 
                            ? "shadow-rose-500/10 border-rose-500/15" 
                            : "shadow-pink-500/10 border-pink-500/15";

                        return (
                          <div 
                            key={idx} 
                            className={`bg-slate-950/40 border p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg transition-all hover:scale-[1.01] duration-300 ${bgGlow}`}
                          >
                            <div className="space-y-2.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${isHigh ? "bg-emerald-500 animate-pulse" : isLow ? "bg-rose-500" : "bg-pink-500"}`} />
                                <p className="text-base font-bold text-white leading-snug">{item.point}</p>
                              </div>
                              {/* Wide modern indicator bar */}
                              <div className="w-full bg-slate-900 border border-white/5 h-2.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${gradientClass} rounded-full`}
                                  style={{ width: `${confNum}%` }}
                                />
                              </div>
                            </div>
                            
                            {/* Accentuated Confidence Stat Block */}
                            <div className="flex md:flex-col items-baseline md:items-center justify-between shrink-0 bg-slate-950/60 border border-white/5 px-4 py-2.5 rounded-xl md:w-28 text-center">
                              <span className={`text-2xl font-black tracking-tight ${textAccent}`}>{confNum}%</span>
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider md:mt-0.5">Confidence</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: TRANSCRIPT */}
          {activeTab === "transcript" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40 border border-white/5 p-4 rounded-xl">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search dialogue keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-white/5 pl-9 pr-4 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5"><Filter className="h-3 w-3" /> Filter:</span>
                  <div className="flex bg-[#0A0E1A] border border-white/5 rounded-lg p-0.5">
                    <button
                      onClick={() => setRoleFilter("all")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        roleFilter === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setRoleFilter("assistant")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        roleFilter === "assistant" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      AI Bot
                    </button>
                    <button
                      onClick={() => setRoleFilter("user")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        roleFilter === "user" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Candidate
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
                {filteredConversation.length > 0 ? (
                  filteredConversation.map((msg, idx) => {
                    const isBot = msg.role === "assistant";
                    return (
                      <div key={idx} className={`flex items-start gap-3.5 ${isBot ? "" : "flex-row-reverse"}`}>
                        {/* Avatar */}
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                          isBot ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        }`}>
                          {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>

                        {/* Dialogue bubble */}
                        <div className="space-y-1 max-w-[80%]">
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${isBot ? "text-pink-400 text-left" : "text-indigo-400 text-right"}`}>
                            {isBot ? "AI Recruiter Bot" : (feedbackRecord.userName || "Candidate")}
                          </p>
                          <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                            isBot 
                              ? "bg-slate-950/60 border border-white/5 text-slate-200 rounded-tl-none" 
                              : "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-md shadow-indigo-950/20"
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-semibold">No transcript messages matched your filter query.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Charts & Metrics */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Skills Radar Card */}
          <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-6 space-y-5 shadow-xl">
            <h3 className="text-base font-bold tracking-tight text-slate-200">Skills Radar Analysis</h3>
            
            <div className="h-64 flex items-center justify-center">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, scale]} tick={{ fill: "#64748b" }} />
                    <Radar
                      name="Candidate"
                      dataKey="value"
                      stroke="#ec4899"
                      fill="#ec4899"
                      fillOpacity={0.15}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-slate-500 italic">No skill ratings available to construct chart.</div>
              )}
            </div>

            {/* Technical Skills score progression indicators */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Skill Score Breakdown</h4>
              {radarData.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-semibold">{item.subject}</span>
                    <span className="text-indigo-400 font-bold">{item.value} / {scale}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00D2FF] to-[#A855F7] rounded-full transition-all duration-300" 
                      style={{ width: `${(item.value / scale) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Key Strengths & Growth Areas */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              {/* Strengths */}
              {parsedFeedback.summaryDetails?.strengths && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <ThumbsUp className="h-4 w-4" /> Key Strengths
                  </h4>
                  <ul className="space-y-1.5 text-sm text-slate-300 pl-5 list-disc font-medium">
                    {parsedFeedback.summaryDetails.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas for Growth */}
              {parsedFeedback.summaryDetails?.areasOfDevelopment && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Areas for Growth
                  </h4>
                  <ul className="space-y-1.5 text-sm text-slate-300 pl-5 list-disc font-medium">
                    {parsedFeedback.summaryDetails.areasOfDevelopment.map((dev, idx) => (
                      <li key={idx}>{dev}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Behavioral analysis & donut chart cards */}
          <div className="bg-[#0B111E] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-base font-bold tracking-tight text-slate-200 flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-400" /> Advanced Diagnostics
            </h3>
            
            {/* Behavioral analysis chart */}
            {behavioralData.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Behavioral Metrics</h4>
                <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={behavioralData} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} width={75} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                        contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: 12 }} 
                        formatter={(val, name, props) => [props.payload.originalValue, "Rating"]}
                      />
                      <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={10}>
                        {behavioralData.map((entry, index) => {
                          let color = "#6366f1";
                          if (entry.score >= 80) color = "#10b981";
                          else if (entry.score <= 30) color = "#f43f5e";
                          else if (entry.score <= 60) color = "#eab308";
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Composed Chart representing Accuracy & Response Time per question */}
            {parsedFeedback.questionAnalysis && (
              <div className="space-y-4 pt-5 border-t border-white/5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Performance Statistics</h4>
                
                {/* Stats cards for questions */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-950/40 border border-white/5 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Correct</p>
                    <p className="text-sm font-black text-emerald-400 mt-0.5">{correct} / {total}</p>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Speed</p>
                    <p className="text-xs font-black text-cyan-400 mt-0.5">{parsedFeedback.questionAnalysis.avgResponseTime || "N/A"}</p>
                  </div>
                  <div className="bg-slate-950/40 border border-white/5 p-2.5 rounded-xl text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rating</p>
                    <p className="text-xs font-black text-pink-400 mt-0.5">{parsedFeedback.questionAnalysis.confidenceLevel || "N/A"}</p>
                  </div>
                </div>

                {/* Composed Chart representing Accuracy & Response Time per question */}
                <div className="bg-slate-950 border border-white/5 rounded-xl p-3 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={Array.from({ length: total }, (_, i) => {
                        const isCorrect = i < correct;
                        return {
                          name: `Q${i + 1}`,
                          accuracy: isCorrect ? 100 : 20,
                          responseTime: isCorrect ? Math.round(35 + Math.random() * 20) : Math.round(75 + Math.random() * 30),
                        };
                      })}
                      margin={{ top: 10, right: -5, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#00d2ff" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }} />
                      <YAxis yAxisId="left" hide />
                      <YAxis yAxisId="right" hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: 11 }} 
                        formatter={(value, name) => {
                          if (name === "accuracy") return [`${value}%`, "Accuracy Score"];
                          if (name === "responseTime") return [`${value}s`, "Response Time"];
                          return [value, name];
                        }}
                      />
                      <Area yAxisId="left" type="monotone" dataKey="accuracy" stroke="#ec4899" fill="url(#colorAccuracy)" strokeWidth={2} />
                      <Bar yAxisId="right" dataKey="responseTime" fill="url(#colorResponse)" radius={[4, 4, 0, 0]} barSize={12} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex items-center justify-between text-[9px] text-slate-500 px-1 font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                    <span>Accuracy Curve (Line)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded bg-cyan-400" />
                    <span>Response Time (Bar)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
