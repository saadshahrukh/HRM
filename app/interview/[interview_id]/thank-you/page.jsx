"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Mail, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

const ThankYouPage = () => {
  const { interview_id } = useParams();
  const router = useRouter();
  const [candidateName, setCandidateName] = useState("");

  useEffect(() => {
    // Get candidate name from localStorage or context if available
    const storedName = localStorage.getItem("candidateName");
    if (storedName) {
      setCandidateName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 md:p-12 shadow-2xl"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
            <div className="relative bg-green-500 rounded-full p-4">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
          >
            Thank You!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-2"
          >
            {candidateName ? `Dear ${candidateName},` : "Dear Candidate,"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-400 leading-relaxed"
          >
            Your interview has been successfully completed. We appreciate the time you took to
            participate in this process.
          </motion.p>
        </div>

        {/* Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-8"
        >
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 flex items-start gap-4">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <Mail className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">What's Next?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our team will review your interview and get back to you shortly. If you are
                shortlisted, we will share the detailed interview report via email.
              </p>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 flex items-start gap-4">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Timeline</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                You can expect to hear from us within 3-5 business days. We'll notify you via
                email about the next steps in the hiring process.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => router.push("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Home
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Thank you for your interest in joining our team!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;

