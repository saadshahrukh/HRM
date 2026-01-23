"use client";
import { useUser } from "@/app/Provider";
import { supabase } from "@/services/supaBaseClient";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const StatsCards = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalCandidates: 0,
    thisMonth: 0,
    avgDuration: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get total interviews
      const { data: interviews, error: interviewsError } = await supabase
        .from("Interviews")
        .select("id, duration, created_at, interview-feedback(id)")
        .eq("userEmail", user?.email);

      if (interviewsError) throw interviewsError;

      // Get this month's interviews
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthInterviews = interviews?.filter(
        (i) => new Date(i.created_at) >= thisMonth
      ) || [];

      // Calculate total candidates
      const totalCandidates = interviews?.reduce(
        (sum, i) => sum + (i["interview-feedback"]?.length || 0),
        0
      ) || 0;

      // Calculate average duration
      const durations = interviews?.map((i) => {
        const match = i.duration?.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      }) || [];
      const avgDuration =
        durations.length > 0
          ? durations.reduce((a, b) => a + b, 0) / durations.length
          : 0;

      setStats({
        totalInterviews: interviews?.length || 0,
        totalCandidates,
        thisMonth: thisMonthInterviews.length,
        avgDuration: Math.round(avgDuration),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Calendar,
      label: "Total Interviews",
      value: stats.totalInterviews,
      change: `+${stats.thisMonth} this month`,
      color: "from-indigo-500 to-purple-600",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
    },
    {
      icon: Users,
      label: "Total Candidates",
      value: stats.totalCandidates,
      change: "All time",
      color: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      icon: TrendingUp,
      label: "This Month",
      value: stats.thisMonth,
      change: "New interviews",
      color: "from-green-500 to-emerald-600",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      icon: Clock,
      label: "Avg Duration",
      value: `${stats.avgDuration} min`,
      change: "Per interview",
      color: "from-orange-500 to-red-600",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 p-6"
          >
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-800 rounded animate-pulse" />
                <div className="h-8 bg-gray-800 rounded animate-pulse" />
                <div className="h-3 bg-gray-800 rounded animate-pulse w-2/3" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`inline-flex p-3 rounded-lg ${stat.iconBg}`}
                  >
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
                {/* Gradient Background */}
                <div
                  className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl`}
                />
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;

