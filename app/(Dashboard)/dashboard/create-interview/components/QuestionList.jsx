"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionUploader from "./QuestionUploader";
import { Loader2, Pencil, Save, BrainCircuit, Sparkles, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import { supabase } from "@/services/supaBaseClient";
import { useUser } from "@/app/Provider";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const QuestionList = ({ formData, onCreateLink, goBack }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ question: "", type: "" });
  const [saveLoading, setSaveLoading] = useState(false);
  const { user, activeOrgId, activeOrgCredits } = useUser();
  const isSystemAdmin = user?.role === "super_admin" || user?.email === "saad122sharukh@gmail.com";
  const creditsExhausted = activeOrgCredits !== null && activeOrgCredits <= 0 && !isSystemAdmin;

  useEffect(() => {
    if (formData && questions.length === 0) {
      fetchQuestions();
    }
  }, [formData]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-model", { ...formData });
      
      if (!result.data || typeof result.data.content !== "string") {
        console.error("AI Model Response Error:", result.data);
        toast.error("AI model did not return a valid response. Please check your OpenRouter API key.");
        return;
      }

      const cleanString = result.data.content
        .replace(/```json\s*/g, "")
        .replace(/```/g, "");
      const parsed = JSON.parse(cleanString);
      if (parsed.interviewQuestions) {
        setQuestions(parsed.interviewQuestions);
        toast.success("AI successfully generated questions!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionsAdded = (newQs) => {
    const normalized = newQs.map((q) => ({
      question: q.question,
      type: q.type || "Experience",
    }));
    setQuestions((prev) => [...prev, ...normalized]);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditData({ ...questions[index] });
  };

  const handleSaveClick = (index) => {
    const updated = [...questions];
    updated[index] = editData;
    setQuestions(updated);
    setEditIndex(null);
    toast.success("Question updated.");
  };

  const handleAddCustom = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "Enter your custom question here?", type: "General" }
    ]);
    setEditIndex(questions.length);
    setEditData({ question: "Enter your custom question here?", type: "General" });
  };

  const onFinish = async () => {
    if (creditsExhausted) {
      toast.error("Insufficient credits. Please recharge to create new interviews.");
      return;
    }

    setSaveLoading(true);
    const interview_id = uuidv4();
    
    try {
      // 1. Insert Interview linked to active organization
      const { data, error } = await supabase
        .from("Interviews")
        .insert([
          {
            jobPosition: formData?.jobPosition || "",
            jobDescription: formData?.jobDescription || "",
            duration: formData?.duration || "",
            type: formData?.type || "",
            questionList: questions,
            userEmail: user?.email || "user@gmail.com",
            interview_id: interview_id,
            organization_id: activeOrgId
          },
        ])
        .select();

      if (error) throw error;

      // 2. Decrement Organization Credits (only for B2B tenants, admins bypass)
      if (activeOrgId && !isSystemAdmin) {
        const { error: creditError } = await supabase
          .from('organizations')
          .update({ credits_remaining: Math.max(0, Number(activeOrgCredits) - 1) })
          .eq('id', activeOrgId);

        if (creditError) throw creditError;
      } else if (!isSystemAdmin) {
        // Fallback: update individual user credits if they have no active tenant
        const { error: userCreditError } = await supabase
          .from('Users')
          .update({ credits: Math.max(0, Number(user?.credits || 0) - 1) })
          .eq('email', user?.email);

        if (userCreditError) throw userCreditError;
      }

      toast.success("Interview link created successfully!");
      onCreateLink(interview_id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete interview creation.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6 text-white animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Step 3: AI Interview Questions</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              The AI has prepared the following screening questions based on the{" "}
              <span className="font-bold text-white">"{formData?.jobPosition || "Job Role"}"</span> description.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchQuestions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-slate-800 rounded-xl bg-slate-950/40 text-xs font-bold hover:text-indigo-400 hover:border-indigo-500/30 transition-all disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5" /> Regenerate Questions
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center bg-slate-950/40 border border-slate-800/80 rounded-2xl text-center space-y-4">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
          <div>
            <h3 className="font-bold text-sm">Generating Interview Questions</h3>
            <p className="text-xs text-gray-500 mt-1">Our AI is crafting customized questions for your job role.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Uploader interface styled beautifully */}
          <div className="bg-slate-950/30 border border-slate-800/50 rounded-2xl p-6">
            <QuestionUploader onAccept={handleQuestionsAdded} />
          </div>

          {questions.length > 0 ? (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="p-4 border border-slate-850 rounded-xl bg-slate-950/40 hover:border-slate-800 transition-all flex items-start justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    {editIndex === i ? (
                      <div className="space-y-2">
                        <Input
                          type="text"
                          value={editData.question}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              question: e.target.value,
                            }))
                          }
                          className="bg-slate-900 border-slate-800 text-white rounded-lg"
                        />
                        <Input
                          type="text"
                          value={editData.type}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                          className="bg-slate-900 border-slate-800 text-white rounded-lg h-9 text-xs"
                        />
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-black text-indigo-400 mr-2 uppercase tracking-wide">
                          Q{i + 1}.
                        </span>
                        <span className="text-sm font-medium text-slate-100">{q.question}</span>
                        <div className="mt-2.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-850 text-indigo-400 capitalize">
                            {q.type}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {editIndex === i ? (
                      <button
                        onClick={() => handleSaveClick(i)}
                        className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(i)}
                        className="p-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg hover:text-white hover:border-slate-700 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-gray-500 border border-dashed border-slate-800 rounded-2xl">
              No screening questions added yet. Use the uploader or add a custom question.
            </div>
          )}

          <button
            type="button"
            onClick={handleAddCustom}
            className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add custom question
          </button>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-850">
        <button
          type="button"
          onClick={goBack}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back
        </button>
        <Button
          onClick={onFinish}
          disabled={creditsExhausted || saveLoading || questions.length === 0}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/15 ${
            creditsExhausted ? "bg-red-600/50 hover:bg-red-600/50 cursor-not-allowed" : ""
          }`}
        >
          {saveLoading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
          {creditsExhausted ? "Credits Exhausted" : "Complete Setup"}
          {!saveLoading && !creditsExhausted && <CheckCircle2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default QuestionList;
