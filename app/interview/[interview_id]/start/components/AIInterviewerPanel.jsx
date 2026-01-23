"use client";
import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const AIInterviewerPanel = ({
  isSpeaking,
  currentQuestion,
  isMuted,
  onToggleMute,
  aiVideoRef,
  isConnected = false,
}) => {
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (isSpeaking) {
      setIsThinking(false);
    } else if (currentQuestion) {
      setIsThinking(true);
      const timer = setTimeout(() => setIsThinking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, currentQuestion]);

  return (
    <div className="h-full bg-gray-800 rounded-lg border border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">AI Interviewer</h3>
          {isConnected && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <button
          onClick={onToggleMute}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-gray-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-indigo-400" />
          )}
        </button>
      </div>

      {/* Main Display */}
      <div className="flex-1 flex items-center justify-center relative bg-gradient-to-br from-gray-900 to-gray-800">
        {/* AI Video or Avatar */}
        <div className="relative w-full h-full flex items-center justify-center">
          {aiVideoRef?.current ? (
            <video
              ref={aiVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative">
              {/* AI Avatar */}
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center"
                animate={{
                  scale: isSpeaking ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: isSpeaking ? Infinity : 0,
                }}
              >
                <span className="text-4xl">🤖</span>
              </motion.div>

              {/* Thinking Indicator */}
              {isThinking && (
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-indigo-400 rounded-full"
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-300">Speaking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="p-4 border-t border-gray-700 bg-gray-900/50">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <p className="text-sm text-gray-300 leading-relaxed">{currentQuestion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInterviewerPanel;

