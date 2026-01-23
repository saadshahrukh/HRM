"use client";
import React, { useEffect, useRef, useState } from "react";

// Eye Contact Detection using MediaPipe Face Mesh or similar
// This is a simplified version - you may want to use a library like face-api.js or MediaPipe
const EyeContactDetector = ({ videoRef, onEyeContactChange }) => {
  const [eyeContactPercentage, setEyeContactPercentage] = useState(0);
  const detectionIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!videoRef?.current || !isDetecting) {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      return;
    }

    // Simplified eye contact detection
    // In production, you would use a proper face detection library
    const detectEyeContact = () => {
      const video = videoRef.current;
      if (!video || video.readyState !== 4) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // Simplified detection - in production use face-api.js or MediaPipe
      // This is a placeholder that simulates eye contact detection
      // You would need to:
      // 1. Load face detection model
      // 2. Detect face landmarks
      // 3. Calculate eye position relative to camera
      // 4. Determine if looking at camera

      // Placeholder: Simulate eye contact based on video activity
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let brightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      brightness = brightness / (data.length / 4);

      // Simple heuristic (replace with actual face detection)
      const simulatedEyeContact = Math.min(
        100,
        Math.max(0, 50 + (brightness - 100) / 2)
      );

      setEyeContactPercentage(simulatedEyeContact);
      onEyeContactChange?.(simulatedEyeContact);
    };

    detectionIntervalRef.current = setInterval(detectEyeContact, 500);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [videoRef, isDetecting, onEyeContactChange]);

  useEffect(() => {
    if (videoRef?.current) {
      setIsDetecting(true);
    }
    return () => setIsDetecting(false);
  }, [videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="hidden"
      style={{ display: "none" }}
    />
  );
};

// Hook for using eye contact detection
export const useEyeContactDetection = (videoRef) => {
  const [eyeContactPercentage, setEyeContactPercentage] = useState(0);
  const [averageEyeContact, setAverageEyeContact] = useState(0);
  const eyeContactHistoryRef = useRef([]);

  const handleEyeContactChange = (percentage) => {
    setEyeContactPercentage(percentage);
    eyeContactHistoryRef.current.push(percentage);
    if (eyeContactHistoryRef.current.length > 60) {
      // Keep last 30 seconds (assuming 2 detections per second)
      eyeContactHistoryRef.current.shift();
    }
    const avg =
      eyeContactHistoryRef.current.reduce((a, b) => a + b, 0) /
      eyeContactHistoryRef.current.length;
    setAverageEyeContact(avg);
  };

  return {
    eyeContactPercentage,
    averageEyeContact,
    EyeContactDetector: (props) => (
      <EyeContactDetector
        {...props}
        videoRef={videoRef}
        onEyeContactChange={handleEyeContactChange}
      />
    ),
  };
};

export default EyeContactDetector;

