"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, FileText, ArrowRight, ArrowLeft, Bot, ShieldAlert } from "lucide-react";
import { useUser } from "@/app/Provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AutomationSettings = ({ formData, handleInputChange, goNext, goBack }) => {
  const { activeOrgPlan } = useUser();
  const isBasic = activeOrgPlan === "basic" || !activeOrgPlan;

  // Read existing values or set defaults
  const gmailFetch = formData?.gmailFetch ?? false;
  const ocrParsing = formData?.ocrParsing ?? false;
  const autoSendLink = formData?.autoSendLink ?? true;

  // Enforce plan restrictions by disabling toggles and forcing state to false
  useEffect(() => {
    if (isBasic) {
      if (formData?.gmailFetch) {
        handleInputChange("gmailFetch", false);
      }
      if (formData?.ocrParsing) {
        handleInputChange("ocrParsing", false);
      }
    }
  }, [isBasic, formData?.gmailFetch, formData?.ocrParsing, handleInputChange]);

  const toggleSetting = (key, currentVal) => {
    handleInputChange(key, !currentVal);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-xl space-y-8 animate-fade-in text-white">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-850">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Step 2: Automation Settings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Configure automated recruitment tasks and triggers.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toggle 1: Gmail API */}
        <div className={`flex items-center justify-between p-4 bg-slate-950/40 border rounded-xl transition-all ${
          isBasic ? "border-slate-850 opacity-60" : "border-slate-800 hover:border-slate-700/60"
        }`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 mt-1">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Gmail API Resume Fetching</h4>
                {isBasic && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                    PRO / ENTERPRISE
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1 max-w-md">
                Automatically pull resumes from inbound emails that match the job criteria.
              </p>
            </div>
          </div>
          
          {isBasic ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block cursor-not-allowed">
                    <button
                      type="button"
                      disabled
                      className="w-11 h-6 rounded-full p-1 bg-slate-800/50 cursor-not-allowed opacity-50 focus:outline-none"
                    >
                      <div className="w-4 h-4 rounded-full bg-slate-600" />
                    </button>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border border-slate-800 text-white max-w-xs p-3 rounded-lg shadow-xl">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs leading-normal">
                      Gmail Integration is only available on Pro & Enterprise plans. Upgrade your workspace to unlock.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              type="button"
              onClick={() => toggleSetting("gmailFetch", gmailFetch)}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                gmailFetch ? "bg-indigo-600" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  gmailFetch ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          )}
        </div>

        {/* Toggle 2: OCR Resume Parsing */}
        <div className={`flex items-center justify-between p-4 bg-slate-950/40 border rounded-xl transition-all ${
          isBasic ? "border-slate-850 opacity-60" : "border-slate-800 hover:border-slate-700/60"
        }`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 mt-1">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">OCR Resume Parsing</h4>
                {isBasic && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                    PRO / ENTERPRISE
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1 max-w-md">
                Extract skills, experience, and calculate job description match percentage.
              </p>
            </div>
          </div>

          {isBasic ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block cursor-not-allowed">
                    <button
                      type="button"
                      disabled
                      className="w-11 h-6 rounded-full p-1 bg-slate-800/50 cursor-not-allowed opacity-50 focus:outline-none"
                    >
                      <div className="w-4 h-4 rounded-full bg-slate-600" />
                    </button>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border border-slate-800 text-white max-w-xs p-3 rounded-lg shadow-xl">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs leading-normal">
                      OCR Resume Extraction requires Pro or Enterprise subscription tier. Please upgrade.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              type="button"
              onClick={() => toggleSetting("ocrParsing", ocrParsing)}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                ocrParsing ? "bg-indigo-600" : "bg-slate-800"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                  ocrParsing ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          )}
        </div>

        {/* Toggle 3: Auto-Send Link */}
        <div className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-xl hover:border-slate-700/60 transition-all">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 mt-1">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Auto-Send 1st AI Interview Link</h4>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                  FREE / BASIC INCLUDED
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 max-w-md">
                Dispatch technical screening to candidates above 75% match.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleSetting("autoSendLink", autoSendLink)}
            className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
              autoSendLink ? "bg-indigo-600" : "bg-slate-800"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                autoSendLink ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-850">
        <button
          type="button"
          onClick={goBack}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back
        </button>
        <Button
          onClick={goNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/15"
        >
          Next Step <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AutomationSettings;
