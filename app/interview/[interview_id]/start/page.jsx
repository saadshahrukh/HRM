"use client";
import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { useParams, useRouter } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supaBaseClient";

// Components
import InterviewSidebar from "./components/InterviewSidebar";
import AIInterviewerPanel from "./components/AIInterviewerPanel";
import CandidatePanel from "./components/CandidatePanel";
import InterviewControls from "./components/InterviewControls";
import { useEyeContactDetection } from "./components/EyeContactDetector";
import { useVideoRecorder } from "./components/VideoRecorder";

const StartInterview = () => {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const { interview_id } = useParams();
  const router = useRouter();

  // VAPI instance
  const vapiRef = useRef(null);
  const [vapiInitialized, setVapiInitialized] = useState(false);
  const [vapiConnected, setVapiConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  // Interview state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionType, setQuestionType] = useState("Technical");
  const [interviewProgress, setInterviewProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("intro");
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  // Media streams
  const candidateVideoRef = useRef(null);
  const aiVideoRef = useRef(null);
  const candidateStreamRef = useRef(null);
  const aiStreamRef = useRef(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoStreamReady, setVideoStreamReady] = useState(false);

  // AI Metrics
  const [aiMetrics, setAiMetrics] = useState({
    confidence: 0,
    communication: 0,
    technical: 0,
  });

  // Eye contact detection
  const {
    eyeContactPercentage,
    averageEyeContact,
    EyeContactDetector,
  } = useEyeContactDetection(candidateVideoRef);

  // Video recording
  const [recordingUrls, setRecordingUrls] = useState({
    candidate: null,
    ai: null,
  });

  const handleRecordingComplete = useCallback((data) => {
    setRecordingUrls((prev) => ({
      ...prev,
      [data.type]: data.url,
    }));
    toast.success(`${data.type} video uploaded successfully`);
  }, []);

  // Video recorder hook
  useVideoRecorder({
    candidateStream: candidateStreamRef.current,
    aiStream: aiStreamRef.current,
    interviewId: interview_id,
    onRecordingComplete: handleRecordingComplete,
  });

  // Initialize VAPI - Fixed initialization
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    if (!apiKey) {
      toast.error("VAPI API key not configured");
      console.error("NEXT_PUBLIC_VAPI_API_KEY is missing");
      return;
    }

    if (!vapiRef.current) {
      try {
        vapiRef.current = new Vapi(apiKey);
        setVapiInitialized(true);
        console.log("VAPI initialized successfully");
      } catch (error) {
        console.error("Failed to initialize VAPI:", error);
        toast.error("Failed to initialize VAPI");
      }
    }
  }, []);

  // Setup media streams - Fixed video preview
  useEffect(() => {
    const setupMediaStreams = async () => {
      try {
        // Get candidate's camera and microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        candidateStreamRef.current = stream;
        
        // Set video source immediately
        if (candidateVideoRef.current) {
          candidateVideoRef.current.srcObject = stream;
          candidateVideoRef.current.play().catch((err) => {
            console.error("Error playing video:", err);
          });
          setVideoStreamReady(true);
        }
      } catch (error) {
        console.error("Failed to access media devices:", error);
        toast.error("Failed to access camera/microphone. Please allow permissions.");
        setIsVideoEnabled(false);
      }
    };

    if (interviewInfo) {
      setupMediaStreams();
    }

    return () => {
      // Cleanup streams
      if (candidateStreamRef.current) {
        candidateStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (aiStreamRef.current) {
        aiStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [interviewInfo]);

  // VAPI Event Listeners - Setup before starting call
  useEffect(() => {
    if (!vapiRef.current || !vapiInitialized) return;

    const vapi = vapiRef.current;

    const handleMessage = (message) => {
      console.log("VAPI Message:", message);
      if (message?.conversation) {
        const convoString = JSON.stringify(message.conversation);
        setConversation(convoString);

        // Extract current question from conversation
        const lastMessage = message.conversation[message.conversation.length - 1];
        if (lastMessage?.role === "assistant") {
          setCurrentQuestion(lastMessage.content);
          setQuestionNumber((prev) => {
            const newNum = prev + 1;
            return newNum;
          });
        }
      }
    };

    const handleCallStart = () => {
      console.log("VAPI Call Started");
      setIsCallActive(true);
      setVapiConnected(true);
      setIsRecording(true);
      toast.success("Interview call connected");
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const handleCallEnd = () => {
      console.log("VAPI Call Ended");
      setIsCallActive(false);
      setVapiConnected(false);
      setIsRecording(false);
      toast.info("Interview call ended");
      // Don't auto-generate feedback here, let user end it manually
    };

    const handleError = (error) => {
      console.error("VAPI Error:", error);
      toast.error("VAPI connection error: " + (error.message || "Unknown error"));
    };

    // Register all event listeners
    vapi.on("message", handleMessage);
    vapi.on("call-start", handleCallStart);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);
    vapi.on("error", handleError);

    return () => {
      // Cleanup listeners
      vapi.off("message", handleMessage);
      vapi.off("call-start", handleCallStart);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("call-end", handleCallEnd);
      vapi.off("error", handleError);
    };
  }, [vapiInitialized]);

  // Start VAPI call - Fixed to wait for initialization
  useEffect(() => {
    if (interviewInfo && vapiRef.current && vapiInitialized && !isCallActive) {
      // Small delay to ensure event listeners are set up
      const timer = setTimeout(() => {
        startCall();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [interviewInfo, vapiInitialized, isCallActive]);

  // Timer
  useEffect(() => {
    if (!isPaused && isRecording) {
      const timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, isRecording]);

  const startCall = async () => {
    if (!vapiRef.current || !interviewInfo) {
      console.error("Cannot start call: VAPI or interview info missing");
      return;
    }

    try {
      let questionList = "";
      const questions = interviewInfo?.interviewData?.questionList || [];
      setTotalQuestions(questions.length || 0);

      if (questions.length === 0) {
        toast.error("No questions available for this interview");
        return;
      }

      questions.forEach((item, index) => {
        if (item?.question) {
          questionList += `${index + 1}. ${item.question}\n`;
        }
      });

      const assistantOptions = {
        name: "AI Recruiter",
        firstMessage:
          "Hi " +
          interviewInfo?.userName +
          ", how are you? Ready for your interview on " +
          interviewInfo?.interviewData?.jobPosition +
          "?",
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        voice: {
          provider: "11labs",
          voiceId: "6JsmTroalVewG1gA6Jmw",
        },
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed friendly expressive excited and yet professional tone.
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise.
Below Are the questions ask one by one:
${questionList}

If the candidate struggles, offer hints or rephrase the question without giving away the answer.
Provide brief, encouraging feedback after each answer.
Keep the conversation natural and engaging—use casual phrases like "Alright, ahh, no no no, yeah yeah, You're right, next up..." or "Let's tackle a tricky one!"
After all questions, wrap up the interview smoothly by summarizing their performance.
End on a positive note.
Key Guidelines:
✅ Be friendly, expressive tone engaging, and witty 🎤
✅ Keep responses short and extreme natural, like a real conversation
✅ Adapt based on the candidate's confidence level
✅ Ensure the interview remains focused on that Position: ${interviewInfo?.interviewData?.jobPosition}
`.trim(),
            },
          ],
        },
      };

      console.log("Starting VAPI call with options:", assistantOptions);
      vapiRef.current.start(assistantOptions);
    } catch (error) {
      console.error("Error starting VAPI call:", error);
      toast.error("Failed to start interview call: " + error.message);
    }
  };

  const StopInterview = async () => {
    try {
      if (vapiRef.current && isCallActive) {
        vapiRef.current.stop();
      }
      
      // Stop video recording - wait a bit for final chunks
      setTimeout(async () => {
        if (candidateStreamRef.current) {
          candidateStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        
        // Generate feedback and redirect
        await GenerateFeedback();
      }, 2000); // Wait 2 seconds for recording to finalize
    } catch (error) {
      console.error("Error stopping interview:", error);
      toast.error("Error ending interview");
      // Still try to generate feedback
      await GenerateFeedback();
    }
  };

  const GenerateFeedback = async () => {
    if (isGeneratingFeedback) return;
    
    setIsGeneratingFeedback(true);

    // If no conversation, still redirect to thank you page
    if (!conversation) {
      toast.info("Redirecting to thank you page...");
      router.push(`/interview/${interview_id}/thank-you`);
      return;
    }

    try {
      // Calculate AI metrics from conversation
      const metrics = calculateMetrics(conversation);
      setAiMetrics(metrics);

      const result = await axios.post("/api/ai-feedback", {
        conversation: conversation,
        eyeContact: averageEyeContact || 0,
        recordingUrls: recordingUrls,
      });

      const Content = result.data.content;
      const FINAL_CONTENT = Content.replace("```json", "").replace("```", "").trim();

      const feedbackData = JSON.parse(FINAL_CONTENT);

      // Save to database with video URLs
      const { data, error } = await supabase.from("interview-feedback").insert([
        {
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          interview_id: interview_id,
          feedback: {
            ...feedbackData.feedback,
            eyeContact: averageEyeContact || 0,
            recordingUrls: recordingUrls,
          },
          recommended: feedbackData.feedback?.Recommendation?.toLowerCase() !== "no",
        },
      ]);

      if (error) throw error;

      toast.success("Feedback generated successfully");
      router.push(`/interview/${interview_id}/thank-you`);
    } catch (error) {
      console.error("Failed to generate feedback:", error);
      toast.error("Failed to generate feedback, but redirecting...");
      // Still redirect to thank you page even if feedback fails
      router.push(`/interview/${interview_id}/thank-you`);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const calculateMetrics = (conversation) => {
    try {
      const convo = JSON.parse(conversation);
      const candidateMessages = convo.filter((msg) => msg.role === "user");
      if (candidateMessages.length === 0) {
        return { confidence: 0, communication: 0, technical: 0 };
      }
      const avgLength =
        candidateMessages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0) /
        candidateMessages.length;

      return {
        confidence: Math.min(100, Math.max(0, 50 + (avgLength - 50) / 2)),
        communication: Math.min(100, Math.max(0, 60 + (avgLength - 50) / 3)),
        technical: Math.min(100, Math.max(0, 70 + (avgLength - 50) / 4)),
      };
    } catch (error) {
      console.error("Error calculating metrics:", error);
      return { confidence: 0, communication: 0, technical: 0 };
    }
  };

  // Update interview progress
  useEffect(() => {
    if (totalQuestions > 0) {
      const progress = Math.min(100, (questionNumber / totalQuestions) * 100);
      setInterviewProgress(progress);

      if (progress < 25) setCurrentStage("intro");
      else if (progress < 50) setCurrentStage("technical");
      else if (progress < 75) setCurrentStage("problem");
      else if (progress < 100) setCurrentStage("behavioral");
      else setCurrentStage("qa");
    }
  }, [questionNumber, totalQuestions]);

  // Handle video toggle
  const handleToggleVideo = useCallback(() => {
    if (candidateStreamRef.current) {
      const videoTrack = candidateStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  }, [isVideoEnabled]);

  // Handle audio toggle
  const handleToggleAudio = useCallback(() => {
    if (candidateStreamRef.current) {
      const audioTrack = candidateStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  }, [isAudioEnabled]);

  if (!interviewInfo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p className="text-lg">Loading interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Eye Contact Detector */}
      {videoStreamReady && <EyeContactDetector />}

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <InterviewSidebar
            candidateName={interviewInfo?.userName}
            jobPosition={interviewInfo?.interviewData?.jobPosition}
            isRecording={isRecording}
            elapsedTime={elapsedTime}
            interviewProgress={interviewProgress}
            currentStage={currentStage}
            aiMetrics={aiMetrics}
            onAddNote={(note) => {
              // Handle notes
              console.log("Note added:", note);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6 gap-6">
          {/* Video Panels */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Interviewer Panel */}
            <AIInterviewerPanel
              isSpeaking={isSpeaking}
              currentQuestion={currentQuestion}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              aiVideoRef={aiVideoRef}
              isConnected={vapiConnected}
            />

            {/* Candidate Panel */}
            <CandidatePanel
              candidateName={interviewInfo?.userName}
              candidateVideoRef={candidateVideoRef}
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              onToggleVideo={handleToggleVideo}
              onToggleAudio={handleToggleAudio}
              isSpeaking={!isSpeaking && isCallActive}
              eyeContactPercentage={eyeContactPercentage}
            />
          </div>

          {/* Controls */}
          <InterviewControls
            elapsedTime={elapsedTime}
            totalTime={interviewInfo?.interviewData?.duration * 60 || 2700}
            isPaused={isPaused}
            onPause={() => setIsPaused(true)}
            onResume={() => setIsPaused(false)}
            onEndInterview={StopInterview}
            onNextQuestion={() => {
              toast.info("AI will ask the next question automatically");
            }}
            currentQuestion={currentQuestion}
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            questionType={questionType}
            overallScore={
              (aiMetrics.confidence +
                aiMetrics.communication +
                aiMetrics.technical) /
              3 /
              10
            }
            audioQuality="Excellent"
            isGeneratingFeedback={isGeneratingFeedback}
          />
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
