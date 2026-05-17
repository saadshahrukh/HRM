import {
  BriefcaseBusinessIcon,
  Code,
  PuzzleIcon,
  User2Icon,
} from "lucide-react";

export { SideBarOptions } from "./navigation";

export const InterviewType = [
  {
    title: "Technical",
    icon: Code,
  },
  {
    title: "Behavioural",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: PuzzleIcon,
  },
];

export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}

Job Description:{{jobDescription}}

Interview Duration: {{duration}}

Interview Type: {{type}}

📝 Your task:

Analyze the job description to identify key responsibilities, required skills, and expected experience.

Generate a list of interview questions depends on interview duration

Adjust the number and depth of questions to match the interview duration.

Ensure the questions match the tone and structure of a real-life {{type}} interview.

🧩 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
 question:'',
 type:'Technical/Behavioral/Experince/Problem Solving/Leaseship'
},{
...
}]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`;

export const FEEDBACK_PROMPT = `{{conversation}}

Analyze this Interview Conversation between assistant and user.

Give me feedback for the candidate interview. Provide ratings out of 10 for:
- Technical Skills (techicalSkills)
- Communication (communication)
- Problem Solving (problemSolving)
- Experience (experince)

Also provide:
- A summary in 3 lines (summery)
- Recommendation: "Yes" or "No"
- Recommendation message (RecommendationMsg)
- Overall score (overallScore) - average of all ratings
- Cultural fit score (culturalFit) - 0 to 10
- AI Analysis (aiAnalysis) - array of 3-5 points with confidence percentages
- Question Analysis (questionAnalysis) - totalQuestions, correctAnswers, avgResponseTime, confidenceLevel
- Behavioral Analysis (behavioralAnalysis) - confidence, stressLevel, engagement, eyeContact
- Summary Details (summaryDetails) - strengths array and areasOfDevelopment array

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks. The structure must be EXACTLY:

{
  "feedback": {
    "rating": {
      "techicalSkills": 5,
      "communication": 6,
      "problemSolving": 4,
      "experince": 7
    },
    "summery": "Three line summary of the interview performance.",
    "Recommendation": "Yes",
    "RecommendationMsg": "Detailed recommendation message here.",
    "overallScore": 5.5,
    "culturalFit": 6,
    "aiAnalysis": [
      {
        "point": "Analysis point here",
        "confidence": "85%"
      }
    ],
    "questionAnalysis": {
      "totalQuestions": 6,
      "correctAnswers": 3,
      "avgResponseTime": "1.5 min",
      "confidenceLevel": "Medium"
    },
    "behavioralAnalysis": {
      "confidence": "Medium",
      "stressLevel": "Medium",
      "engagement": "Good",
      "eyeContact": "Not applicable (audio interview)"
    },
    "summaryDetails": {
      "strengths": [
        "Strength 1",
        "Strength 2"
      ],
      "areasOfDevelopment": [
        "Area 1",
        "Area 2"
      ]
    }
  }
}`;
