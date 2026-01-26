import { FEEDBACK_PROMPT } from "@/services/Options";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
    try {
        const {conversation, eyeContact, recordingUrls} = await req.json();

        console.log("Feedback API called");
        console.log("Conversation type:", typeof conversation);
        console.log("Conversation length:", typeof conversation === 'string' ? conversation.length : 'not string');

        // Parse conversation if it's a string
        let conversationData;
        if (typeof conversation === 'string') {
            try {
                conversationData = JSON.parse(conversation);
            } catch (e) {
                console.error("Failed to parse conversation string:", e);
                return NextResponse.json(
                    { error: "Invalid conversation format" },
                    { status: 400 }
                );
            }
        } else {
            conversationData = conversation;
        }

        // Ensure conversation is an array
        if (!Array.isArray(conversationData)) {
            console.error("Conversation is not an array:", conversationData);
            return NextResponse.json(
                { error: "Conversation must be an array" },
                { status: 400 }
            );
        }

        console.log("Conversation messages count:", conversationData.length);

        // Format conversation for prompt
        const conversationText = conversationData
            .map((msg, idx) => {
                const role = msg.role === 'user' ? 'Candidate' : 'AI Interviewer';
                return `${idx + 1}. [${role}]: ${msg.content || ''}`;
            })
            .join('\n');

        let FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', conversationText);
        
        // Add context information if available
        if (eyeContact !== undefined) {
            FINAL_PROMPT += `\n\nAdditional Context:\n- Average Eye Contact: ${eyeContact.toFixed(1)}%`;
        }
        
        // Add video recording info
        if (recordingUrls && (recordingUrls.candidate || recordingUrls.ai)) {
            FINAL_PROMPT += `\n- Video Recordings: Available`;
        }
        
        // Emphasize strict JSON format
        FINAL_PROMPT += `\n\nCRITICAL: Return ONLY valid JSON. No markdown code blocks, no explanations. Just the JSON object starting with { and ending with }.`;

        console.log("Sending to OpenAI...");

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        });
    
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                { role: "user", content: FINAL_PROMPT }
            ],
        });

        console.log("OpenAI response received");
        console.log("Response content length:", completion.choices[0]?.message?.content?.length);

        return NextResponse.json(completion.choices[0].message);
    } catch (e) {
        console.error("Feedback API error:", e);
        return NextResponse.json(
            { 
                error: "Failed to generate feedback",
                message: e.message,
                stack: process.env.NODE_ENV === 'development' ? e.stack : undefined
            },
            { status: 500 }
        );
    }
}