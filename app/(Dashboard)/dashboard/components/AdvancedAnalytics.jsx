"use client";

import { useUser } from "@/app/Provider";
import { supabase } from "@/services/supaBaseClient";
import {
  BrainCircuit,
  Gauge,
  Target,
  Timer,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const INITIAL_METRICS = {
  completionRate: 0,
  recommendationRate: 0,
  averageScore: 0,
  qualityIndex: 0,
  avgResponseTime: 0,
  totalCandidates: 0,
};

const AdvancedAnalytics = () => {
  const { user } = useUser();
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [scoreBands, setScoreBands] = useState([]);
  const [recommendationSplit, setRecommendationSplit] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAnalytics = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      const [{ data: interviews }, { data: feedbacks }] = await Promise.all([
        supabase
          .from("Interviews")
          .select("id, created_at")
          .eq("userEmail", user.email),
        supabase
          .from("interview-feedback")
          .select("feedback, recommended")
          .eq("userEmail", user.email),
      ]);

      const totalInterviews = interviews?.length ?? 0;
      const totalFeedbacks = feedbacks?.length ?? 0;
      const recommendedCount =
        feedbacks?.filter((item) => item.recommended).length ?? 0;

      const scoreValues =
        feedbacks
          ?.map((item) => Number(item?.feedback?.overallScore ?? 0))
          .filter((score) => Number.isFinite(score) && score > 0) ?? [];

      const responseTimes =
        feedbacks
          ?.map((item) =>
            Number.parseFloat(
              String(item?.feedback?.questionAnalysis?.avgResponseTime ?? "0")
            )
          )
          .filter((value) => Number.isFinite(value) && value > 0) ?? [];

      const completionRate = totalInterviews
        ? Math.round((totalFeedbacks / totalInterviews) * 100)
        : 0;
      const recommendationRate = totalFeedbacks
        ? Math.round((recommendedCount / totalFeedbacks) * 100)
        : 0;
      const averageScore = scoreValues.length
        ? Number(
            (
              scoreValues.reduce((sum, score) => sum + score, 0) /
              scoreValues.length
            ).toFixed(1)
          )
        : 0;
      const qualityIndex = Math.round(
        completionRate * 0.35 +
          recommendationRate * 0.3 +
          averageScore * 10 * 0.35
      );
      const avgResponseTime = responseTimes.length
        ? Number(
            (
              responseTimes.reduce((sum, value) => sum + value, 0) /
              responseTimes.length
            ).toFixed(1)
          )
        : 0;

      setMetrics({
        completionRate,
        recommendationRate,
        averageScore,
        qualityIndex,
        avgResponseTime,
        totalCandidates: totalFeedbacks,
      });

      const monthMap = new Map();
      (interviews ?? []).forEach((item) => {
        const date = new Date(item.created_at ?? Date.now());
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const label = date.toLocaleString("en-US", { month: "short" });
        const existing = monthMap.get(key);
        monthMap.set(key, {
          month: label,
          interviews: (existing?.interviews ?? 0) + 1,
        });
      });
      setMonthlyTrend(Array.from(monthMap.values()).slice(-6));

      const bands = { low: 0, medium: 0, high: 0 };
      scoreValues.forEach((score) => {
        if (score < 5) bands.low += 1;
        else if (score < 8) bands.medium += 1;
        else bands.high += 1;
      });
      setScoreBands([
        { band: "Low", count: bands.low },
        { band: "Medium", count: bands.medium },
        { band: "High", count: bands.high },
      ]);
      setRecommendationSplit([
        { name: "Recommended", value: recommendedCount },
        {
          name: "Not Recommended",
          value: Math.max(totalFeedbacks - recommendedCount, 0),
        },
      ]);

      // Optional persistence — never block dashboard if table is missing
      const { error: snapshotError } = await supabase
        .from("analytics_snapshots")
        .insert([
          {
            user_email: user.email,
            completion_rate: completionRate,
            recommendation_rate: recommendationRate,
            average_score: averageScore,
            quality_index: qualityIndex,
            avg_response_time: avgResponseTime,
            total_candidates: totalFeedbacks,
          },
        ]);

      if (snapshotError) {
        console.warn("Analytics snapshot skipped:", snapshotError.message);
      }
    } catch (error) {
      console.error("Error fetching advanced analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const cards = [
    {
      title: "Completion Rate",
      value: `${metrics.completionRate}%`,
      hint: "Interviews with complete AI feedback",
      icon: Gauge,
      tone: "text-blue-500",
    },
    {
      title: "Recommendation Rate",
      value: `${metrics.recommendationRate}%`,
      hint: "Candidates marked as recommended",
      icon: Target,
      tone: "text-emerald-500",
    },
    {
      title: "Average Candidate Score",
      value: `${metrics.averageScore}/10`,
      hint: "Mean score from interview reports",
      icon: TrendingUp,
      tone: "text-amber-500",
    },
    {
      title: "Hiring Quality Index",
      value: metrics.qualityIndex,
      hint: "Composite SaaS benchmark metric",
      icon: BrainCircuit,
      tone: "text-violet-500",
    },
    {
      title: "Avg Response Time",
      value: `${metrics.avgResponseTime} min`,
      hint: "Candidate answer speed",
      icon: Timer,
      tone: "text-cyan-500",
    },
    {
      title: "Candidates Evaluated",
      value: metrics.totalCandidates,
      hint: "Interview feedback records",
      icon: UsersRound,
      tone: "text-pink-500",
    },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <header className="mb-5">
        <h2 className="text-xl font-semibold text-card-foreground">
          Advanced Analytics
        </h2>
        <p className="text-sm text-muted-foreground">
          Enterprise-grade hiring insights for data-driven decisions
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <Icon className={`h-5 w-5 ${card.tone}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {loading ? "--" : card.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
            </article>
          );
        })}
      </div>

      {mounted && (
        <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-4 xl:col-span-2">
            <p className="mb-3 text-sm font-medium text-foreground">
              Interview Trend (6 months)
            </p>
            <div className="h-64 min-h-[256px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                  <XAxis dataKey="month" stroke="#71717a" />
                  <YAxis stroke="#71717a" allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#trendFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="mb-3 text-sm font-medium text-foreground">
              Recommendation Split
            </p>
            <div className="h-64 min-h-[256px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recommendationSplit}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4 xl:col-span-3">
            <p className="mb-3 text-sm font-medium text-foreground">
              Score Distribution
            </p>
            <div className="h-64 min-h-[256px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreBands}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                  <XAxis dataKey="band" stroke="#71717a" />
                  <YAxis stroke="#71717a" allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdvancedAnalytics;

