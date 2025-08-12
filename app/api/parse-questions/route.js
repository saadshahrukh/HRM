import { NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import xlsx from "xlsx";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const runtime = "nodejs";

// Hardcoded fallback for dev
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    if (file.name.endsWith(".pdf")) {
      extractedText = await extractTextFromPDF(buffer);
    } else if (file.name.endsWith(".xlsx")) {
      extractedText = extractTextFromExcel(buffer);
    } else {
      return NextResponse.json({ success: false, error: "Unsupported file format" }, { status: 400 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ success: false, error: "Could not extract text from file" }, { status: 400 });
    }

    let questions = await parseWithAI(extractedText);
    if (!questions?.length) {
      console.warn("AI parsing failed — using fallback parser");
      questions = heuristicParse(extractedText);
    }

    return NextResponse.json({ success: true, questions });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// --- Helpers ---
async function extractTextFromPDF(buffer) {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    fullText += textContent.items.map((t) => t.str).join(" ") + "\n";
  }
  return fullText;
}

function extractTextFromExcel(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  let fullText = "";
  workbook.SheetNames.forEach((sheet) => {
    const sheetData = xlsx.utils.sheet_to_csv(workbook.Sheets[sheet]);
    fullText += sheetData + "\n";
  });
  return fullText;
}

function heuristicParse(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ question: line, type: "unknown" }));
}

async function parseWithAI(text) {
  try {
    const prompt = `Extract all questions and their types from the following text.
Return as JSON array where each object is { "question": string, "type": string }.
Text:\n${text}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      }),
    });

    if (!res.ok) throw new Error(`AI API error: ${res.status}`);
    const data = await res.json();

    let raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return [];

    // Clean & parse JSON
    raw = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(raw);
  } catch (err) {
    console.error("AI parsing error:", err);
    return [];
  }
}
