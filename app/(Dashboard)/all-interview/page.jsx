"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supaBaseClient";
import { Camera, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/components/InterviewCard";
import { useUser } from "@/app/Provider";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AllInterview = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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
        .order("id", { ascending: false });

      if (error) throw error;
      setInterviewList(Interviews || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort interviews
  const filteredAndSorted = interviewList
    .filter((interview) =>
      interview.jobPosition?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === "name") {
        return (a.jobPosition || "").localeCompare(b.jobPosition || "");
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            All Interviews
          </h1>
          <p className="text-gray-400">
            Manage and view all your interview sessions
          </p>
        </div>
        <Link href="/dashboard/create-interview">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Interview
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by job position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500 focus:bg-gray-800"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[200px] bg-gray-800/80 border-gray-700 text-white hover:bg-gray-800">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="newest" className="text-white">
              Newest First
            </SelectItem>
            <SelectItem value="oldest" className="text-white">
              Oldest First
            </SelectItem>
            <SelectItem value="name" className="text-white">
              Name (A-Z)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-gray-700 bg-gray-800/80 animate-pulse"
            />
          ))}
        </div>
      ) : filteredAndSorted?.length === 0 ? (
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
              {searchQuery ? "No interviews found" : "No Interviews Yet"}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Create your first interview to get started"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/create-interview">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Interview
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {filteredAndSorted.length} of {interviewList.length} interview
              {interviewList.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSorted.map((interview, index) => (
              <InterviewCard interview={interview} key={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllInterview;
