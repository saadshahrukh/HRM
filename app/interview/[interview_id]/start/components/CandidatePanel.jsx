"use client";
import React, { useEffect, useRef, useState } from "react";
import { Video, VideoOff, Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

const CandidatePanel = ({
  candidateName,
  candidateVideoRef,
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
  isSpeaking,
  eyeContactPercentage,
}) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (candidateVideoRef?.current && isAudioEnabled) {
      // Setup audio level detection
      const setupAudioAnalysis = async () => {
        try {
          const stream = candidateVideoRef.current.srcObject;
          if (stream) {
            audioContextRef.current = new (window.AudioContext ||
              window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;

            const updateAudioLevel = () => {
              if (analyserRef.current) {
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);
                const average =
                  dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
                setAudioLevel(Math.min(100, (average / 255) * 100));
                requestAnimationFrame(updateAudioLevel);
              }
            };
            updateAudioLevel();
          }
        } catch (error) {
          console.error("Audio analysis setup failed:", error);
        }
      };

      setupAudioAnalysis();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [candidateVideoRef, isAudioEnabled]);

  return (
    <div className="h-full bg-gray-800 rounded-lg border border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-white">{candidateName}</h3>
        <div className="flex gap-2">
          <button
            onClick={onToggleVideo}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isVideoEnabled
                ? "bg-gray-700 hover:bg-gray-600 text-green-400"
                : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
            }`}
            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoEnabled ? (
              <Video className="w-5 h-5 text-green-400" />
            ) : (
              <VideoOff className="w-5 h-5 text-red-400" />
            )}
          </button>
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isAudioEnabled
                ? "bg-gray-700 hover:bg-gray-600 text-green-400"
                : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
            }`}
            title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
          >
            {isAudioEnabled ? (
              <Mic className="w-5 h-5 text-green-400" />
            ) : (
              <MicOff className="w-5 h-5 text-red-400" />
            )}
          </button>
        </div>
      </div>

      {/* Video Display */}
      <div className="flex-1 relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <video
          ref={candidateVideoRef}
          autoPlay
          playsInline
          muted={!isAudioEnabled}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isVideoEnabled ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Fallback avatar - only show when video is disabled or not available */}
        {(!isVideoEnabled || !candidateVideoRef?.current?.srcObject) && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600">
              <span className="text-4xl text-gray-400 font-semibold">
                {candidateName?.[0]?.toUpperCase() || "C"}
              </span>
            </div>
          </div>
        )}

        {/* Speaking Indicator */}
        {isSpeaking && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col items-center gap-2 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-300">Speaking...</span>
              {/* Audio Level Bar */}
              <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  animate={{ width: `${audioLevel}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Eye Contact Indicator */}
        {eyeContactPercentage !== null && (
          <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full" />
              <span className="text-xs text-gray-300">
                Eye Contact: {Math.round(eyeContactPercentage)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatePanel;

