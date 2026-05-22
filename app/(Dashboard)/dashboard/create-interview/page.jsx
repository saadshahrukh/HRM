"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/app/Provider";
import { useSelector, useDispatch } from "react-redux";
import { updateForm, saveInterviewAutomation, resetForm } from "@/features/interview/interviewSlice";
import { supabase } from "@/services/supaBaseClient";

// Sub-components
import FormContainer from "./components/FormContainer";
import AutomationSettings from "./components/AutomationSettings";
import QuestionList from "./components/QuestionList";
import InterviewLink from "./components/InterviewLink";

const CreateInterview = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams ? searchParams.get("edit") : null;
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const formData = useSelector((state) => state.interview.currentForm);
  const interviewsAutomation = useSelector((state) => state.interview.interviewsAutomation);
  const [interviewId, setInterviewId] = useState("");
  const { user, activeOrgCredits } = useUser();

  useEffect(() => {
    if (editId) {
      const fetchInterviewData = async () => {
        try {
          const { data, error } = await supabase
            .from("Interviews")
            .select("*")
            .eq("interview_id", editId)
            .single();
          if (data && !error) {
            const savedSetting = interviewsAutomation[editId] || {
              gmailFetch: false,
              ocrParsing: false,
              autoSendLink: true,
            };
            dispatch(
              updateForm({
                jobPosition: data.jobPosition || "",
                department: data.department || "",
                location: data.location || "Remote",
                jobDescription: data.jobDescription || "",
                duration: data.duration || "",
                type: data.type || "",
                gmailFetch: savedSetting.gmailFetch,
                ocrParsing: savedSetting.ocrParsing,
                autoSendLink: savedSetting.autoSendLink,
                questions: data.questionList || [],
                isEditing: true,
                editInterviewId: editId,
                budget_min: data.budget_min || "",
                budget_max: data.budget_max || "",
                currency: data.currency || "USD",
              })
            );
          } else {
            toast.error("Failed to load job details.");
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to load job details.");
        }
      };
      fetchInterviewData();
    } else {
      dispatch(resetForm());
    }
  }, [editId, dispatch]);

  const isSystemAdmin = user?.role === "super_admin" || user?.email === "saad122sharukh@gmail.com";
  const creditsExhausted = activeOrgCredits !== null && activeOrgCredits <= 0 && !isSystemAdmin;

  const handleInputChange = (field, value) => {
    dispatch(updateForm({ [field]: value }));
  };

  const validateStep1 = () => {
    if (creditsExhausted) {
      toast.error("Credits exhausted. Please recharge your workspace to create interviews.");
      return false;
    }
    if (!formData.jobPosition || !formData.jobDescription || !formData.duration || !formData.type) {
      toast.error("Please fill in all the required job details.");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBackStep = () => {
    if (step > 1 && step < 4) {
      setStep(step - 1);
    }
  };

  const handleCreateLink = (id) => {
    dispatch(saveInterviewAutomation({
      interviewId: id,
      settings: {
        gmailFetch: formData?.gmailFetch ?? false,
        ocrParsing: formData?.ocrParsing ?? false,
        autoSendLink: formData?.autoSendLink ?? true,
      }
    }));
    setInterviewId(id);
    setStep(4);
  };

  // Steps configuration
  const stepsList = [
    { number: 1, label: "Job Details" },
    { number: 2, label: "Automation Rules" },
    { number: 3, label: "AI Interview Questions" },
    { number: 4, label: "Job Ready" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 md:px-8 max-w-5xl mx-auto space-y-10 relative">
      {/* Back button & Page title */}
      <div className="space-y-4">
        <button
          onClick={() => {
            if (step > 1 && step < 4) {
              handleBackStep();
            } else {
              router.back();
            }
          }}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-all group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>

        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Create New Job Opening
          </h1>
          <p className="text-sm text-gray-400">
            Configure job details and set up AI automation rules for the recruiting pipeline.
          </p>
        </div>
      </div>

      {/* Modern Multi-step Progress Bar */}
      <div className="relative flex items-center justify-between w-full px-20">
        {/* Background connector line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />

        {/* Foreground connector line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 transition-all duration-300 z-0"
          style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
        />

        {stepsList.map((s, index) => {
          const isActive = step === s.number;
          const isCompleted = step > s.number;

          return (
            <div key={s.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-350 ${
                  isActive
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30 scale-110"
                    : isCompleted
                    ? "bg-indigo-950/80 border-indigo-600 text-indigo-400"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : s.number}
              </div>
            </div>
          );
        })}
      </div>

      {/* Render Steps */}
      <div className="relative pt-4">
        {step === 1 && (
          <FormContainer
            formData={formData}
            handleInputChange={handleInputChange}
            goToNext={handleNextStep}
          />
        )}
        {step === 2 && (
          <AutomationSettings
            formData={formData}
            handleInputChange={handleInputChange}
            goNext={handleNextStep}
            goBack={handleBackStep}
          />
        )}
        {step === 3 && (
          <QuestionList
            formData={formData}
            onCreateLink={handleCreateLink}
            goBack={handleBackStep}
          />
        )}
        {step === 4 && (
          <InterviewLink
            interview_id={interviewId}
            formData={formData}
          />
        )}
      </div>
    </div>
  );
};

export default CreateInterview;
