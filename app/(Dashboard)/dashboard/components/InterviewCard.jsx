"use client";
import { Button } from "@/components/ui/button";
import { Copy, Send, View, ArrowRight, Calendar, Clock, Users } from "lucide-react";
import moment from "moment/moment";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const InterviewCard = ({ interview, viewDetail = false }) => {
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/interview/" + interview?.interview_id;

  const onCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Interview link copied to clipboard!");
  };

  const onSubmit = () => {
    window.location.href =
      "mailto:" +
      interview?.userEmail +
      "?subject=AI Interview Link &body=Interview Link: " +
      url +
      "%0D%0A%0D%0AThanks and Regards";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {interview?.jobPosition?.[0]?.toUpperCase() || "I"}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
              {interview?.jobPosition || "Interview"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <Calendar className="w-3 h-3" />
              <span>{moment(interview?.created_at).format("MMM Do, YYYY")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Duration</span>
          </div>
          <span className="text-white font-medium">{interview?.duration || "N/A"}</span>
        </div>

        {viewDetail && interview?.["interview-feedback"] && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>Candidates</span>
            </div>
            <span className="text-green-400 font-semibold">
              {interview["interview-feedback"]?.length || 0}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {!viewDetail ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCopyLink}
            className="flex-1 border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 text-gray-300 hover:text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button
            onClick={onSubmit}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      ) : (
        <Link
          href={"/scheduled-interview/" + interview?.interview_id + "/details"}
          className="w-full"
        >
          <Button
            variant="outline"
            className="w-full border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 text-gray-300 hover:text-white"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      )}
    </motion.div>
  );
};

export default InterviewCard;
