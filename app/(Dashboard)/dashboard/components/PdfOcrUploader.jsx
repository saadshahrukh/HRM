"use client";

import React, { useMemo, useRef, useState } from "react";
import { Upload, Loader2, CheckCircle2, AlertTriangle, Trash2, Play, X } from "lucide-react";

const MAX_MB = 10;

function fmtSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + " KB";
  return bytes + " B";
}

export default function PdfOcrUploader({ onExtracted }) {
  const inputRef = useRef(null);
  const [items, setItems] = useState([]); // {id, file, name, size, status, error, text}
  const [processing, setProcessing] = useState(false);

  const queuedCount = useMemo(() => items.filter(i => i.status === "queued").length, [items]);
  const doneCount = useMemo(() => items.filter(i => i.status === "done").length, [items]);

  const addFiles = (fileList) => {
    const selected = Array.from(fileList || []);
    const next = [];
    for (const f of selected) {
      const name = f.name || "document.pdf";
      const isPdf = (f.type === "application/pdf") || name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        next.push({ id: crypto.randomUUID(), file: null, name, size: f.size || 0, status: "error", error: "Only PDF files are allowed." });
        continue;
      }
      if ((f.size || 0) > MAX_MB * 1024 * 1024) {
        next.push({ id: crypto.randomUUID(), file: null, name, size: f.size || 0, status: "error", error: `Max size ${MAX_MB}MB.` });
        continue;
      }
      next.push({ id: crypto.randomUUID(), file: f, name, size: f.size || 0, status: "queued" });
    }
    setItems(prev => [...prev, ...next]);
  };

  const onPick = (e) => {
    addFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const startProcessing = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      // process strictly one-by-one
      for (const item of items) {
        if (item.status !== "queued" || !item.file) continue;

        setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: "uploading", error: "" } : p));
        try {
          const form = new FormData();
          form.append("pdf", item.file);
          // Optional: form.append("lang", "eng");

          const res = await fetch("/api/ocr", { method: "POST", body: form });
          const data = await res.json();

          if (!res.ok || !data?.success) {
            const err = data?.error || `Server error (${res.status})`;
            setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: "error", error: err } : p));
            continue;
          }

          setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: "done", text: data.text || "" } : p));
          if (typeof onExtracted === "function") onExtracted(item.name, data.text || "");
        } catch (e) {
          setItems(prev => prev.map(p => p.id === item.id ? { ...p, status: "error", error: e.message || "Network error" } : p));
        }
      }
    } finally {
      setProcessing(false);
    }
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const clearAll = () => setItems([]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">PDF → Text (OCR)</h3>
          <p className="text-xs text-slate-500">Only PDF • Max {MAX_MB}MB each • Bulk supported (processed one-by-one)</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={startProcessing}
            disabled={processing || queuedCount === 0}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white ${processing || queuedCount === 0 ? "bg-slate-300" : "bg-blue-600 hover:bg-blue-700"}`}
            title="Start OCR"
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} {processing ? "Processing…" : "Start"}
          </button>
          <button onClick={clearAll} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      <div
        onDragOver={(e)=>e.preventDefault()}
        onDrop={onDrop}
        className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:bg-slate-100"
      >
        <Upload className="h-8 w-8 text-slate-400" />
        <p className="mt-2 text-sm text-slate-600">Drag & drop PDFs here, or</p>
        <button
          className="mt-2 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-900"
          onClick={() => inputRef.current?.click()}
        >Choose files</button>
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" multiple className="hidden" onChange={onPick} />
      </div>

      {/* List */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((it) => (
          <div key={it.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{it.name}</div>
                <div className="text-xs text-slate-500">{fmtSize(it.size)}</div>
              </div>
              <button onClick={() => removeItem(it.id)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3">
              {it.status === "queued" && (
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">Queued</div>
              )}
              {it.status === "uploading" && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                </div>
              )}
              {it.status === "done" && (
                <>
                  <div className="mb-2 flex items-center gap-2 text-xs text-green-700">
                    <CheckCircle2 className="h-4 w-4" /> Done
                  </div>
                  <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border bg-slate-50 p-3 text-xs text-slate-800">
{it.text || "(empty)"}
                  </pre>
                </>
              )}
              {it.status === "error" && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  <AlertTriangle className="h-4 w-4" /> {it.error || "Failed"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="mt-4 text-right text-xs text-slate-500">
          {doneCount} / {items.length} completed
        </div>
      )}
    </div>
  );
}
