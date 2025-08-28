import {
  BriefcaseBusinessIcon,
  Calendar,
  Code,
  LayoutDashboardIcon,
  List,
  PuzzleIcon,
  Settings,
  User2Icon,
  WalletCards,
} from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboardIcon,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interviews",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

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

 export  const QUESTION_PROMPT = `You are an expert technical interviewer.
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

Depends on this Interview Conversation between assitant and user, 

Give me feedback for user interview. Give me rating out of 10 for technical Skills, 

Communication, Problem Solving, Experince. Also give me summery in 3 lines 

about the interview and one line to let me know whether is recommanded 

for hire or not with msg. Give me response in JSON format

{

    feedback:{

        rating:{

            techicalSkills:5,

            communication:6,

            problemSolving:4,

            experince:7

        },

        summery:<in 3 Line>,

        Recommendation:'',

        RecommendationMsg:''



    }

}

`



// export const FEEDBACK_PROMPT = `{{conversation}}

// Depends on this Interview Conversation between assistant and user,  

// Give me feedback for user interview. Keep the same structure as below but also
// add more detailed analysis sections.  

// Give me rating out of 10 for Technical Skills, Communication, Problem Solving, and Experience.  
// Also give me a summary in 3 lines about the interview and one line to let me know whether the candidate is recommended for hire or not with message.  

// Additionally, include extra fields for deeper analysis:
// - overallScore (average of skills)
// - culturalFit (0-10)
// - aiAnalysis (list of 3–5 bullet points with confidence %)
// - questionAnalysis (totalQuestions, correctAnswers, avgResponseTime, confidenceLevel)
// - behavioralAnalysis (confidence, stressLevel, engagement, eyeContact)
// - summaryDetails (strengths [list], areasOfDevelopment [list])

// Return the response **only in valid JSON** format like this:

// {
//   "feedback": {
//     "rating": {
//       "techicalSkills": 5,
//       "communication": 6,
//       "problemSolving": 4,
//       "experince": 7
//     },
//     "summery": "<in 3 lines>",
//     "Recommendation": "",
//     "RecommendationMsg": "",

//     "overallScore": 7.8,
//     "culturalFit": 8,
//     "aiAnalysis": [
//       { "point": "Strong technical foundation", "confidence": "87%" },
//       { "point": "Needs improvement in leadership", "confidence": "65%" }
//     ],
//     "questionAnalysis": {
//       "totalQuestions": 12,
//       "correctAnswers": 10,
//       "avgResponseTime": "2.3 min",
//       "confidenceLevel": "High"
//     },
//     "behavioralAnalysis": {
//       "confidence": "High",
//       "stressLevel": "Low",
//       "engagement": "Excellent",
//       "eyeContact": "Good"
//     },
//     "summaryDetails": {
//       "strengths": [
//         "Clear communication and articulation",
//         "Strong problem-solving skills"
//       ],
//       "areasOfDevelopment": [
//         "Leadership experience could be improved",
//         "Backend knowledge needs improvement"
//       ]
//     }
//   }
// }
// `
