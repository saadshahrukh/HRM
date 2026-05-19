"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/services/Options";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

const FormContainer = ({ formData, handleInputChange, goToNext }) => {
  const [selectedTypes, setSelectedTypes] = useState(
    formData?.type ? formData.type.split(", ").filter(Boolean) : []
  );

  const toggleInterviewType = (typeTitle) => {
    let updated;
    if (selectedTypes.includes(typeTitle)) {
      updated = selectedTypes.filter((t) => t !== typeTitle);
    } else {
      updated = [...selectedTypes, typeTitle];
    }
    setSelectedTypes(updated);
    handleInputChange("type", updated.join(", "));
  };

  const handleAiGenerate = () => {
    const jobTitle = formData?.jobPosition || "";
    const department = formData?.department || "";
    
    if (!jobTitle) {
      toast.error("Please enter a Job Title first.");
      return;
    }

    // Dynamic mock job description generator
    const mockDescription = `We are looking for a skilled ${jobTitle} to join our ${department || "Engineering"} team. In this role, you will be responsible for building high-quality, scalable products, collaborating with cross-functional teams, and implementing best practices. Requirements: 3+ years of experience, strong analytical skills, and expertise in the relevant tech stack.`;
    
    handleInputChange("jobDescription", mockDescription);
    toast.success("AI generated a draft job description!");
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6 text-white animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-850">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Step 1: Job Details</h2>
          <p className="text-xs text-gray-400 mt-0.5">Specify job details to train the AI interviewer.</p>
        </div>
      </div>

      {/* Main Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Title</label>
          <Input
            placeholder="e.g. Senior UI/UX Designer"
            value={formData?.jobPosition || ""}
            onChange={(e) => handleInputChange("jobPosition", e.target.value)}
            className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder:text-gray-600 h-11"
          />
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</label>
          <Input
            placeholder="e.g. Design, Engineering"
            value={formData?.department || ""}
            onChange={(e) => handleInputChange("department", e.target.value)}
            className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder:text-gray-600 h-11"
          />
        </div>
      </div>

      {/* Job Description with AI Auto-Generator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Description</label>
          <button
            type="button"
            onClick={handleAiGenerate}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Sparkles className="h-3 w-3" /> Auto-Generate with AI
          </button>
        </div>
        <Textarea
          placeholder="Paste or write the job description here..."
          value={formData?.jobDescription || ""}
          onChange={(e) => handleInputChange("jobDescription", e.target.value)}
          className="bg-slate-950 border-slate-800 text-white rounded-xl focus:border-indigo-500 placeholder:text-gray-600 min-h-[140px] leading-relaxed p-4"
        />
      </div>

      {/* Interview Parameters (Duration & Type) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Duration Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Interview Duration</label>
          <Select
            value={formData?.duration || ""}
            onValueChange={(value) => handleInputChange("duration", value)}
          >
            <SelectTrigger className="w-full bg-slate-950 border-slate-800 text-white rounded-xl h-11 focus:border-indigo-500 text-left">
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-850 text-white rounded-xl">
              <SelectItem value="5 Min" className="focus:bg-indigo-600 focus:text-white">5 Minutes</SelectItem>
              <SelectItem value="15 Min" className="focus:bg-indigo-600 focus:text-white">15 Minutes</SelectItem>
              <SelectItem value="45 Min" className="focus:bg-indigo-600 focus:text-white">45 Minutes</SelectItem>
              <SelectItem value="60 Min" className="focus:bg-indigo-600 focus:text-white">60 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interview Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Interview Type</label>
          <div className="flex flex-wrap gap-2">
            {InterviewType.map((type, index) => {
              const Icon = type.icon;
              const isSelected = selectedTypes.includes(type.title);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleInterviewType(type.title)}
                  className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "bg-slate-950 border-slate-800 text-gray-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{type.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-end pt-6 border-t border-slate-850">
        <Button
          onClick={goToNext}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/15"
        >
          Next Step <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FormContainer;
