import { FEEDBACK_PROMPT } from "@/services/Options";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
    const {conversation, eyeContact, recordingUrls} = await req.json();

    let FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));
    
    // Add eye contact information if available
    if (eyeContact !== undefined) {
        FINAL_PROMPT += `\n\nAdditional Context:\n- Average Eye Contact: ${eyeContact.toFixed(1)}%\n- Video Recordings Available: ${recordingUrls ? 'Yes' : 'No'}`;
    }

    try{
    
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY ,
     
    })
    
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          { role: "user", content: FINAL_PROMPT   }
        ],
      })
      console.log(completion.choices[0].message)
      return NextResponse.json(completion.choices[0].message)
      }
      catch (e) {
    console.log(e)
    return NextResponse.json(e)
      }

}