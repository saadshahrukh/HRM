"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ModernSpinner({ size = "default", fullScreen = false, text = "Loading..." }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className={`relative ${sizeClasses[size]}`}
      >
        <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 opacity-75"></div>
        <div className="absolute inset-0 rounded-full border-r-2 border-purple-500 opacity-75 mt-1 ml-1"></div>
      </motion.div>
      {text && <p className="text-sm text-slate-400 font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

// Global Skeleton Loader for general UI sections
export function SkeletonLoader({ className = "", lines = 3 }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800"></div>
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div key={i} className="h-4 w-full animate-pulse rounded bg-slate-800"></div>
      ))}
    </div>
  );
}
