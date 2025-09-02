"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Gauge,
  Brain,
  Users,
  MessageSquare,
  CalendarClock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Activity,
  Target,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { RiRobot2Fill } from "react-icons/ri";
import Image from "next/image";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

function getInitial(name) {
  if (!name || typeof name !== "string") return "?";
  return name.trim().charAt(0).toUpperCase();
}

const BadgePill = ({ children, className = "" }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${className}`}
  >
    {children}
  </span>
);

const StatChip = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-xl border bg-white/60 backdrop-blur p-3 shadow-sm">
    <Icon className="h-4 w-4 text-indigo-500" />
    <span className="text-xs text-gray-500">{label}</span>
    <span className="ml-auto text-sm font-semibold">{value}</span>
  </div>
);

const AnimatedBar = ({ label, value = 0 }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </div>
    </div>
  );
};

const CandidateFeedbackDialog = ({ candidate }) => {
  // ---- Safe extraction with fallbacks ----
  const feedback = candidate?.feedback?.feedback || {};

  const ratings = feedback?.rating || {};
  const summary = feedback?.summery || "No summary available.";
  const recommendation = feedback?.Recommendation ?? "No";
  const recommendationMsg =
    feedback?.RecommendationMsg || "No recommendation message provided.";

  const overallScore = Number(feedback?.overallScore ?? 0) || 0;
  const culturalFit = Number(feedback?.culturalFit ?? 0) || 0;

  const aiAnalysis = Array.isArray(feedback?.aiAnalysis)
    ? feedback.aiAnalysis
    : [
        { point: "Strong technical foundation", confidence: "87%" },
        { point: "Needs improvement in leadership", confidence: "65%" },
      ];

  const questionAnalysis = feedback?.questionAnalysis || {
    totalQuestions: 0 ,
    correctAnswers:0,
    avgResponseTime: "N/A",
    confidenceLevel: "N/A",
  };

  const behavioral = feedback?.behavioralAnalysis || {
    confidence: "Medium",
    stressLevel: "Medium",
    engagement: "Good",
    eyeContact: "Average",
  };

  const summaryDetails = feedback?.summaryDetails || {
    strengths: [],
    areasOfDevelopment: [],
  };

  // ---- Charts data ----
  const skillData = [
    { subject: "Technical", A: Number(ratings?.techicalSkills ?? 0) },
    { subject: "Communication", A: Number(ratings?.communication ?? 0) },
    { subject: "Problem Solving", A: Number(ratings?.problemSolving ?? 0) },
    { subject: "Experience", A: Number(ratings?.experince ?? 0) },
    { subject: "Cultural Fit", A: Number(culturalFit) },
  ];

  const qaBars = [
    {
      name: "Correct",
      value: Number(questionAnalysis?.correctAnswers ?? 0),
    },
    {
      name: "Total",
      value: Number(questionAnalysis?.totalQuestions ?? 0),
    },
  ];

  // Fake % mapping for behavioral into nice visuals
  const toPct = (text, good, mid, bad) => {
    const t = String(text || "").toLowerCase();
    if (t.includes(good.toLowerCase())) return 85;
    if (t.includes(mid.toLowerCase())) return 60;
    if (t.includes(bad.toLowerCase())) return 35;
    return 50;
    // (fallback)
  };

  const behvScores = [
    {
      label: "Confidence",
      value: toPct(behavioral?.confidence, "High", "Medium", "Low"),
      icon: ShieldCheck,
    },
    {
      label: "Stress Level",
      value:
        100 - toPct(behavioral?.stressLevel, "Low", "Medium", "High"), // low is better
      icon: Activity,
    },
    {
      label: "Engagement",
      value: toPct(behavioral?.engagement, "Excellent", "Good", "Low"),
      icon: MessageSquare,
    },
    {
      label: "Eye Contact",
      value: toPct(behavioral?.eyeContact, "Good", "Average", "Poor"),
      icon: Users,
    },
  ];

  const initial = getInitial(candidate?.userName);
  const displayName = candidate?.userName || "Unknown Candidate";
  const email = candidate?.userEmail || "N/A";

  const isRecommended = String(recommendation).toLowerCase() !== "no";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Report</Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl p-0 overflow-hidden">
        {/* Scroll container */}
        <div className="max-h-[80vh] overflow-y-auto px-6 pb-6">
          <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/50 px-0 pt-6 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {/* <Sparkles className="h-6 w-6 text-indigo-500" /> */}
              <Image width={40} height={40} className="w-10 h-10" alt='Logo' src='/documents.gif'  />
              Candidate Interview Report
            </DialogTitle>
            <DialogDescription className="sr-only">
              AI-driven analysis of candidate performance
            </DialogDescription>
          </DialogHeader>

          {/* Profile / Hero */}
          <motion.div
            className="rounded-2xl p-6 shadow-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white text-indigo-600 w-14 h-14 flex items-center justify-center font-bold rounded-full text-2xl shadow-md">
                  {initial}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-wide">
                      {displayName}
                    </h2>
                  </div>
                  <p className="text-white/90 text-sm">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm opacity-90">Overall Score</p>
                  <div className="flex items-end gap-2">
                    <Gauge className="h-5 w-5 opacity-90" />
                    <h2 className="text-3xl font-extrabold">
                      {Number.isFinite(overallScore) ? overallScore : 0}/10
                    </h2>
                  </div>
                </div>
                <BadgePill
                  className={`${
                    isRecommended
                      ? "bg-emerald-300/20 text-emerald-50 border border-emerald-200/40"
                      : "bg-rose-300/20 text-rose-50 border border-rose-200/40"
                  }`}
                >
                  {isRecommended ? "Recommended" : "Not Recommended"}
                </BadgePill>
              </div>
            </div>
          </motion.div>

          {/* Skills card (Radar + Progress in the same card) */}
          <div className="mt-6 bg-white rounded-2xl border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Image width={40} height={40} className="w-10 h-10" alt='Logo' src='/brain.gif'  />
              <h3 className="text-lg font-semibold text-gray-800">
                Skills Assessment
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Radar */}
              <div className="h-72 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.55}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Progress bars */}
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-xl border p-4 bg-white">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-700">Technical Skills</span>
                    <span className="ml-auto font-semibold">
                      {Number(ratings?.techicalSkills ?? 0)}/10
                    </span>
                  </div>
                  <Progress
                    value={Number(ratings?.techicalSkills ?? 0) * 10}
                  />
                </div>

                <div className="rounded-xl border p-4 bg-white">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <MessageSquare className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-700">Communication</span>
                    <span className="ml-auto font-semibold">
                      {Number(ratings?.communication ?? 0)}/10
                    </span>
                  </div>
                  <Progress value={Number(ratings?.communication ?? 0) * 10} />
                </div>

                <div className="rounded-xl border p-4 bg-white">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-700">Problem Solving</span>
                    <span className="ml-auto font-semibold">
                      {Number(ratings?.problemSolving ?? 0)}/10
                    </span>
                  </div>
                  <Progress
                    value={Number(ratings?.problemSolving ?? 0) * 10}
                  />
                </div>

                <div className="rounded-xl border p-4 bg-white">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-700">Experience</span>
                    <span className="ml-auto font-semibold">
                      {Number(ratings?.experince ?? 0)}/10
                    </span>
                  </div>
                  <Progress value={Number(ratings?.experince ?? 0) * 10} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mt-6 bg-white rounded-2xl border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Image width={40} height={40} className="w-10 h-10" alt='Logo' src='/bulb.gif'  />
              <h3 className="text-lg font-semibold text-gray-800">
                AI Insights
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {aiAnalysis.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="p-4 rounded-xl border bg-gray-50/60 hover:bg-gray-50 shadow-sm flex items-start gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ShieldCheck className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item?.point || "Insight"}
                    </p>
                    <BadgePill className="bg-indigo-50 text-indigo-600 border border-indigo-100 mt-2 inline-block">
                      Confidence: {item?.confidence || "—"}
                    </BadgePill>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Question Analysis */}
          <div className="mt-6 bg-white rounded-2xl border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Image width={40} height={40} className="w-10 h-10" alt='Logo' src='/question.gif'  />
              <h3 className="text-lg font-semibold text-gray-800">
                Question Analysis
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qaBars}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatChip
                  icon={CheckCircle2}
                  label="Correct Answers"
                  value={questionAnalysis?.correctAnswers ?? 0}
                />
                <StatChip
                  icon={Target}
                  label="Total Questions"
                  value={questionAnalysis?.totalQuestions ?? 0}
                />
                <StatChip
                  icon={CalendarClock}
                  label="Avg Response Time"
                  value={questionAnalysis?.avgResponseTime || "N/A"}
                />
                <StatChip
                  icon={Gauge}
                  label="Confidence Level"
                  value={questionAnalysis?.confidenceLevel || "N/A"}
                />
              </div>
            </div>
          </div>

          {/* Behavioral (unique gradient bars) */}
          <div className="mt-6 bg-white rounded-2xl border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Image width={40} height={40} className="w-10 h-10" alt='Logo' src='/sparkling.gif'  />
              <h3 className="text-lg font-semibold text-gray-800">
                Behavioral Analysis
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid grid-cols-1 gap-4">
                {behvScores.map(({ label, value, icon: Icon }, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {label}
                      </span>
                    </div>
                    <AnimatedBar label={label} value={value} />
                  </div>
                ))}
              </div>

              <div className="rounded-xl border bg-gradient-to-br from-violet-50 to-blue-50 p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-indigo-500" />
                  System Summary
                </h4>
                <p className="text-sm text-gray-700">
                  Candidate demonstrates{" "}
                  <span className="font-semibold">
                    {behavioral?.confidence || "balanced"} confidence
                  </span>{" "}
                  with{" "}
                  <span className="font-semibold">
                    {behavioral?.engagement || "good"} engagement
                  </span>
                  . Stress appears{" "}
                  <span className="font-semibold">
                    {behavioral?.stressLevel || "moderate"}
                  </span>
                  , and eye contact is{" "}
                  <span className="font-semibold">
                    {behavioral?.eyeContact || "acceptable"}
                  </span>
                  . Further practice in real panel scenarios is recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Summary + Strengths & Areas */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Feedback Summary
                </h3>
              </div>
              <p className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700">
                {summary}
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm p-5">
                <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Strengths
                </h3>
                <ul className="list-disc list-inside text-sm mt-2 text-emerald-900/90">
                  {Array.isArray(summaryDetails?.strengths) &&
                  summaryDetails.strengths.length > 0 ? (
                    summaryDetails.strengths.map((s, i) => <li key={i}>{s}</li>)
                  ) : (
                    <li>Not provided</li>
                  )}
                </ul>
              </div>

              <div className="bg-rose-50 rounded-2xl border border-rose-100 shadow-sm p-5">
                <h3 className="font-semibold text-rose-800 flex items-center gap-2">
                  <XCircle className="h-5 w-5" /> Areas of Development
                </h3>
                <ul className="list-disc list-inside text-sm mt-2 text-rose-900/90">
                  {Array.isArray(summaryDetails?.areasOfDevelopment) &&
                  summaryDetails.areasOfDevelopment.length > 0 ? (
                    summaryDetails.areasOfDevelopment.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))
                  ) : (
                    <li>Not provided</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div
            className={`mt-6 p-5 rounded-2xl shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
              isRecommended
                ? "bg-emerald-50 border-emerald-100"
                : "bg-rose-50 border-rose-100"
            }`}
          >
            <div className="space-y-1">
              <h3
                className={`font-bold text-lg ${
                  isRecommended ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                Recommendation: {isRecommended ? "Yes" : "No"}
              </h3>
              <p
                className={`text-sm ${
                  isRecommended ? "text-emerald-800/80" : "text-rose-800/80"
                }`}
              >
                {recommendationMsg}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`${
                  isRecommended
                    ? "border-emerald-300 text-emerald-700"
                    : "border-rose-300 text-rose-700"
                }`}
              >
                Save PDF
              </Button>
              <Button
                className={`${isRecommended ? "bg-emerald-500" : "bg-rose-500"}`}
              >
                Send Message
              </Button>
            </div>
          </div>

          <div className="h-2" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateFeedbackDialog;
