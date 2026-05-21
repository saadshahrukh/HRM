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
  Target
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
  PieChart,
  Pie
} from "recharts";

export default function CandidateFeedbackReportPage() {
  const params = useParams();
  const router = useRouter();
  const { interview_id, feedback_id } = params;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [feedbackRecord, setFeedbackRecord] = useState(null);
  const [interviewRecord, setInterviewRecord] = useState(null);

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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Analyzing & loading candidate report...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-center px-4">
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-center px-4">
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

  // Donut chart data for Question Analysis
  const correct = parsedFeedback.questionAnalysis?.correctAnswers || 0;
  const total = parsedFeedback.questionAnalysis?.totalQuestions || 1;
  const wrong = Math.max(0, total - correct);
  const pieData = [
    { name: "Correct Answers", value: correct, color: "#10b981" },
    { name: "Incorrect / Unanswered", value: wrong, color: "#f43f5e" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8 space-y-6">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => router.push(`/scheduled-interview/${interview_id}/details`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Pipeline
        </button>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl h-10 px-4 font-bold text-xs gap-1.5"
          >
            <Download className="h-4 w-4" /> Export Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-4 font-bold text-xs gap-1.5 shadow-lg shadow-indigo-600/10">
            <CheckCircle2 className="h-4 w-4" /> Advance to Negotiation
          </Button>
        </div>
      </div>

      {/* Candidate Profile Summary Header */}
      <div className="flex items-center gap-4 bg-slate-900/10 border border-slate-900/60 p-5 rounded-2xl">
        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg">
          <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-black text-white">
            {feedbackRecord.userName?.charAt(0) || "C"}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight">{feedbackRecord.userName}</h1>
            {averageRating >= 8 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                <Star className="h-3 w-3 fill-emerald-400" /> Strong Hire ({matchPercentage}% Match)
              </span>
            ) : averageRating >= 5 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold text-[10px]">
                <CheckCircle2 className="h-3 w-3 text-indigo-400" /> Recommended ({matchPercentage}% Match)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-[10px]">
                <ThumbsDown className="h-3 w-3" /> Not Recommended ({matchPercentage}% Match)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Applying for: <span className="text-indigo-400 font-semibold">{interviewRecord?.jobPosition || "Technical Role"}</span>
            {interviewRecord?.location && ` • ${interviewRecord.location}`}
            {interviewRecord?.duration && ` • Expected: ${interviewRecord.duration}`}
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Video & Summary */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Interview Recording Box */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold tracking-tight text-slate-200 flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-pink-500" /> AI Interview Recording
            </h3>
            
            {/* Video Placeholder Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group flex items-center justify-center">
              {/* Abstract dark workspace visual background using premium gradients */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40 opacity-70" />
              
              {/* Pulsing visual core */}
              <div className="z-10 flex flex-col items-center gap-3 text-center p-6">
                <div className="h-14 w-14 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-pink-500/5">
                  <PlayCircle className="h-8 w-8 fill-pink-500/20" />
                </div>
                <p className="text-xs font-bold text-slate-300">Screening Session Recording</p>
                <p className="text-[10px] text-slate-500">Audio conversation converted to diagnostic logs</p>
              </div>

              {/* Timestamp overlay */}
              <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400">
                12:45 min
              </div>
            </div>

            {/* AI Summary Text */}
            <div className="space-y-3 mt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-indigo-400" /> AI Executive Summary
              </h4>
              <p className="text-xs leading-relaxed text-slate-300 font-medium">
                {parsedFeedback.summery || "No detailed summary available."}
              </p>
              {parsedFeedback.RecommendationMsg && (
                <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-indigo-300 leading-relaxed italic">
                  &ldquo;{parsedFeedback.RecommendationMsg}&rdquo;
                </div>
              )}
            </div>

            {/* AI Diagnostics list with radial circles */}
            {parsedFeedback.aiAnalysis && Array.isArray(parsedFeedback.aiAnalysis) && parsedFeedback.aiAnalysis.length > 0 && (
              <div className="space-y-3 mt-6 pt-5 border-t border-slate-900">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-pink-500" /> AI Diagnostics
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {parsedFeedback.aiAnalysis.map((item, idx) => {
                    const confNum = parseInt(item.confidence) || 75;
                    const radius = 14;
                    const circ = 2 * Math.PI * radius;
                    const strokeOffset = circ - (confNum / 100) * circ;
                    const isHigh = confNum >= 80;
                    const ringColor = isHigh ? "stroke-emerald-500" : confNum >= 60 ? "stroke-amber-500" : "stroke-rose-500";
                    
                    return (
                      <div key={idx} className="bg-slate-950 border border-slate-900 p-4 rounded-xl flex items-center justify-between gap-4">
                        <p className="text-xs text-slate-200 font-medium leading-relaxed flex-1">{item.point}</p>
                        
                        {/* Circular ring indicator */}
                        <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle cx="24" cy="24" r={radius} className="stroke-slate-900" strokeWidth="3" fill="transparent" />
                            <circle 
                              cx="24" 
                              cy="24" 
                              r={radius} 
                              className={ringColor} 
                              strokeWidth="3" 
                              fill="transparent" 
                              strokeDasharray={circ} 
                              strokeDashoffset={strokeOffset} 
                              strokeLinecap="round" 
                            />
                          </svg>
                          <span className="absolute text-[9px] font-black text-slate-300">{confNum}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Charts & Metrics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Radar Chart Card */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-5 shadow-xl">
            <h3 className="text-sm font-bold tracking-tight text-slate-200">Skills Analysis</h3>
            
            <div className="h-64 flex items-center justify-center">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} />
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
                <div className="text-xs text-slate-500 italic">No skill ratings available to construct chart.</div>
              )}
            </div>

            {/* Technical Skills Scorecards - Progress Bars ONLY here */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Skill Score Breakdown</h4>
              {radarData.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{item.subject}</span>
                    <span className="text-indigo-400 font-bold">{item.value} / {scale}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full animate-all duration-300" 
                      style={{ width: `${(item.value / scale) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths & Growth Areas */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              {/* Strengths */}
              {parsedFeedback.summaryDetails?.strengths && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ThumbsUp className="h-3.5 w-3.5" /> Key Strengths
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300 pl-5 list-disc font-medium">
                    {parsedFeedback.summaryDetails.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas for Growth */}
              {parsedFeedback.summaryDetails?.areasOfDevelopment && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Areas for Growth
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300 pl-5 list-disc font-medium">
                    {parsedFeedback.summaryDetails.areasOfDevelopment.map((dev, idx) => (
                      <li key={idx}>{dev}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Behavioral Analysis & Donut Chart Box */}
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5 space-y-5 shadow-xl">
            <h3 className="text-sm font-bold tracking-tight text-slate-200 flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-400" /> Advanced Diagnostics
            </h3>
            
            {/* Behavioral analysis represented in a beautiful horizontal BarChart */}
            {behavioralData.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Behavioral Metrics</h4>
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-2 h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={behavioralData} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 10 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 600 }} width={75} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                        contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '8px', fontSize: 11 }} 
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

            {/* Question Analysis donut chart */}
            {parsedFeedback.questionAnalysis && (
              <div className="space-y-3 pt-4 border-t border-slate-900">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Question & Performance Stats</h4>
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 p-4 bg-slate-950 border border-slate-900 rounded-xl">
                  <div className="h-28 w-28 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={45}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-black text-slate-100">{correct}/{total}</span>
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Answers</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-400 font-medium">Correct:</span>
                      <span className="text-emerald-400 font-bold">{correct}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                      <span className="text-slate-400 font-medium">Incorrect:</span>
                      <span className="text-rose-400 font-bold">{wrong}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-900 flex justify-between gap-4">
                      <div>
                        <p className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Avg Response</p>
                        <p className="font-bold text-slate-200">{parsedFeedback.questionAnalysis.avgResponseTime || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Confidence</p>
                        <p className="font-bold text-slate-200">{parsedFeedback.questionAnalysis.confidenceLevel || "N/A"}</p>
                      </div>
                    </div>
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
