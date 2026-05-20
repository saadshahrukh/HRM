"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const InterviewLink = ({ interview_id, formData }) => {
  const router = useRouter();
  const url = typeof window !== "undefined" 
    ? `${window.location.origin}/interview/${interview_id}`
    : `https://aihrm.com/interview/${interview_id}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Public job link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-2xl shadow-xl space-y-8 animate-fade-in text-white text-center max-w-2xl mx-auto">
      {/* Animated Success Ring */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Soft outer glow */}
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center shadow-inner">
            <Check className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Main Copy */}
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight">Job is Ready!</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          The AI automation rules are set. Your job pipeline is active and ready to process candidates.
        </p>
      </div>

      {/* Copy Link Container */}
      <div className="p-6 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2 text-left">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Public Job Link</label>
        <div className="flex gap-2">
          <Input 
            readOnly 
            value={url} 
            className="bg-slate-900 border-slate-800 text-white rounded-lg h-11 select-all font-mono text-xs cursor-text"
          />
          <Button 
            onClick={onCopy}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-4 pt-4 border-t border-slate-850">
        <Button 
          onClick={() => router.push("/reports/pipeline")}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 group"
        >
          <span>Go to Job Pipeline</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>

        <button 
          onClick={() => window.location.reload()}
          className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto"
        >
          <RefreshCw className="h-3 w-3" /> Create another interview job
        </button>
      </div>
    </div>
  );
};

export default InterviewLink;
