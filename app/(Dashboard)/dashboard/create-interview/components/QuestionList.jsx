"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionUploader from "./QuestionUploader";
import { Loader2Icon, Pencil, Save } from "lucide-react";
import { supabase } from "@/services/supaBaseClient";
import { useUser } from "@/app/Provider";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";

const QuestionList = ({ formData, onCreateLink  }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ question: "", type: "" });
  const [saveLoading, setSaveLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (formData) {
      fetchQuestions();
    }
  }, [formData]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-model", { ...formData });
      const cleanString = result.data.content
        .replace(/```json\s*/g, "")
        .replace(/```/g, "");
      const parsed = JSON.parse(cleanString);
      if (parsed.interviewQuestions) {
        setQuestions(parsed.interviewQuestions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // merge: handle upload questions (from QuestionUploader)
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
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();
    const { data, error } = await supabase
      .from("Interviews")
      .insert([
        {
          ...formData,
          questionList: questions,
          userEmail: user?.email || "user@gmail.com",
          interview_id: interview_id,
        },
      ])
      .select();
    setSaveLoading(false);

    onCreateLink (interview_id)
    console.log(data)
  };

  return (
    <div className="py-5 px-10 bg-white rounded-2xl">
      {loading && (
        <div className="p-5 flex bg-blue-50 rounded-xl border border-blue-200 text-center">
          <Loader2Icon className="animate-spin mr-2" />
          <div>
            <h2>Generating Interview Questions</h2>
            <p>
              Our AI is crafting personalized questions based on your Job
              Position
            </p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Upload questions from file */}
          <QuestionUploader onAddQuestion={handleQuestionsAdded} />

          {questions.length > 0 && (
            <div className="mt-4">
              <h2 className="font-bold text-lg mb-2">Interview Questions</h2>
              <ul className="space-y-3">
                {questions.map((q, i) => (
                  <li
                    key={i}
                    className="p-3 border rounded-lg bg-white shadow-sm flex flex-col gap-2"
                  >
                    {editIndex === i ? (
                      <>
                        <input
                          type="text"
                          value={editData.question}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              question: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                        <input
                          type="text"
                          value={editData.type}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                        <button
                          onClick={() => handleSaveClick(i)}
                          className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 w-fit"
                        >
                          <Save size={16} /> Save
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-900">
                          <strong>Question:</strong> {q.question}
                        </p>
                        <p className="text-sm text-blue-500">
                          <strong>Type:</strong> {q.type}
                        </p>
                        <button
                          onClick={() => handleEditClick(i)}
                          className="text-gray-500 hover:text-blue-500 flex items-center gap-1 w-fit"
                        >
                          <Pencil size={16} /> Edit
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* // FINISH BUTTON  */}

      <div className="flex justify-end my-5">
        <Button onClick={() => onFinish()} >
          {saveLoading && <Loader2Icon className="animate-spin" />}
          Create Interview Link
        </Button>
      </div>
    </div>
  );
};

export default QuestionList;
