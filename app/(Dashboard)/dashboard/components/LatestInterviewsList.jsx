"use client";
import { useUser } from "@/app/Provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supaBaseClient";
import { Camera, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard";
import { motion } from "framer-motion";

const LatestInterviewsList = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    try {
      setLoading(true);
      let { data: Interviews, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("userEmail", user?.email)
        .order("id", { ascending: false })
        .limit(6);

      if (error) throw error;
      setInterviewList(Interviews || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Recent Interviews
          </h2>
          <p className="text-gray-400 text-sm">
            Your latest interview sessions
          </p>
        </div>
        <Link href="/all-interview">
          <Button
            variant="ghost"
            className="text-gray-400 bg-gray-800/50 hover:bg-gray-800 hover:text-white border border-gray-700/50"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-gray-700 bg-gray-800/80 animate-pulse"
            />
          ))}
        </div>
      ) : interviewList?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 items-center justify-center bg-gray-800/80 border border-gray-700 rounded-xl p-12 shadow-lg"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Camera className="h-8 w-8 text-indigo-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              No Interviews Yet
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Create your first interview to get started
            </p>
            <Link href="/dashboard/create-interview">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Interview
              </Button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewList.map((interview, index) => (
            <InterviewCard interview={interview} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestInterviewsList;
