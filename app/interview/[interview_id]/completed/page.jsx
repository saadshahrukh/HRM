"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supaBaseClient";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { downloadInterviewPDF } from "@/lib/pdfExport";
import { motion } from "framer-motion";

const InterviewComplete = () => {
  const { interview_id } = useParams();
  const router = useRouter();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateInfo, setCandidateInfo] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, [interview_id]);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("interview-feedback")
        .select("*")
        .eq("interview_id", interview_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      setFeedback(data);
      setCandidateInfo({
        userName: data.userName,
        userEmail: data.userEmail,
      });
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
      toast.error("Failed to load interview feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!feedback || !candidateInfo) {
        toast.error("Feedback data not available");
        return;
      }

      await downloadInterviewPDF(feedback.feedback, candidateInfo);
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF report");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p>Loading interview feedback...</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Feedback Found</h2>
          <p className="text-gray-400 mb-4">
            The interview feedback is not available yet.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const feedbackData = feedback.feedback || {};
  const ratings = feedbackData.rating || {};
  const isRecommended = feedback.recommended;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Interview Completed</h1>
              <p className="text-gray-400">
                Thank you for completing the interview
              </p>
            </div>
            <Button onClick={handleDownloadPDF} className="bg-indigo-600 hover:bg-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </Button>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-white" />
            <div>
              <h2 className="text-xl font-bold mb-1">Interview Successfully Completed</h2>
              <p className="text-indigo-100">
                Your interview has been recorded and analyzed. The feedback report is ready.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-400">
                {feedbackData.overallScore?.toFixed(1) || "0.0"}
              </p>
              <p className="text-sm text-gray-400 mt-1">Overall Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                {ratings.techicalSkills || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">Technical Skills</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {ratings.communication || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">Communication</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">
                {ratings.problemSolving || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">Problem Solving</p>
            </div>
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-lg p-6 mb-6 border ${
            isRecommended
              ? "bg-green-900/20 border-green-700"
              : "bg-red-900/20 border-red-700"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            {isRecommended ? (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <h3 className="text-lg font-semibold">
              Recommendation: {isRecommended ? "Yes" : "No"}
            </h3>
          </div>
          <p className="text-gray-300">
            {feedbackData.RecommendationMsg || "No recommendation message available."}
          </p>
        </motion.div>

        {/* Summary */}
        {feedbackData.summery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <p className="text-gray-300 leading-relaxed">{feedbackData.summery}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Full Report (PDF)
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewComplete;
