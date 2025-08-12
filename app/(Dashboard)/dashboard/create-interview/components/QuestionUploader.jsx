"use client";
import React, { useState, useRef } from "react";
import { Upload, Plus, Loader2, AlertCircle, Check, X } from "lucide-react";
import axios from "axios";

/*
Usage:
<FileUploader onAccept={(questionsArray) => { setQuestions(prev => [...prev, ...questionsArray]) }} />
*/

export default function Uploader({ onAccept }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [ocring, setOcring] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setPreview(null);
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      // Use fetch / axios to send FormData
      const res = await axios.post("/api/parse-questions", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      if (res.data?.success && Array.isArray(res.data.questions)) {
        setPreview({ questions: res.data.questions });
      } else {
        setError(
          res.data?.error || "Parsing failed. The file might be unreadable."
        );
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err?.response?.data?.error ||
          err.message ||
          "Unexpected error uploading file."
      );
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const acceptAll = () => {
    if (!preview?.questions) return;
    onAccept(preview.questions);
    setPreview(null);
  };

  const updatePreview = (idx, q) => {
    setPreview((p) => {
      const copy = { questions: [...p.questions] };
      copy.questions[idx] = { ...copy.questions[idx], ...q };
      return copy;
    });
  };

  const removePreview = (idx) => {
    setPreview((p) => {
      const arr = p.questions.filter((_, i) => i !== idx);
      return arr.length ? { questions: arr } : null;
    });
  };

  const manualAdd = () => {
    onAccept([{ question: "Your custom question?", type: "Experience" }]);
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upload / Add Questions</h3>
        <div className="text-sm text-slate-500">
          PDF, XLSX, CSV, TXT supported
        </div>
      </div>

      <div className="flex gap-3">
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100">
          <Upload className="w-4 h-4 text-blue-700" />
          <span className="text-sm">Upload file</span>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.xlsx,.xls,.csv,.txt"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        <button
          onClick={manualAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Add Manual
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="animate-spin w-4 h-4" /> Processing file... this
          can take a few seconds.
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-red-700 bg-red-50 p-3 rounded">
          <AlertCircle className="w-5 h-5" />
          <div className="text-sm">{error}</div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="mt-4 border rounded-lg p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-sm">Preview parsed questions</div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreview(null)}
                className="px-3 py-1 bg-gray-200 rounded text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={acceptAll}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-1"
              >
                <Check className="w-4 h-4" /> Accept All
              </button>
            </div>
          </div>

          <ul className="space-y-2 max-h-72 overflow-auto">
            {preview.questions.map((q, idx) => (
              <li key={idx} className="p-2 bg-white border rounded flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={q.question}
                    onChange={(e) =>
                      updatePreview(idx, { question: e.target.value })
                    }
                    rows={2}
                    className="w-full p-2 border rounded resize-none"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-xs">Type</label>
                    <select
                      value={q.type}
                      onChange={(e) =>
                        updatePreview(idx, { type: e.target.value })
                      }
                      className="text-sm border px-2 py-1 rounded"
                    >
                      <option>Technical</option>
                      <option>Behavioral</option>
                      <option>Experience</option>
                      <option>Problem-Solving</option>
                      <option>Leadership</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => removePreview(idx)}
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
