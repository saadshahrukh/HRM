import { NextResponse } from "next/server";
import pdf from "pdf-parse/lib/pdf-parse.js";

export const runtime = "nodejs";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const jd = formData.get("jobDescription") || "";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = "";

    if (file.name.toLowerCase().endsWith(".pdf")) {
      const data = await pdf(buffer);
      extractedText = data.text || "";
    } else {
      // Fallback plain text read
      extractedText = buffer.toString("utf-8");
    }

    if (!extractedText.trim() || extractedText.length < 10) {
      return NextResponse.json({ success: false, error: "Could not extract readable text from resume." }, { status: 400 });
    }

    const isManual = formData.get("isManual") === "true";

    let analysis = null;
    
    if (isManual) {
      // Local JS matching algorithm for manual uploads (No AI)
      const jdWords = new Set(jd.toLowerCase().match(/\b\w{3,}\b/g) || []);
      const resumeWords = new Set(extractedText.toLowerCase().match(/\b\w{3,}\b/g) || []);
      let matchCount = 0;
      for (const word of jdWords) {
        if (resumeWords.has(word)) matchCount++;
      }
      const jdMatchScore = jdWords.size > 0 ? Math.min(100, Math.round((matchCount / jdWords.size) * 100)) : 50;
      
      const commonSkills = ["javascript", "react", "node", "python", "java", "sql", "aws", "docker", "agile", "css", "html", "leadership", "communication"];
      const extractedSkills = commonSkills.filter(skill => resumeWords.has(skill)).slice(0, 5);

      analysis = {
        name: formData.get("name") || "Unknown",
        email: formData.get("email") || "unknown@example.com",
        jd_match_score: jdMatchScore + 20 > 100 ? 100 : jdMatchScore + 20,
        skills: extractedSkills.length > 0 ? extractedSkills : ["Teamwork"]
      };
    } else {
      analysis = await analyzeResumeWithAI(extractedText, jd);
      if (!analysis) {
        return NextResponse.json({ success: false, error: "AI analysis of resume failed." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, ...analysis, text: extractedText });
  } catch (err) {
    console.error("Resume parse error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to process resume." }, { status: 500 });
  }
}

async function analyzeResumeWithAI(resumeText, jobDescription) {
  try {
    const prompt = `You are an expert recruitment assistant.
Analyze the candidate resume text below and compare it to the Job Description.

Extract:
1. Candidate Name (e.g. "John Doe")
2. Candidate Email (e.g. "john@example.com")
3. Match Score (an integer percentage from 0 to 100, comparing how well candidate skills/exp match the job requirements)
4. Key Skills (array of up to 8 core skills)

Return the result ONLY as a JSON object with this exact schema:
{
  "name": "Candidate Name",
  "email": "candidate@example.com",
  "jd_match_score": 85,
  "skills": ["Skill1", "Skill2"]
}

IMPORTANT: Do not return any introduction, explanation, or code blocks. Only return the raw JSON object.

Job Description:
${jobDescription || "General Professional Requisition"}

Resume Text:
${resumeText}`;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter API responded with ${res.status}`);
    const data = await res.json();
    let content = data.choices?.[0]?.message?.content?.trim() || "";

    // Clean JSON markdown blocks if any
    content = content.replace(/```json|```/g, "").trim();

    // Sometimes deepseek embeds thoughts in <think> tags, filter them out
    if (content.includes("</think>")) {
      content = content.split("</think>")[1].trim();
    }

    return JSON.parse(content);
  } catch (err) {
    console.error("AI Resume analysis failed:", err);
    // Fallback: Local matching algorithm
    try {
      const jdWords = new Set(jobDescription.toLowerCase().match(/\b\w{3,}\b/g) || []);
      const resumeWords = new Set(resumeText.toLowerCase().match(/\b\w{3,}\b/g) || []);
      let matchCount = 0;
      for (const word of jdWords) {
        if (resumeWords.has(word)) matchCount++;
      }
      const jdMatchScore = jdWords.size > 0 ? Math.min(100, Math.round((matchCount / jdWords.size) * 100)) : 50;
      
      // Extract skills heuristically (mock)
      const commonSkills = ["javascript", "react", "node", "python", "java", "sql", "aws", "docker", "agile", "css", "html", "leadership", "communication"];
      const extractedSkills = commonSkills.filter(skill => resumeWords.has(skill)).slice(0, 5);

      return {
        name: "Unknown Candidate", // Will be overridden by manual entry if isManual is true
        email: "unknown@example.com",
        jd_match_score: jdMatchScore + 20 > 100 ? 100 : jdMatchScore + 20, // Boost score a bit
        skills: extractedSkills.length > 0 ? extractedSkills : ["Teamwork"]
      };
    } catch (fallbackErr) {
      return null;
    }
  }
}
