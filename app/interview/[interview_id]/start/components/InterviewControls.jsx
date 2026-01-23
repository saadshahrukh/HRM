"use client";
import React from "react";
import { Phone, Pause, Play, Settings, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertConfirmation from "./AlertConfirmation";

const InterviewControls = ({
  elapsedTime,
  totalTime,
  isPaused,
  onPause,
  onResume,
  onEndInterview,
  onNextQuestion,
  currentQuestion,
  questionNumber,
  totalQuestions,
  questionType,
  overallScore,
  audioQuality,
  isGeneratingFeedback = false,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-900 border-t border-gray-800 p-4">
      {/* Main Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertConfirmation stopInterview={onEndInterview}>
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-14 h-14 p-0"
              disabled={isGeneratingFeedback}
            >
              <Phone className="w-6 h-6" />
            </Button>
          </AlertConfirmation>

          <Button
            variant="outline"
            size="lg"
            onClick={isPaused ? onResume : onPause}
            className="rounded-full w-14 h-14 p-0 border-gray-700 bg-gray-800 hover:bg-gray-900"
          >
            {isPaused ? (
              <Play className="w-6 h-6 text-white" />
            ) : (
              <Pause className="w-6 h-6 text-white" />
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onNextQuestion}
            className="rounded-full w-14 h-14 p-0 border-gray-700 bg-gray-800  hover:bg-gray-900"
            disabled={!onNextQuestion}
          >
            <SkipForward className="w-6 h-6 text-white" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Time</p>
            <p className="text-lg font-semibold text-white">
              {formatTime(elapsedTime)} / {formatTime(totalTime)}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-lg border-gray-700 bg-gray-800 hover:bg-gray-900"
          >
            <Settings className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Current Question Info */}
      {currentQuestion && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-400 mb-1">Current Question</p>
              <p className="text-sm font-medium text-white">{currentQuestion}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">
                Question {questionNumber} of {totalQuestions}
              </p>
              <span className="inline-block mt-1 px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded">
                {questionType}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs text-gray-400">Overall Score</span>
          <span className="text-sm font-semibold text-white">
            {overallScore?.toFixed(1) || "0.0"}/10
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-400">Audio Quality</span>
            <span className="text-sm font-semibold text-white">{audioQuality}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewControls;

