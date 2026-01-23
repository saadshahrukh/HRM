"use client";
import React from "react";
import { CheckCircle2, Circle, Clock, User, Radio } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const InterviewSidebar = ({
  candidateName,
  jobPosition,
  isRecording,
  elapsedTime,
  interviewProgress,
  currentStage,
  aiMetrics,
  onAddNote,
}) => {
  const stages = [
    { id: "intro", label: "Introduction", completed: interviewProgress > 0 },
    { id: "technical", label: "Technical Skills", completed: interviewProgress > 25 },
    { id: "problem", label: "Problem Solving", completed: interviewProgress > 50 },
    { id: "behavioral", label: "Behavioral Questions", completed: interviewProgress > 75 },
    { id: "qa", label: "Q&A Session", completed: interviewProgress === 100 },
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col border-r border-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold mb-1">Live Interview</h2>
        <p className="text-sm text-gray-400">{jobPosition}</p>
      </div>

      {/* Candidate Info */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
            {candidateName?.[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <p className="text-sm text-gray-400">Candidate</p>
            <p className="font-semibold">{candidateName || "Unknown"}</p>
          </div>
        </div>
      </div>

      {/* Recording Status */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-gray-600"
              }`}
            />
            <span className="text-sm font-medium">
              {isRecording ? "Recording" : "Paused"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formatTime(elapsedTime)}</span>
          </div>
        </div>
      </div>

      {/* MODERN SCROLLBAR CONTAINER */}
      <div className="flex-1 overflow-y-auto 
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-gray-950
        [&::-webkit-scrollbar-thumb]:bg-gray-700
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-indigo-500/50
        transition-colors">
        
        {/* Interview Progress */}
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-sm font-semibold mb-4 text-gray-300">Interview Progress</h3>
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const isCurrent = currentStage === stage.id;
              const isCompleted = stage.completed && !isCurrent;

              return (
                <div key={stage.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isCurrent ? (
                      <Radio className="w-5 h-5 text-indigo-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        isCurrent
                          ? "text-indigo-400 font-medium"
                          : isCompleted
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {stage.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-gray-300 font-medium">{interviewProgress}% Complete</span>
            </div>
            <Progress value={interviewProgress} className="h-2" />
          </div>
        </div>

        {/* AI Analysis */}
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-sm font-semibold mb-4 text-gray-300">AI Analysis</h3>
          <div className="space-y-4">
            <MetricBar
              label="Confidence Level"
              value={aiMetrics?.confidence || 0}
              color="bg-blue-500"
            />
            <MetricBar
              label="Communication"
              value={aiMetrics?.communication || 0}
              color="bg-green-500"
            />
            <MetricBar
              label="Technical Knowledge"
              value={aiMetrics?.technical || 0}
              color="bg-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Notes */}
      <div className="p-6 border-t border-gray-800 bg-gray-900">
        <textarea
          placeholder="Add interview notes..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={3}
          onChange={(e) => onAddNote?.(e.target.value)}
        />
      </div>
    </div>
  );
};

const MetricBar = ({ label, value, color }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300 font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default InterviewSidebar;