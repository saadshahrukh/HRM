import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // (for Vercel) optional

const SIZE_MB_LIMIT = 10; // change if you want

function pickPythonBin() {
  // Allow override
  if (process.env.PYTHON_BIN) return process.env.PYTHON_BIN;
  // Best guess by platform
  if (process.platform === "win32") return "python"; // or set PYTHON_BIN=py
  return "python3";
}

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req) {
  try {
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json({ success: false, error: "Use multipart/form-data with a 'pdf' file." }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("pdf");
    const lang = (form.get("lang") || "eng").toString();

    if (!file) {
      return NextResponse.json({ success: false, error: "Missing 'pdf' file field." }, { status: 400 });
    }

    // Validate type (some browsers may send generic octet-stream; also check extension)
    const fileName = file.name || "document.pdf";
    const isPdfByName = fileName.toLowerCase().endsWith(".pdf");
    if (!(file.type === "application/pdf" || isPdfByName)) {
      return NextResponse.json({ success: false, error: "Only PDF is allowed." }, { status: 415 });
    }

    // Size limit
    const size = file.size || 0;
    if (size > SIZE_MB_LIMIT * 1024 * 1024) {
      return NextResponse.json({ success: false, error: `File too large. Max ${SIZE_MB_LIMIT}MB.` }, { status: 413 });
    }

    // Write to temp
    const tmpDir = path.join(process.cwd(), "tmp", "ocr");
    await fs.mkdir(tmpDir, { recursive: true });
    const tmpPath = path.join(tmpDir, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${sanitize(fileName)}`);
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tmpPath, buf);

    const pythonBin = pickPythonBin();
    const scriptPath = path.join(process.cwd(), "python", "ocr_service.py");

    const result = await new Promise((resolve) => {
      const child = spawn(pythonBin, [scriptPath, "--file", tmpPath, "--lang", lang], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"],
      });

      let out = "";
      let err = "";
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
      }, 1000 * 180); // 3 minutes

      child.stdout.on("data", (d) => (out += d.toString()));
      child.stderr.on("data", (d) => (err += d.toString()));
      child.on("close", (code) => {
        clearTimeout(timer);
        resolve({ code, out, err });
      });
    });

    // cleanup temp file
    try { await fs.unlink(tmpPath); } catch {}

    if (result.code !== 0) {
      let detail = result.err?.trim() || "Python failed.";
      // If Python printed JSON on stdout with ok:false, prefer that
      try {
        const maybe = JSON.parse(result.out || "{}");
        if (maybe && maybe.ok === false && maybe.error) detail = maybe.error;
      } catch {}
      return NextResponse.json({ success: false, error: detail }, { status: 500 });
    }

    // Parse Python JSON
    let payload = {};
    try {
      payload = JSON.parse(result.out);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid response from OCR service." }, { status: 500 });
    }

    if (!payload.ok) {
      return NextResponse.json({ success: false, error: payload.error || "OCR failed." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      file: payload.file || fileName,
      text: payload.text || "",
    });
  } catch (e) {
    const msg = (e && e.message) || String(e);
    // Helpful hints for common Windows issues
    let hint = "";
    if (/tesseract/i.test(msg)) {
      hint = " Hint: Install Tesseract and set TESSERACT_CMD to tesseract.exe.";
    } else if (/poppler|pdfinfo/i.test(msg)) {
      hint = " Hint: Install Poppler and set POPPLER_PATH to its 'bin' folder.";
    } else if (/ENOENT/i.test(msg)) {
      hint = " Hint: Set PYTHON_BIN in .env.local (e.g. PYTHON_BIN=py or python).";
    }
    return NextResponse.json({ success: false, error: msg + hint }, { status: 500 });
  }
}
