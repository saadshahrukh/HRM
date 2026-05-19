"use client";
import React, { useState, useRef } from "react";
import { Upload, Plus, Loader2, AlertCircle, Check, X } from "lucide-react";
import axios from "axios";

export default function Uploader({ onAccept }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
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

  return (
    <div className="space-y-4 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold">Upload Interview Questions</h3>
          <p className="text-xs text-gray-400 mt-0.5">Upload a list of questions directly from external files.</p>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          PDF, XLSX, CSV, TXT supported
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-850 hover:border-slate-700 transition-all text-xs font-bold text-gray-300">
          <Upload className="w-4 h-4 text-indigo-400" />
          <span>Upload File</span>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.xlsx,.xls,.csv,.txt"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
          <Loader2 className="animate-spin w-4 h-4 text-indigo-400" />
          <span>Processing questions file... this might take a few moments.</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 text-red-400 bg-red-950/20 border border-red-900/30 p-3.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-xs">{error}</div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="mt-4 border border-slate-850 rounded-xl p-4 bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-bold text-xs">Previewing Parsed Questions</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="px-3 py-1.5 bg-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all text-white"
              >
                Accept All
              </button>
            </div>
          </div>

          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {preview.questions.map((q, idx) => (
              <li key={idx} className="p-3 bg-slate-900/60 border border-slate-850 rounded-lg space-y-2">
                <textarea
                  value={q.question}
                  onChange={(e) =>
                    updatePreview(idx, { question: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Type</span>
                    <select
                      value={q.type}
                      onChange={(e) =>
                        updatePreview(idx, { type: e.target.value })
                      }
                      className="text-xs bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option>Technical</option>
                      <option>Behavioral</option>
                      <option>Experience</option>
                      <option>Problem-Solving</option>
                      <option>Leadership</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePreview(idx)}
                    className="text-xs text-red-400 hover:text-red-300 font-bold"
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
